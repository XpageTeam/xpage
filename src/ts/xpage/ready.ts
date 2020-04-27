/** 
 * DOMContentLoaded 
 * @param callback : Function
*/
const domReady = (callback: any): void => {
	try{
		document.addEventListener("DOMContentLoaded", callback)
	}catch(e){
		throw Error(e)
	}
}

export default domReady