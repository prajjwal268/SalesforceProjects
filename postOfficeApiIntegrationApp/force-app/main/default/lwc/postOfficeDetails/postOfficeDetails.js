import { LightningElement,track,wire } from 'lwc';
import { refreshApex } from '@salesforce/apex';
import postOfficeByBranch from '@salesforce/apex/PostOffice.getPostOfficebyBranch';
export default class PostOfficeDetails extends LightningElement {
    @track branchName;
    @track searchClicked=false;
    @track postOffice;
    handleNameChange(event){
        this.branchName=event.target.value;
        console.log('branchNmae');
        console.log(this.branchName);
    }
    postOfficeSearch(){    
        this.searchClicked=true;
        postOfficeByBranch({
            Name: this.branchName
        })
        .then(result => {
            this.postOffice = result;
            console.log('post Office');
            console.log(this.postOffice);
        })
        .catch((error) => {
            this.message = 'Error received: code' + error.errorCode + ', ' +
                'message ' + error.body.message;
        });
    }
}