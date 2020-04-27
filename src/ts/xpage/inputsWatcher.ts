import App from "./core"

const observerConfig = {
    childList: true,
    subtree: true
};

class InputWatcher{
    private _selector: string

    // private _pluginForWatch: any

    private _els: Array<HTMLInputElement | HTMLSelectElement> = []
    private _observer: MutationObserver

    set selector(selector: string){
        this._selector = selector

        const el = App.getElement(selector);

        // console.log(el[this._watchProp]);

        // if ((el instanceof HTMLInputElement || el instanceof HTMLSelectElement) 
        //     && el[this._watchProp])
        //         this.el = el
    }

    set el (element: HTMLInputElement | HTMLSelectElement){
        this._els.push(element);
    }

    constructor(selector: string, private _watchProp: String, private _pluginForWatch: any, private _pluginSettings: any){
        if ((selector as String) instanceof String && selector){
            this.selector = selector

            this.startObserver()
        } 
    }

    private startObserver(){
        this._observer = new MutationObserver(function(mutationList: MutationRecord[], obs: MutationObserver){
            for (const mutation of mutationList){
                console.log(mutation)
            }
        });

        this._observer.observe(document.body, observerConfig);
    }
}

export default InputWatcher
