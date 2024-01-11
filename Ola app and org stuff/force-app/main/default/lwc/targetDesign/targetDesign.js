import { LightningElement,api } from 'lwc';

export default class TargetDesign extends LightningElement {
@api greeting='World';
handleChange(event){
    this.greeting=event.target.value;
}
}