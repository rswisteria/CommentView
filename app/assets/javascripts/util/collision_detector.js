var CollisionDetector = {
    
  isCollisionY: function (model1, model2) {
    var model1_top = model1.get('y');
    var model2_top = model2.get('y');

    if (model1_top > model2_top) {
      var tmp = model1;
      model1 = model2;
      model2 = tmp;
      model1_top = model1.get('y');
      model2_top = model2.get('y');
    }

    var model1_bottom = model1.get('y') + model1.get('text_height');    
    return model1_bottom > model2_top;
  },

  isCollisionX: function (model1, model2, displayWidth, activeTime) {
    // 先にコメントされた方をmodel1、後にコメントされた方をmodel2とする
    if (model1.get('comment_time') > model2.get('comment_time')) {
      var tmp = model1;
      model1 = model2;
      model2 = tmp;
    }

    var now = +new Date();
    // activeTime後の時間
    var at = model1.get('comment_time') + activeTime;

    // model2の現時点のactiveTime後の右端のx座標
    var x01 = (displayWidth + model1.get('text_width')) / (activeTime / 1000) * (now - model1.get('comment_time')) / 1000 - model1.get('text_width');
    // model2の現時点のactiveTime後の右端のx座標
    var x02 = (displayWidth + model2.get('text_width')) / (activeTime / 1000) * (now - model2.get('comment_time')) / 1000;
    
    if (x01 < x02) {
      return true;
    }
    
    // model1のactiveTime後の右端のx座標
    var x1 = (displayWidth + model1.get('text_width')) / (activeTime / 1000) * (at - model1.get('comment_time')) / 1000 - model1.get('text_width');
    // model2のactiveTime後の左端のx座標
    var x2 = (displayWidth + model2.get('text_width')) / (activeTime / 1000) * (at - model2.get('comment_time')) / 1000;

    return x1 < x2;
  },

  getNextY: function(model, collection, height, margin) {
    var tmp_y = margin;
    var need_height = model.get('text_height');

    while (true) {
      model.set( { y: tmp_y }, { silent: true });
      var collisionYList = [];
      collection.each(function (comment) {
        if (model.cid != comment.cid) {
          if (this.isCollisionY(model, comment)) {
            // Y軸衝突リストに追加
            collisionYList.push(comment);
          }
        }
      }, this);

      // 衝突リストが空ならtmp_yの値を返す
      if (collisionYList.length == 0) {
        return tmp_y;
      }

      // 衝突リストから一番手前のコメントを取得
      var tmp_comment = undefined;
      var tmp_comment_x = undefined;
      _.each(collisionYList, function(comment) {
        if (tmp_comment == undefined) {
          tmp_comment = comment;
          tmp_comment_x = comment.get('x');
        } else {
          var cx = comment.get('x');
          if (cx < tmp_comment_x) {
            tmp_comment = comment;
            tmp_comment_x = cx;
          }
        }
      }, this);

      // 一番手前のコメントとX軸衝突判定
      if (this.isCollisionX(tmp_comment, model, 400, 4000)) {
        // 衝突したらtmp_yをこのコメントとY軸で衝突しない値に設定し、再度衝突判定      
        tmp_y += tmp_comment.get('text_height');
      } else {
        // 衝突しなかったらtmp_yの値を返す
        return tmp_y;
      }

      // tmp_y + need_heightがheight - marginを超えたら、弾幕モードへ移行
      if (tmp_y + need_height > height - margin) {
        return Math.random() * (height - margin - need_height);
      }
    }
  }
};