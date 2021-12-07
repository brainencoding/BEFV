import {BEFormValidatorCreateImpl} from "../../types";

export interface HTMLObserverValidationImpl {
    forms: Record<any, any>;
    $form?: HTMLFormElement;
    commonForms: HTMLCollectionOf<HTMLFormElement>;
    init(): HTMLObserverValidationImpl;
    getRawForms(): HTMLFormElement[];
    formsProcessing(): void;
    localPreparation($form: HTMLFormElement): void;
    checkDefinedForm($form: HTMLFormElement): boolean;
}

export interface HTMLObserverValidationFormImpl {
    _id: string;
    $form: HTMLElement;
    formArgs: Record<any, any>;
    fields: Record<any, any>;

    initValidation?: boolean;
    ValidatorInstance?: BEFormValidatorCreateImpl;
}