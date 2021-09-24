import {HTMLObserverValidationImpl} from "../types";

let __LOCAL_INVOKE__ = false;

export class HTMLObserverValidation implements HTMLObserverValidationImpl {
    forms: Array<HTMLFormElement> = []

    constructor() {
        if (!__LOCAL_INVOKE__) {
            throw new Error(ErrorMessages.getMessage('INVOKE_ERROR'));
        }

    }

    getFroms() {}

    init(): HTMLObserverValidation {

        return this;
    }

    static init() {
        __LOCAL_INVOKE__ = true;

    }
}

class ErrorMessages {
    static getMessage(messageType: string): string {
        return ({
            INVOKE_ERROR: "Incorrect constructor call, for the class to work, call the [HTMLObserverValidation :: init] method",
        })[messageType] || 'INVALID MESSAGE TYPE'
    }
}

