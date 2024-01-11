import { LightningElement,wire,track } from 'lwc';
import getWrapperList from '@salesforce/apex/ContactController.getWrapperList';
export default class Wrapperlwc extends LightningElement {
    @wire(getWrapperList) wrappers;
    @track selected;
    Change(event){
        if(event.target.checked==true)
        {
            this.wrappers.selected=false;
            
        }
        else{
            this.wrappers.selected=true;
        }
        return this.wrappers.selected;

    }
   

    }