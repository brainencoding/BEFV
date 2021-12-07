import {TBEFormValidator} from "./types";
import {BEFormValidatorCreate} from "./core/BEFormValidatorCreate";
import {constants} from "./constants";
import {utils} from "./utils";
import {DefaultRules} from "./core/DefaultRules";
import {BEModules} from "./modules";
import {BEHelper} from "./core/BEHelper";

export let BEFormValidator: TBEFormValidator = Object.create({});

class BEFormValidatorModule {
	static load(): void {
		Object.defineProperty(BEFormValidator, '__constants', {
			value: constants,
		});

		Object.defineProperty(BEFormValidator, '__utils', {
			value: utils,
		});
		
		Object.defineProperty(BEFormValidator, 'DefaultRules', {
			value: DefaultRules,
		});

		Object.defineProperty(BEFormValidator, 'Create', {
			value: BEFormValidatorCreate,
		});

		Object.defineProperty(BEFormValidator, 'BEHelper', {
			value: BEHelper,
		});

		Object.defineProperty(BEFormValidator, 'modules', {
			value: BEModules.getModules(),
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
