import {AValidateForm, AValidateInput, TRule, ValidateElementImpl} from "../types";
import {Exception} from "./components/Exception";
import {InputMessage} from "./components/InputMessage";
import {constants} from "../constants";

export class ValidateElement implements ValidateElementImpl {
	public isValid: boolean = false;
	public isInit: boolean = false;

	public messages: InputMessage;

	constructor(public opt: AValidateInput, public validator: AValidateForm) {
		const clone = {...constants.DEFAUTL_VALUES.VALIDATION_ELEMENT};
		this.opt = Object.assign(clone, this.opt);

		if (typeof this.opt.element === 'string') {
			// @ts-ignore
			const gettingElement = document.querySelector(this.opt.element);

			if (gettingElement) {
				// @ts-ignore
				this.opt.element = gettingElement;
			} else {
				this.opt.element = undefined;
				console.error(ValidateElement.Error('{ element } is undefined!'));
			}
		}
	}

	public validate(): void {
		this.isValid = false;
		let res: boolean = false;

		const value = this.opt.element?.value;
		const rules = this.opt.rules;
		const message = this.opt.message;

		const __conditionForSupportingOnlyBorder__ = (!message.required && !message.rule && message.border)

		const InputMessageOpts = {
			location: message.location || undefined,
			noAdjacent: message.noAdjacent || undefined,
			border: message.border || false,
			noSpan: __conditionForSupportingOnlyBorder__,
		}

		if (!this.messages) {
			this.messages = new InputMessage(' ', this.opt.element, InputMessageOpts);
		}

		if (rules.hasOwnProperty('required') && rules.required) {
			const valCond = !!value;

			this.messages.changeStatus(valCond,
				message && message.required ?
					message?.required[valCond ? 'success' : 'error'] :
					__conditionForSupportingOnlyBorder__ ? '' : ''
			);

			if (!valCond) {
				this.opt.subscriptions.invalid();
				return;
			}
		}

		if (rules.hasOwnProperty('rule') && rules.rule !== undefined) {
			const rule: TRule = rules.rule;

			const validateDefaultRule = (_rule: TRule): boolean => {
				switch (_rule.constructor) {
					case RegExp: {
						return (<RegExp>_rule).test(value.toString());
					}

					case Function: {
						return (<Function>_rule).call(this, this.opt.element, this.validator);
					}

					case Array: {
						const _rule = (<Array<RegExp | Function>>rule);
						let localRes = false;

						if (_rule.length) {
							for (const r of _rule) {
								const cond: boolean = validateDefaultRule(r);
								localRes = cond;
								if (!cond) {
									break;
								}
							}
						} else {
							console.error(ValidateElement.Error('rule of array [] is empty.', this.opt.element.className));;
						}

						return localRes
					}

					default: {
						throw ValidateElement.Error('rules: { rule: ... } for this input is not valid. Please use valid RegExp like => /(.*)/g without quotes and dbl quotes or use function \n Element =>', this.opt.element.className);
					}
				}
			}

			res = validateDefaultRule(rule);

			this.messages.changeStatus(res,
				!res ? message.rule['error'] || '' : res ? message.rule['success'] || '' : ''
			);

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
		console.log(111, this.opt)
		if (!this.isInit && !this.opt.onlyOnSubmit) {
			this.opt.element.addEventListener('input', this.elementHandler.bind(this));
		}

		this.isInit = true;
	}

	public isCorrect(): boolean {
		if (!this.opt.element) {
			console.error(ValidateElement.Error('{ element } is undefined!'));
			return false;
		}

		if (!this.opt.hasOwnProperty('rules')) {
			console.error(ValidateElement.Error('{ rules } is not defined!'));
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


