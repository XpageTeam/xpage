import App from "./core"
import Element from "./Element"

interface EventOtions{
	capture?: boolean,
	once?: boolean,
	passive?: boolean
}

export default class EventListener extends Element{

	/** 
	* Метод для подписки на событие
	* @param event: string - название js события
	* @param callback: function
	* @param options: object
	* @retrun EventListener
	*/
	public add(event: string, callback: any, options?: EventOtions): EventListener{

		App.each(this.els, function(el:HTMLElement, i: number){
			el.addEventListener(event, function(event){
				callback(this, event, i)
			}, options)
		})

		return this
	}

	/** 
	* Метод для вызова события
	* @param event: string - название js события
	* @retrun EventListener
	*/
	public trigger(event: string): EventListener{
		App.each(this.els, function(el: HTMLElement){
			let evt: Event = document.createEvent("HTMLEvents");

			evt.initEvent(event, false, true)
			el.dispatchEvent(evt)
		})

		return this
	}
}