export class Messages
{
    static getMessage(messageType: string): string
    {
        return ({
            INVOKE_ERROR: "Incorrect constructor call, for the class to work, call the [HTMLObserverValidation :: init] method",
            EMPTY_FORMS: "No form exists on the page",
            INVALID_FORM: "Initialized form",
            MUTATION_OBSERVER_IS_NOT_SUPPORTED: "Mutation observer not found or not supported!",
        })[messageType] || "INVALID MESSAGE TYPE";
    }
}