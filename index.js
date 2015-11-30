(function() {
	"use strict";
	if(!Object.observe && typeof(Proxy)==="function") {
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
	    Observer.prototype.get = function(target, property) {
	    	if(property==="__observer__") {
	    		return this;
	    	}
	    	return target[property];
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
	    };
	    Observer.prototype.deleteProperty = function(target, property) {
	    	var oldvalue = target[property];
	    	delete target[property];
	    	if(!this.acceptlist || this.acceptlist.indexOf("delete")>=0) {
	        	var change = {object:this.proxy,name:property,type:"delete",oldValue:oldvalue};
	        	this.changeset.push(change);
	    	}
	    	return true;
	    };
	    Observer.prototype.defineProperty = function(target, property, descriptor) {
	   		Object.defineProperty(target, property, descriptor);
	    	if(!this.acceptlist || this.acceptlist.indexOf("reconfigure")>=0) {
	        	var change = {object:this.proxy,name:property,type:"reconfigure"};
	        	this.changeset.push(change);
	    	}
	    	return true;
	    };
	    Observer.prototype.setProtoypeOf = function(target, prototype) {
	    	var oldvalue = Object.getPrototypeOf(target);
	        Object.setPrototypeOf(target, prototype);
	    	if(!this.acceptlist || this.acceptlist.indexOf("setProtoype")>=0) {
	        	var change = {object:this.proxy,name:"__proto__",type:"setProtoype",oldValue:oldvalue};
	        	this.changeset.push(change);
	    	}
	    	return true;
	    };
	    Observer.prototype.preventExtensions = function(target) {
	    	var oldvalue = Object.getPrototypeOf(target);
	        Object.preventExtensions(target);
	    	if(!this.acceptlist || this.acceptlist.indexOf("preventExtensions")>=0) {
	        	var change = {object:this.proxy,type:"preventExtensions"};
	        	this.changeset.push(change);
	    	}
	    	return true;
	    };
	    Object.observe = function(object,callback,acceptlist) {
	    	return new Observer(object,callback,acceptlist);
	    };
	    Object.unobserve = function(object,callback) {
	    	if(object.__observerCallbacks__) {
	    		object.__observerCallbacks__.forEach(function(observercallback,i) {
	    			if(callback===observercallback) {
	    				object.__observerCallbacks__.splice(i,1);
	    				delete object.__observers__[i].callback;
	    				object.__observers__.splice(i,1);
	    			}
	    		});
	    	}
	    };
	    Array.observe = function(object,callback,acceptlist) {
	    	var proxy = Object.observe(object,function(changeset) { 
	    		var changes = [];
	    		changeset.forEach(function(change) {
	    			if(change.name!=="length" && change.name!=="add") {
	    				changes.push(change);
	    			}
	    		});
	    		if(changes.length>0) {
	    			callback(changes);
	    		}
	    	},acceptlist);
	    	var oldsplice = object.splice;
	    	object.splice = function(start,end) {
	    		var removed = this.slice(start,end);
	    		var addedCount = arguments.length - 1;
	    		var change =  {object:proxy,type:"splice",index:start,removed:removed,addedCount:addedCount};
	    		oldsplice.apply(this,arguments);
	    		proxy.__observer__.changeset.push(change);
	    	};
	    	var oldpush = object.push;
	    	object.push = function(item) {
	    		return this.splice(this.length-1,0,item);
	    	};
	    	var oldpop = object.pop;
	    	object.pop = function(item) {
	    		return this.splice(this.length-1,1);
	    	};
	    	var oldunshift = object.unshift;
	    	object.unshift = function(item) {
	    		return this.splice(0,0,item);
	    	};
	    	var shift = object.shift;
	    	object.shift = function(item) {
	    		return this.splice(0,1);
	    	};
	    	return proxy;
	    };
	}
	Object.deepObserve = function(object,callback,parts) {
		parts = (parts ? parts : []);
		var keys = Object.keys(object);
		object = Object.observe(object,function(changeset) {
			var changes = [];
			function recurse(name,rootObject,oldObject,newObject,path) {
				if(newObject instanceof Object) {
					var newkeys = Object.keys(newObject);
					newkeys.forEach(function(key) {
						if(!oldObject || (oldObject[key]!==newObject[key])) {
							var oldvalue = (oldObject && oldObject[key]!==undefined ? oldObject[key] : undefined);
							var change = (oldvalue===undefined ? "add" : "update");
							var keypath = path + "." + key;
							changes.push({name:name,object:rootObject,type:change,oldValue:oldvalue,newValue:newObject[key],keypath:keypath});
							recurse(name,rootObject,oldvalue,newObject[key],keypath);
						}
					});
				} else if(oldObject instanceof Object) {
					var oldkeys = Object.keys(oldObject);
					oldkeys.forEach(function(key) {
						var change = (newObject===null ? "update" : "delete");
						var keypath = path + "." + key;
						changes.push({name:name,object:rootObject,type:change,oldValue:oldObject[key],newValue:newObject,keypath:keypath});
						recurse(name,rootObject,oldObject[key],undefined,keypath);
					});
				}
			}
			changeset.forEach(function(change) {
				var keypath = (parts.length>0 ? parts.join(".") + "." : "") + change.name;
				changes.push({name:change.name,object:change.object,type:change.type,oldValue:change.oldValue,newValue:change.object[change.name],keypath:keypath});
				recurse(change.name,change.object,change.oldValue,change.object[change.name],keypath);
			});
			callback(changes);
		});
		keys.forEach(function(key) {
			if(object[key] instanceof Object) {
				var newparts = parts.slice(0);
				newparts.push(key);
				Object.deepObserve(object[key],callback,newparts);
			}
		});
		return object;
	};
})();