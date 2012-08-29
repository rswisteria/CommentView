describe('CollisionDetector', function () {

  var model1;
  var model2;
  var collection;
  
  beforeEach(function() {
    model1 = new Comment();
    model2 = new Comment();
    collection = new CommentCollection();
  });

  it("Y軸で衝突判定1・ぶつかる", function() {
    model1.set({ y: 20, text_height: 35 });
    model2.set({ y: 50, text_height: 20 });
    
    expect(CollisionDetector.isCollisionY(model1, model2)).toBeTruthy();
  });

  it("Y軸での衝突判定2・ギリギリぶつからない", function() {
    model1.set({ y: 20, text_height: 35 });
    model2.set({ y: 55, text_height: 20 });
    
    expect(CollisionDetector.isCollisionY(model1, model2)).not.toBeTruthy();
  });

  it("Y軸で衝突判定3・上下逆にしてギリギリぶつからない", function() {
    model1.set({ y: 55, text_height: 20 });
    model2.set({ y: 20, text_height: 35 });
    
    expect(CollisionDetector.isCollisionY(model1, model2)).not.toBeTruthy();
  });

  it("Y軸で衝突判定4・不具合から", function() {
    model1.set({ y: 50, text_height: 40 });
    model2.set({ y: 10, text_height: 40 });
    
    expect(CollisionDetector.isCollisionY(model1, model2)).not.toBeTruthy();
  });
  
  it("時間軸込みでX軸での衝突判定1・ぶつかる", function () {
    model1.set({ text_width: 100, comment_time: +new Date() });
    model2.set({ text_width: 200, comment_time: +new Date() + 500 });
  
    expect(CollisionDetector.isCollisionX(model1, model2, 400, 4000)).toBeTruthy();
  });

  it("時間軸込みでX軸での衝突判定2・ギリギリぶつからない", function () {
    model1.set({ text_width: 100, comment_time: +new Date() });
    model2.set({ text_width: 100, comment_time: +new Date() + 800 });
  
    expect(CollisionDetector.isCollisionX(model1, model2, 400, 4000)).not.toBeTruthy();
  });

  it("時間軸込みでX軸での衝突判定3・同じ速度で移動しているのでぶつからない", function () {
    model1.set({ text_width: 50, comment_time: +new Date() });
    model2.set({ text_width: 50, comment_time: +new Date() + 1000 });
  
    expect(CollisionDetector.isCollisionX(model1, model2, 400, 4000)).not.toBeTruthy();
  });

  it("時間軸込みでのX軸での衝突判定4・コメント出現時に衝突して、コメント消えるときには解消されている場合、衝突と判定されない不具合の修正", function () {
    model1.set({ text_width: 100, comment_time: +new Date() });
    model2.set({ text_width: 30, comment_time: +new Date() + 300 });
  
    expect(CollisionDetector.isCollisionX(model1, model2, 400, 4000)).toBeTruthy();
  });
    
  it("コレクションに含まれるコメントと衝突判定1・最上段に挿入される", function () {
    var commentTime = +new Date();
    model1.set( { x: 125, y: 10, text_width: 100, text_height: 30, comment_time: commentTime } );
    model2.set( { x: 37.5, y: 40, text_width: 100, text_height: 30, comment_time: commentTime + 300 });
    collection.add(model1);
    collection.add(model2);
    
    var model3 = new Comment();
    model3.set( { text_width: 50, text_height: 30, comment_time: commentTime + 1000 });

    expect(CollisionDetector.getNextY(model3, collection, 300, 10)).toEqual(10);
  });

  it("コレクションに含まれるコメントと衝突判定1・3段目に挿入される", function () {
    var commentTime = +new Date();
    model1.set( { x: 125, y: 10, text_width: 100, text_height: 30, comment_time: commentTime } );
    model2.set( { x: 37.5, y: 40, text_width: 100, text_height: 30, comment_time: commentTime + 300 });
    collection.add(model1);
    collection.add(model2);
    
    var model3 = new Comment();
    model3.set( { text_width: 400, text_height: 30, comment_time: commentTime + 1000 });

    expect(CollisionDetector.getNextY(model3, collection, 300, 10)).toEqual(70);
  });
         
});
