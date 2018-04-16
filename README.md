ember-keyword-complete
==============================================================================

[![npm version](https://badge.fury.io/js/ember-keyword-complete.svg)](https://badge.fury.io/js/ember-keyword-complete) 
[![Build Status](https://travis-ci.org/makepanic/ember-keyword-complete.svg?branch=master)](https://travis-ci.org/makepanic/ember-keyword-complete)
[![Ember Observer Score](http://emberobserver.com/badges/ember-keyword-complete.svg)](http://emberobserver.com/addons/ember-keyword-complete)

An easy way to add keyword autocompletion to existing input/textarea elements

[ember-keyword-complete demo + docs](https://makepanic.github.io/ember-keyword-complete/master/)

Installation
------------------------------------------------------------------------------

```
ember install ember-keyword-complete
```


Usage
------------------------------------------------------------------------------

In order to break control whether the component breaks on spaces simply set the `breakOnSpaces` property to false.
Great for Facebook tags.

```
{{#keyword-complete dataSources=ds breakOnSpaces=false}}
```

Contributing
------------------------------------------------------------------------------

### Installation

* `git clone <repository-url>`
* `cd ember-keyword-complete`
* `yarn`

### Linting

* `yarn lint:js`
* `yarn lint:js -- --fix`

### Running tests

* `ember test` – Runs the test suite on the current Ember version
* `ember test --server` – Runs the test suite in "watch mode"
* `ember try:each` – Runs the test suite against multiple Ember versions

### Running the dummy application

* `ember serve`
* Visit the dummy application at [http://localhost:4200](http://localhost:4200).

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

License
------------------------------------------------------------------------------

This project is licensed under the [MIT License](LICENSE.md).
