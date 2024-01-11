import { LightningElement,api } from 'lwc';

import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import LOGO from '@salesforce/resourceUrl/iImage';
import getProducts from '@salesforce/apex/ProductController.getProducts';

export default class ProductManagement extends LightningElement {
    //columns for displaying columns of a table 
    columns = [
        { label: 'Product Id', fieldName: 'Product_Id__c' },
        { label: 'Product Name', fieldName: 'Name'},
        
        { label: 'Price', fieldName: 'Price__c', type:'number'},
        { label: 'Type', fieldName: 'Type__c'},
    ];
    products;
    //this will open the form
    
    connectedCallback(){      
        this.refreshList();
    }
    //it will load the data from function to variable
    refreshList(){
        getProducts()
        .then(result=>{
            this.products=result;
        })
        .catch(error=>{
            alert('Error while fetching data');
        });
    }
    //this will enter the data on button click
    handleSuccess(){
        this.refreshList();
        const evt=new ShowToastEvent({
            title:"Product created",
            message:"Successful!!",
            variant:"success"
        });
        this.dispatchEvent(evt);
        eval("$A.get('e.force:refreshView').fire();");
    }
    
}