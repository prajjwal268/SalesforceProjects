import { LightningElement, track, wire } from 'lwc';
import findContacts from '@salesforce/apex/ContactController.findContacts';


const DELAY = 300;

export default class SearchContactLwc extends LightningElement {
    @track searchKey = '';

    @wire(findContacts, {searchKey: '$searchKey'}) contacts;

    handleChange(event){
        window.clearTimeout(this.delayTimeout);
        const searchKey = this.template.querySelector('lightning-input').value;
        this.delayTimeout = setTimeout(() => {
            this.searchKey = searchKey;
        }, DELAY);
    }
}