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

  // The onRendered function is called when a template is actually added to
  // the DOM and rendered. We're guaranteed that it's DOM children are
  // present by the time this function is called, so we use it to do our
  // function binding
  Template.taskGroup.onRendered(function() {
    // jquery style item lookup. jquery returns arrays, so we just return the
    // first item
    var taskCol = this.$('.task-col')[0];
    // Keep a reference to 'this', since it is the template instance and we
    // need it's instance variables within other functions (whic have different
    // values for 'this')
    var self = this;
    // Implement the 'droppable' interface for HTML5 drag and drop
    // https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
    taskCol.ondrop = function(ev) {
      // Some browsers check the drop item for data and act accordingly, so
      // we prevent any behavior we don't control after a drop
      ev.preventDefault();
      // When a drop event occurs, grab the task id from it's stored data and
      // this template instance's group name and pass it to the server side
      // moveTask function to reassign the task
      Meteor.call("moveTask", ev.dataTransfer.getData("task_id"), self.data.groupName);
    }
    // We need to implement these functions to implement the interface, but we
    // currently don't use them for anything. preventDefault is a safe way to make
    // sure that these events won't do something unexpected
    taskCol.ondragenter = function(ev) {
      ev.preventDefault();
    }
    taskCol.ondragover = function(ev) {
      ev.preventDefault();
    }
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
      // Reset the form and hide it, leaving the user's last color intact
      e.target.content.value = '';
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

  // Defines onRendered behavior for each task. To do drag and drop, we need
  // to implement the HTML5 draggable interface
  Template.task.onRendered(function() {
    // jquery element lookup, keep first result
    var taskbox = this.$(".task")[0];
    // keep a reference to the template instance and its instance variables
    var self = this;
    taskbox.ondragstart = function(ev) {
      // See HTML5 drag and drop docs
      ev.dataTransfer.dropEffect = "move";
      // Set what data is released on a drop event. We store this template
      // instance's mongodb id
      ev.dataTransfer.setData("task_id", self.data._id);
    }
  })
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
}
