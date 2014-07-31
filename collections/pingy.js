Pingy = new Meteor.Collection("pingy");

if (Meteor.isServer) {
  Meteor.startup(function() {
    if (!Pingy.find().count()) {
      // fill BigCollection
    }
  });

  Meteor.methods({
    helloSomeone: function(online) {
      var userType = online ? 'listener' : 'emitter';
      console.log('hello '+userType);
      Pingy.insert({
        dateAdded: new Date()
      }, function(err, docs){
        if(err)
          console.log(err)
        else{
          console.log('Inserted');
          console.log(docs);
        }
      });
      return 'Welcome '+userType+', will sing in Soixante circuits';
    }
  });
} else {

}