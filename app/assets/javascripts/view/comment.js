var CommentView = Backbone.View.extend({
  id: 'canvas',
  tagName: 'canvas',
  width: 800,
  height: 480,
  delay: 66,
  fps: 30,
  comment_through: 4000,
  current_fps: 0,
  line_margin: 10,
  
  initialize: function () {
    this.model.on('add', this.addComment, this);
  },

  resize: function (width, height) {
    this.width = width;
    this.height = height;
    this.render();
  },

  /**
   * キャンバスのアニメーション関数の実行を開始する
   */
  play: function() {
    this._status = 'play';
    this.resize(this.width, this.height);
    this.trigger('resize', this.width, this.height);
    var self = this;
    this.timer = setTimeout(function() { self.canvas_render(); }, 0);
  },

  status: function() {
    return this._status;
  },

  render: function() {
    this.$el.width(this.width);
    this.$el.height(this.height);
    this.el.width = this.width;
    this.el.height = this.height;
    this.$el.attr('id', this.id);
    return this;
  },

  addComment: function(comment) {
    comment.set( { x: 0, comment_time: +new Date() }, { silent: true } );
  },

  canvas_render: function()
  {
    if (this._time == undefined) {
      this.current_fps = this.fps;
    } else {
      this.current_fps = 1000 / (new Date() - this._time);
    }
    this._time = new Date();
    context = this.el.getContext('2d');
    // アニメーション処理 - ここから
    context.clearRect(0, 0, this.width, this.height);

    context.font = "normal 10px san-serif";
    context.fillStyle = '#000000';
    context.textBaseline = "middle";
    context.textAlignment = "left";
    context.fillText("FPS: " + this.current_fps.toFixed(2), 0, 10);
    
    var removeArray = [];

    this.model.each(function(comment) {
      // コメント描画
      var text = comment.get('text');

      context.font = "normal 30px san-serif";
      context.fillStyle = '#000000';
      context.textBaseline = "top";
      context.textAlignment = "left";

      var comment_velocity = comment.get('velocity');
      if (!comment_velocity) {
        var textMetrics = context.measureText(text);
        comment_velocity = (this.width + textMetrics.width) / (this.comment_through / (1000 / this.fps));
        comment.set({ velocity: comment_velocity, text_width: textMetrics.width, text_height: 30 + this.line_margin }, { silent: true });
        var y = CollisionDetector.getNextY(comment, this.model, this.height, this.line_margin);
        comment.set({ y: y }, { silent: true });
      }

      var comment_x = comment.get('x');
      var comment_y = comment.get('y');

      context.fillText(text, this.width - comment_x, comment_y);
      
      // コメントの情報更新
      comment.set({ x: comment_x + comment_velocity }, { silent: true } );
      if (comment.get('x') > comment.get('text_width') + this.width) {
        removeArray.push(comment);
      } 
    }, this);

    _.each(removeArray, function (comment) {
      this.model.remove(comment);
    }, this);
    
    // アニメーション処理 - ここまで
    if (this._status == 'play') {
      var time = new Date() - this._time;
      var self = this;
      var interval = (1000 / this.fps) - time;
      interval = interval > 5 ? interval : 5;
      setTimeout(function () { self.canvas_render(); }, interval);
    }
  }
});