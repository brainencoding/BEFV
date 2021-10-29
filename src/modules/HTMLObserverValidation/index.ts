import {HTMLObserverValidationFormImpl, HTMLObserverValidationImpl} from "./types";
import {Messages} from "./messages";
import {HTMLOVConstants} from "./constants";
import {BEHelper} from "../../core/BEHelper";
import {ObservableObject} from "../../core/components/ObjectObserver";
import {BEFormValidatorCreate} from "../../core/BEFormValidatorCreate";
import {BEFormValidatorCreateImpl} from "../../types";

let __LOCAL_INVOKE__ = false;

export class HTMLObserverValidation implements HTMLObserverValidationImpl {
    public forms: Record<any, any> = {};
    public $form?: HTMLFormElement;
    public commonForms: HTMLCollectionOf<HTMLFormElement> = document.forms;

    private MutationObserverInstance: MutationObserver;
    private MutationObserverOptions: MutationObserverInit = {
        childList: true,
        attributes: true,
        subtree: true,
    }

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

    public checkDefinedForm($form: HTMLFormElement): boolean {
        const definitionAttr = $form.getAttribute(HTMLOVConstants['KEYWORDS']['DEFINITION']);
        const initializedAttr = $form.getAttribute(HTMLOVConstants['KEYWORDS']['INITIALIZED']);

        return definitionAttr !== null && !definitionAttr.length && !initializedAttr;
    }

    public getRawForms(): HTMLFormElement[] {
        let $allForms: HTMLFormElement[] = Array.from(this.commonForms);
        let $rawForms: HTMLFormElement[] = [];

        for (const $form of $allForms) {
            if (this.checkDefinedForm($form)) {
                $rawForms = [...$rawForms, $form];
            }
        }

        return $rawForms;
    }

    public formsProcessing(): void {
        if (this.$form) {
            this.localPreparation(this.$form);
        } else {
            const $forms = this.getRawForms();

            for (const $formElement of $forms) {
                this.localPreparation($formElement);
            }
        }
    }

    public localPreparation($form: HTMLFormElement): void {
        const _id = BEHelper.generateId();
        const formArgs: Record<any, any> = {
            element: $form
        };
        const fields: any[] = [];

        $form.dataset.beDefine = _id;

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
                    required: $field.dataset.beRequired === 'Y' || false,
                    rule: $field.dataset.beRule ? new RegExp(String.raw`${$field.dataset.beRule}`) : null,
                },
                onlyOnSubmit: $field.dataset.beOnlyOnSubmit === 'Y' || false,
                message: {
                    rule: {
                        error: $field.dataset.beMessageRuleError || '',
                        success: $field.dataset.beMessageRuleSuccess || '',
                    },
                    required: {
                        error: $field.dataset.beMessageRequiredError || '',
                        success: $field.dataset.beMessageRequiredSuccess || '',
                    },
                    border: $field.dataset.beBorder === 'Y' || false,
                }
            });
        }

        const newForm = new HTMLObserverValidationForm;

        newForm._id = _id;
        newForm.$form = $form;
        newForm.formArgs = formArgs;
        newForm.fields = fields;

        this.forms[_id] = newForm;
    }

    private mutationCallback$(): void {
        const isFormsChanged = BEHelper.arrayEquals(this.commonForms, Array.from(document.forms));

        if (isFormsChanged) {
            this.commonForms = document.forms;
            this.formsProcessing();
        }
    }

    private formsSetterHandler(): void {
        const formObjects = Object.values(this.forms).filter((item) => item instanceof HTMLObserverValidationForm && !item.initValidation);

        for (const formEntity of formObjects) {
            formEntity.ValidatorInstance = new BEFormValidatorCreate(formEntity.formArgs, formEntity.fields);

            formEntity.ValidatorInstance.init();
            formEntity.initValidation = true;
        }
    }

    public init(): HTMLObserverValidation {
        this.forms = ObservableObject(this.forms);
        this.forms.observe(this.formsSetterHandler.bind(this));

        this.formsProcessing();

        if (window.MutationObserver) {
            this.MutationObserverInstance = new MutationObserver(this.mutationCallback$.bind(this));

            if (!this.$form) {
                this.MutationObserverInstance.observe(document.body, this.MutationObserverOptions);
            }
        } else {
            console.warn(Messages.getMessage('MUTATION_OBSERVER_IS_NOT_SUPPORTED'))
        }

        return this;
    }

    static init($form?: HTMLFormElement): HTMLObserverValidation {
        __LOCAL_INVOKE__ = true;
        return new HTMLObserverValidation($form).init();
    }
}

class HTMLObserverValidationForm implements HTMLObserverValidationFormImpl {
    _id: string = null;
    $form: HTMLElement = null;
    formArgs: Record<any, any> = null;
    fields: Record<any, any> = null;
    initValidation: boolean = false;
    ValidatorInstance: BEFormValidatorCreateImpl = null;
}
