if (Meteor.isClient) {

  var tasklist = {
    '1' : [{content : "You are procrastinating by not doing this", color : "DBFEC2"} ],
    '2' : [{content : "You really need to do this this", color : "FFCBD5"},
           {content : "You really need to do this also", color : "FFCBD5"}
          ],
    '3' : [{content : "You did this. I'm proud of you", color : "C3DCFE"}]
  };

  Template.taskGroup.helpers({
    'tasks' : function() {
      console.log(Template.instance());
      return tasklist[Template.instance().data.id]
    }
  })
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
