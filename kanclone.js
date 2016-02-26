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
  // No logic for the client right now
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
