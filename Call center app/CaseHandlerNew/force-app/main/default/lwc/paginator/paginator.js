import { LightningElement, api, track } from 'lwc';
/* eslint-disable no-console */
 /* eslint-disable no-alert */
export default class Paginator extends LightningElement {
    @track previousDisabled;
    @track nextDisabled;
     @api
    changeView(str){
        console.log(str);
        if(str === 'trueprevious'){
            this.previousDisabled= true;
        }
        if(str === 'falsenext'){
            this.nextDisabled = false;
        }
        if(str === 'truenext'){
            this.nextDisabled = true;
        }
        if(str === 'falseprevious'){
            this.previousDisabled = false;
        }
    }
    connectedCallback(){
        console.log('Here in rendered');
          this.previousDisabled = true;
    }
    previousHandler1() {
        this.dispatchEvent(new CustomEvent('previous'));
    }

    nextHandler1() {
        this.dispatchEvent(new CustomEvent('next'));
    }
    FirstPageHandler1(){
        this.dispatchEvent(new CustomEvent('firstpage'));
    }
    LastPageHandler1(){
        this.dispatchEvent(new CustomEvent('lastpage'));
    }
    changeHandler(event){
        event.preventDefault();
        const s_value = event.target.value;
        const selectedEvent = new CustomEvent('selected', { detail: s_value});

        this.dispatchEvent(selectedEvent);
 
    }
}