import { LightningElement,track } from 'lwc';
import getCaseList from '@salesforce/apex/CaseUpdateLwc.getCaseList';
import {updateRecord} from 'lightning/uiRecordApi';
import {refreshApex} from  '@salesforce/apex';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CaseInlineEdit extends LightningElement {
    @track cases=[];
    @track data=[];
    @track error;
    @track draftValues=[];
    @track selectedOption=10;
    @track strSubject;
    lastSavedData = [];
    connectedCallback(){
        this.columns=[
            {label:'Case Number',fieldName:'recordLink',type:'url',typeAttributes:{label:{fieldName:'CaseNumber'},tooltip:'CaseNumber',target:'_blank'}},
            {label:'Account Name',fieldName:'AccountId',type:'lookup'},
            {label:'Contact Name',fieldName:'ContactId',type:'lookup', editable: true },
            {label:'Subject',fieldName:'Subject', editable: true },
            {label:'Case Reason',fieldName:'Reason',type:'picklist',typeAttributes: {
                placeholder: 'Choose Reason', options: [
                    { label: 'Installation', value: 'Installation' },
                    { label: 'Equipment Complexity', value: 'Equipment Complexity' },
                    { label: 'Performance', value: 'Performance' },
                    { label: 'Breakdown', value: 'Breakdown' },
                    { label: 'Equipment Design', value: 'Equipment Design' },
                    { label: 'Feedback', value: 'Feedback' },
                    { label: 'Other', value: 'Other' },
                ], value: { fieldName: 'Reason' }, context:{ fieldName: 'Id' }},
                 }
        ,
            {label:'Case Status',fieldName:'Status',type:'picklist',typeAttributes: {
                placeholder: 'Choose Status', options: [
                    { label: 'New', value: 'New' },
                    { label: 'Working', value: 'Working' },
                    { label: 'Escalated', value: 'Escalated' },
                    { label: 'Closed', value: 'Closed' },
                ], value: { fieldName: 'Status' }, context:{ fieldName: 'Id' }},},
            {label:'Case Origin',fieldName:'Origin',type:'picklist',typeAttributes: {
                placeholder: 'Choose Origin', options: [
                    { label: 'Phone', value: 'Phone' },
                    { label: 'Email', value: 'Email' },
                    { label: 'Web', value: 'Web' },
                    
                ], value: { fieldName: 'Origin' }, context:{ fieldName: 'Id' }},}
        ];
        console.log('Here in connected');
        const strSubject='';
        const filter=this.selectedOption;
            getCaseList({strSubject,filter})
            .then(result=>{
                
                var tempCaseList = [];
                for(var i=0;i<result.length;i++){
                    let tempRecord=Object.assign({},result[i]);
                    tempRecord.recordLink='/'+tempRecord.Id;
                    if(tempRecord.ContactId!=null){
                        tempRecord.ContactId=tempRecord.Contact.Name;
                    }
                    if(tempRecord.AccountId!=null){
                        tempRecord.AccountId=tempRecord.Account.Name;
                    }
                    tempCaseList.push(tempRecord);
                    
                }
                this.cases=tempCaseList;
                //console.log('I am here in constructor',JSON.stringify(this.cases));
            })
            .catch(error=>{
                this.error=error;
            });
            
            //save last saved copy
        this.lastSavedData = JSON.parse(JSON.stringify(this.cases));
    }
    picklistChanged(event) {
        event.stopPropagation();
        let dataRecieved = event.detail.data;
        console.log('picklist1'+JSON.stringify(event.detail.data));
        console.log(`picklist2${event.detail.data}`);
        let updatedItem = { Id: dataRecieved.context, Reason: dataRecieved.value };
        this.updateDraftValues(updatedItem);
        this.updateDataValues(updatedItem);
        console.log('Event Started'+JSON.stringify(this.cases));
        console.log('DraFT Valuesa'+JSON.stringify(this.draftValues));
        console.log('DraFT Valuesa'+this.draftValues+dataRecieved.value);
    }
    updateDraftValues(updateItem) {
        let draftValueChanged = false;
        let copyDraftValues = [...this.draftValues];
        //store changed value to do operations
        //on save. This will enable inline editing &
        //show standard cancel & save button
        copyDraftValues.forEach(item => {
            if (item.Id === updateItem.Id) {
                for (let field in updateItem) {
                    item[field] = updateItem[field];
                }
                draftValueChanged = true;
            }
        });

        if (draftValueChanged) {
            this.draftValues.push(...copyDraftValues);
        } else {
            this.draftValues = [...copyDraftValues, updateItem];
        }
    }
    handleCellChange(event) {
        this.updateDraftValues(event.detail.draftValues[0]);
        console.log('handle Cell Change');
    }
    updateDataValues(updateItem) {
        let copyData = [... this.cases];
        let lll=[... this.data];
        console.log('copyData'+lll);
        console.log('copyData'+copyData);
        console.log('start'+JSON.stringify(updateItem));
        copyData.forEach(item => {
            if (item.Id === updateItem.Id) {
                for (let field in updateItem) {
                    item[field] = updateItem[field];

                }
            }
        });
        console.log('In updateDataValues'+JSON.stringify(copyData));
        //write changes back to original data
        this.cases = [...copyData];
    }
    handleKeyChange(event){
        const strSubject=event.target.value;
        const filter=this.selectedOption;
        if(strSubject){
            getCaseList({strSubject,filter})
            .then(result=>{
                var tempCaseList = [];
                for(var i=0;i<result.length;i++){
                    let tempRecord=Object.assign({},result[i]);
                    tempRecord.recordLink='/'+tempRecord.Id;
                    if(tempRecord.ContactId!=null){
                        tempRecord.ContactId=tempRecord.Contact.Name;
                    }
                    if(tempRecord.AccountId!=null){
                        tempRecord.AccountId=tempRecord.Account.Name;
                    }
                    tempCaseList.push(tempRecord);
                    
                }
                this.cases=tempCaseList;
                
            })
            .catch(error=>{
                this.error=error;
            });
        }
        else{
            const strSubject='';
            const filter=this.selectedOption;
            console.log('else');
            getCaseList({strSubject,filter})
            .then(result=>{
                var tempCaseList = [];
                for(var i=0;i<result.length;i++){
                    let tempRecord=Object.assign({},result[i]);
                    tempRecord.recordLink='/'+tempRecord.Id;
                    if(tempRecord.ContactId!=null){
                        tempRecord.ContactId=tempRecord.Contact.Name;
                    }
                    if(tempRecord.AccountId!=null){
                        tempRecord.AccountId=tempRecord.Account.Name;
                    }
                    tempCaseList.push(tempRecord);
                    
                }
                this.cases=tempCaseList;
                
            })
            .catch(error=>{
                this.error=error;
            });
        }
    }
    changeHandler(event) {
        const field = event.target.name;
        
        if (field === 'optionSelect') {
            this.selectedOption = event.target.value;
            const filter=this.selectedOption;
            const strSubject='';
            console.log('filter');
            getCaseList({strSubject,filter})
            .then(result=>{
                var tempCaseList = [];
                for(var i=0;i<result.length;i++){
                    let tempRecord=Object.assign({},result[i]);
                    tempRecord.recordLink='/'+tempRecord.Id;
                    if(tempRecord.ContactId!=null){
                        tempRecord.ContactId=tempRecord.Contact.Name;
                    }
                    if(tempRecord.AccountId!=null){
                        tempRecord.AccountId=tempRecord.Account.Name;
                    }
                    tempCaseList.push(tempRecord);
                    console.log('filter worked');
                    
                }
                this.cases=tempCaseList;
                
            })
            .catch(error=>{
                this.error=error;
            });
            } 
        }
    handleSave(event){
        
        console.log('Save CLicked');
        const recordInputs=event.detail.draftValues.slice().map(draft=>{
            const fields=Object.assign({},draft);
            return {fields};
        });
        console.log('Here');
        const promises=recordInputs.map(recordInput=>updateRecord(recordInput));
        Promise.all(promises).then(cases=>{
            this.dispatchEvent(

                new ShowToastEvent({
                    title: 'Success',
                    message: 'All Cases updated 1',
                    variant: 'success',
                    mode: 'dismissable'
                })
        );
        
    
          // Clear all draft values
          this.draftValues = [];
   
          // Display fresh data in the datatable
          return refreshApex(this.cases);
            }).catch(error=>{
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Toast Error',
                        message: 'Closed Cases cannot be updated. Press Cancel',
                        variant: 'error',
                        mode: 'dismissable'
                    })
            );
            });
            console.log('Case'+this.cases);
            
           
    }
}