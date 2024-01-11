import { LightningElement,track } from 'lwc';

export default class LwcName extends LightningElement {
@track fName='';
@track lName='';
@track showInUpperCase=false;
handleChange(event){
    
    const field=event.target.name;
    if(field==='firstName'){
        this.fName=event.target.value;

    }
    else if(field==='lastName'){
        this.lName=event.target.value;
    }
}
show(event){
    this.showInUpperCase=event.target.checked;
}
    get uppercasedFullName(){
        return `${this.fName} ${this.lName}`.toUpperCase();
}
get lowercasedFullName(){
    return `${this.fName} ${this.lName}`.toLowerCase();
}
/*get uppercasedFullName(){
    return `${this.fName} ${this.lName}`;
}*/

}