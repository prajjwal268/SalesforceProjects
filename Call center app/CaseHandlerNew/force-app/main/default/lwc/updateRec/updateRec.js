import { LightningElement,api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class UpdateRec extends LightningElement {
    @api recordId;
    
    handleSubmit(event) {
        
        console.log('onsubmit event recordEditForm'+ event.detail.fields);
    }
    handleSuccess(event) {
        this.dispatchEvent(

            new ShowToastEvent({
                title: 'Success',
                message: 'Case updated!! Close the window',
                variant: 'success',
                mode: 'dismissable'
            })
    );
        
        console.log('onsuccess event recordEditForm', event.detail.id);
    }
    handleReset(event) {
   const inputFields = this.template.querySelectorAll(
       'lightning-input-field'
   );
   if (inputFields) {
       inputFields.forEach(field => {
           field.reset();
       });
   }
}
}