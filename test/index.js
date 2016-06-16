var expect;
if(typeof(window)==="undefined") {
	expect = require("chai").expect;
	require("../index.js");
}

describe('Object', function() {
	it('Object should have an observe function ', function() {
	  expect(Object.observe).to.be.a('function');
	});
	it('Object should have an unobserve function ', function() {
	  expect(Object.unobserve).to.be.a('function');
	});
	it('Object should have an deepObserve function ', function() {
	  expect(Object.deepObserve).to.be.a('function');
	});
	it('should not observe after Object.unobserve ', function(done) {
		var to = {};
		function onAdd(changes) {
			expect(changes==undefined).to.be.true;
		}
		to = Object.observe(to,onAdd,["add"]);
		Object.unobserve(to,onAdd);
		to.newProperty = true;
		setTimeout(function () { done(); },1000);
	});
	it('should not observe and should return original object on <instance>.unobserve ', function(done) {
		var to = {};
		function onAdd(changes) {
			expect(changes==undefined).to.be.true;
		}
		var observed = Object.observe(to,onAdd,["add"]);
		var original = observed.unobserve();
		observed.newProperty = true;
		setTimeout(function () {
				expect(to===original).to.be.true;
				done(); 
			},
			1000);
	});
	it('should support response to add ', function(done) {
		var to = {};
		function onAdd(changes) {
			expect(changes.every(function(change) { return change.type==="add"; })).to.be.true;
			Object.unobserve(to,onAdd);
			done();
		}
		to = Object.observe(to,onAdd,["add"]);
		to.newProperty = true;
	});
	it('should support response to update ', function(done) {
		var to = {newProperty:true};
		function onUpdate(changes) {
			expect(changes.every(function(change) { return change.type==="update"; })).to.be.true;
			Object.unobserve(to,onUpdate);
			done();
		}
		to = Object.observe(to,onUpdate,["update"]);
		to.newProperty = false;
	});
	it('should support response to delete ', function(done) {
		var to = {};
		var d = false;
		function onDelete(changes) {
			expect(changes.every(function(change) { return change.type==="delete"; })).to.be.true;
			Object.unobserve(to,onDelete);
			if(!d) {
				done();
				d = true;
			}
		}
		to = Object.observe(to,onDelete,["delete"]);
		delete to.newProperty;
	});
	it('should support getting the deliver function on paused pausable observers add then start it ', function(done) {
		var to = {};
		function onDelete(changes) {
			expect(changes.every(function(change) { return change.type==="delete"; })).to.be.true;
			Object.unobserve(to,onDelete);
			done();
		}
		to = Object.observe(to,onDelete,["delete"],true,true);
		expect(typeof(to.deliver)).to.be.equal("function");
		expect(to.deliver.pause).to.be.true;
		to.deliver.pause = false;
		to.deliver();
		delete to.newProperty;
	});
	it('should support reconfigure ', function(done) {
		var to = {newProperty:0};
		var d = false;
		function onReconfigure(changes) {
			expect(changes.every(function(change) { return change.type==="reconfigure"; })).to.be.true;
			Object.unobserve(to,onReconfigure);
			done();
		}
		to = Object.observe(to,onReconfigure,["reconfigure"]);
		Object.defineProperty(to,"newProperty",{value:1});
	});
	it('should support setPrototypeOf ', function(done) {
		var to = {newProperty:0};
		var d = false;
		function onSetPrototype(changes) {
			expect(changes.every(function(change) { return change.type==="setPrototype"; })).to.be.true;
			Object.unobserve(to,onSetPrototype);
			done();
		}
		to = Object.observe(to,onSetPrototype,["setPrototype"]);
		Object.setPrototypeOf(to,function() {});
	});
	it('should support preventExtensions ', function(done) {
		var to = {newProperty:0};
		var d = false;
		function onPreventExtensions(changes) {
			expect(changes.every(function(change) { return change.type==="preventExtensions"; })).to.be.true;
			Object.unobserve(to,onPreventExtensions);
			done();
		}
		to = Object.observe(to,onPreventExtensions,["preventExtensions"]);
		Object.preventExtensions(to);
	});
	it('should support deepObserve add ', function(done) {
		var to = {subobject:{subsubobject:{}}};
		function onAdd(changes) {
			expect(changes.every(function(change) { return change.type==="add"; })).to.be.true;
			Object.unobserve(to,onAdd);
			done();
		}
		to = Object.deepObserve(to,onAdd);
		var so = to.subobject;
		so.subsubobject.newProperty = true;
	});
	it('should support deepObserve update ', function(done) {
		var to = {subobject:{newProperty:true}};
		function onUpdate(changes) {
			expect(changes.every(function(change) { return change.type==="update"; })).to.be.true;
			Object.unobserve(to,onUpdate);
			done();
		}
		to = Object.deepObserve(to,onUpdate);
		to.subobject.newProperty = false;
	});
	it('should support deepObserve delete ', function(done) {
		var to = {subobject:{newProperty:true}};
		var d = false;
		function onDelete(changes) {
			expect(changes.every(function(change) { return change.type==="delete"; })).to.be.true;
			Object.unobserve(to,onDelete);
			if(!d) {
				done();
				d = true;
			}
		}
		to = Object.deepObserve(to,onDelete);
		delete to.subobject.newProperty;
	});
});
describe('Array', function() {
	it('should have an observe function', function() {
		expect(Array.observe).to.a('function');
	});
	it('should throw TypeError on non-Array arg', function() {
		var result;
		try {
			Array.observe();
		} catch(e) {
			result = e;
		}
		expect(result).to.be.instanceof(TypeError);
	});
	it('should not observe after Array.unobserve ', function(done) {
		var ta = [];
		function onAdd(changes) {
			expect(changes==undefined).to.be.true;
		}
		ta = Array.observe(ta,onAdd,["add"]);
		Array.unobserve(ta,onAdd);
		ta.newProperty = true;
		setTimeout(function () { done(); },1000);
	});
	it('should not observe and should return original object on <Array instance>.unobserve ', function(done) {
		var ta = [];
		function onAdd(changes) {
			expect(changes==undefined).to.be.true;
		}
		var observed = Object.observe(ta,onAdd,["add"]);
		var original = observed.unobserve();
		observed.newProperty = true;
		setTimeout(function () {
				expect(ta===original).to.be.true;
				done(); 
			},
			1000);
	});
	it('should support response to add ', function(done) {
		var ta = [];
		function onAdd(changes) {
			expect(changes.every(function(change) { return change.type==="add"; })).to.be.true;
			//Array.unobserve(ta,onAdd);
			done();
		}
		ta = Array.observe(ta,onAdd,["add"]);
		ta.newProperty = true;
	});
	it('should support response to update ', function(done) {
		var ta = [];
		ta.newProperty = true;
		var d = false;
		function onUpdate(changes) {
			expect(changes.some(function(change) { return change.type==="update" && change.name==="newProperty" && change.object.newProperty===false; })).to.be.true;
			//Array.unobserve(ta,onUpdate);
			if(!d) {
				done();
				d = true;
			}
		}
		ta = Array.observe(ta,onUpdate,["update"]);
		ta.newProperty = false;
	});
	it('should support response to delete ', function(done) {
		var ta = [];
		function onDelete(changes) {
			expect(changes.some(function(change) { return change.type==="delete";  })).to.be.true;
			//Array.unobserve(ta,onDelete);
			done();
		}
		ta = Array.observe(ta,onDelete,["delete"]);
		delete ta.newProperty;
	});
	it('should support response to splice ', function(done) {
		var ta = [-1,-2];
		function onSplice(changes) {
			expect(changes.some(function(change) { return change.type==="splice" && change.index===1 && change.removed.length===1 && change.addedCount===2; })).to.be.true;
			//Array.unobserve(ta,onSplice);
			done();
		}
		ta = Array.observe(ta,onSplice,["splice"]);
		ta.splice(1,1,1,2);
	});
	it('should throw TypeError on non-numbers for splice ', function(done) {
		var result, ta = [-1,-2];
		function onSplice(changes) {
			expect(changes.some(function(change) { return change.type==="splice" && change.index===1 && change.removed.length===1 && change.addedCount===2; })).to.be.true;
			//Array.unobserve(ta,onSplice);
			done();
		}
		ta = Array.observe(ta,onSplice,["splice"]);
		try {
			ta.splice("a",1,1,2);
		} catch(e) {
			result = e;
		}
		expect(result).to.be.instanceof(TypeError);
		done();
	});
	it('should support response to push ', function(done) {
		var ta = [];
		function onSplice(changes) {
			expect(changes.some(function(change) { return change.type==="splice" && ta[0]===1; })).to.be.true;
			//Array.unobserve(ta,onSplice);
			done();
		}
		ta = Array.observe(ta,onSplice,["splice"]);
		ta.push(1);
	});
	it('should support response to pop ', function(done) {
		var ta = [1,2];
		function onSplice(changes) {
			expect(changes.some(function(change) { return change.type==="splice" && ta[0]===1 && ta[1]===undefined; })).to.be.true;
			//Array.unobserve(ta,onSplice);
			done();
		}
		ta = Array.observe(ta,onSplice,["splice"]);
		ta.pop();
	});
	it('should support response to shift ', function(done) {
		var ta = [1,2];
		function onSplice(changes) {
			expect(changes.some(function(change) { return change.type==="splice" && ta[0]===2; })).to.be.true;
			//Array.unobserve(ta,onSplice);
			done();
		}
		ta = Array.observe(ta,onSplice,["splice"]);
		ta.shift();
	});
	it('should support response to unshift ', function(done) {
		var ta = [];
		function onSplice(changes) {
			expect(changes.some(function(change) { return change.type==="splice" && ta[0]===1 })).to.be.true;
			//Array.unobserve(ta,onSplice);
			done();
		}
		ta = Array.observe(ta,onSplice,["splice"]);
		ta.unshift(1);
	});
});