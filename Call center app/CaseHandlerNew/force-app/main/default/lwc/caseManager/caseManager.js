/* eslint-disable no-console */
import { LightningElement, wire, track, api } from 'lwc';
import { deleteRecord } from 'lightning/uiRecordApi';
import getCases from '@salesforce/apex/CaseListClass.getCases';
import { refreshApex } from '@salesforce/apex';
import getNext from '@salesforce/apex/CaseListClass.getNext';
import accountName from '@salesforce/schema/Account.Name';
import getPrevious from '@salesforce/apex/CaseListClass.getPrevious';
import TotalRecords from '@salesforce/apex/CaseListClass.TotalRecords';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CaseManager extends LightningElement {
    @track error;
    @track chartConfiguration;
    @track cases;
    wiredResult;
    @track page_size = 10;
    @track v_Offset=0;
    @wire(getCases,{v_Offset: '$v_Offset', v_pagesize: '$page_size'}) wcases(result) {
        this._wiredResult = result;
        if (result.data) {
        let values = [];
        console.log('here');
        let chartData = [];
        let chartLabels = [];
            result.data.forEach(i => {
                console.log('Inside');
                let value = Object.assign({},i);
                value.recordUrl=`/${i.Id}`;
                if(value.ContactId!=null){
                    value.ContactId=i.Contact.Name;
                }
                if(value.AccountId!=null){
                    value.AccountId=i.Account.Name;
                }
                
                values.push(value);
                //console.log('value'+JSON.stringify(value));
            });
            
            this.cases = values;
            var w=0;
            var e=0;
            var c=0;
            var n=0;
            for(var prod of this.cases){
                if(prod.Status=='Working'){
                    w++;    
                }
                if(prod.Status == 'Escalated'){
                    e++;
                }
                if(prod.Status == 'Closed'){
                    c++;
                }
                if(prod.Status == 'New'){
                    n++;
                }
            }
            chartData=[w,e,c,n];
            chartLabels=['Working','Escalated','Closed','New'];
            //console.log('Hey this is updated case'+JSON.stringify(this.cases));
            this.error = undefined;
            this.chartConfiguration = {
                type: 'bar',
                data: {
                 labels: chartLabels,
                 datasets: [
                  {
                   label: 'y:Number Of Cases,x:Status',
                   barPercentage: 0.5,
                   barThickness: 6,
                   maxBarThickness: 8,
                   minBarLength: 2,
                   backgroundColor: "#6B8A70",
                   data: chartData,
                  },
                 ],
                },
                options: {
                },
               };
        } else if (result.error) {
            this.error = result.error;
            this.chartConfiguration = undefined;
            
        }
    };
    @track open = false;
    @track openGraph=false;
    @track openDelete=false;
    @api rec2Id;
    
    @track v_TotalRecords;
    
    connectedCallback() {
        TotalRecords().then(result=>{
            this.v_TotalRecords = result;
        });
        console.log('connected');
    }
    renderedCallback() {
        
        console.log('Here in rendered of case manager');
        console.log("Cases:::", JSON.stringify(this.cases));
        //console.log("Cases:::", JSON.stringify(this.cases));
        //console.log("Accounts:::", JSON.stringify(this.Accounts));
    }
    handleClick(event) {
        console.log("In HandleClick");
        const recId = event.target.name;
        this.rec2Id = event.currentTarget.name;
        console.log("Selected Case Id:::", recId);
        console.log("Selected Case Id rec2Id :::", this.rec2Id);
        this.open = true;
    }
    handleDelete(event){
        console.log('here in delete');
        const recId = event.target.name;
        this.rec2Id = event.currentTarget.name;
        console.log(this.rec2Id);
        this.openDelete = true;
        console.log(this.openDelete);
    }
    handleGraph(){
        this.openGraph=true;
    }
    previousHandler2(){
        getPrevious({v_Offset: this.v_Offset, v_pagesize: this.page_size}).then(result=>{
            this.v_Offset = result;
            if(this.v_Offset === 0){
                this.template.querySelector('c-paginator').changeView('trueprevious');
            }else{
                this.template.querySelector('c-paginator').changeView('falsenext');
            }
        });
        return refreshApex(this._wiredResult);
    }
    nextHandler2(){
        getNext({v_Offset: this.v_Offset, v_pagesize: this.page_size}).then(result=>{
            this.v_Offset = result;
           if(this.v_Offset + 10 > this.v_TotalRecords){
                this.template.querySelector('c-paginator').changeView('truenext');
            }else{
                this.template.querySelector('c-paginator').changeView('falseprevious');
            }
        });
        return refreshApex(this._wiredResult);
    }
    changeHandler2(event){
        const det = event.detail;
        this.page_size = det;
        return refreshApex(this._wiredResult);
    }
    firstpagehandler(){
        this.v_Offset = 0;
        this.template.querySelector('c-paginator').changeView('trueprevious');
        this.template.querySelector('c-paginator').changeView('falsenext');
        return refreshApex(this._wiredResult);
    }
    lastpagehandler(){
        this.v_Offset = this.v_TotalRecords - (this.v_TotalRecords)%(this.page_size);
        this.template.querySelector('c-paginator').changeView('falseprevious');
        this.template.querySelector('c-paginator').changeView('truenext');
        return refreshApex(this._wiredResult);
        
    }
    caseDelete(){
        console.log('here in delete record');
        deleteRecord(this.rec2Id)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Case deleted',
                        variant: 'success'
                    })
                );
                console.log('working');
            })
            .catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error deleting record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            });
            var i=-1;
            for(var prod of this.cases){
                i++;
                if(prod.Id == this.rec2Id){
                    break;
    
                }
            }
            this.cases.splice(i,1);
        this.openDelete=false;
        
    }
    closeModal() {
        console.log("In closeModal");
        
        this.open = false;
        this.openDelete=false;
        this.openGraph=false;
        console.log('after closing');
        
        return refreshApex(this._wiredResult);
    }

   
}
