var VideoPageView = Backbone.View.extend({
  initialize: function() {
    this.video = new Video();
    this.videoView = new VideoView({ model: this.video });
  },

  appendTo: function(element) {
    this.render().$el.appendTo(element);
    this.video.set('video_id', '4TFbLwWU7jc');
  },

  render: function() {
    var element = this.videoView.render().$el;
    element.appendTo(this.$el);
    return this;
  }

});