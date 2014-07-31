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
  Template.main.selected = function(event, suggestion, datasetName) {
    console.log(suggestion);

    $('#groupPlayer').empty();

    var name = $('<p/>', {
      'text': suggestion.name,
      'data-id': suggestion.id.videoId
    });
    var button = $('<button/>', {
      'class': 'addToPlaylist',
      'text': "add"
    });

    $(document).one('click', '.addToPlaylist', function() {
      if ($('#songToAdd').data('name') != '') {
        Playlist.insert({
          videoId: $('#songToAdd').data('id'),
          name: $('#songToAdd').data('name'),
          playing: false,
          dateAdded: new Date()
        });
      } else {
        console.log('no name');
      }
    });

    name.appendTo($('#groupPlayer'));
    button.appendTo($('#groupPlayer'));

    $('#songToAdd').val(suggestion.name).data('name', suggestion.name).data('id', suggestion.id.videoId);
  }

}