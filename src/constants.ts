export const constants = Object.create({});

constants.VERSION = '0.0.1';

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
}

constants.DATASET = {
	VALID: "data-be-valid"
}
