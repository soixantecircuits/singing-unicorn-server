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
  },
  songsPlayed: function(){
    var songsPlayed = 0,
        playlist = Playlist.find().fetch();

    for(i=0; i<playlist.length; i++){
      var item = playlist[i].played;
      if(item!=undefined && typeof item == "number"){
        songsPlayed+=item;
      }
    }

    return songsPlayed;
  },
  totalDuration: function(){
    var playlist = Playlist.find().fetch(),
        totalDuration = 0,
        durationFormated = "";

    for(i=0; i<playlist.length; i++){
      totalDuration += playlist[i].duration;
    }
    if(Math.floor(totalDuration/3600)>0){
      durationFormated += Math.floor(totalDuration/3600)+"h ";
    }
    durationFormated += Math.round(totalDuration/60)+"min";
    return durationFormated;
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
  if($(window).width()<568){
    var tooltipHeight = $(window).height() -180;
    $('.tooltip-about').height(tooltipHeight);
  }
  $(document).keyup(function(e) {
    if (e.keyCode == 27) {
    var tooltip = $('.tooltip-about'),
        animSpeed = 0.4;
    if(Session.get('tooltipState')){
      TweenMax.to(tooltip, animSpeed, {top: "120px", opacity: 0});
      Session.set('tooltipState', false);      
    }
    }   // esc
  });
};

Template.main.events({
  'click #about': function(){
    var tooltip = $('.tooltip-about'),
        animSpeed = 0.4;

    if(Session.get('tooltipState')){
      TweenMax.to(tooltip, animSpeed, {top: "120px", opacity: 0, onComplete: function(){
        tooltip.css('display', 'none');
      }});
      Session.set('tooltipState', false);
    } else {
      tooltip.css('display', 'block');
      TweenMax.to(tooltip, animSpeed, {top: "140px", opacity: 1});
      Session.set('tooltipState', true);
    }
  },
  'click': function(e){
    var tooltip = $('.tooltip-about'),
        animSpeed = 0.4;

    if( $(e.target).closest('.tooltip-about').length==0 && Session.get('tooltipState') && $(e.target).attr('id')!="about"){
      TweenMax.to(tooltip, animSpeed, {top: "120px", opacity: 0, onComplete: function(){
        tooltip.css('display', 'none');
      }});
      Session.set('tooltipState', false);      
    }
  },
  'click .arrow': function(){
    if(Session.get('isAtTop')){
      scrollAnim();
    }
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
    'data-id': suggestion.id.videoId,
  });

  var duration;
  Meteor.call('getDuration', suggestion.id.videoId, function(err, data){
    if(name){
      $('.addToPlaylist').removeClass('grayscale');
    }

    $(document).one('click', '.addToPlaylist', function(event) {
      if (name) {
        Playlist.insert({
          videoId: $('#songToAdd').data('id'),
          name: $('#songToAdd').data('name'),
          playing: false,
          played: 0,
          duration: data,
          dateAdded: new Date()
        });
        $('#songToAdd').empty();
        $('.addToPlaylist').addClass('grayscale');
      } else {
        console.log('no name');
      }
    });
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
    $('.searchSection').css('z-index', '200');
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