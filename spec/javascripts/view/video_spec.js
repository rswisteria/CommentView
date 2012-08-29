describe("VideoView", function () {
  var video;
  var videoView;
  var called = false;

  beforeEach(function () {
    video = new Video();
    videoView = new VideoView( { model : video } );
    called = false;

    setFixtures(sandbox('<div id="test"></div>'));
    videoView.$el.appendTo($('#test'));
  });

  it("動画IDをモデルに設定したら、Youtube動画をロードし、load_videoで登録したリスナーが動作する", function () {
    // YouTubeの動画ロードが完了したら、変数calledがtrueになるリスナー
    var callback = function() {
      called = true;
    };
    videoView.on('load_video', callback, this);
    video.set('video_id', '4TFbLwWU7jc');

    waitsFor(function() {
      return called;
    }, 'YouTube動画のロードが完了する', 5000);

    runs(function() {
      // calledがtrue
      expect(called).toBeTruthy();
      // 動画要素が読み込まれている
      var videoElement = $('#test');
      expect(videoElement.find('#player_4TFbLwWU7jc').attr('id')).toEqual('player_4TFbLwWU7jc');
    });
  });

  it("動画を再生する", function () {
    //videoView.play();
  });

});