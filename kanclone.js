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
  // For info on the Session object, see http://docs.meteor.com/#/full/session
  // Here we're setting a key value pair, where key = 'counter' and value = 0
  // Using setDefault prevents resetting the variable when a new version of the
  // app is loaded (during a "hot code push" after saving for example)
  Session.setDefault('counter', 0);

  // For the hello template (see kanclone.html), define a variable called
  // 'counter', whose value watches the value of session
  Template.hello.helpers({
    counter: function () {
      return Session.get('counter');
    }
  });
  // Watch for click events on the button within the hello template
  Template.hello.events({
    'click button': function () {
      // increment the counter when button is clicked
      Session.set('counter', Session.get('counter') + 1);
    }
  });
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
