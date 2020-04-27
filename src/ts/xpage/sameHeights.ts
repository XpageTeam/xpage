import App from "./core"
import Element from "./Element"

const setSameHeights = (containerSelector: string, targetSelector: string) => {
	App.each(containerSelector, (el: HTMLElement) => {
		new Element(el.querySelectorAll(targetSelector)).height(
			Math.max(...new Element(el.querySelectorAll(targetSelector)).map((value: HTMLElement) => {
				return parseInt(getComputedStyle(value).height)})))
	})
}

export default setSameHeights