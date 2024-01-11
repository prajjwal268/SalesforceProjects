import { LightningElement, wire, track} from 'lwc';
import getProducts from '@salesforce/apex/OrderController.getProducts';
import createOrder from '@salesforce/apex/OrderController.createOrder';
//import confirmSaveOrder from '@salesforce/apex/OrderController.confirmSaveOrder';


export default class Order_Create extends LightningElement {

    productList;
    searchVal;showSearchList=false;
    selectedProductList=[];
    selectedTableToggle=true;

    showFinalTable=false;

    handleSearch(event){
        if(event.target.value.length!=0){
            getProducts({searchVal:event.target.value,priceBookId:'01u2x000000UQ0aAAG'})
            .then(result=>{
                this.productList=JSON.parse(result);
            });
            this.showSearchList=true;
        }
        if(event.target.value.length==0){
            this.showSearchList=false;
        }
    }

    addProduct(event){
        this.selectedTableToggle=false;
        var id=event.target.value;
        var index = -1;
        var selectedproduct=new Object();
        for(var product of this.productList){
            index++;
            if(id==product.Id){
                selectedproduct.Id=product.Id;
                selectedproduct.Name=product.Name;
                selectedproduct.ProductCode=product.ProductCode;
                selectedproduct.Brand=product.Brand;
                selectedproduct.Stock_Quantity=product.Stock_Quantity;
                selectedproduct.Quantity='1';
                selectedproduct.UnitPrice=0;
                selectedproduct.ListPrice=product.ListPrice;
                selectedproduct.Discount=0;
                selectedproduct.PriceBookEntryId=product.PriceBookEntryId;
                break;
            }
        }
        if(!this.selectedProductList.some(item => item.Id === selectedproduct.Id)){
            this.selectedProductList.push(selectedproduct);
        }
        this.showSearchList=false;
        this.selectedTableToggle=true;
    }

    updateQuantity(event){
        var index = -1;
        for(var product of this.selectedProductList){
            index++;
            if(event.target.name==product.Id){
                break;
            }
        }
        this.selectedProductList[index].Quantity=event.target.value;
    }
    updateDiscount(event){
        var index = -1;
        for(var product of this.selectedProductList){
            index++;
            if(event.target.name==product.Id){
                break;
            }
        }
        this.selectedProductList[index].Discount=event.target.value;
    }

    removeClicked(event){
        var id=event.target.value;
        for(var product of this.selectedProductList){
            if(id==product.Id){
                const index = this.selectedProductList.indexOf(product);
                this.selectedProductList.splice(index,1)
            }
        }
        this.selectedTableToggle=false;
        this.selectedTableToggle=true;
    }
    
    saveClicked(){
        this.selectedTableToggle=false;
        for(var product of this.selectedProductList){
            var selectedproduct=new Object();
            if(product.Quantity>10){
                selectedproduct.Id=product.Id;
                selectedproduct.Name=product.Name;
                selectedproduct.ProductCode=product.ProductCode;
                selectedproduct.Brand=product.Brand__c;
                selectedproduct.Stock_Quantity=product.Stock_Quantity__c;
                selectedproduct.Quantity='1';
                selectedproduct.ListPrice=0;
                selectedproduct.UnitPrice=0;
                selectedproduct.Discount=100;
                selectedproduct.PriceBookEntryId=product.PriceBookEntryId;
                this.selectedProductList.push(selectedproduct);
            }
            product.UnitPrice=product.ListPrice - (product.ListPrice * product.Discount / 100);
        }
        createOrder({selectedProducts:JSON.stringify(this.selectedProductList),priceBookId:'01u2x000000UQ0aAAG'})
        .then(result=>{
            console.log('Order Id : ' + result);
        });
        this.showFinalTable=true;
    }

}