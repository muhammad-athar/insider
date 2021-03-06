var mongoose = require('mongoose');
var articles = mongoose.model('Articles');

var sendJsonResponse = function(res, status, content) {
  res.status(status);
  res.json(content);
};

module.exports.articlesShowAll = function (req, res, next) { 
  articles.find().select('articleid title author description urlToImage').exec((function(err, articles) {
    sendJsonResponse(res, 200, articles);
  }));
};

module.exports.articlesRead = function (req, res, next) { 
  articles
    .find({'articleid': req.params.articleid})
    .select('author title text articleid urlToImage')
    .exec(function(err, article) {
      if(!article || article.length == 0) {
        sendJsonResponse(res, 404, {"message": "articleid not found"});
        return;
      } else if (err) {
        sendJsonResponse(res, 400, err);
        return;
      } else {
          sendJsonResponse(res, 200, article);
      }
    });
};

module.exports.articlesCreate = function (req, res, next) {
  articles.findOne().sort({articleid: -1}).select('articleid').exec((function(err, article) {
    var thisArticleID = article.articleid;
    thisArticleID++;
    console.log(thisArticleID);
      articles.create({
      articleid: thisArticleID,
      author: req.body.author,
      title: req.body.title,
      text: req.body.text,
      urlToImage: "https://unsplash.it/150/"
      },
      function (err, article) {
        if(err){
          console.log(err);
          sendJsonResponse(res, 400, err);
        } else {
          console.log(article);
          sendJsonResponse(res, 201, article);
        }
      });
  }));
};


module.exports.articlesUpdate = function (req, res, next) { 
  articles
    .find({'articleid': req.params.articleid})
    .select('author title text articleid')
    .exec(function(err, article) {
    article = article[0];
      article.author = req.body.author;
      article.title = req.body.title;
      article.text = req.body.text;
      article.save(
        function (err, article) {
        if(err){
          sendJsonResponse(res, 400, err);
        } else {
          sendJsonResponse(res, 200, article);
        }
      });
    })
};


module.exports.articlesDelete = function (req, res, next) { 
    articles
      .remove({'articleid': req.params.articleid})
      .exec(function(err, article) {
        if(err){
          sendJsonResponse(res, 404, err);
        } else {
          sendJsonResponse(res, 204, null);
        }
    });
};
