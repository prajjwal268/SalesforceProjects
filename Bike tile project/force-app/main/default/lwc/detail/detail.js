import { LightningElement, api } from 'lwc';
import { bikes } from 'c/data';


export default class Detail extends LightningElement {

    // Ensure changes are reactive when product is updated
    product;

    // Private var to track @api productId
    //_productId = undefined;

    // Use set and get to process the value every time it's
    // requested while switching between products
    set productZd(value) {
        //this._productId = value;
        this.product = bikes.find(RITA => RITA.fields.Id.value === value);
    }
    
    // getter for productId
    @api get productZd(){
        // return this._productId;
    }
}