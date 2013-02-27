
/*
 * GET home page.
 */

var model = require('../model');
var Post = model.Post;

exports.index = function(req, res){
  var query = Post.find().limit(50);
  query.exec(function(err, posts) {
    if (err) {
      log(err);
    } else {
      res.render('index', { title: 'NodeでつくったWebチャットだよ', posts: posts });
    }
  });
};
