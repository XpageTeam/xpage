import domReady from "./xpage/ready";
import App from "./xpage/core";
import Element from "./xpage/Element";
import EventListener from "./xpage/EventListener";

domReady(() => {
	App.each(".default-input__input--file", (el: HTMLInputElement) => {
		const textInput = new Element(el).closest(".default-input")
							.find(".default-input__input[type='text']").getHTMLElement(0);

		new EventListener(textInput).add("click", (input: HTMLInputElement) => {
			el.click()
		})

		new EventListener(el).add("change", (el: HTMLInputElement) => {
			let files: Array<string> = [];

			for (let i = 0; i < el.files.length; i++)
				files.push(el.files[i].name)

			if (!files.length)
				(textInput as HTMLInputElement).value = ""
			else{
				(textInput as HTMLInputElement).value = files.join(", ")
			}
		})
	})
})