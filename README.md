# Kanclone
A clone of kanban board-esque web applications, designed to introduce the
Meteor javascript framework. There are branches for each phase of the project and
each phase introduces or discusses a new concept in Meteor.

This project currently targets Meteor version 1.2, and each "phase" listed corresponds to a git branch.

To run the project you will need Meteor installed. Instructions for Windows/Linux/OSX are available on
[the official Meteor website](https://www.meteor.com/install). Once you've installed Meteor and have a copy of this
repository, navigate to the project root in a console/terminal and simply type

```bash
meteor
```

You will see output as Meteor "links" source files and installs dependencies. The first time you run the project it may take a while to start up, but subsequent launches will be quicker. Once you see

```bash
=> App running at: http://localhost:[ANY_PORT]/
```
you will be able to visit the application in your browser. Happy coding!

## Phase 0
Getting familiar with the project layout

## Phase 1
Setting a goal for the project

## Phase 2
Bringing in bootstrap and getting our layout

We're using the meteor module for bootstrap, which adds all of bootstrap's
'stuff' to the head section for us. It also allows for recompiling the css
by setting up a custom .less file if we wanted.

On the command line, in the project directory root:

```bash
meteor add twbs:bootstrap
```

## Phase 3
Start using templates

## Phase 4
How about *more* templates? We also introduce the use of #each to render something
for each item in an array-like variable

## Phase 5
Databases and "reactivity"

```bash
meteor remove insecure
meteor add reactive-var
meteor add check
```

## Phase 6
Drag and drop functionality via HTML5 drag and drop protocol

## Phase 7
Removing the autopublish package and creating publications and subscriptions

```bash
meteor remove autopublish
```
