import EventEmitter from "./core/EventEmitter";

export {};

declare global {
	interface Window {
		BEFormValidator: TBEFormValidator;
	}
}

export interface BEFormValidatorCreateImpl {
	form: AValidateForm;
	isFormValid: boolean;
	emitter: EventEmitter;
	init(): void;
	uid: string;
	emit(name: string, ...data:any): void;
	addListener(name: string, ...callback: Function[]): void;
}

export interface InputMessageImpl {
	remove(): void;
	append(): void;
	changeStatus(status: boolean, text: string): void;
}

export interface ValidateElementImpl {
	isValid: boolean;
	isInit: boolean;
	messages: InputMessageImpl;
	validate(): void;
	init(): void;
	isCorrect(): boolean;
	destroy(): void;
}

type TUtils = {
		errorConstructor: (beFormValidator: string) => (text: string) => Error;
		toBoolean: (num: Number | String | Boolean) => Boolean | Number;
}

export type TBEFormValidator = {
	__constants: Record<string, string | number>;
	__utils: TUtils;
	Create: BEFormValidatorCreateImpl;
	DefaultRules: Record<string, RegExp | Function>
}

export type TInputElement = HTMLInputElement;

export type TRules = {
	required: Boolean;
	rule: TRule;
}

export type TRule = Array<RegExp | Function> | RegExp | Function;

export abstract class AValidateInput {
	element?: TInputElement;
	rules?: TRules;
	handlers?: Record<string, Function>;
	subscriptions?: Record<any, any>;
	message?: Record<any, any>;
	onlyOnSubmit?: boolean;
}

export abstract class AValidateForm {
	element?: HTMLFormElement;
	options?: Record<string, any>;
	subscriptions?: Record<any, any>;
	handlers?: Record<any, any>;
	earlyInputInitiation: boolean;
	subscribeOnInput: boolean;
}
