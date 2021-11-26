import EventEmitter from "./EventEmitter";
import { AValidateForm, AValidateInput, BEFormValidatorCreateImpl } from "../types";
import {Exception} from "./components/Exception";
import {ValidateElement} from "./ValidateElement";
import {constants} from "../constants";

export class BEFormValidatorCreate implements BEFormValidatorCreateImpl {
	private __initialInputs: AValidateInput[];
	private inputs: ValidateElement[] = [];
	public form: AValidateForm = constants.DEFAUTL_VALUES.VALIDATOR;

	public emitter = new EventEmitter; 

	public isFormValid: boolean = false;
	private __isInit: boolean = false;
	uid: string = (Date.now().toString() + Math.floor(Math.random() * Date.now())).toString();

	constructor(form: AValidateForm, validateElements: AValidateInput[]) {
		this.__initialInputs = validateElements;
		this.form = form;

		if (typeof this.form.element === 'string') {
			const gettingElement = document.querySelector(this.form.element);
			                                          	
			if (gettingElement) {
				this.form.element = gettingElement;
			} else {
				this.form.element = undefined;
				throw(ValidateElement.Error('{ element } is undefined!'));
			}
		}

		Object.defineProperty(this.form.element, constants.PACKAGE_NAME_IN_FORM, {
			value: this,
		});
		
		if (!this.form.hasOwnProperty('subscriptions')) {
			this.form.subscriptions = {
				valid: () => { },
				invalid: () => { }
			}
		} else {
			if (!('valid' in this.form.subscriptions) || !(this.form.subscriptions.valid instanceof Function)) {
				this.form.subscriptions.valid = () => { };
			}

			if (!('invalid' in this.form.subscriptions)|| !(this.form.subscriptions.invalid instanceof Function)) {
				this.form.subscriptions.invalid = () => { };
			}
		}

		function Event_isValidForm() {
			const errorMessageInputClassName = constants.ERROR_MESSAGE_CLASS_NAME + 'input';

			this.isFormValid = true;
			this.form.element.setAttribute(constants.DATASET.VALID, '1');

			this.form.element.querySelectorAll('be-error')?.forEach((beErrElement: HTMLElement) => beErrElement.remove());
			this.form.element.querySelectorAll(errorMessageInputClassName)
				?.forEach((beErrElement: HTMLElement) => {
					if (beErrElement.classList.contains(errorMessageInputClassName)) {
						beErrElement.classList.remove(errorMessageInputClassName);
						beErrElement.classList.add(constants.SUCCESS_MESSAGE_CLASS_NAME + 'input');
					}
				});

			this.form.subscriptions.valid(this);
		}

		this.addListener('BEForm::isValidForm', Event_isValidForm.bind(this));

		function Event_isInvalidForm() {
			this.isFormValid = false;
			this.form.element.setAttribute(constants.DATASET.VALID, '0');
			this.form.subscriptions.invalid(this);
		}

		this.addListener('BEForm::isInvalidForm', Event_isInvalidForm.bind(this));

		function Event_checkInputValidation(beforeValidation: Function = () => { }) {
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

			this.emit('BEForm::' + (this.isFormValid ? 'isValidForm' : 'isInvalidForm'));

			if (beforeValidation instanceof Function) {
				beforeValidation();
			}
		}

		this.addListener('BEForm::checkInputValidation', Event_checkInputValidation.bind(this));
	}

	private formSubmitHandler(e: Event): void {
		e.preventDefault();

		this.emit('BEForm::checkInputValidation', () => {
			if (this.isFormValid) {
				if (this.form.options?.default) {
					this.form.element.submit();
				}

				if (this.form.handlers.hasOwnProperty('submit') && this.form.handlers.submit instanceof Function) {
					this.form.handlers.submit(e);
				}
			}
		});
	}

	private inputsTreatment() {
		const inputsResult: AValidateInput[] = [];

		for (let i = 0; i < this.__initialInputs.length; i++) {
			if (this.__initialInputs[i].element instanceof NodeList) {
				const commonOptions: AValidateInput = { ...this.__initialInputs[i] };
				// @ts-ignore
				const elements = Array.from(this.__initialInputs[i].element);
				this.__initialInputs.splice(i, 1);

				for (const element of elements) {
					// @ts-ignore
					commonOptions['element'] = element;
					inputsResult.push({ ...commonOptions });
				}
			} else {
				inputsResult.push(this.__initialInputs[i])
			}
		}

		this.__initialInputs = inputsResult;
	}

	emit(name: string, ...data: any) {
		this.emitter.emit(this.uid + ' => ' + name, ...data)
	}

	addListener(name: string, ...callback: Function[]) {
		this.emitter.addListener(this.uid + ' => ' + name, ...callback)
	}

	public getElement(input: HTMLInputElement | HTMLTextAreaElement): ValidateElement {
		return this.inputs.find(_validateElement => _validateElement.element === input);
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
			this.inputsTreatment();

			this.form.element.setAttribute(constants.DATASET.VALID, '0');

			for (let i = 0; i !== this.__initialInputs.length; i++) {
				let newValidateElement: ValidateElement = new ValidateElement(this.__initialInputs[i], this);

				if (newValidateElement.isCorrect()) {
					this.inputs.push(newValidateElement);
				} else {
					newValidateElement.destroy(i);
					newValidateElement = undefined;
				}
			}

			if (this.form.earlyInputInitiation) {
				for (const input of this.inputs) {
					if (!input.isInit) {
						input.init();
					}
				}
            }

			if (this.inputs.length) {
				if (!this.__isInit) {
					this.form.element.addEventListener('submit', this.formSubmitHandler.bind(this), true);
				}
			} else {
				console.error(Exception.throw('All of inputs is incorrect for creating a ValidateElement! Please check your field in validateElementObject'));
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
