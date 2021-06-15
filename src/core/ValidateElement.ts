import {AValidateForm, AValidateInput, TInputElement, TInputValidate} from "../types";
import {Exception} from "./components/Exception";
import {InputMessage} from "./components/InputMessage";

export class ValidateElement {
	public isValid: boolean = false;
	public isInit: boolean = false;

	public messages: Record<any, any> = {};

	constructor(public opt: AValidateInput, public validator: AValidateForm) {}

	public validate(): void {
		this.isValid = false;

		const value = this.opt.element?.value;
		const rules = this.opt.rules;
		const message = this.opt.message;

		const InputMessageOpts = {
			location: message.location || undefined,
			noAdjacent: message.noAdjacent || undefined,
			success: (!message.error || !message.error.length) && message.success ? true : undefined
		}

		if (rules.hasOwnProperty('required') && rules.required) {
			const valCond = !!value;

			if (message) {
				if (!this.messages.hasOwnProperty('required')) {
					this.messages.required = new InputMessage(' ', this.opt.element, InputMessageOpts);
				}

				this.messages.required.remove();
				this.messages.required.changeStatus(valCond,
					valCond ? (
						message?.required?.success ?
							message?.required?.success :
							message.success ?
								message.success :
								''
					) : (
						message?.required?.error ?
							message?.required?.error:
							message.error ?
								message.error :
								''
					));
				this.messages.required.append();
			}

			if (!valCond) return;
		}

		this.isValid = true;
	}

	private elementHandler(): void {
		/*
		*  TODO: this.opt.border если указан то добавлять инпуту калсс ерора или саксес
		* */
	}
	                                     
	public init(): void {
		this.isInit = true;

		/*
		* TODO: кидаем хенделеры для обработки при вводе
		* */
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

	public destroy(idx: number): void {
		ValidateElement.Error('object are destroyed for element [index => ' + idx + '], element is undefined!');
	}

	static Error(..._s: string[]): Exception {
		const str: string = _s.reduce((acc, prev) => acc + prev);

		return Exception.throw(str, 'ValidateElement');
	}
}


