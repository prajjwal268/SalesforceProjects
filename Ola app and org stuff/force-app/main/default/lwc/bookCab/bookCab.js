import { LightningElement, api, track} from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import star from '@salesforce/resourceUrl/starimg';
import Available__c from '@salesforce/schema/DriverInfo__c.Available__c';

export default class BookCab extends NavigationMixin(LightningElement) {

    @api driver;
    @api error;
    starLogo = star;
    @track bShowModal = false;

    field = [Available__c];

    openModal() {
        // to open modal window set 'bShowModal' tarck value as true
        this.bShowModal = true;
    }

    closeModal() {
        // to close modal window set 'bShowModal' tarck value as false
        this.bShowModal = false;
    }

    handleSuccess(event) {
        const evt = new ShowToastEvent({
            title: "Cab Booked",
            variant: "success"
        });
        this.dispatchEvent(evt);
        location.reload();
    }

    alreadyBooked(event){
        
        const evt = new ShowToastEvent({
            title: "Driver Not Available",
            variant: "danger"
        });
        this.dispatchEvent(evt);

    }

}