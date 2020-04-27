import App from "./core"

export default class Element {
	// private _selector: string
	protected _els: HTMLElement[]
	public _length: number = 0

	set els(elements: HTMLElement[]){
		this._els = elements

		this._length = elements.length || 0
	}

	get els(){
		return this._els
	}

	get length(){
		return this._length
	}

	/**
	* Создание коллекции элементов
	* @param selector: HTMLElement[] || NodeList || HTMLElement || Element || string
	* @return Element
	*/  
	constructor (selector?: EventTarget)
	constructor (selector?: HTMLElement[])
	constructor (selector?: NodeList)
	constructor (selector?: Element)
	constructor (selector?: string)
	constructor (selector?: HTMLElement)
	constructor (selector?: any){

		if (!selector)
			this.els = []
		else if (typeof selector == "string")
			this.els = App.elementsGetter(selector)
		else if (selector instanceof HTMLElement)
			this.els = [selector]
		else if (selector instanceof NodeList)
			this.els = App.transformNodeListToArray(selector)
		else if (selector instanceof Array && (selector[0] instanceof HTMLElement || !selector.length))
			this.els = selector
		else if (selector instanceof Element)
			this.els = selector.els
		else
			throw Error(`Invalid selector: ${selector}`)
	}

	/**
	 * Метод добавление HTMLElemnt в экземпляр
	 * класса Element
	 * @param element: HTMLElement || NodeList || string || Element
	 * @return Element
	 */
	public addElement(element: Element): Element
	public addElement(element: NodeList): Element
	public addElement(element: string): Element
	public addElement(element: HTMLElement): Element
	public addElement(element: HTMLElement[]): Element
	public addElement(element: any): Element{

		if (typeof element == "string")
			this.els = this.els.concat(App.elementsGetter(element))
		else if (element instanceof Element)
			this.els = this.els.concat(element.els)
		else if (element instanceof HTMLElement)
			this.els = this.els.concat(element)
		else if (element instanceof NodeList)
			this.els = this.els.concat(App.transformNodeListToArray(element))
		else if (element instanceof Array && (element[0] instanceof HTMLElement || !element.length))
			this.els = this.els.concat(element)
		else
			throw Error(`Invalid selector: ${element}`)
		return this
	}


	/** 
	* Метод сравнения элементов
	* @param selector: HTMLElement || string
	* @return boolean
	*/
	public is(selector: HTMLElement): boolean
	public is(selector: string): boolean
	public is(selector: any): boolean{
		let element: HTMLElement[];

		if (typeof selector == "string")
			element = App.elementsGetter(selector)
		else if (selector instanceof HTMLElement)
			element = [selector]

		return this.els[0] == element[0]
	}

	/** Метод проверки содержания текущими элементами передаваемых
	* @param selector: Element || HTMLElement || HTMLElement[] || NodeList || string
	* @return boolean
	*/
	public has(selector: Element): boolean
	public has(selector: HTMLElement): boolean
	public has(selector: HTMLElement[]): boolean
	public has(selector: NodeList): boolean
	public has(selector: string): boolean
	public has(selector: any): boolean{
		let searchElements: HTMLElement[];

		if (typeof selector == "string")
			searchElements = App.elementsGetter(selector)
		else if (selector instanceof HTMLElement)
			searchElements = [selector]
		else if (selector instanceof Element)
			searchElements = selector._els
		else if (selector instanceof NodeList)
			searchElements = App.transformNodeListToArray(selector)
		else if (selector instanceof Array && (selector[0] instanceof HTMLElement || !selector.length))
			searchElements = selector
		else
			throw Error(`Invalid selector: ${selector}`)

		let isFinded: boolean = false;

		for (let el of this.els){

			for (let target of searchElements)
				if (el.contains(target)){
					isFinded = true
					break
				}

			if (isFinded)
				return true
		}

		return false
	}

	/**
	* Назначить класс всем текущим элементам
	* @param className: string
	* @return Element
	*/
	public addClass(className: string): Element{
		App.each(this.els, (el: HTMLElement) => {
			el.classList.add(className)
		})
		return this
	}

	/**
	* Удалить класс у всех текущих элементов
	* @param className: string
	* @return Element
	*/
	public removeClass(className: string): Element{
		App.each(this.els, (el: HTMLElement) => {
			el.classList.remove(className)
		})
		return this
	}

