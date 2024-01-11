public with sharing class CaseListClass {
    public CaseListClass() {

    }
    @AuraEnabled(cacheable = true)
    public static List<Case> getCases(Integer v_Offset, Integer v_pagesize) {
        return  [SELECT Id, CaseNumber, AccountId,ContactId,Account.Name,Contact.Name, Subject,Reason,Status,Origin
        FROM Case
        Order By CaseNumber DESC
        limit :v_pagesize OFFSET :v_Offset];
    }
    @AuraEnabled
       public static Integer TotalRecords(){
           return [Select count() from Case];
       }
      

       @AuraEnabled(cacheable=true)
       public static Integer getNext(Integer v_Offset, Integer v_pagesize){
           v_Offset += v_pagesize;
           return v_Offset;
       }

       @AuraEnabled(cacheable=true)
       public static Integer getPrevious(Integer v_Offset, Integer v_pagesize){
           v_Offset -= v_pagesize;
           return v_Offset;
       }
}
