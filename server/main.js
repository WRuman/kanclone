/**
 * server/main.js
 *
 * Includes server side logic for kanclone, a clone of various
 * kanban board-esque web applications using the meteor framework
*/

// Items in the startup function run only once on startup. We add in some
// database items if there are none.
Meteor.startup(function () {
    Tasks = new Mongo.Collection("tasks");
    
    if(Tasks.find().count() < 1) {
      Tasks.insert({content : "You are procrastinating by not doing this", color : "#DBFEC2", groupName : "To-Do"});
      Tasks.insert({content : "You really need to do this this", color : "#FFCBD5", groupName : "In Progress"});
      Tasks.insert({content : "You really need to do this this also", color : "#FFCBD5", groupName : "In Progress"});
      Tasks.insert({content : "You did this. I'm proud of you", color : "#C3DCFE", groupName : "Done"});
    }
});

// Define server side methods for actually manipulating the database
Meteor.methods({
    "addTask" : function(task) {
        // 'check' does a type check for security. However, a GOOD implementation
        // would do additional checks on each field of the task.
        // We don't worry about SQL injections, but we do need to worry about
        // XSS attacks when the data is re-rendered for other users
        check(task, Object);
        // See collections.js where Tasks is defined. Regular mongodb insert otherwise
        Tasks.insert(task);
    },
    "removeTask" : function(task_id) {
      // Task id's should be strings
      check(task_id, String);
      // Regular mongo remove command, using task_id as a query parameter
      Tasks.remove({
        _id : task_id
      });
    },
    // To move a task between groups, we simply change it's group name.
    // Any view that shows tasks by group name will update automatically
    "moveTask" : function(task_id, groupName) {
      // Two string arguments
      check(task_id, String);
      check(groupName, String);
      // Update query finds by id, then re-sets group name to the new group name
      Tasks.update({
        _id : task_id
      }, {
        $set : {
          'groupName' : groupName
        }
      });
    }
});

// Publications allow you to control what parts of the database the client can
// see. The find query here can take any argument a regular mongo query would
// take. In this case it just returns all tasks in the task collection

// For example, if you wanted to only show users tasks their team had posted,
// you would publish tasks with the appropriate 'team_id'.

// Also, if the data set is large and you don't want it all to go to the
// client, publish functions can take arguments (like 'count') that you can
// use to apply limits or specificity to the publish query

// When using the meteor accounts package, you can get the id of the requesting
// user with Meteor.userId, in case you want to do authorization work

Meteor.publish('Tasks', function() {
    return Tasks.find({});
});