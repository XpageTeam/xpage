import App from "./core"
import Element from "./Element"
import EventListener from "./EventListener"

interface mobileMenuSettings {
	burger: string,
	menu: string,
	menuActiveClass: string,
	bodyActiveClass: string,
	ignoreWarnings: boolean,
	fixBody: boolean,
	media?: string,
}

export default class MobileMenu{
	private _settings: mobileMenuSettings
	private _burger: HTMLElement
	private _menu: HTMLElement
	private _state: boolean = false
	private _error: boolean = false
	private menuActiveClass: string = "js__opened"
	private bodyActiveClass: string = "js__menu-opened"
	private body: HTMLElement = App.getElement("body")
	private ignoreWarnings: boolean = false

	set error(text: string){
		this._error = true

		console.error(`${text}. Меню не работает`)
	}

	set state(newState: boolean){
		this._state = newState
	}


	set menu (el: HTMLElement){
		if (!(el instanceof HTMLElement) && !this.ignoreWarnings)
			this.error = "Меню не найдено"
		else
			this._menu = el
	}

	set burger(el: HTMLElement){
		if (!(el instanceof HTMLElement) && !this.ignoreWarnings)
			this.error = "Бургер не найден"
		else
			this._burger = el
	}

	get burger(){
		return this._burger
	}

	get menu(){
		return this._menu
	}

	get settings(){
		return this._settings
	}

	get state(){
		return this._state
	}

	constructor(settings: mobileMenuSettings){
		this._settings = settings
		this.ignoreWarnings = settings.ignoreWarnings


		this.burger = App.getElement(settings.burger)

		this.menuActiveClass = settings.menuActiveClass
		this.bodyActiveClass = settings.bodyActiveClass

		this.menu = App.getElement(settings.menu)

		this.bindEvents()
	}

	public openMenu(): MobileMenu{
		if (!window.matchMedia(this.settings.media).matches)
			return

		if (this.settings.fixBody){
			this.body.style.top = -window.pageYOffset + "px";
			this.body.style.position = "fixed";
		}

		this.burger.classList.add("js__active")
		this.menu.classList.add(this.menuActiveClass)
		this.body.classList.add(this.bodyActiveClass)

		this.state = true

		return this
	}

	public closeMenu(): MobileMenu{
		if (!window.matchMedia(this.settings.media).matches || !this.state)
			return

		let top: number = 0;

		if (this.settings.fixBody){
			top = Math.abs(parseInt(this.body.style.top))

			this.body.style.top = ""
			this.body.style.position = ""
		}

		this.burger.classList.remove("js__active")
		this.menu.classList.remove(this.menuActiveClass)
		this.body.classList.remove(this.bodyActiveClass)

		if (this.settings.fixBody)
			window.scrollTo(0, top)

		this.state = false

		return this
	}

	public toggleMenu(): MobileMenu{
		if (!window.matchMedia(this.settings.media).matches)
			return

		if (this.state)
			this.closeMenu()
		else
			this.openMenu()

		return this
	}

	private bindEvents(){
		document.addEventListener("click", (event: any) => {
			const target: Element = new Element(event.target);
			
			if(!target.is(this.burger)
				&& !new Element(this.burger).has(target)
				&& !target.is(this.menu)
				&& !new Element(this.menu).has(target))
				this.closeMenu()
		})

		new EventListener(this.burger).add("click", (el: HTMLElement) => {
			this.toggleMenu()
		})
	}
}