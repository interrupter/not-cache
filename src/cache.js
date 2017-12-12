/**
* Caching JSON responses per model in memory
* @module not-cache
*/
/**
* @const {module} log not-log logger
*/
const log = require('not-log')(module);
/**
* @const {object} config not-config.readerForModule initialized with 'cache' module name
*/
const config = require('not-config').readerForModule('cache');
/**
* @const {module} cache memory-cache module
*/
const cache = require('memory-cache');

/**
* Cache data if caching enabled or returns if already cached, else pass through
* Anyway returns nothing, writes to ServerResponse object
* @param {string} modelName name of model
* @param {function} dataGetter function which retrieves data, and recieves callback function as param
* @param {http.ServerResponse|https.ServerResponse} res Express response object
*/
exports.returnJSON = (modelName, dataGetter, res) => {
	let dryRun = () => {
		dataGetter((data) => {
			res.status(200).json(data);
		});
	};
	if (config.get('enabled')) {
		if (config.get('models').indexOf(modelName) > -1) {
			log.info('model (' + modelName + ') in list');
			if (cache.keys().indexOf(modelName) > -1) {
				log.info('return from cache');
				res.status(200).json(cache.get(modelName));
			} else {
				log.info('cache empty');
				dataGetter((data) => {
					log.info('caching data');
					cache.put(modelName, data);
					res.status(200).json(data);
				});
			}
		} else {
			log.info('model (' + modelName + ') not in list');
			dryRun();
		}
	} else {
		dryRun();
	}
};

/**
*	Clears cache
*/

exports.clear = cache.clear;
