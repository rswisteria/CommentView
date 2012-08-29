describe("CommentView", function () {
  var commentCollection;
  var commentView;
  var called = false;

  beforeEach(function () {
    commentCollection = new CommentCollection();
    commentView = new CommentView( { model: commentCollection });
    setFixtures(sandbox('<div id="test" style="background-color: rgb(128, 128, 128); width: 800px; height: 480px;"></div>'));
  });

  it("play()を呼ぶととりあえずアニメーション開始状態に", function () {
    commentView.$el.appendTo($('#test'));
    commentView.play();
    expect(commentView.status()).toEqual('play');
    expect(commentView.$el.width()).toEqual(800);
    expect(commentView.$el.height()).toEqual(480);
  });

  it("play状態でモデルにコメントが追加されると、コメントが流れるアニメーションが開始", function() {
    var color = ["white", "red", "pink", "orange", "yellow", "green", "cyan", "blue", "purple", "black"];
    var color_index = 0;

    commentView.$el.appendTo($('#test'));
    commentView.play();

    commentCollection.add(new Comment( { text: 'てすつ', font_size: 'big', font_color: color[color_index] } ));
    color_index = ++color_index >= color.length ? 0 : color_index;
    for (var i = 0; i < 2; i++) {
      waits(300);
      runs(function() {
        commentCollection.add(new Comment( { text: 'VIPからきますた', font_color: 'red', font_color: color[color_index] } ));
        color_index = ++color_index >= color.length ? 0 : color_index;
      });
    }
    for (var i = 0; i < 10; i++) {
      waits(200);
      runs(function() {
        commentCollection.add(new Comment( { text: 'きますた', font_color: color[color_index] } ));
        color_index = ++color_index >= color.length ? 0 : color_index;
      });
    }
    waits(300);
    runs(function() {
      commentCollection.add(new Comment( { text: 'くますた', font_color: color[color_index] } ));
      color_index = ++color_index >= color.length ? 0 : color_index;
    });
    runs(function() {
      commentCollection.add(new Comment( { text: '寿限無、寿限無'
                                           + ' 五劫の擦り切れ'
                                           + ' 海砂利水魚の'
                                           + ' 水行末 雲来末 風来末'
                                           + ' 食う寝る処に住む処'
                                           + ' やぶら小路の藪柑子'
                                           + ' パイポパイポ パイポのシューリンガン'
                                           + ' シューリンガンのグーリンダイ'
                                           + ' グーリンダイのポンポコピーのポンポコナーの'
                                           + ' 長久命の長助', font_color: color[color_index] } ));
      color_index = ++color_index >= color.length ? 0 : color_index;
    });
    waits(300);
    runs(function() {
      commentCollection.add(new Comment( { text: 'てすと', font_color: color[color_index] }));
      color_index = ++color_index >= color.length ? 0 : color_index;
    });

    waits(5000);
  });
});