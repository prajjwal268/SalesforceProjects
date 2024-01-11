public with sharing class SearchController {
    public SearchController() {

    }
  
    @AuraEnabled
    public static String searchHCP(String firstName,String lastName,String address){
        map<Id,HCP_Contact__c> hcpList;
        //storing the results in List
        
            hcpList = new map<Id,HCP_Contact__c>([select Id,First_Name__c,Credential__c,Gender__c,Last_Name__c,Location_Address__c,	Middle_Name__c,	Name_Prefix__c,	NPI__c,	status__c from HCP_Contact__c where First_Name__c LIKE :'%'+firstName+'%' or Last_Name__c LIKE :'%'+lastName+'%' or Location_Address__c LIKE :'%'+address+'%']);
      
        //return string 
        String str='[';
        for(Id key:hcpList.keySet()){
            str+='{"Id":"'+key+'",'+'"First_Name__c":"'+hcpList.get(key).First_Name__c+'",'+'"Credential__c":"'+hcpList.get(key).Credential__c+'",'+'"Gender__c":"'+hcpList.get(key).Gender__c+'","Last_Name__c":"'+hcpList.get(key).Last_Name__c+'",'+'"Location_Address__c":"'+hcpList.get(key).Location_Address__c+'","'+'Middle_Name__c":"'+hcpList.get(key).Middle_Name__c+'","'+'Name_Prefix__c":"'+hcpList.get(key).Name_Prefix__c+'",'+'"NPI__c":"'+hcpList.get(key).NPI__c+'",'+'"status__c":"'+hcpList.get(key).status__c+'"}'+',';
        }
        str = str.substring(0, str.length()-1);
        str+=']';
        return str;
    }
}
