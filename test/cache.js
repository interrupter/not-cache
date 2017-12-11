const expect = require("chai").expect,
	path = require('path'),
	logPath = require('not-log')(path.join(__dirname, 'log')),
	cache = require('../index.js'),
	conf = require('not-config');

console.log(logPath);
describe("cache enabled", function() {

	before(()=>{
		conf.init(path.join(__dirname, 'config.json'));
	});

	it("caching enabled, cache is clear", function() {
		let res = {
			status: function(param){ return this;},
			json: function(data){
				expect(data).to.be.deep.equal([{'data':1},{'data':2}]);
			}
		};
		cache.returnJSON('post', (f) => {f([{'data':1},{'data':2}]);},  res);
	});

	it("caching enabled, cache is exists", function() {
		cache.returnJSON('post', (f)=>{ f([{'data':1},{'data':2},{'data':3}]);},  {
			status(param){ return this;},
			json(data){
				expect(data).to.be.deep.equal([{'data':1},{'data':2}]);
			}
		});

	});

	it("caching enabled, model is not listed for caching", function() {
		cache.returnJSON('forum', (f)=>{f([{'data':10}]);},  {
			status(param){ return this;},
			json(data){
				expect(data).to.be.deep.equal([{'data':10}]);
			}
		});

	});
});

describe("cache disabled", function() {
	before(()=>{
		conf.init(path.join(__dirname, 'config_disabled.json'));
	});

	it("caching disabled, cache is exists", function() {
		cache.returnJSON('post', (f)=>{f([{'data':1},{'data':2},{'data':3}]);},  {
			status(param){ return this;},
			json(data){
				expect(data).to.be.deep.equal([{'data':1},{'data':2},{'data':3}]);
			}
		});

	});

	it("caching disabled, cache is not exists", function() {
		cache.returnJSON('user', (f)=>{ f([{'data':1},{'data':2},{'data':3}]); },  {
			status(param){ return this;},
			json(data){
				expect(data).to.be.deep.equal([{'data':1},{'data':2},{'data':3}]);
			}
		});

	});
});
