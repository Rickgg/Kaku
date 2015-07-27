exports = function() {
  'use strict';

  var path = require('path');
  var semver = require('semver');
  var GithubAPI = require('github');
  var packageJSON = require(path.join(__dirname, 'package.json'));

  var AutoUpdater = function() {
    this._github = new GithubAPI({
      version: '3.0.0'
    });
  };

  AutoUpdater.prototype._getRelease = function() {
    var promise = new Promise((resolve, reject) => {
      this._github.releases.listReleases({
        owner: 'EragonJ',
        repo: 'kaku'
      }, (error, result) => {
        if (error) {
          reject(error);
        }
        else {
          resolve(result);
        }
      });
    });
    return promise;
  };

  AutoUpdater.prototype.checkUpdate = function() {
    return this._getRelease().catch((error) => {
      console.error(error);
    })
    .then((result) => {
      if (result && result.length) {
        var release = this._getWrappedReleaseObject(result[0]);
        return release;
      }
    })
    .then((release = {}) => {
      var latestVersion = release.version;
      var currentVersion = packageJSON.version;
      var isNewer = false;

      if (latestVersion) {
        isNewer = semver.gt(latestVersion, currentVersion);
      }

      return {
        isNewer: isNewer,
        release: release
      };
    });
  };

  AutoUpdater.prototype._getWrappedReleaseObject = function(result) {
    if (!result) {
      return {};
    }

    var assets = result.assets || [];
    var download = {};

    assets.forEach((rawAsset) => {
      var assetName = rawAsset.name;
      var asset = {
        link: rawAsset.browser_download_url,
        name: assetName
      };

      // Note
      // we should release Kaku with the format like this :
      // Kaku-mac.zip, Kaku-win.zip, Kaku-linux32.zip, Kaku-linux64.zip
      if (assetName.match(/mac/)) {
        download.mac = asset;
      }
      else if (assetName.match(/win/)) {
        download.win = asset;
      }
      else if (assetName.match(/linux32/)) {
        download.linux32 = asset;
      }
      else if (assetName.match(/linux64/)) {
        download.linux64 = asset;
      }
    });

    return {
      version: result.tag_name,
      title: result.name,
      note: result.body,
      download: download
    };
  };

  // singleton
  return new AutoUpdater();
};
