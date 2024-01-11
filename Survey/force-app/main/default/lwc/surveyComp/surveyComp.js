import { LightningElement,wire,track} from 'lwc';
import getLastResponse from '@salesforce/apex/SurveyResponse.getLastResponse';
import getQuestionList from '@salesforce/apex/SurveyResponse.getQuestionList';
import { getRecordNotifyChange } from 'lightning/uiRecordApi';
import { refreshApex } from '@salesforce/apex';
export default class SurveyComp extends LightningElement {
    value = 'Survey List';
    invitationId='0Ki2w000000588UCAQ';
    buttonLabel='Last Response';
    isresponseVisible=false;
    @track reports=[];
    @wire (getLastResponse,{invitationId:'$invitationId'}) response;
    @wire (getQuestionList) questionList;
    questionResponse;
    @track values=[];
    once=true;
    get invitations() {
        return [
                 { label: 'Survey1', value: '0Ki2w00000057iICAQ' },
                 { label: 'Survey2', value: '0Ki2w00000057iOCAQ' },
                 { label: 'Survey3', value: '0Ki2w000000588UCAQ' },
               ];
    }
    get options() {
        return [
                 { label: 'Survey1', value: 'https://prajjcommunity-developer-edition.ap16.force.com/survey/runtimeApp.app?invitationId=0Ki2w00000057iO&surveyName=survey2&UUID=d4a4a29c-e3f8-43c2-ac2b-16eed7af5ea7' },
                 { label: 'Survey2', value: 'https://prajjcommunity-developer-edition.ap16.force.com/survey/runtimeApp.app?invitationId=0Ki2w00000057iI&surveyName=surveyking&UUID=a282a4ca-2294-4cb2-b613-8306259312fb' },
                 { label: 'Survey3', value: 'https://prajjcommunity-developer-edition.ap16.force.com/survey/runtimeApp.app?invitationId=0Ki2w000000588U&surveyName=survey3&UUID=8099dd98-61be-4615-859b-a5f069d97741' },
               ];
    }
    
    handleInvitation(event){
        this.invitationId=event.detail.value;
        this.values=[];

        getLastResponse({
            invitationId:this.invitationId
        }).then(result => {
            for(var prod of result){
                this.questionResponse=prod.SurveyQuestionResponses;
            }
            for(var i of this.questionResponse){
                let value = Object.assign({},i);
                for(var j of this.questionList.data){
                    if(j.Id==i.QuestionId){
                        value.QuestionLabel=j.QuestionName;
                    }
                }
                this.values.push(value);
                
            }
        })
        .catch(error => {
            this.error = error;
        });
        
    }
   
    handleChange(event) {
            this.value = event.detail.value;
            var url = this.value; 
            
            window.open(url, "_blank");
         }
    
    handleClick(event) {
       
        if(this.once==true){
            for(var prod of this.response.data){
                this.questionResponse=prod.SurveyQuestionResponses;
            
            }
            for(var i of this.questionResponse){
                let value = Object.assign({},i);
                for(var j of this.questionList.data){
                    if(j.Id==i.QuestionId){
                       
                        value.QuestionLabel=j.QuestionName;
                    }
                }
                this.values.push(value);
            }
           this.once=false;
        }
        if (this.isresponseVisible==true){
            this.isresponseVisible=false;
            this.buttonLabel='Show Response';
        }
        else{
            this.isresponseVisible=true;
            this.buttonLabel='Hide Response';
        }
    }
}
    