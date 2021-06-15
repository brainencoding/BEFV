export {};

declare global {
	interface Window {
		BEFormValidator: TBEFormValidator;
	}
}

export interface BEFormValidatorCreateImpl {
	form: AValidateForm;
	isFormValid: boolean;
	
	init(): void;
}

export interface InputMessageImpl {
	remove(): void;
	append(): void;
	changeStatus(status: boolean, text: string): void;
}

type TUtils = {
		errorConstructor: (beFormValidator: string) => (text: string) => Error;
		toBoolean: (num: Number | String | Boolean) => Boolean | Number;
}

export type TBEFormValidator = {
	__constants: Record<string, string | number>;
	__utils: TUtils;
	Create: BEFormValidatorCreateImpl;
}

export type TInputElement = HTMLInputElement;

export type TInputValidate = {
	input: TInputElement;
	id: any;
}

export abstract class AValidateInput {
	element: TInputElement;
	rules: Record<any, any>;
	handlers?: Record<string, Function>;
	subscriptions?: Record<any, any>;
	message: Record<any, any>
}

export abstract class AValidateForm {
	element: HTMLFormElement;
	options?: Record<string, any>;
	subscriptions?: Record<any, any>;
	handlers?: Record<any, any>;
}
