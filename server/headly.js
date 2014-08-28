Meteor.headly.config({
    tagsForRequest: function(req) {
      var meta = ['<meta property="og:title" content="Singing Unicorn"/>',
        '<meta property="og:site_name" content="Singing Unicorn"/>',
        '<meta property="og:url" content="http://singingunicorn.meteor.com"/>',
        '<meta property="og:description" content="Let the pink fluffy unicorn dancing on rainbow magic begin. Spread the love !"/>',
        '<meta property="og:image" content="http://singingunicorn.meteor.com/img/fb_cover.jpg" />',
        '<meta property="fb:app_id" content="692934807457866" />'
      ];
      return meta.join();
    },
    twitter: function(req) {
      var meta = [
      '<meta name="twitter:card" content="summary">',
        '<meta name="twitter:site" content="@soixanteci">',
        '<meta name="twitter:title" content="Singing Unicorn">',
        '<meta name="twitter:description" content="Let the pink fluffy unicorn dancing on rainbow magic begin. Spread the love !">',
        '<meta name="twitter:creator" content="@soixanteci">',
        '<meta name="twitter:image:src" content="http://singingunicorn.meteor.com/img/unicorn.png">',
        '<meta name="twitter:domain" content="http://singingunicorn.meteor.com">'];
      return meta.join();
    }
  });