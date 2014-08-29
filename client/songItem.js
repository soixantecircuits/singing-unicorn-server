Template.songItem.totalCount = 0;

Template.songItem.helpers({
  isPlaying: function(state) {
    return state ? 'isPlaying' : 'notPlaying'
  },
  formattedDuration: function(data) {
    var duration = data;
    var durationFormated = "";

    if (Math.floor(duration / 3600) > 0) {
      if (Math.floor(duration / 3600) < 10) {
        durationFormated += "0";
      }
      durationFormated += Math.floor(duration / 3600) + ":";
      duration -= Math.floor(duration / 3600) * 3600;
    }
    if (Math.floor(duration / 60) > 0) {
      if (Math.floor(duration / 60) < 10) {
        durationFormated += "0";
      }
      durationFormated += Math.floor(duration / 60) + ":";
      duration -= Math.floor(duration / 60) * 60;
    } else {
      durationFormated += "00:";
    }
    if (duration > 0) {
      if (duration < 10) {
        durationFormated += "0";
      }
      durationFormated += duration;
    } else {
      durationFormated += "00";
    }
    return durationFormated;
  }
});

Template.songItem.rendered = function() {
  Template.songItem.totalCount++;
  if (Meteor.songList.length == Template.songItem.totalCount) {
    /*var win = $(window);
    var allMods = $(".songItem");
    // Already visible modules
    allMods.each(function(i, el) {
      var el = $(el);
      if (el.visible(true)) {
        el.addClass("already-visible");
      }
    });
    win.scroll(function(event) {
      allMods.each(function(i, el) {
        var el = $(el);
        if (el.visible(true)) {
          el.addClass("come-in");
        }
      });
    });*/
    console.log("finished: "+Template.songItem.totalCount);
  }
}