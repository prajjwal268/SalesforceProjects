public with sharing class OrderCreateController {
    public OrderCreateController() {

    }
    class ProductDetail{
        public String Id;
        public String Name;
        public String ProductCode;
        public String Brand;
        public String StockQuantity;
        public String Quantity;
        public String ListPrice;
        public String UnitPrice;
        public String Discount;
        public String PriceBookEntryId;
    }

    @AuraEnabled
    public static string getRecordId(){
        list<Order> recId = [SELECT Id FROM Order ORDER BY CreatedDate DESC LIMIT 1];
        String rId = '' + recId[0].Id;
        return rId;
    }

    @AuraEnabled
    public static string getProducts(String rbVal, String searchText, String pbId){
        System.debug('Inside controller method');
        map<Id,Product2> prodList= new map<Id,Product2>([select Id,ProductCode,Name,Brand__c,StockQuantity__c from Product2 where Name LIKE :'%'+searchText+'%']);
        /*if(rbVal.equals('Name')){
            prodList.putAll([select Id,ProductCode,Name,Brand__c,StockQuantity__c from Product2 where Name LIKE :'%'+searchText+'%']);
            System.debug('prodList created');
        }
        else{
            prodList.putAll([select Id,ProductCode,Name,Brand__c,StockQuantity__c from Product2 where Brand__c LIKE :'%'+searchText+'%']);
        }*/
        list<PricebookEntry> pbeList=[select Id,Product2Id,UnitPrice from PricebookEntry where Product2Id IN :prodList.keySet() AND Pricebook2Id=:pbId];
        map<Id,String> priceBookList=new map<Id,String>();
        map<Id,Decimal> unitPriceList=new map<Id,Decimal>();
        for(PricebookEntry item:pbeList){
            priceBookList.put(item.Product2Id,item.Id);
            unitPriceList.put(item.Product2Id,item.UnitPrice);
        }
        System.debug(priceBookList);
        System.debug(pbeList);
        System.debug(unitPriceList);
        String str='[';
        for(Id key:prodList.keySet()){
            str+='{"Id":"'+key+'","'+'Name":"'+prodList.get(key).Name+'","'+'ProductCode":"'+prodList.get(key).ProductCode+'","'+'ListPrice":"'+unitPriceList.get(key)+'","'+'Quantity":"","Brand__c":"'+prodList.get(key).Brand__c+'","'+'StockQuantity__c":"'+prodList.get(key).StockQuantity__c+'","'+'PriceBookEntryId":"'+priceBookList.get(key)+'"}'+',';
        }
        str = str.substring(0, str.length()-1);
        str+=']';
        System.debug(str);
        if(str.equals(']')){
            str='';
        }
        return str;
    }
//SELECT Id FROM Order ORDER BY CreatedDate DESC LIMIT 1
    @AuraEnabled
    public static string createOrderProducts(String selectedProducts,String priceBookId, String orderId){
        list<ProductDetail> productList=new list<ProductDetail>();
        JSONParser parser = JSON.createParser(selectedProducts);
        while (parser.nextToken() != null) {
            if (parser.getCurrentToken() == JSONToken.START_ARRAY) {
                while (parser.nextToken() != null) {
                    if (parser.getCurrentToken() == JSONToken.START_OBJECT) {
                        ProductDetail acc = (ProductDetail)parser.readValueAs(ProductDetail.class);
                        system.debug('Id:' + acc.Id + ' Name:' + acc.Name);
                        productList.add(acc);
                    }
                }
            }
        }
        Order order=[Select Stage__c,Pricebook2Id from Order where Id=:orderId];
        order.Pricebook2Id = priceBookId;
        order.Stage__c = 'In process';
        update order;

        list<OrderItem> orderItemList = new list<OrderItem>();
        list<Product2> newProductList = new list<Product2>();
        for(ProductDetail product:productList){
            orderItemList.add(new OrderItem(OrderId=orderId,Product2Id=product.Id,Quantity=Decimal.valueOf(product.Quantity),UnitPrice=Decimal.valueOf(product.UnitPrice),PricebookEntryId=product.PriceBookEntryId));
            Product2 productId = [Select StockQuantity__c from Product2 where Id=:product.Id];
            newProductList.add(new Product2(Id=product.Id, StockQuantity__c=productId.StockQuantity__c-Integer.valueOf(product.Quantity)));
        }
        insert orderItemList;
        update newProductList;
        return 'Done Insertion Successfully';
    }

}
