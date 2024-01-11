public with sharing class SurveyResponse {
    
    @AuraEnabled
    public static List<SObject> getLastResponse(){
        List<SObject> lastResp=[Select id, CompletionDateTime,InvitationId, (Select id, questionid, responsevalue from surveyquestionresponses) 
                                from SurveyResponse where CompletionDateTime!=null and InvitationId='0Ki2w00000057iOCAQ'  
                                order by CompletionDateTime desc limit 1];
        List<SurveyQuestion> quesName=[Select id,QuestionName from SurveyQuestion];
        System.debug(lastResp);
        System.debug('String'+String.valueOf(lastResp));
        
        return lastResp;
        
    }
}
