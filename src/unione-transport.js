'use strict';

var packageData = require('../package.json');

// expose to the world
module.exports = function (options) {
    return new UnioneTransport(options);
};

/**
 * @constructor
 * @param {Object} optional config auth parameter for the UniOne service
 */
function Unione(options) {
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
    this.sendMessage(mail, callback);
};

/**
 * @param {Object} mail Mail object
 * @param {Function} callback Callback function to run when the sending is completed
 */
UnioneTransport.prototype.sendMessage = function (mail, callback) {
    this.callUnioneAPI('/ru/transactional/api/v1/email/send.json', mail, (function (err, res) {
        if (err) {
            return typeof callback === 'function' && callback(err);
        }
        /**
         * @todo Обработка статуса отправки письма от UniOne
         */
        callback(err, res);
    }).bind(this));
};

UnioneTransport.prototype.callUnioneAPI = function (path, mail, callback) {
    var url = 'https://one.unisender.com' + path;
    var json = {
        api_key: this.auth.api_key,
        username: this.auth.username,
        message: mail
    }
    /**
     * @todo Отправка JSON-запроса в UniOne
     */
 }
