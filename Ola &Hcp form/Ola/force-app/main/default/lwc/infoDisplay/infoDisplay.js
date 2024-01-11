import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class InfoDisplay extends NavigationMixin(LightningElement) {
    
    @api driver;
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
}