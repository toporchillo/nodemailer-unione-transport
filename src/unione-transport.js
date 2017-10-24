'use strict';

var packageData = require('../package.json');
var request = require('request');

// expose to the world
module.exports = function (options) {
    return new UnioneTransport(options);
};

/**
 * @constructor
 * @param {Object} optional config auth parameter for the UniOne service
 */
function UnioneTransport(options) {
    options = options || {};

    this.auth = options.auth;

    this.rateLimit = Number(options.rateLimit) || false;

    this.name = 'UniOne';
    this.version = packageData.version;
}

/**
 * Appends the message to the queue if rate limiting is used, or passes directly to the sending function
 *
 * @param {Object} mail Mail object
 * @param {Function} callback Callback function to run when the sending is completed
 */
UnioneTransport.prototype.send = function (mail, callback) {
    this.sendMail(mail.data, callback);
};

/**
 * @param {Object} mail Mail object
 * @param {Function} callback Callback function to run when the sending is completed
 */
UnioneTransport.prototype.sendMail = function (mail, callback) {
    this.callUnioneAPI('/ru/transactional/api/v1/email/send.json', mail, (function (err, res) {
        if (err) {
            return typeof callback === 'function' && callback(err);
        }
        try {
            var response = JSON.parse(res.body);
        }
        catch(err) {
            return typeof callback === 'function' && callback(new Error('UniOne Error: non-JSON response'));
        }
        /**
         * Обработка статуса отправки письма от UniOne
         */
        if (response.status == 'error') {
            return typeof callback === 'function' && callback(new Error('UniOne Error: '+response.message));
        }
        return typeof callback === 'function' && callback(null, response);
    }).bind(this));
};

UnioneTransport.prototype.callUnioneAPI = function (path, mail, callback) {
    var url = 'https://one.unisender.com' + path;
    var json = {
        api_key: this.auth.api_key,
        username: this.auth.username,
        message: mail
    }
	request({
		method: 'post',
		url: url,
		form: JSON.stringify(json)
    }, callback);    
 }
