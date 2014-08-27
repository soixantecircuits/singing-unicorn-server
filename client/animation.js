floatPapercraft = function(){
  var papercrafts = $('.obj');
  for(i=1; i<=papercrafts.length; i++){
    var paper = $('.obj'+i),
        position = paper.position();
    floatSinglePaper(paper, position);
  }
}

floatSinglePaper = function(obj, position){
  var topMove = gaussianNumber(0, 8) +position.top;
  var leftMove = gaussianNumber(0, 8) + position.left;
  topMove = formatDistance(topMove); 
  leftMove = formatDistance(leftMove);

  TweenMax.to(obj, 2, {top: topMove, left: leftMove, ease: Quad.easeOut, onComplete: function(){
    floatSinglePaper(obj, position);
  }});
}

scrollAnim = function(){
  var scrollSpeed = 0.6,
      menuAppearSpeed = 0.6,
      minMenu = $('.fixed-bar');

  var newTop = ($(window).height() - (minMenu.height()-$('.social-bar').height()) )*(-1);

  TweenMax.to(minMenu, menuAppearSpeed, {top: $('.social-bar').height()*(-1)});
  $('.searchSection').css('margin-top', minMenu.height()-$('.social-bar').height());
  TweenMax.to($('.min-header > hr'), menuAppearSpeed, {bottom: "-6px"});
  TweenMax.to($('#header'), scrollSpeed, {top: newTop, position: 'absolute', onComplete: function(){
    Session.set('isAtTop', false);
    $('.searchSection').css('z-index', '4');
    setTimeout(function(){
      TweenMax.to($('#header'), menuAppearSpeed, {top: ($(window).height()-minMenu.height())*(-1)})
      TweenMax.to(minMenu, menuAppearSpeed, {top: 0});
      TweenMax.to($('.searchSection'), menuAppearSpeed, {'margin-top': minMenu.height()});
    }, 400);
  }});
  $('html, body').animate({scrollTop: 0}, scrollSpeed);
}

sndNumber = function() {
  return (Math.random()*2-1)+(Math.random()*2-1)+(Math.random()*2-1);
}
gaussianNumber = function(mean, stdev) {
  return sndNumber()*stdev+mean;
}
formatDistance = function(nbr){
  return nbr+"px";
}