export default class App {
	public static getElements(selector: string): NodeList{
		const elements: any = document.querySelectorAll(selector);

		return elements.length ? elements : []
		// return this.elementsGetter(sele ctor)
	}

	/**
	* Метод получения одного объекта по селектору
	* @param selector: string
	* @return HTMLElement
	*/
	public static getElement(selector: string): HTMLElement{
		const element: any = document.querySelector(selector);

		return element
	}

	public static elementsGetter(selector: string): HTMLElement[]{
		return App.transformNodeListToArray(document.querySelectorAll(selector))
	}

	public static transformNodeListToArray(list: NodeList): HTMLElement[]{
		try{
			return Array.prototype.slice.call(list)
		}catch(e){
			throw Error(e)
			return []
		}
	}

	public static wrap(selector: any, wrapper: HTMLElement): void
	public static wrap(selector: any, wrapper: string): void
	public static wrap(selector: any, wrapper: any): void{
		let localWrapper: HTMLElement;

		if (typeof wrapper == "string")
			localWrapper = document.createElement(wrapper)
		else if (wrapper instanceof HTMLElement)
			localWrapper = wrapper

		// console.log(selector, [localWrapper])

		App.each(selector, function(el: HTMLElement, i:number){
			localWrapper.innerHTML = el.outerHTML

			el.parentNode.replaceChild(localWrapper, el)
		})
	}

	public static each(elements: string, callback: any): void
	public static each(elements: HTMLElement[], callback: any): void
	public static each(elements: NodeList, callback: any): void
	public static each(elements: any, callback: any): void{

		if (!callback){
			console.error("Callback does not exists in yours 'each'")
			return
		}

		if (typeof elements == "string")
			elements = App.transformNodeListToArray(App.getElements(elements))

		let i = 0;

		for (let el of elements){
			callback(el, i)
			i++
		}
	}
}