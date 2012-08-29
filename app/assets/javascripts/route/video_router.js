var VideoRouter = Backbone.Router.extend({
  
  routes: {
    ":video_id" : "load_video"
  },

  initialize: function () {
    this.on("route:video_id", this.load_video, this);
  },

  load_video: function(video_id) {
    if (this.video == undefined) {
      this.video = new Video();
      this.videoView = new VideoView( { model: this.video } );
      this.comments = new CommentCollection();
      this.commentView = new CommentView({ model: this.comments });
      
      this.videoView.render().$el.appendTo($('#video_view'));
      this.commentView.$el.appendTo($('#comment_view'));
      this.commentView.play();
    }
    this.video.set( { video_id: video_id });
  },

  comment: function(comment, color) {
    this.comments.add(new Comment({ text: comment, font_color: 'red' }));
  }
  
});