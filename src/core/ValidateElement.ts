import {AValidateForm, AValidateInput, TRule, ValidateElementImpl} from "../types";
import {Exception} from "./components/Exception";
import {InputMessage} from "./components/InputMessage";
import {constants} from "../constants";

export class ValidateElement implements ValidateElementImpl {
	public isValid: boolean = false;
	public isInit: boolean = false;

	public messages: InputMessage;

	constructor(public opt: AValidateInput, public validator: AValidateForm) {
		this.opt = Object.assign(this.opt, constants.DEFAUTL_VALUES.VALIDATION_ELEMENT);
	}

	public validate(): void {
		this.isValid = false;

		const value = this.opt.element?.value;
		const rules = this.opt.rules;
		const message = this.opt.message;

		const InputMessageOpts = {
			location: message.location || undefined,
			noAdjacent: message.noAdjacent || undefined,
			border: message.border || false
		}

		if (!this.messages) {
			this.messages = new InputMessage(' ', this.opt.element, InputMessageOpts);
		}

		if (rules.hasOwnProperty('required') && rules.required) {
			const valCond = !!value;

			if (message && message.required) {
				this.messages.remove();
				this.messages.changeStatus(valCond, message?.required[valCond ? 'success' : 'error']);
				this.messages.append();
			}

			if (!valCond) {
				this.opt.subscriptions.invalid();
				return;
			}
		}

		if (rules.hasOwnProperty('rule') && rules.rule !== undefined) {
			const rule: TRule = rules.rule;
			let res: boolean = false;

			const validateDefaultRule = (_rule: TRule) => {
				switch (_rule.constructor) {
					case RegExp: {
						if ((<RegExp>_rule).test(value.toString())) {
							res = true;
							break;
						}
						break;
					}

					case Function: {
						if ((<Function>_rule).call(this, this.opt.element, this.validator)) {
							res = true;
							break;
						}
						break;
					}

					default: {
						ValidateElement.Error('rules: { rule: ... } for this input is not valid. Please use valid RegExp like => /(.*)/g without quotes and dbl quotes or use function \n Element =>', this.opt.element.className);
					}
				}
			}

			switch (rule.constructor) {
				case Array: {
					const _rule = (<Array<RegExp | Function>>rule);

					if (_rule.length) {
						_rule.map((r: TRule) => validateDefaultRule(r));
					} else {
						ValidateElement.Error('rule of array [] is empty.', this.opt.element.className);
					}
					break;
				}

				default: {
					validateDefaultRule(rule);
				}
			}

			this.messages.remove();

			this.messages.changeStatus(res,
				!res ? message.rule['error'] || '' : res ? message.rule['success'] || '' : ''
			);

			this.messages.append();

			if (!res) {
				this.opt.subscriptions.invalid();
				return;
			}
		}

		this.opt.subscriptions.valid(this);

		this.isValid = true;
	}

	private elementHandler(e: Event): void {
		this.opt.handlers.input(e);
		this.validate();
	}

	public init(): void {
		if (!this.isInit && !this.opt.onlyOnSubmit) {
			this.opt.element.addEventListener('input', this.elementHandler.bind(this));
		}

		this.isInit = true;
	}

	public isCorrect(): boolean {
		if (!this.opt.element) {
			ValidateElement.Error('{ element } is undefined!');
			return false;
		}

		if (!this.opt.hasOwnProperty('rules')) {
			ValidateElement.Error('{ rules } is not defined!');
			return false;
		}

		return true
	}

	public destroy(idx?: number): void {
		if (idx) {
			ValidateElement.Error('object are destroyed for element [index => ' + idx + '], element is undefined!');
		}

		if (this.isInit) {
			this.opt.element.removeEventListener('input', this.elementHandler.bind(this));

			if (this.messages && this.messages.remove) {
				this.messages.remove();
				this.messages = undefined;
			}
		}
	}

	static Error(..._s: string[]): Exception {
		const str: string = _s.reduce((acc, prev) => acc + prev);

		return Exception.throw(str, 'ValidateElement');
	}
}


