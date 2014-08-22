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
  },
  currentSong: function(){
    var song = Playlist.findOne({playing: true});
    return song.name;
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
  });
  floatPapercraft();

  var isAtTop, 
      scrollSpeed = 1,
      menuAppearSpeed = 0.5,
      minMenu = $('.min-header');

  if($(window).scrollTop()==0){
    isAtTop = true;
  } else {
    isAtTop = false;
    TweenMax.to(minMenu, menuAppearSpeed, {top: 0});
  }

  $(window).scroll(function(event) {
    // If top of page
    if(isAtTop==true){
      TweenMax.to(minMenu, menuAppearSpeed, {top: 0});
      TweenMax.to($('#header'), scrollSpeed, {top: '-100vh', position: 'absolute', opacity: 0, onComplete: function(){
        console.log("Fin descente !");        
        isAtTop = false;
      }});
    }
  });
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
  $('#songToAdd').val(suggestion.name).data('name', suggestion.name).data('id', suggestion.id.videoId);


  var name = $('<p/>', {
    'text': suggestion.name,
    'data-id': suggestion.id.videoId
  });

  if(name){
    $('.addToPlaylist').removeClass('grayscale');
  }

  $(document).one('click', '.addToPlaylist', function(event) {
    if (name) {
      Playlist.insert({
        videoId: $('#songToAdd').data('id'),
        name: $('#songToAdd').data('name'),
        playing: false,
        dateAdded: new Date()
      });
      $('#songToAdd').empty();
      $('.addToPlaylist').addClass('grayscale');
      event.preventDefault();
    } else {
      console.log('no name');
    }
  });
}
function floatPapercraft(){
  var papercrafts = $('.obj');
  for(i=1; i<=papercrafts.length; i++){
    var paper = $('.obj'+i),
        position = paper.position();
    floatSinglePaper(paper, position);
  }
}

function floatSinglePaper(obj, position){
  var topMove = gaussianNumber(0, 10) +position.top;
  var leftMove = gaussianNumber(0, 10) + position.left;
  topMove = formatDistance(topMove); 
  leftMove = formatDistance(leftMove);

  TweenMax.to(obj, 2, {top: topMove, left: leftMove, ease: Quad.easeOut, onComplete: function(){
    floatSinglePaper(obj, position);
  }});
}

function sndNumber() {
  return (Math.random()*2-1)+(Math.random()*2-1)+(Math.random()*2-1);
}
function gaussianNumber(mean, stdev) {
  return sndNumber()*stdev+mean;
}
function formatDistance(nbr){
  return nbr+"px";
}