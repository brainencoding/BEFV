import {InputMessageImpl} from "../../types";
import {Exception} from "./Exception";
import {constants} from "../../constants";

export class InputMessage implements InputMessageImpl {
	private readonly messageHTML: HTMLElement;

	constructor(public readonly  text: string, public readonly input: HTMLElement, public opt: Record<any, any> = {
		success: false
	}) {
		if (!this.text.length) {
			throw Exception.throw('{ text } for error is empty', 'InputMessage')
		}

		if (!this.input) {
			throw Exception.throw('{ input } is undefined', 'InputMessage')
		}

		this.messageHTML = InputMessage.createWrapper(this.text, opt.success);
	}

	private static createWrapper(text: string, status: boolean): HTMLElement {
		const wrapper = document.createElement('span');
		wrapper.classList.add(!status ? constants.ERROR_MESSAGE_CLASS_NAME : constants.SUCCESS_MESSAGE_CLASS_NAME);
		wrapper.textContent = text;

		return wrapper;
	}

	public append(): void {
		if (!this.opt.noSpan) {
			if (!this.opt.noAdjacent) {
				this.input.insertAdjacentElement('afterend', this.messageHTML);
			} else {
				if (!this.opt.location) {
					throw Exception.throw('{ messages.location } is undefined', 'InputMessage');
				} else {
					this.opt.location.appendChild(this.messageHTML);
				}
			}
		}
	}

	public changeStatus(status: boolean, text: string = this.text): void {
		this.remove();

		const classNameConditionStatus = !status ? constants.ERROR_MESSAGE_CLASS_NAME : constants.SUCCESS_MESSAGE_CLASS_NAME;

		if (!this.opt.noSpan) {
			this.messageHTML.className = '';
			this.messageHTML.classList.add(classNameConditionStatus);

			this.messageHTML.innerText = text || '';
		}

		if (this.opt.hasOwnProperty('border') && this.opt.border) {
			this.input.classList.add(classNameConditionStatus + '-input');
		}

		this.append();
	}

	public remove(): void {
		if (this.opt.hasOwnProperty('border') && this.opt.border) {
			this.input.classList.remove(constants.ERROR_MESSAGE_CLASS_NAME + '-input');
			this.input.classList.remove(constants.SUCCESS_MESSAGE_CLASS_NAME + '-input');
		}

		this.messageHTML.remove();
	}
}
