import { LightningElement,api,track } from 'lwc';

export default class Edit extends LightningElement {
  
        @api recordId;
        @api objectApiName;
        @track bShowModal = true;
 
    /* javaScipt functions start */ 
   
 
    closeModal() {    
        // to close modal window set 'bShowModal' tarck value as false
        this.bShowModal = false;
    }
    
}