import {InputMessageImpl} from "../../types";
import {Exception} from "./Exception";
import {constants} from "../../constants";

export class InputMessage implements InputMessageImpl {
	private readonly messageHTML: HTMLElement;

	constructor(public readonly  text: string, public readonly input: HTMLElement, success: boolean = false) {
		if (!this.text.length) {
			throw Exception.throw('{ text } for error is empty', 'InputMessage')
		}

		if (!this.input) {
			throw Exception.throw('{ input } is undefined', 'InputMessage')
		}

		this.messageHTML = InputMessage.createWrapper(this.text, success);
	}

	private static createWrapper(text: string, status: boolean): HTMLElement {
		const wrapper = document.createElement('span');
		wrapper.classList.add(status ? constants.ERROR_MESSAGE_CLASS_NAME : constants.SUCCESS_MESSAGE_CLASS_NAME);
		wrapper.textContent = text;

		return wrapper;
	}

	public append(): void {
		this.input.insertAdjacentElement('afterend', this.messageHTML);
	}

	public changeStatus(status: boolean): void {
		this.messageHTML.className = '';
		this.messageHTML.classList.add(status ? constants.ERROR_MESSAGE_CLASS_NAME : constants.SUCCESS_MESSAGE_CLASS_NAME)
	}

	public remove(): void {
		this.messageHTML.remove();
	}
}
