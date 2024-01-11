public class PostOffice {
    @AuraEnabled
    public static list<PostalResponseWrapper> getPostOfficebyBranch(String Name){
    	list<PostalResponseWrapper> postalList=new list<PostalResponseWrapper>();
        Http http=new Http();
        HttpRequest request=new HttpRequest();
        String endpoint='https://api.postalpincode.in/postoffice/';
        if(Name!=null){
            endpoint=endpoint+Name;
        }
        request.setEndpoint(endpoint);
        request.setMethod('GET');
        request.setHeader('content-type', 'application/JSON');
        HttpResponse response=http.send(request);
        Integer i=1;
        if(response.getStatusCode()==200){
            JSONParser parser=JSON.createParser(response.getBody());
            parser.nextToken();
            
            while(parser.nextToken()!=NULL){
                if(parser.getCurrentToken()==JSONTOKEN.START_ARRAY){
                    while(parser.nextToken()!=NULL){
                        if(parser.getCurrentToken()==JSONTOKEN.START_OBJECT){
                            PostalResponseWrapper eachPostal=(PostalResponseWrapper)parser.readValueAs(PostalResponseWrapper.class);
                            eachPostal.Id=String.valueOf(i++);
                            postalList.add(eachPostal);
                            system.debug('eachPostal'+eachPostal);
                        }
                    }
                   
                } 
            }
            
            
            
        }
        if(response.getStatus()=='Error'){
            System.debug('Error');
        }
      	System.debug('Postal List');
        System.debug(postalList);
        return postalList;
    }
    
    public class PostalResponseWrapper{
        @AuraEnabled
        public string Id;
        @AuraEnabled
        public string Name;
        @AuraEnabled
        public string Description;
        @AuraEnabled
        public string PINCode;
        @AuraEnabled
        public string BranchType;
        @AuraEnabled
        public string DeliveryStatus;
        @AuraEnabled
        public string Circle;
        @AuraEnabled
        public string District;
        @AuraEnabled
        public string Division;
        @AuraEnabled
        public string Region;
        @AuraEnabled
        public string State;
        @AuraEnabled
        public string Country;
    }
}