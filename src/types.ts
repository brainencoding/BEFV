export {};

declare global {
	interface Window {
		BEFormValidator: TBEFormValidator;
	}
}

export interface BEFormValidatorCreate {}

type TUtils = {
		errorConstructor: (beFormValidator: string) => (text: string) => Error;
		toBoolean: (num: Number | String | Boolean) => Boolean | Number;
}

export type TBEFormValidator = {
	__constants: Record<string, string | number>;
	__utils: TUtils;
	Create: BEFormValidatorCreate;
}

export type TInputElement = HTMLInputElement | HTMLTextAreaElement;

export type TInputValidate = {
	input: TInputElement;
	id: any;
}

export abstract class AValidateInput {
	element: TInputElement;
	rules: Record<string, string>;
	handlers?: Record<string, Function>;
	subscriptions?: Record<any, any>;
}

export abstract class AValidateForm {
	element: HTMLFormElement;
	options?: Record<string, any>;
	subscriptions?: Record<any, any>;
	handlers?: Record<any, any>;
}
