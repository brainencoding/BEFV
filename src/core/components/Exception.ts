import {BEFormValidator} from "../../index";

export class Exception{
	static throw(s: string, _class: string = 'BEFormValidator') {
		return BEFormValidator.__utils.errorConstructor(_class)(s)
	}
}
