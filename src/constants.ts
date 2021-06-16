export const constants = Object.create({});

constants.VERSION = '0.0.1';
constants.PACKAGE_NAME_IN_FORM = '__BEFV';

constants.VALIDATOR_TYPES = {
	phone: 'phone',
	email: 'email',
	required: 'required',
	length: 'length',
}

constants.DEFAUTL_VALUES = {
	VALIDATOR: {
		element: undefined,
		options: {
			default: false,
		},
		subscriptions: {},
		handlers: {},
	},
	VALIDATION_ELEMENT: {
		onlyOnSubmit: false,
		subscriptions: {
			valid: () => {},
			invalid: () => {}
		},
		handlers: {
			input: () => {}
		}
	}
}

constants.DATASET = {
	VALID: "data-be-valid"
}

constants.ERROR_MESSAGE_CLASS_NAME = 'be-error-message';
constants.SUCCESS_MESSAGE_CLASS_NAME = 'be-success-message';
