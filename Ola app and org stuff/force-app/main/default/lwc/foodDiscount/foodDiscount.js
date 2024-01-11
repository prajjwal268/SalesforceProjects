import { LightningElement,track} from 'lwc';

export default class FoodDiscount extends LightningElement {
    @track name='';
   
    @track quan;
    @track val = '';
    @track price;
    @track total=0;
    handleClick(event){
        this.val=event.detail.value;
        const con=event.target.name;
        if(con=='quan')
        {
            this.quan=event.target.value;
        }    
        if(con=='price')
        {
            this.price=event.target.value;
        }
       
       
        
        if(this.val==='drink'){
            this.total=(this.price*this.quan)-(this.price*this.quan*0.10);
        }
        else if(this.val==='Burger'){
            this.total=(this.price*this.quan)-(this.price*this.quan*0.15);
        }
        else{
            this.total=(this.price*this.quan)-(this.price*this.quan*0.20);
        }

    }
    

    get options() {
        return [
            { label: 'Drink', value: 'drink' },
            { label: 'Burger', value: 'Burger' },
            { label: 'Others', value: 'Others' },
        ];
    }
    get total(){
        return this.total;

    }
   

    
}