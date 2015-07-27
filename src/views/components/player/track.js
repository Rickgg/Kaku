exports = function() {
  'use strict';

  var Player = require('../../modules/Player');
  var React = require('react');

  var PlayerTrack = React.createClass({
    componentDidMount: function() {
      this._setupPlayer();
    },

    _onPlayerPlay: function() {

    },

    _onPlayerPause: function() {

    },

    _onPlayerProgress: function() {
      
    },

    _setupPlayer: function() {
      var playerDOM = document.createElement('video');
      playerDOM.id = 'player';
      playerDOM.classList.add('video-js');
      playerDOM.classList.add('vjs-default-skin');
      this.refs.playerContainer.getDOMNode().appendChild(playerDOM);

      Player.setPlayer(playerDOM);
      Player.on('play', this._onPlayerPlay);
      Player.on('pause', this._onPlayerPause);
      Player.on('progress', this._onPlayerProgress);
    },

    render: function() {
      /* jshint ignore:start */
      return (
        <div
          className="playerContainer vjs-default-skin"
          ref="playerContainer">
        </div>
      );
      /* jshint ignore:end */
    }
  });

  return PlayerTrack;
};
