import { LightningElement, api,track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import LOGO from '@salesforce/resourceUrl/starimg';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import deleteRecord from '@salesforce/apex/olaController.deleteRecord';
export default class InfoDisplay extends NavigationMixin(LightningElement) {
    
    @api driver;
    @api logo=LOGO;
    editInfo(event){
        console.log('sds'+this.driver.Name);
             // Opens the Account record modal
             // to view a particular record.
            //a0C2v00000zhhbbEAA
             this[NavigationMixin.Navigate]({
                 type: 'standard__recordPage',
                 attributes: {
                     recordId: this.driver.Id,
                     objectApiName: 'DriverInfo__c', // objectApiName is optional
                     actionName: 'edit'
                 }
             });
         
     }
     deleteDriverInfo(event){
        console.log(this.driver.Id);
        deleteRecord({
                driver: this.driver.Id
            })
            .then()
            .catch(error => {
                this.error = error;
            });

        const evt = new ShowToastEvent({
            title: "Driver deleted",
            message: "Record ID: " + this.driver.Id,
            variant: "success"
        });
        this.dispatchEvent(evt);
        console.log('Deleted');
        window.location.reload();

     }
    //  @api objectApiName;
    
    // @track error;
    // deleteMe(event) {
    //     deleteRecord(this.driver.Id)
    //         .then(() => {
    //             this.dispatchEvent(
    //                 new ShowToastEvent({
    //                     title: 'Success',
    //                     message: 'Record deleted',
    //                     variant: 'success'
    //                 })
    //             );
    //             // Navigate to a record home page after
    //             // the record is deleted, such as to the
    //             // contact home page
    //             this[NavigationMixin.Navigate]({
    //                 type: 'standard__objectPage',
    //                 attributes: {
    //                     objectApiName: 'DriverInfo__c',
    //                     actionName: '',
    //                 },
    //             });
    //         })
    //         .catch(error => {
    //             this.dispatchEvent(
    //                 new ShowToastEvent({
    //                     title: 'Error deleting record',
    //                     message: error.body.message,
    //                     variant: 'error'
    //                 })
    //             );
    //         });
    // }
}