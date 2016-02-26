# Kanclone
A clone of kanban board-esque web applications, designed to introduce the
Meteor javascript framework. There are branches for each phase of the project and
each phase introduces or discusses a new concept in Meteor.

This project currently targets Meteor version 1.2, and each "phase" listed corresponds to a git branch.

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
