import { LightningElement,track } from 'lwc';
import searchHCP from '@salesforce/apex/searchController.searchHCP'; 

export default class SearchhcpComp extends LightningElement {
    @track firstName='';
    @track lastName='';
    @track address='';
    msg='';
    displayHcpList=false;
    hcpList;
    choosenHcp=[];
    visible=true;
    selectedhcp=false;
    handleSearch(event){
        if(this.firstName==''||this.lastName==''||this.address=='')
        {
            this.msg = 'Complete all the fields';
        window.alert( this.msg);
        }
        else{
            console.log(event.target.name);
            searchHCP({firstName: this.firstName, lastName: this.lastName,address : this.address})
            .then(result =>{
                this.hcpList=JSON.parse(result);
                console.log(this.productList);
            });
            this.displayHcpList=true;
            this.selectedhcp=false;
        }
      
    }
    addToselectedhcpItem(event){
        var hcpId=event.target.value;
        this.choosenHcp=[];
        var selectedhcpdetails =new Object();
        for(var prod of this.hcpList){
            if(prod.Id==hcpId){
                selectedhcpdetails.Id=prod.Id;
                selectedhcpdetails.First_Name__c=prod.First_Name__c;
                selectedhcpdetails.Credential__c=prod.Credential__c;
                selectedhcpdetails.Gender__c=prod.Gender__c;
                selectedhcpdetails.Last_Name__c=prod.Last_Name__c;
                selectedhcpdetails.Location_Address__c=prod.Location_Address__c;
                selectedhcpdetails.Middle_Name__c=prod.Middle_Name__c;
                selectedhcpdetails.Name_Prefix__c=prod.Name_Prefix__c;
                selectedhcpdetails.NPI__c=prod.NPI__c;
                selectedhcpdetails.status__c=prod.status__c;
                this.choosenHcp.push(selectedhcpdetails);

            }
            
        }
        this.selectedhcp=true;
        this.displayHcpList=false;
        this.visible=false;
    }
    getfirstname(event){
        this.firstName=event.target.value;
    }
    getlastname(event){
        this.lastName=event.target.value;
    }
    getaddress(event){
        this.address=event.target.value;
    }
    clearSearch(event){
        this.firstName='';
        this.lastName='';
        this.address='';
    }
    backToSearch(event){
        this.selectedhcp=false;
        this.choosenHcp=[];
        this.visible=true;
    }
}