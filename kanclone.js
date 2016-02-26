/**
 * kanclone.js
 * Includes both server and client side logic for kanclone, a clone of various
 * kanban board-esque web applications using the meteor framework
*/

if (Meteor.isClient) {

  Template.taskGroup.helpers({
    'tasks' : function() {
      return Tasks.find({
        'groupName' : Template.instance().data.groupName
      });
    }
  });

  Template.taskGroup.onCreated(function() {
    var self = this;
    self.showAddForm = new ReactiveVar(false);
  });

  Template.taskGroup.onRendered(function() {
    var taskCol = this.find('.tasks');
    var self = this;
    console.log(taskCol);
    taskCol.ondrop = function(ev) {
      ev.preventDefault();
      Meteor.call("moveTask", ev.dataTransfer.getData("text/plain"), self.data.groupName);
    }
    taskCol.ondragenter = function(ev) {
      ev.preventDefault();
      taskCol.style.margin = "1px solid blue";
    }
    taskCol.ondragover = function(ev) {
      ev.preventDefault();
      taskCol.style.margin = "1px solid blue";
    }
  })

  Template.taskGroup.events({
    'click [name="addBtn"]' : function(e, tpl) {
      tpl.showAddForm.set(true);
    },
    'click [name="cancelBtn"]' : function(e, tpl) {
      tpl.showAddForm.set(false);
    },
    'submit [name="newTask"]' : function(e, tpl) {
      e.preventDefault();
      var task = {
        'content' : e.target.content.value,
        'color' : e.target.color.value,
        'groupName' : tpl.data.groupName
      };
      Meteor.call("addTask", task);
      e.target.content.value = '';
      e.target.color.value = '#C3DCFE';
      tpl.showAddForm.set(false);
    }
  });

  Template.taskGroup.helpers({
    'showAddForm' : function() {
      return Template.instance().showAddForm.get();
    }
  });

  Template.task.events({
    'click [name="deleteBtn"]' : function(e, tpl) {
      Meteor.call("removeTask", this._id);
    }
  });

  Template.task.onRendered(function() {
    var taskbox = this.find(".task");
    var self = this;
    taskbox.ondragstart = function(ev) {
      console.log('drag started');
      ev.dataTransfer.dropEffect = "move";
      ev.dataTransfer.setData("text/plain", self.data._id);
    }
  })
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    if(Tasks.find().count() < 1) {
      Tasks.insert({content : "You are procrastinating by not doing this", color : "#DBFEC2", groupName : "To-Do"});
      Tasks.insert({content : "You really need to do this this", color : "#FFCBD5", groupName : "In Progress"});
      Tasks.insert({content : "You really need to do this this also", color : "#FFCBD5", groupName : "In Progress"});
      Tasks.insert({content : "You did this. I'm proud of you", color : "#C3DCFE", groupName : "Done"});
    }
  });

  Meteor.methods({
    "addTask" : function(task) {
        check(task, Object);
        Tasks.insert(task);
    },
    "removeTask" : function(task_id) {
      check(task_id, String);
      Tasks.remove({
        _id : task_id
      });
    },
    "moveTask" : function(task_id, groupName) {
      check(task_id, String);
      check(groupName, String);
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
