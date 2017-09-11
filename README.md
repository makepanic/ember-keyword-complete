# Ember-keyword-complete

[![npm version](https://badge.fury.io/js/ember-keyword-complete.svg)](https://badge.fury.io/js/ember-keyword-complete) 
[![Build Status](https://travis-ci.org/makepanic/ember-keyword-complete.svg?branch=master)](https://travis-ci.org/makepanic/ember-keyword-complete)
[![Ember Observer Score](http://emberobserver.com/badges/ember-keyword-complete.svg)](http://emberobserver.com/addons/ember-keyword-complete)

> An easy way to add keyword autocompletion to existing input/textarea elements

[ember-keyword-complete demo + docs](http://makepanic.github.io/ember-keyword-complete/#/)

## Usage

Installing this addon is as easy as:

```
ember install ember-keyword-complete
```

In order to break control whether the component breaks on spaces simply set the `breakOnSpaces` property to false.
Great for Facebook tags.

```
{{#keyword-complete dataSources=ds breakOnSpaces=false}}
```


This README outlines the details of collaborating on this Ember addon.

## Installation

* `git clone <repository-url>` this repository
* `cd ember-keyword-complete`
* `npm install`
* `bower install`

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
