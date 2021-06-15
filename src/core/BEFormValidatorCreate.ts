import {AValidateForm, AValidateInput, BEFormValidatorCreateImpl} from "../types";
import {Exception} from "./components/Exception";
import {ValidateElement} from "./ValidateElement";
import {constants} from "../constants";

export class BEFormValidatorCreate implements BEFormValidatorCreateImpl {
	private readonly __initialInputs: AValidateInput[];
	private inputs: ValidateElement[] = [];
	public form: AValidateForm = constants.DEFAUTL_VALUES.VALIDATOR;

	public isFormValid: boolean = false;
	private __isInit: boolean = false;

	constructor(form: AValidateForm, validateElements: AValidateInput[]) {
		this.__initialInputs = validateElements;
		this.form = Object.assign(this.form, form);

		Object.defineProperty(this.form.element, '__BEFV', {
			value: this
		})
	}

	private formSubmitHandler(e: Event): void {
		e.preventDefault();

		if (this.inputs.length) {
			this.isFormValid = true;

			for (const input of this.inputs) {
				if (!input.isInit) {
					input.init();
				}

				input.validate();

				if (!input.isValid) {
					if (this.isFormValid) {
						this.isFormValid = false;
					}
				}
			}
		}

		if (this.isFormValid) {
			this.form.element.setAttribute(constants.DATASET.VALID, '1');

			if (this.form.subscriptions?.valid) {
				this.form.subscriptions.valid(this);
			}

			if (this.form.options?.default) {
				this.form.element.submit();
			}

			if (this.form.options.hasOwnProperty('submit') && this.form.options.submit instanceof Function) {
				this.form.handlers.submit(e);
			}
		} else {
			this.form.element.setAttribute(constants.DATASET.VALID, '0');

			if (this.form.subscriptions?.invalid) {
				this.form.subscriptions.invalid(this);
			}
		}
	}

	public init(): void {
		if (this.__isInit) {
			if (this.inputs.length) {
				for (const input of this.inputs) {
					input.destroy();
				}
				
				this.inputs = [];
			}
		}

		try {
			this.validatorOptionsChecker();

			this.form.element.setAttribute('data-be-valid', '0');

			for (let i = 0; i !== this.__initialInputs.length; i++) {
				let newValidateElement: ValidateElement = new ValidateElement(this.__initialInputs[i], this.form);

				if (newValidateElement.isCorrect()) {
					this.inputs.push(newValidateElement);
				} else {
					newValidateElement.destroy(i);
					newValidateElement = undefined;
				}
			}

			if (this.inputs.length) {
					if (!this.__isInit) {
						this.form.element.addEventListener('submit', this.formSubmitHandler.bind(this), true);
					}
			} else {
				Exception.throw('All of inputs is incorrect for creating a ValidateElement! Please check your field in validateElementObject');
				return;
			}

			this.__isInit = true;
		} catch (error) {
			console.error(error);
		}
	}

	private validatorOptionsChecker(): void {
		if (!this.form?.element) {
			throw Exception.throw('{ form.element } is undefined');
		}

		if (!(this.form.element instanceof HTMLFormElement)) {
			throw Exception.throw('{ form.element } is not equal to type HTMLFormElement');
		}

		if (!this.__initialInputs) {
			throw Exception.throw('{ validateElements } is undefined!');
		}

		if (!(this.__initialInputs instanceof Array)) {
			throw Exception.throw('{ validateElements } is not equal to type Array!');
		}

		if (!this.__initialInputs.length) {
			throw Exception.throw('{ validateElements } is empty!');
		}
	}
}
