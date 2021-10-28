export class Messages {
    static getMessage(messageType: string): string {
        return ({
            INVOKE_ERROR: "Incorrect constructor call, for the class to work, call the [HTMLObserverValidation :: init] method",
            EMPTY_FORMS: "No form exists on the page",
            INVALID_FORM: "Initialized form",
        })[messageType] || 'INVALID MESSAGE TYPE'
    }
}