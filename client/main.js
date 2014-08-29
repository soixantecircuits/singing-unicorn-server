UI.registerHelper("log", function(context) {
  return console.log(context);
});

Meteor.subscribe('playlist');

Template.main.helpers({
  songs: function() {
    return Playlist.find({}).fetch();
  },
  invertLoop: function(el) {
    return el.reverse();
  },
  currentSong: function(){
    var song = Playlist.findOne({playing: true});
    if(song!=undefined)
      return song.name;
  },
  currentDuration: function(){
    var duration = Playlist.findOne({playing: true}).duration;
    var durationFormated="";

    if(Math.floor(duration/3600)>0){
      durationFormated += Math.floor(duration/3600)+":";
      duration -= Math.floor(duration/3600)*3600;
    }
    if(Math.floor(duration/60)>0){
      durationFormated += Math.floor(duration/60)+":";
      duration -= Math.floor(duration/60)*60;
    } else {
      durationFormated+="0:";
    }
    if(duration>0){
      durationFormated+=duration;
    } else {
      durationFormated+="0";
    }
    return durationFormated;
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
      if(playlist[i].duration==undefined)
        totalDuration+=0;
      else
        totalDuration += playlist[i].duration;
    }
    if(Math.floor(totalDuration/3600)>0){
      durationFormated += Math.floor(totalDuration/3600)+"h ";
      totalDuration-=Math.floor(totalDuration/3600)*3600;
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

  if($(window).width()>568){
    floatPapercraft();
    $(window).scroll(function(event) {
      // If top of page
      if(Session.get('isAtTop')){
        scrollAnim();
      }
    });
  }
  Session.set('tooltipState', false);

  if($(window).scrollTop()==0){
    Session.set('isAtTop', true);
  } else {
    isAtTop = false;
    Session.set('isAtTop', false);
  }

  if($(window).width()<568){
    var tooltipHeight = $(window).height() -170;
    $('.tooltip-about').height(tooltipHeight);
    $('.main-header').height($(window).height());
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
  var arrowTl = new TimelineMax({repeat: -1}),
      arrow = $('.arrow'),
      arrowSpeed = 0.7;
  arrowTl.add(TweenMax.to(arrow, arrowSpeed, {bottom: "11vh", ease:Quad.easeOut}));
  arrowTl.add(TweenMax.to(arrow, arrowSpeed, {bottom: "10vh", ease:Quad.easeOut}));
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
  },
  'click .close-social': function(){
    var scrollSpeed = 0.6,
        menuAppearSpeed = 0.6,
        minMenu = $('.fixed-bar');

    var newTop = ($(window).height() - (minMenu.height()-$('.social-bar').height()) )*(-1);
    TweenMax.to($('#header'), menuAppearSpeed, {top: newTop})
    TweenMax.to(minMenu, menuAppearSpeed, {top: $('.social-bar').height()*(-1)});
    TweenMax.to($('.searchSection'), menuAppearSpeed, {'margin-top': minMenu.height()-$('.social-bar').height()});
  },
  'click input.addToPlaylist': function() {
    // template data, if any, is available in 'this'
    if (typeof console !== 'undefined')
      console.log("You pressed the button");
  },
  'focus #songToAdd': function(){
    TweenMax.to($('.addToPlaylist'), 0.4, {opacity: 1, scale: 1, transformOrigin: "center"});
    TweenMax.to($('.nice-message'), 0.4, {opacity: 0, onComplete: function(){
      $('.nice-message').css('display', 'none');
    }});
  }
});

Meteor.startup(function() {
  // initializes all typeahead instances
  Meteor.typeahead.inject();
});

Template.songItem.helpers({
  isPlaying: function(state){
    return state ? 'isPlaying' : 'notPlaying'
  },
  formattedDuration: function(data){
    var duration = data;
    var durationFormated="";

    if(Math.floor(duration/3600)>0){
      if(Math.floor(duration/3600)<10){
        durationFormated+="0";
      }
      durationFormated += Math.floor(duration/3600)+":";
      duration -= Math.floor(duration/3600)*3600;
    }
    if(Math.floor(duration/60)>0){
      if(Math.floor(duration/60)<10){
        durationFormated+="0";
      }
      durationFormated += Math.floor(duration/60)+":";
      duration -= Math.floor(duration/60)*60;
    } else {
      durationFormated+="00:";
    }
    if(duration>0){
      if(duration<10){
        durationFormated+="0";
      }
      durationFormated+=duration;
    } else {
      durationFormated+="00";
    }
    return durationFormated;
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
        Meteor.call('insertSong', $('#songToAdd').data('id'), $('#songToAdd').data('name'),data);

        $('#songToAdd').empty();
        TweenMax.to($('.addToPlaylist'), 0.4, {opacity: 0, scale: 0.9, transformOrigin: "center"});
        $('.addToPlaylist').addClass('grayscale');
        $('.nice-message').css('display', 'block');
        TweenMax.to($('.nice-message'), 0.4, {opacity: 1});
      } else {
        console.log('no name');
      }
    });
  });
}