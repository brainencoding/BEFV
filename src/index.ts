import {TBEFormValidator} from "./types";
import {BEFormValidatorCreate} from "./core/BEFormValidatorCreate";
import {constants} from "./constants";
import {utils} from "./utils";

export let BEFormValidator: TBEFormValidator = Object.create({});

class BEFormValidatorModule {
	static load(): void {
		Object.defineProperty(BEFormValidator, '__constants', {
			value: constants
		});

		Object.defineProperty(BEFormValidator, '__utils', {
			value: utils
		});

		Object.defineProperty(BEFormValidator, 'Create', {
			value: BEFormValidatorCreate
		});
	}

	static afterLoad(): void {
		Object.freeze(BEFormValidator.__constants);
		Object.freeze(BEFormValidator.__utils);

		window.BEFormValidator = BEFormValidator;
	}
}

function bootstrap() {
	BEFormValidatorModule.load();
	BEFormValidatorModule.afterLoad();
}


bootstrap();

