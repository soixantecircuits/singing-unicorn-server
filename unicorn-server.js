if (Meteor.isServer) {
  Meteor.startup(function() {
    // code to run on server at startup
  });
  Meteor.methods({
    'print': function(string){
        console.log(string);
    }
  })
}