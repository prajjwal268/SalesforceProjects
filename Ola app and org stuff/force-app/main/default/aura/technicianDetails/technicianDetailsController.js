({
	show : function(component, event, helper) {
        if(event.getParams().isSearch){
       
            helper.handlerResponse(component,event,component.get("c.showTechnicianBySearch"),{"searchly":event.getParams().searchStr},"v.clist");
            console.log(JSON.parse(JSON.stringify(component.get("v.clist"))));
        }
        else{
            var req=component.get("c.showTechnicianByState");
            req.setParams({"searchly":event.getParams().searchStr});
            $A.enqueueAction(req);
            req.setCallback(this,function(res){
                if(res.getState()=="SUCCESS"){
                    component.set("v.clist",res.getReturnValue());
                }
            })
            helper.handlerResponse(component,event);
        }
	}
})