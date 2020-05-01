import $ from "jquery";

window.jQuery = $
window.$ = $
// window.is = is

require("./jquery.fancybox.js");

document.addEventListener("DOMContentLoaded", function(){
	$(".fancybox").fancybox({
		trapFocus: false,
		touch: false,
		buttons: ["fullscreen", "close", "thumbs"],
		image: {
			preload: true,
		},
		transitionEffect: "slide",
	});
});

document.addEventListener("DOMContentLoaded", function(){

	
	$(window).on("load scroll", function(){
		if ($(window).scrollTop() > 45){
			$(".head-cont").addClass('js__scroll-offset');
		}else{
			$(".head-cont").removeClass('js__scroll-offset');
		}
	});

});