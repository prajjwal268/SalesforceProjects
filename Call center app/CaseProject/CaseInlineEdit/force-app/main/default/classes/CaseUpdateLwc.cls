public with sharing class CaseUpdateLwc {
    Static String strSub;
    public CaseUpdateLwc() {
        strSub='';
    }
    @AuraEnabled
    public static List<Case> getCaseList(String strSubject,Integer filter){
        strSub='%'+strSubject+'%';
        return [
            SELECT Id, CaseNumber, AccountId,ContactId,Account.Name,Contact.Name, Subject,Reason,Status,Origin
            FROM Case
            where Subject like :strSub
            Order By CaseNumber DESC
            LIMIT :filter 
        ];
    }
    //Not Used
    @AuraEnabled
    public static void updateCase(List<Case> cass){
        update cass;
    }
}
