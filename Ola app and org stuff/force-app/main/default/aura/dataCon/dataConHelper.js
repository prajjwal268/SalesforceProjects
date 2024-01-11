({
	handlerResponse: function(component,event,resi,resi2,d) {
		console.log("parent uis called..");
             var req=resi;
            req.setParams(resi2);
            $A.enqueueAction(req);
            req.setCallback(this,function(res){
                if(res.getState()=="SUCCESS"){
                    component.set(d,res.getReturnValue());
                }
            })
	}
})