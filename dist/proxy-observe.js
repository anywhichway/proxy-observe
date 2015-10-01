(function() {
	if(!Object.observe && Proxy) {
	    function Observer(target,callback,acceptlist) {
	    	var me = this;
	    	function deliver() {
	    		if(me.callback) {
	        		if(me.changeset.length>0) {
	        			me.callback(me.changeset);
	        			me.changeset = [];
	        		}
	        		setTimeout(deliver,0);
	    		}
	    	}
	    	me.target = target;
	    	me.callback = callback;
	    	me.acceptlist = acceptlist;
	    	me.changeset = [];
	    	if(!target.__observerCallbacks__) {
	    		Object.defineProperty(target,"__observerCallbacks__",{enumerable:false,configurable:true,writable:false,value:[]});
	    		Object.defineProperty(target,"__observers__",{enumerable:false,configurable:true,writable:false,value:[]});
	    	}
	    	target.__observerCallbacks__.push(callback);
	    	target.__observers__.push(this);
	    	var proxy = new Proxy(target,me);
	    	me.proxy = proxy;
	    	deliver();
	    	return proxy;
	    }
	    Observer.prototype.set = function(target, property, value, receiver) {
	    	var oldvalue = target[property];
	    	var type = (oldvalue===undefined ? "add" : "update");
	    	target[property] = value;
	    	if(!this.acceptlist || this.acceptlist.indexOf(type)>=0) {
	        	var change = {object:this.proxy,name:property,type:type};
	        	if(type==="update") {
	        		change.oldValue = oldvalue;
	        	}
	        	this.changeset.push(change);
	    	}
	    	return true;
	    }
	    Observer.prototype.deleteProperty = function(target, property) {
	    	var oldvalue = target[property];
	    	delete target[property];
	    	if(!this.acceptlist || this.acceptlist.indexOf("delete")>=0) {
	        	var change = {object:this.proxy,name:property,type:"delete",oldValue:oldvalue};
	        	this.changeset.push(change);
	    	}
	    	return true;
	    }
	    Observer.prototype.defineProperty = function(target, property, descriptor) {
	   		Object.defineProperty(target, property, descriptor);
	    	if(!this.acceptlist || this.acceptlist.indexOf("reconfigure")>=0) {
	        	var change = {object:this.proxy,name:property,type:"reconfigure"};
	        	this.changeset.push(change);
	    	}
	    	return true;
	    }
	    Observer.prototype.setProtoypeOf = function(target, prototype) {
	    	var oldvalue = Object.getPrototypeOf(target);
	        Object.setPrototypeOf(target, prototype);
	    	if(!this.acceptlist || this.acceptlist.indexOf("setProtoype")>=0) {
	        	var change = {object:this.proxy,name:"__proto__",type:"setProtoype",oldValue:oldvalue};
	        	this.changeset.push(change);
	    	}
	    	return true;
	    }
	    Object.observe = function(object,callback,acceptlist) {
	    	return new Observer(object,callback,acceptlist);
	    }
	    Object.unobserve = function(object,callback) {
	    	if(object.__observerCallbacks__) {
	    		object.__observerCallbacks__.forEach(function(observercallback,i) {
	    			if(callback===observercallback) {
	    				object.__observerCallbacks__.splice(i,1);
	    				delete object.__observers__[i].callback;
	    				object.__observers__.splice(i,1);
	    			}
	    		})
	    	}
	    }
	}
})();