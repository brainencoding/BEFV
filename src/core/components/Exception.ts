import {BEFormValidator} from "../../index";

export class Exception
{
    /**
     * Exception::Error creator
     *
     * @param s {String}
     * @param _class {String}
     * @return {Error}
     * */
    static throw(s: string, _class: string = "BEFormValidator"): Error
    {
        return BEFormValidator.__utils.errorConstructor(_class)(s);
    }
}
