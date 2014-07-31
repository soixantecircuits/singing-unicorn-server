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
    }
  });

  Template.main.rendered = function() {
    //Meteor.typeahead.inject('.typeahead');
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

    $('#songToAdd').empty();

    var name = $('<p/>', {
      'text': suggestion.name,
      'data-id': suggestion.id.videoId
    });


    $(document).one('click', '.addToPlaylist', function() {
      if ($('#songToAdd').data('name') != '') {
        Playlist.insert({
          videoId: $('#songToAdd').data('id'),
          name: $('#songToAdd').data('name'),
          playing: false,
          dateAdded: new Date()
        });
        $('#songToAdd').empty();
      } else {
        console.log('no name');
      }
    });

    name.appendTo($('#songToAdd'));

    $('#songToAdd').val(suggestion.name).data('name', suggestion.name).data('id', suggestion.id.videoId);
  }

}