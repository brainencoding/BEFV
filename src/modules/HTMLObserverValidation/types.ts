export interface HTMLObserverValidationImpl {
    forms: HTMLObserverValidationForm[];
    MutationObserverInstance: MutationObserver;
    $form?: HTMLFormElement;
    init(): HTMLObserverValidationImpl;
    getRawForms(): HTMLFormElement[];
}

export type HTMLObserverValidationForm = {

}