var CommentView = Backbone.View.extend({
  id: 'canvas',
  tagName: 'canvas',
  width: 800,
  height: 480,
  delay: 66,
  comment_through: 4000,
  line_margin: 10,
  target_fps: 30,
  
  initialize: function () {
    this.model.on('add', this.addComment, this);
    this.fps = new FPSTimer(this.target_fps);
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
    this.fps.check();
    context = this.el.getContext('2d');
    // アニメーション処理 - ここから
    context.clearRect(0, 0, this.width, this.height);

    // FPS描画
    this.fps.draw(context, 0, 0);

    var removeArray = [];

    this.model.each(function(comment) {
      // コメント描画
      var comment_velocity = comment.get('velocity');
      if (!comment_velocity) {
        comment.updateVelocity(context, this.model, this.width, this.height, this.comment_through, this.target_fps, this.line_margin);
      }
      comment.draw(context, this.width);
      
      // コメントの情報更新
      comment.updateX(function () {
        removeArray.push(comment);
      }, this.width);
    }, this);

    _.each(removeArray, function (comment) {
      this.model.remove(comment);
    }, this);
    
    // アニメーション処理 - ここまで
    if (this._status == 'play') {
      var self = this;
      this.fps.setTimeout(function () { self.canvas_render(); });
    }
  }
});

var FPSTimer = function(target_fps) {
  this.target_fps = target_fps;
};

FPSTimer.prototype.check = function () {
  var newDate = new Date();
  if (this._time == undefined) {
    this.fps = this.target_fps;
  } else {
    this.fps = 1000 / (newDate - this._time);
  }
  this._time = newDate;
};

FPSTimer.prototype.setTimeout = function (func) {
  var time = new Date - this._time;
  var interval = (1000 / this.target_fps) - time;
  setTimeout(func, interval);
};

FPSTimer.prototype.draw = function (context, x, y) {
  context.save();
  context.font = "normal 10px san-serif";
  context.fillStyle = '#000000';
  context.textBaseline = "top";
  context.textAlignment = "left";
  context.fillText("FPS: " + this.fps.toFixed(2), x, y);
  context.restore();
};