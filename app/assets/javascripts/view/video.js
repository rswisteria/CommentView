var VideoView = Backbone.View.extend({

  tagName: 'div',

  id: 'player',

  playerApiId: 'ytplayer',

  initialize: function () {
    this.model.on('change:video_id', this.setVideo, this);
    addPlayerReadyListener(this.playerApiId, this.ready, this);
  },

  setVideo: function (model, value) {
    this.video_id = value;
    var params = { allowScriptAccess: "always" };
    var atts = { id: "player_" + value };
    var url = "http://www.youtube.com/v/" + value + "?enablejsapi=1&playerapiid=" + this.playerApiId;
    var result = swfobject.embedSWF(url, this.id, "800", "500", "8", null, null, params, atts);
  },

  ready: function() {
    this.id = 'player_' + this.video_id;
    this.player_el = document.getElementById(this.id);
    this.player_el.playVideo();
    this.trigger('load_video');
  },

  setID: function(id) {
    this.id = id;
  }
});
