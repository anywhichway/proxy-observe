

var to = {}, ta = [];
describe('Object', function() {
	it('should have an observe function ', function() {
	  expect(Object.observe).to.be.a('function');
	});
	it('should have an unobserve function ', function() {
	  expect(Object.unobserve).to.be.a('function');
	});
	it('should have an deepObserve function ', function() {
	  expect(Object.deepObserve).to.be.a('function');
	});
	it('should support response to add ', function(done) {
		function onAdd(changes) {
			expect(changes.every(function(change) { return change.type==="add"; })).to.be.true;
			Object.unobserve(to,onAdd);
			done();
		}
		to = Object.observe(to,onAdd,["add"]);
		to.newProperty = true;
	});
	it('should support response to update ', function(done) {
		function onUpdate(changes) {
			expect(changes.every(function(change) { return change.type==="update"; })).to.be.true;
			Object.unobserve(to,onUpdate);
			done();
		}
		to = Object.observe(to,onUpdate,["update"]);
		to.newProperty = false;
	});
	it('should support response to delete ', function(done) {
		function onDelete(changes) {
			expect(changes.every(function(change) { return change.type==="delete"; })).to.be.true;
			Object.unobserve(to,onDelete);
			done();
		}
		to = Object.observe(to,onDelete,["delete"]);
		delete to.newProperty;
	});
});
describe('Array', function() {
	it('should have an observe function', function() {
		expect(Array.observe).to.a('function');
	});
	it('should support response to add ', function(done) {
		function onAdd(changes) {
			expect(changes.every(function(change) { return change.type==="add"; })).to.be.true;
			//Array.unobserve(ta,onAdd);
			done();
		}
		ta = Array.observe(ta,onAdd,["add"]);
		ta.newProperty = true;
	});
	it('should support response to update ', function(done) {
		function onUpdate(changes) {
			expect(changes.every(function(change) { return change.type==="update"; })).to.be.true;
			//Array.unobserve(ta,onUpdate);
			done();
		}
		ta = Array.observe(ta,onUpdate,["update"]);
		ta.newProperty = false;
	});
	it('should support response to delete ', function(done) {
		function onDelete(changes) {
			expect(changes.every(function(change) { return change.type==="delete"; })).to.be.true;
			//Array.unobserve(ta,onDelete);
			done();
		}
		ta = Array.observe(ta,onDelete,["delete"]);
		delete ta.newProperty;
	});
	it('should support response to splice ', function(done) {
		function onSplice(changes) {
			var result = changes.every(function(change) { return change.type==="splice"; });
			expect(changes.every(function(change) { return change.type==="splice"; })).to.be.true;
			//Array.unobserve(ta,onSplice);
			done();
		}
		ta = Array.observe(ta,onSplice,["splice"]);
		ta.splice(0,[1,2]);
	});
});