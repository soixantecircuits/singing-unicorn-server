Template.song.events({
    'click li': function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined'){
        console.log("You pressed the button");
        console.log($(this).data('link'));
      }
    }
  });