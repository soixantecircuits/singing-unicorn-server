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
  },
  currentLink: function(){
    var song = Playlist.findOne({playing: true});
    return "http://www.youtube.com/watch?v="+song.videoId;
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

  Session.set('tooltipState', false);

  if($(window).scrollTop()==0){
    Session.set('isAtTop', true);
  } else {
    isAtTop = false;
    Session.set('isAtTop', false);
  }

  $(window).scroll(function(event) {
    // If top of page
    if(Session.get('isAtTop')){
      scrollAnim();
    }
  });
};

Template.main.events({
  'click #about': function(){
    var tooltip = $('.tooltip-about'),
        animSpeed = 0.4;

    if(Session.get('tooltipState')){
      TweenMax.to(tooltip, animSpeed, {top: "120px", opacity: 0});
      Session.set('tooltipState', false);
    } else {
      TweenMax.to(tooltip, animSpeed, {top: "140px", opacity: 1});
      Session.set('tooltipState', true);
    }
  },
  'click': function(e){
    var tooltip = $('.tooltip-about'),
        animSpeed = 0.4;

    if( $(e.target).closest('.tooltip-about').length==0 && Session.get('tooltipState') && $(e.target).attr('id')!="about"){
      TweenMax.to(tooltip, animSpeed, {top: "120px", opacity: 0});
      Session.set('tooltipState', false);      
    }
  },
  'click #base-click': function(){
    scrollAnim();
  }
});

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
  var topMove = gaussianNumber(0, 8) +position.top;
  var leftMove = gaussianNumber(0, 8) + position.left;
  topMove = formatDistance(topMove); 
  leftMove = formatDistance(leftMove);

  TweenMax.to(obj, 2, {top: topMove, left: leftMove, ease: Quad.easeOut, onComplete: function(){
    floatSinglePaper(obj, position);
  }});
}

function scrollAnim(){
  var scrollSpeed = 0.7,
      menuAppearSpeed = 0.7,
      minMenu = $('.min-header');

  TweenMax.to(minMenu, menuAppearSpeed, {top: 0});
  TweenMax.to($('#header'), scrollSpeed, {top: '-100vh', position: 'absolute', onComplete: function(){
    Session.set('isAtTop', false);
  }});
  $('html, body').animate({scrollTop: 0}, scrollSpeed);
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