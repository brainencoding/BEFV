import {
	AValidateInput,
	BEFormValidatorCreateImpl,
	TRule,
	TValidateElementHandler,
	ValidateElementImpl,
} from "../types";
import {Exception} from "./components/Exception";
import {InputMessage} from "./components/InputMessage";
import {constants} from "../constants";

export class ValidateElement implements ValidateElementImpl
{
    public isValid: boolean = false;
    public isInit: boolean = false;

    public messages: InputMessage;
    public element: HTMLInputElement | HTMLTextAreaElement;

    constructor(public opt: AValidateInput, public validator: BEFormValidatorCreateImpl)
    {
        const clone = {...constants.DEFAUTL_VALUES.VALIDATION_ELEMENT};
        this.opt = Object.assign(clone, this.opt);
        this.element = this.opt.element;

        if (typeof this.element === "string") {
            // @ts-ignore
            const gettingElement = document.querySelector(this.element);

            if (gettingElement) {
                // @ts-ignore
                this.element = gettingElement;
            } else {
                this.element = undefined;
            }
        }
    }

    public validate(): void
    {
        this.isValid = false;

        let res: boolean = false;
        let stateChecked: boolean;
        let ruleMessagePreventDefault = false;

        const value = this.element?.value;
        const isCheckBox = this.element.type === "checkbox";
        const rules = this.opt.rules;
        const message = this.opt.message;
        const __conditionForSupportingOnlyBorder__ = (!message.required && !message.rule && message.border);
        const InputMessageOpts = {
            location: message.location || undefined,
            noAdjacent: message.noAdjacent || undefined,
            border: message.border || false,
            noSpan: __conditionForSupportingOnlyBorder__,
        };

        if ("checked" in this.element) {
            stateChecked = this.element.checked;
        }

        if (!this.messages) {
            this.messages = new InputMessage(" ", this.element, InputMessageOpts);
        }

        if (rules.hasOwnProperty("required") && rules.required) {
            let valCond = isCheckBox ? !!stateChecked : !!value;

            const _status = valCond ? "success" : "error";

            this.messages.changeStatus(valCond,
                message && message.required ?
                    message?.required.hasOwnProperty(_status) && message.required[_status] :
                    __conditionForSupportingOnlyBorder__ ? "" : "",
            );

            if (!valCond) {
                this.opt.subscriptions.invalid();
                return;
            }
        }

        const additionalFunctionContextProps: Record<any, any> = {
            messagePreventDefault: SetRuleMessagePreventDefault,
        };

        if (rules.hasOwnProperty("rule") && rules.rule !== undefined) {
            const rule: TRule = rules.rule;

            const validateDefaultRule = (innerRule: TRule): boolean =>
            {
                if (innerRule === null) {
                    return true;
                }

                switch (innerRule.constructor) {
                    case RegExp: {
                        return (<RegExp>innerRule).test(value.toString());
                    }

                    case Function: {
                        return (<Function>innerRule).call({...this, ...additionalFunctionContextProps}, this.element, this.validator);
                    }

                    case Array: {
                        const typedRule = (<Array<RegExp | Function>>rule);
                        let localRes = false;

                        if (typedRule.length) {
                            for (const typedRuleElement of typedRule) {
                                const cond: boolean = validateDefaultRule(typedRuleElement);
                                localRes = cond;
                                if (!cond) {
                                    break;
                                }
                            }
                        } else {
                            console.error(ValidateElement.Error("rule of array [] is empty.", this.element.className));

                        }

                        return localRes;
                    }

                    default: {
                        throw ValidateElement.Error("rules: { rule: ... } for this input is not valid. Please use valid RegExp like => /(.*)/g without quotes and dbl quotes or use function \n Element =>", this.element.className);
                    }
                }
            };

            res = validateDefaultRule(rule);

            if (!ruleMessagePreventDefault) {
                this.messages.changeStatus(res,
                    !res ? message?.rule?.error || "" : res ? message?.rule?.success || "" : "",
                );
            }

            if (!res) {
                this.opt.subscriptions.invalid();
                return;
            }
        }

        this.opt.subscriptions.valid(this);
        this.isValid = true;

        function SetRuleMessagePreventDefault(): void
        {
            ruleMessagePreventDefault = true;
        }
    }

    private createHandlerFunc = (options: TValidateElementHandler = constants.DEFAUTL_VALUES.VALIDATOR_ELEMENT_HANDLER) =>
    {
        return (event: Event) =>
        {
            if (options.handler) {
                options.handler(event);
            }

            if (options.useValidate) {
                this.validate();
            }

            if (options.useSubscribeOnInput && this.validator.form.subscribeOnInput) {
                this.validator.emit("BEForm::checkInputValidation");
            }
        };
    };

    public init(): void
    {
        if (!this.isInit && !this.opt.onlyOnSubmit) {
            this.element.addEventListener(
                "input",
                this.createHandlerFunc({
                    handler: this.opt.handlers.input,
                    useValidate: true,
                    useSubscribeOnInput: true,
                }),
            );
        }

        this.isInit = true;
    }

    public isCorrect(): boolean
    {
        if (!this.element) {
            console.error(ValidateElement.Error(`{ element => ${this.opt.element} } is nothing to found!`));

            return false;
        }

        if (!this.opt.hasOwnProperty("rules")) {
            console.error(ValidateElement.Error("{ rules } is not defined!"));

            return false;
        }

        return true;
    }

    public destroy(idx?: number): void
    {
        if (idx) {
            ValidateElement.Error("object are destroyed for element [index => " + idx + "], element is undefined!");
        }

        if (this.isInit) {
            if (this.messages && this.messages.remove) {
                this.messages.remove();
                this.messages = undefined;
            }
        }
    }

    static Error(..._s: string[]): Exception
    {
        const str: string = _s.reduce((acc, prev) => acc + prev);

        return Exception.throw(str, "ValidateElement");
    }
}


