import { LightningElement, track } from 'lwc';
import getProducts from '@salesforce/apex/OrderCreateController.getProducts';
import getRecordId from '@salesforce/apex/OrderCreateController.getRecordId';
import createOrderProducts from '@salesforce/apex/OrderCreateController.createOrderProducts';
export default class OrderCreateAndSummary extends LightningElement {

    recordId = '';
    orderCreated = false;
    displayList = false;
    selectedItems = true;
    showFinalTable = false;
    @track value = '';
    productList;
    desiredQuantity = 0;
    error;
    selectedProductsList = [];

    get options() {
        return [
            { label: 'Product Name', value: 'Name' },
            { label: 'Product Brand', value: 'Brand__c' },
            { label: 'MRP', value: 'UnitPrice' }
        ];
    }

    handleSuccess(event) {
        alert('Order Created');
        this.orderCreated = true;
        if (this.orderCreated) {
            getRecordId()
                .then(result => {
                    this.recordId = result;
                    console.log(this.recordId);
                })
        }
    }

    searchProducts(event) {
        var searchValue = event.target.value;
        console.log('inside get products list');
        if (searchValue.length > 0) {
            getProducts({ rbVal: this.value, searchText: searchValue, pbId: '01s2x0000007nggAAA' })
                .then(result => {
                    console.log(result);
                    console.log('inside get products success 1');
                    this.productList = JSON.parse(result);
                    console.log('inside get products success 2');
                    this.displayList = true;
                    console.log(this.productList);
                })
                .catch(error => {
                    console.log('inside get products error');
                    this.error = error;
                });

        } else {
            this.displayList = false;
        }
    }

    addProduct(event) {
        if (this.recordId == null || this.recordId == '') {
            alert('Please create a record first');
        } else if (this.desiredQuantity < 0) {
            alert('Please enter a valid value');
        } else {
            this.selectedItems = false;
            var pId = event.target.value;
            var index = -1;
            var selectedProduct = new Object();
            for (var product of this.productList) {
                index++;
                if (pId == product.Id) {
                    selectedProduct.Id = product.Id;
                    selectedProduct.Name = product.Name;
                    selectedProduct.ProductCode = product.ProductCode;
                    selectedProduct.Brand__c = product.Brand__c;
                    selectedProduct.StockQuantity__c = product.StockQuantity__c;
                    selectedProduct.Quantity = 0;
                    selectedProduct.UnitPrice = 0;
                    selectedProduct.ListPrice = product.ListPrice;
                    selectedProduct.Discount = 0;
                    selectedProduct.PriceBookEntryId = product.PriceBookEntryId;
                    break;
                }
            }
            if (!this.selectedProductsList.some(prod => prod.Id === selectedProduct.Id)) {
                this.selectedProductsList.push(selectedProduct);
            }
            this.selectedItems = true;
        }
    }

    removeProduct(event) {
        var id = event.target.value;
        for (var product of this.selectedProductsList) {
            if (id == product.Id) {
                const index = this.selectedProductsList.indexOf(product);
                this.selectedProductsList.splice(index, 1)
            }
        }
        this.selectedItems = false;
        this.selectedItems = true;
    }

    updateQuantity(event) {
        var index = -1;
        for (var product of this.selectedProductsList) {
            index++;
            if (event.target.name == product.Id) {
                break;
            }
        }
        this.selectedProductsList[index].Quantity = event.target.value;
    }

    updateDiscount(event) {
        var index = -1;
        for (var product of this.selectedProductsList) {
            index++;
            if (event.target.name == product.Id) {
                break;
            }
        }
        this.selectedProductsList[index].Discount = event.target.value;
    }

    saveOrderProducts(event) {
        this.selectedItems = false;
        for (var product of this.selectedProductsList) {
            var selectedProduct = new Object();
            if (product.Quantity > 10) {
                selectedProduct.Id = product.Id;
                selectedProduct.Name = product.Name;
                selectedProduct.ProductCode = product.ProductCode;
                selectedProduct.Brand = product.Brand__c;
                selectedProduct.Stock_Quantity = product.StockQuantity__c;
                selectedProduct.Quantity = '1';
                selectedProduct.ListPrice = 0;
                selectedProduct.UnitPrice = 0;
                selectedProduct.Discount = 100;
                selectedProduct.PriceBookEntryId = product.PriceBookEntryId;
                this.selectedProductsList.push(selectedproduct);
            }
            if(product.Discount>=0&&product.Discount<=100){
            product.UnitPrice = product.ListPrice - (product.ListPrice * product.Discount / 100);
            }
            else{
                product.UnitPrice=product.ListPrice;
            }
        }

        createOrderProducts({ selectedProducts: JSON.stringify(this.selectedProductsList), priceBookId: '01s2x0000007nggAAA', orderId: this.recordId })
            .then(result => {
                console.log('Order Id : ' + result);
            })
            .catch(error => {
                console.log(error);
            });
        this.showFinalTable = true;
    }

}