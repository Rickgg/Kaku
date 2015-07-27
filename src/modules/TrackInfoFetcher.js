exports = function() {
  'use strict';

  var BaseModule = require('./BaseModule');
  var youtubeDownloader = require('youtube-dl');

  var TrackInfoFetcher = BaseModule(function() {
    this._options = ['--no-check-certificate'];
  });

  TrackInfoFetcher.prototype.getInfo = function(url) {
    var promise = new Promise((resolve, reject) => {
      youtubeDownloader.getInfo(url, this._options, (error, info) => {
        if (error) {
          this.debug(error);
          reject();
        } else {
          resolve(info);
        }
      });
    });
    return promise;
  };

  return new TrackInfoFetcher();
};
