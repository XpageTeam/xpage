import domReady from "../xpage/ready";
import App from "../xpage/core";
import EventListener from "../xpage/EventListener";

interface Shadows {
	right: HTMLElement,
	left?: HTMLElement
}

domReady(() => {
	const tableWrap: HTMLElement = document.createElement("div"),
		tableWrapTrack: HTMLElement = document.createElement("div"),
		shadows: Shadows = {
			right: document.createElement("div"),
			left: document.createElement("div"),
		};

	shadows.right.classList.add("table-wrap__shadow")
	shadows.right.classList.add("table-wrap__shadow--right")	

	shadows.left.classList.add("table-wrap__shadow")
	shadows.left.classList.add("table-wrap__shadow--left")

	tableWrap.classList.add("table-wrap");
	tableWrapTrack.classList.add("table-wrap__track");

	App.wrap(".standart-page__text table:not([class])", tableWrapTrack)
	App.wrap(".table-wrap__track", tableWrap)

	App.each(".table-wrap", (el: HTMLElement) => {
		el.insertBefore(shadows.left, el.querySelector("*:first-child"))
		el.insertBefore(shadows.right, null)
	})

	App.each(".table-wrap__track", function(track: HTMLElement){
		if (track.scrollWidth > track.clientWidth){
			let wrap = track.closest(".table-wrap");

			let shadows: Shadows = {
				right: wrap.querySelector(".table-wrap__shadow--right")
			};

			setShadowOpacity(shadows.right, track.scrollWidth - track.clientWidth)
		}

		new EventListener(track).add("scroll", function(el: HTMLElement){
			let wrap = el.closest(".table-wrap");

			let shadows: Shadows = {
				left: wrap.querySelector(".table-wrap__shadow--left"),
				right: wrap.querySelector(".table-wrap__shadow--right")
			};

			setShadowOpacity(shadows.right, el.scrollWidth - el.clientWidth - el.scrollLeft)
			setShadowOpacity(shadows.left, el.scrollLeft)
		})
	})

})

const setShadowOpacity = (element:HTMLElement, scrollWidth: number, offsetWidth: number = 80) => {
	element.style.opacity = (scrollWidth / offsetWidth <= 1 ? scrollWidth / offsetWidth : 1).toString()
}