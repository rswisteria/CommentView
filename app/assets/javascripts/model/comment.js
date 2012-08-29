var Comment = Backbone.Model.extend({
  draw: function(context, canvas_width) {
    context.save();
    this.updateContext(context);
    
    var text = this.get('text');
    var comment_x = this.get('x');
    var comment_y = this.get('y');

    context.fillText(text, canvas_width - comment_x, comment_y);
    context.restore();
  },

  updateContext: function(context) {
    context.font = "normal " + this.getFontSize() + "px san-serif";
    context.fillStyle = this.getFontColor();
    context.textBaseline = "top";
    context.textAlignment = "left";
  },

  getFontColor: function() 
  {
    if (this.get('font_color') == undefined) {
      return '#FFFFFF';
    }
    return this.get('font_color');
  },

  getFontSize: function()
  {
    switch (this.get('font_size')) {
     case 'big':
      size = 50;
      break;
     case 'medium':
      size = 30;
      break;
     case 'small':
      size = 10;
      break;
    default:
      size = 30;
      break;
    }
    return size;
  },

  updateX: function(removeFunc, canvas_width) {
    this.set({ x: this.get('x') + this.get('velocity') }, { silent: true } );
    if (this.get('x') > this.get('text_width') + canvas_width) {
      removeFunc();
    } 
  },

  updateVelocity: function(context, collection, canvas_width, canvas_height, comment_through, target_fps, line_margin) {
    context.save();
    this.updateContext(context);
    
    var comment_velocity = this.get('velocity');
    if (!comment_velocity) {
      var textMetrics = context.measureText(this.get('text'));
      comment_velocity = (canvas_width + textMetrics.width) / (comment_through / (1000 / target_fps));
      this.set({ velocity: comment_velocity, text_width: textMetrics.width, text_height: this.getFontSize() + line_margin }, { silent: true });
      var y = CollisionDetector.getNextY(this, collection, canvas_height, line_margin);
      this.set({ y: y }, { silent: true });
    }
    context.restore();
  }
});

var CommentCollection = Backbone.Collection.extend({
  model : Comment
});