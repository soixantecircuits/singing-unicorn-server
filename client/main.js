if (Meteor.isClient) {
  UI.registerHelper("log", function(context) {
    return console.log(context);
  });

  Template.main.greeting = function() {
    return "Welcome to unicorn-server.";
  };

  Template.main.helpers({
    songs: function() {
      return Playlist.find({}).fetch();
    },
    invertLoop: function(el) {
      return el.reverse();
    }
  });


  Template.main.rendered = function() {
    $(document).on('keyup', '#songToAdd', function() {
      var menu = $('.tt-dropdown-menu');
      if(!menu.find('.tt-suggestions').length && $('#songToAdd').val().length > 1) {
        menu.slideDown(300);
        menu.addClass('loading');
      } else {
        menu.removeClass('loading');
      }
    })
  };

  Template.songItem.rendered = function(){
    $('.isPlaying > .info').addClass('animated  bounceOutLeft');
    $('.isPlaying').hover(
      function(){
        $('.isPlaying > .info').removeClass('animated fadeOutLeft');
        $('.isPlaying > .info').addClass('animated fadeInLeft');
      }, function(){
        $('.isPlaying > .info').removeClass('animated fadeInLeft');
        $('.isPlaying > .info').addClass('animated fadeOutLeft');
      });
  }

  Meteor.startup(function() {
    // initializes all typeahead instances
    Meteor.typeahead.inject();
  });

  Template.main.events({
    'click input.addToPlaylist': function() {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });

  Template.songItem.helpers({
    isPlaying: function(state){
      return state ? 'isPlaying' : 'notPlaying'
    }
  });

  Template.main.selected = function(event, suggestion, datasetName) {
    console.log(suggestion);
    $('#songToAdd').val(suggestion.name).data('name', suggestion.name).data('id', suggestion.id.videoId);

    $('.addToPlaylist').fadeTo(500, 1);

    var name = $('<p/>', {
      'text': suggestion.name,
      'data-id': suggestion.id.videoId
    });

    $(document).one('click', '.addToPlaylist', function() {
      if (name) {
        Playlist.insert({
          videoId: $('#songToAdd').data('id'),
          name: $('#songToAdd').data('name'),
          playing: false,
          dateAdded: new Date()
        });
        $('#songToAdd').empty();
        $('.addToPlaylist').fadeTo(500, 0);
      } else {
        console.log('no name');
      }
    });

  }

}