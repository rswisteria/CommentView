var YouTubeEventQueue = Backbone.Model.extend({});
var youtubeEventQueue = new YouTubeEventQueue();

function onYouTubePlayerReady(playerId) {
  youtubeEventQueue.trigger('load_video_' + playerId);
}

function addPlayerReadyListener(playerId, func, thisArgs) {
  youtubeEventQueue.on('load_video_' + playerId, func, thisArgs);
}

