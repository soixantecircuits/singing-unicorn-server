Playlist = new Meteor.Collection("playlist");


if (Meteor.isServer) {
  Future = Meteor.require("fibers/future");
  cheerio = Meteor.require('cheerio');
  _ = Meteor.require('lodash');
  Youtube = Meteor.require("youtube-api");

  Meteor.startup(function() {
    if (!Playlist.find().count()) {
      // fill BigCollection
    }
  });

  Meteor.methods({
    updatePlayStart: function(videoId) {
      console.log('Play: ' + videoId);
      Playlist.update({
        playing: true
      }, {
        $set: {
          playing: false
        }
      }, {
        multi: true,
        upsert: true
      }, function(err, docs) {
        if (err)
          console.log(err);
        console.log(docs);
        Playlist.update({
          _id: videoId
        }, {
          $set: {
            playing: true
          },
          $inc: {
            played: 1
          }
        }, {
          multi: false,
          upsert: true
        }, function(err, docs) {
          if (err) {
            console.log(err);
          } else {
            return "Well done, " + docs;
            console.log('update play')
            console.log(docs);
          }
        });
      });
    },
    updatePlayEnd: function(videoId) {
      console.log('Stop: ' + videoId);
      Playlist.update({
        _id: videoId
      }, {
        $set: {
          playing: false
        }
      }, {
        multi: false,
        upsert: true
      }, function(err, docs) {
        if (err) {
          console.log(err);
        } else {
          return "Well done, " + docs;
          console.log(docs);
        }
      });
    },
    searchPrev: function(query, options) {
      options = options || {};
      // guard against client-side DOS: hard limit to 50
      if (options.limit) {
        options.limit = Math.min(50, Math.abs(options.limit));
      } else {
        options.limit = 50;
      }

      var fut = new Future(),
        url = 'http://mp3skull.com/mp3/' + query + '.html';
      // Do call here, return value with Future
      console.log(url);
      HTTP.call('GET', url, function(err, res) {
        //console.log(res);
        var $ = cheerio.load(res.content);
        var listOfMp3Dom = $('a[href$=".mp3"]');
        var listOfMp3 = [];
        var requestCounter = 0;
        _.each(listOfMp3Dom, function(el, index) {
          console.log($(el).attr("href"));
          HTTP.call('GET', $(el).attr("href"), {
            timeout: 3000
          }, function(err, res) {
            if (err) {
              console.log(err)
              this.destroy();
            } else if (res.statusCode == 200) {
              listOfMp3.push({
                name: $(el).parent().parent().parent().prev().prev().find('b').text(),
                link: $(el).attr("href")
              });
              this.resume();
            }
            requestCounter++;
            if (requestCounter == listOfMp3Dom.length)
              fut.return(listOfMp3);
          });
        });
        console.log(listOfMp3);
      });
      return fut.wait();
    },
    search: function(query, options) {
      options = options || {};
      // guard against client-side DOS: hard limit to 50
      if (options.limit) {
        options.limit = Math.min(50, Math.abs(options.limit));
      } else {
        options.limit = 50;
      }

      var fut = new Future();
      Youtube.authenticate({
        type: 'key',
        key: Meteor.settings.youtube.key
      });
      var listOfMp3 = [];
      Youtube.search.list({
        "part": "id, snippet",
        "maxResults": 50,
        "q": query,

      }, function(err, data) {
        console.log(err, data);
        if (err) {
          console.log(err);
          console.log(data);
        } else {
          _.each(data.items, function(item, index) {
            listOfMp3.push({
              name: item.snippet.title,
              id: item.id,
              date: Date.now()
            });
          });
          fut.return(listOfMp3);
        }
      });
      return fut.wait();
    }
  });
} else {
  Template.main.search = function(query, callback) {
    Meteor.call('search', query, {}, function(err, res) {
      if (err) {
        console.log(err);
        return;
      }
      callback(res);
    });
  };
}