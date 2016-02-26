/**
 * kanclone.js
 *
 * This code runs exclusively on the client. You could place client and server
 * code in different files, in any arrangement of your choosing. In this case
 * nearly all the code will stay in this file for the sake of brevity
 */

 if (Meteor.isClient) {
  // We've updated our taskGroup helper to do a database query based on its
  // groupName
  Template.taskGroup.helpers({
    'tasks' : function() {
      var instanceVars = Template.instance().data;
      return Tasks.find({
        'groupName' : instanceVars.groupName
      });
    }
  });

  // The onCreated function is called by a template when it's created in
  // browser memory. Don't confuse this with the onRendered function which is
  // called after the template enters the page's DOM
  Template.taskGroup.onCreated(function() {
    // Reactive variables are a special idea in meteor. Any function that includes
    // a reactive variable will re-run any time the value of the variable
    // changes. We attach one to this template instance, which is referenced
    // by 'this' when inside the onCreated function. We set it to false so the
    // add task form will start out hidden
    this.showAddForm = new ReactiveVar(false);
  });

  // Events can be form submissions, clicks, changes, etc. A full list is
  // available on the meteor docs
  Template.taskGroup.events({
    // Clicking the add button will set showAddForm to true, and anyone watching
    // showAddForm will be notified of the value change
    'click [name="addBtn"]' : function(e, tpl) {
      tpl.showAddForm.set(true);
    },
    // Clicking cancel will set showAddForm to false
    'click [name="cancelBtn"]' : function(e, tpl) {
      tpl.showAddForm.set(false);
    },
    // Submitting the new task form. Note that the event and the template instance
    // are passed into event functions by meteor
    'submit [name="newTask"]' : function(e, tpl) {
      // prevent the browser from doing a regular POST request with the form data
      e.preventDefault();
      // Create a task object based off of the form fields
      var task = {
        'content' : e.target.content.value,
        'color' : e.target.color.value,
        'groupName' : tpl.data.groupName // Pull in template instance data
      };
      // Call a server side function, since we've removed the insecure package
      Meteor.call("addTask", task);
      // Reset the form and hide it
      e.target.content.value = '';
      e.target.color.value = '#C3DCFE';
      tpl.showAddForm.set(false);
    }
  });

  // Provide the value of our showAddForm variable to the template. Remember
  // that, because we're using a reactive variable, any time showAddForm
  // changes all the watchers will be notified, including the parts of the
  // template that rely on this variable
  Template.taskGroup.helpers({
    'showAddForm' : function() {
      // Because we attached showAddForm in the onCreated function for each
      // taskGroup template, each instance has a copy
      return Template.instance().showAddForm.get();
    }
  });
  // Tasks have a single button for removing themselves
  Template.task.events({
    'click [name="deleteBtn"]' : function(e, tpl) {
      // Server side function for removing a task, given the task's id.
      // Since 'this' is an instance of a task, it has a mongodb _id field
      Meteor.call("removeTask", this._id);
    }
  });
}

/**
 * This code runs only on the server side. Again, this could be in another
 * file entirely.
 */
if (Meteor.isServer) {
  // Items in the startup function run only once on startup. We add in some
  // database items if there are none.
  Meteor.startup(function () {
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
    }
  });
}
