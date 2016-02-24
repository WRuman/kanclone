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
    }
  });
}
