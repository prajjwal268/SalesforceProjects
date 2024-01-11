import { LightningElement ,track} from 'lwc';

export default class HelloWord extends LightningElement {
@track greeting;
handlechange(event)
{
    this.greeting=event.target.value;
}
}