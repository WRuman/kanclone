/**
 * kanclone.js
 * Includes both server and client side logic for kanclone, a clone of various
 * kanban board-esque web applications using the meteor framework
 */

/**
 * This code runs exclusively on the client. You could place client and server
 * code in different files, in any arrangement of your choosing. In this case
 * nearly all the code will stay in this file for the sake of brevity
 */
if (Meteor.isClient) {
  // This will be a stand-in before we add a database component. You can do
  // 'lookups' using the groupname as a key to return a task array
  var tasklist = {
    'To-Do' : [{content : "You are procrastinating by not doing this", color : "DBFEC2"} ],
    'In Progress' : [{content : "You really need to do this this", color : "FFCBD5"},
           {content : "You really need to do this also", color : "FFCBD5"}
          ],
    'Done' : [{content : "You did this. I'm proud of you", color : "C3DCFE"}]
  };

  // Define variables each taskGroup template can use. Here we provide a task
  // list by doing a 'lookup' in our fake task databse using the groupname
  Template.taskGroup.helpers({
    'tasks' : function() {
      // Within a 'helper' function, we can reference the actual template instance
      // (and its instance variables) with Template.instance(). The instance
      // variables live in the 'data' attribute, and we want to do the lookup
      // based on groupName. The returned item is an array of tasks
      var instanceVars = Template.instance().data;
      return tasklist[instanceVars.groupName]
    }
  })
}

/**
 * This code runs only on the server side. Again, this could be in another
 * file entirely.
 */
if (Meteor.isServer) {
  // Items in the startup function run only once on startup. We have nothing for
  // the server to do at this point
  Meteor.startup(function () {
    // No tasks yet
  });
}
