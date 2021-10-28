import {HTMLObserverValidationForm, HTMLObserverValidationImpl} from "./types";
import {Messages} from "./messages";
import {HTMLOVConstants} from "./constants";
import {BEHelper} from "../../core/BEHelper";

let __LOCAL_INVOKE__ = false;

export class HTMLObserverValidation implements HTMLObserverValidationImpl {
    forms: HTMLObserverValidationForm[] = []
    MutationObserverInstance: MutationObserver;
    $form?: HTMLFormElement;
    commonForms: HTMLCollectionOf<HTMLFormElement> = document.forms;

    constructor($form?: HTMLFormElement) {
        if (!__LOCAL_INVOKE__) {
            throw new Error(Messages.getMessage('INVOKE_ERROR'));
        }

        if (!$form && !document.forms.length) {
            throw new Error(Messages.getMessage('EMPTY_FORMS'));
        }

        if ($form && !this.checkDefinedForm($form)) {
            throw new Error(Messages.getMessage('INVALID_FORM'));
        }

        this.$form = $form;
        this.MutationObserverInstance = null;
    }

    checkDefinedForm($form: HTMLFormElement) {
        const definitionAttr = $form.getAttribute(HTMLOVConstants['KEYWORDS']['DEFINITION']);
        const initializedAttr = $form.getAttribute(HTMLOVConstants['KEYWORDS']['INITIALIZED']);

        return definitionAttr !== null && !definitionAttr.length && !initializedAttr;
    }

    getRawForms(): HTMLFormElement[] {
        let $allForms: HTMLFormElement[] = Array.from(this.commonForms);
        let $rawForms: HTMLFormElement[] = [];

        for (const $form of $allForms) {
            if (this.checkDefinedForm($form)) {
                $rawForms = [...$rawForms, $form];
            }
        }

        return $rawForms;
    }

    formsProcessing() {
        if (this.$form) {
            this.localPreparation(this.$form);
        } else {
            const $forms = this.getRawForms();

            for (const $formElement of $forms) {
                this.localPreparation($formElement);
            }
        }
    }

    localPreparation($form: HTMLFormElement) {
        const id = BEHelper.generateId();
        const formArgs: Record<any, any> = {
            element: $form
        };
        const fields: any[] = [];

        $form.dataset.beDefine = id;

        if ($form.dataset.beDefault) {
            formArgs.options.default = $form.dataset.beDefault === 'Y';
        }

        if ($form.dataset.beSubscribeOnInput) {
            formArgs.options.subscribeOnInput = $form.dataset.subscribeOnInput === 'Y';
        }

        const $fields: NodeListOf<HTMLElement> = $form.querySelectorAll('input[data-be-field],textarea[data-be-field],select[data-be-field]');

        for (const $field of $fields) {
            fields.push({
                element: $field,
                rules: {
                    required: $field.dataset.beRequired,
                    rule: $field.dataset.beRule || null,
                },
                message: {
                    rule: {
                        error: $field.dataset.beMessageRuleError || '',
                        success: $field.dataset.beMessageRuleSuccess || '',
                    },
                    required: {
                        error: $field.dataset.beMessageRequiredError || '',
                        success: $field.dataset.beMessageRequiredSuccess || '',
                    }
                }
            });
        }

        this.forms.push({
            id,
            $form,
            formArgs,
            fields
        });
    }

    observer() {

    }

    init(): HTMLObserverValidation {
        this.formsProcessing();



        return this;
    }

    static init($form?: HTMLFormElement) {
        __LOCAL_INVOKE__ = true;
        new HTMLObserverValidation($form).init();
    }
}



