import { LightningElement, track, api } from 'lwc';
import getDriverInfo from '@salesforce/apex/olaController.getDriverInfo';
import { NavigationMixin } from 'lightning/navigation';



import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import Name from '@salesforce/schema/DriverInfo__c.Name';
import Car_Type__c from '@salesforce/schema/DriverInfo__c.Car_Type__c';
import Car_Name__c from '@salesforce/schema/DriverInfo__c.Car_Name__c';
import Vehicle_Number__c from '@salesforce/schema/DriverInfo__c.Vehicle_Number__c';
import Rating__c from '@salesforce/schema/DriverInfo__c.Rating__c';
import Available__c from '@salesforce/schema/DriverInfo__c.Available__c';

export default class OlaMain extends NavigationMixin(LightningElement) {
    fields=[Name,Car_Type__c,Car_Name__c,Vehicle_Number__c,Rating__c,Available__c];
    @track info;
    @track errors;
    @api type = '';
    @track bshowModal=false;
    
    showInfo(event){
        this.type = event.target.name;
        console.log(this.type);
        //
        getDriverInfo({type : this.type})
            .then(result => {this.info = result;})
            .catch(error => {this.errors = error;});
    }
    // newData(event){
    //     const defaultValues = encodeDefaultFieldValues({
    //         Car_Type__c: event.target.name,
            
    //     });
        
        

    //     console.log(defaultValues);
    //     this[NavigationMixin.Navigate]({
    //         type: 'standard__objectPage',
    //         attributes: {
    //             objectApiName: 'DriverInfo__c',
    //             actionName: 'new',
    //         },
    //         state: {
    //             defaultFieldValues: defaultValues
    //         }
    //     });
    // }
    openModal(){
        this.bshowModal=true;
    }
    closeModal() {
        // to close modal window set 'bShowModal' tarck value as false
        this.bshowModal = false;
    }
    handleSuccess(event){
        const evt=new ShowToastEvent({
            title:"Driver created",
            message:"Record ID: "+event.detail.id,
            variant:"success"
        });
        this.dispatchEvent(evt);
    }
}