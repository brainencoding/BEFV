import {AValidateForm, AValidateInput, TInputElement, TInputValidate} from "../types";
import {Exception} from "./components/Exception";
import {InputMessage} from "./components/InputMessage";

export class ValidateElement {
	public isValid: boolean = false;
	public isInit: boolean = false;

	public messages: InputMessage;

	private static __defaultOpt = {
		onlyOnSubmit: false,
		rules: {},
	}

	constructor(public opt: AValidateInput = ValidateElement.__defaultOpt, public validator: AValidateForm) {
	}

	public validate(): void {
		this.isValid = false;

		const value = this.opt.element?.value;
		const rules = this.opt.rules;
		const message = this.opt.message;

		const InputMessageOpts = {
			location: message.location || undefined,
			noAdjacent: message.noAdjacent || undefined,
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

			if (!valCond) return;
		}

		if (rules.hasOwnProperty('rule') && rules.rule !== undefined) {
			const rule = rules.rule;
			let res;

			switch (rule.constructor) {
				case RegExp: {
					if (rule.test(value.toString())) {
						res = true;
						break;
					}

					res = false;
					break;
				}

				case Function: {
					if (rule.call(this, value, this.validator)) {
						res = true;
						break;
					}

					res = false;
					break;
				}

				default: {
					ValidateElement.Error('rules: { rule: ... } for this input is not valid. Please use valid RegExp like => /(.*)/g without quotes and dbl quotes or use function \n Element =>', this.opt.element.className);
				}
			}

			if (message?.rule.hasOwnProperty('success')) {
				this.messages.changeStatus(res, message.rule['success']);
			}

			if (message?.rule.hasOwnProperty('error')) {
				this.messages.changeStatus(res, message.rule['error']);
			}

			if (!res) return;
		}

		this.isValid = true;
	}

	private elementHandler(): void {
		/*
		*  TODO: this.opt.border если указан то добавлять инпуту калсс ерора или саксес из рула или если нет рула брать рекваред
		* */
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


