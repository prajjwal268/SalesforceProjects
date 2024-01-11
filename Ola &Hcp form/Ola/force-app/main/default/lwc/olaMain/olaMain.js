import { LightningElement, track, api } from 'lwc';
import getDriverInfo from '@salesforce/apex/olaController.getDriverInfo';
import { NavigationMixin } from 'lightning/navigation';
import { encodeDefaultFieldValues } from 'lightning/pageReferenceUtils';

export default class OlaMain extends NavigationMixin(LightningElement) {
    @track info;
    @track errors;
    @api type = '';
    showInfo(event){
        this.type = event.target.name;
        console.log(this.type);
        //
        getDriverInfo({type : this.type})
            .then(result => {this.info = result;})
            .catch(error => {this.errors = error;});
    }
    newData(event){
        const defaultValues = encodeDefaultFieldValues({
            Car_Type__c: event.target.name,
            
        });
        
        

        console.log(defaultValues);
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'DriverInfo__c',
                actionName: 'new',
            },
            state: {
                defaultFieldValues: defaultValues
            }
        });
    }
}