	/**
	* Переключения класса у всех текущих элементов
	* @param className: string
	* @return Element
	*/
	public toggleClass(className: string, callback?: Function): Element{
		App.each(this.els, (el: HTMLElement) => {
			if (el.classList.contains(className)){
				el.classList.remove(className)

				if(callback)
					callback(false)
			}else{
				el.classList.add(className)

				if(callback)
					callback(true)
			}
		})
		return this
	}

	public hasClass(targetClass: string): boolean{
		for (const el of this.els)
			if (el.classList.contains(targetClass))
				return true

		return false
	}

	/** Метод поиска потомков элемента по селектору 
	* @param selector: string - селектор искомого
	* @return Element
	* */
	public find(selector: string): Element{
		let searchingElements = new Array();

		App.each(this.els, (el: HTMLElement) => {
			const findedElements: NodeList = el.querySelectorAll(selector);

			if (!findedElements.length)
				return

			for (const el of App.transformNodeListToArray(findedElements))
				searchingElements.push(el)

			// searchingElements.concat(App.transformNodeListToArray(findedElements))

			// console.log(searchingElements instanceof Array, App.transformNodeListToArray(findedElements) instanceof Array)
		})

		return new Element(searchingElements)
	}

	/** Метод поиска родителей по селектору 
	* @param selector: string
	* @return Element 
	*/
	public closest(selector: string): Element{
		const searchingElements = new Element();

		App.each(this.els, (el: HTMLElement) => {
			const findedElements: any = el.closest(selector);

			if (!findedElements)
				return

			searchingElements.addElement(findedElements);
		})

		return searchingElements
	}

	/** Метод для изменения и получения innerText
	* @param text?: string
	* @return ELement || string[] || string */
	public text(): string
	public text(text?: string): string[]
	public text(text?: string): string
	public text(text?: string): any{
		if (text){
			App.each(this.els, (el: HTMLElement) => {
				el.innerText = text
			})
			return this
		}else if (this.length > 1){
			let textArray: string[] = [];

			App.each(this.els, (el: HTMLElement) => {
				textArray.push(el.innerText)
			})
			return textArray
		}else
			return this.els[0].innerText
	}

	/** Метод для получения конкретного элемента по индексу 
	* @param index: number
	* @return Element*/
	public get(index: number): Element{
		if (this.els[index])
			return new Element(this.els[index])
		else
			return new Element()
	}

	/** Функция, возвращающая HTMLElement по индексу в коллеции элементов 
	* @param index: nuber
	* @return HTMLElement 
	*/
	public getHTMLElement(index: number): HTMLElement{
		return this.els[index]
	}

	/** Метод получениея или установки высоты элементов
	* @param height || empty 
	* @return height: number || Element */
	public height(height?: number): Element
	public height(height?: string): Element
	public height(height?: any): any{
		if (!height)
			return parseInt(getComputedStyle(this.els[0]).height)

		App.each(this.els, (el: HTMLElement) => {
			if (isNaN(height))
				el.style.height = height
			else
				el.style.height = height + "px"
		})

		return this
	}

	/** Map
	* @param callback: Function
	* @return any[] */
	public map(callback: any): any[]{
		return this.els.map(callback)
	}

	/** Метод для изменения или получение атрибута
	* @param attrName: string - имя атрибута
	* @param value:string - Новое значение атрибута
	* @return Element || string */
	public attr(attrName: string, value?: string): string
	public attr(attrName: string, value?: string): Element
	public attr(attrName: string, value?: string): any{
		if (value){
			App.each(this.els, (el: HTMLElement) => {
				el.setAttribute(attrName, value)
			})
			return this
		}

		return this.els[0].getAttribute(attrName)
	}


	/** Метод в разработке */
	public prev(selector?: string): Element{
		const searchingElements = new Element();

		App.each(this.els, (el: HTMLElement) => {
			const findedElements: any = el.previousElementSibling;

			if (!findedElements)
				return

			if (selector){
				if (findedElements.classList.contains(selector.replace(".", "")))
					searchingElements.addElement(findedElements)
			}else
				searchingElements.addElement(findedElements)
		})

		return searchingElements
	}
}