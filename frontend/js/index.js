var annotator = require('annotator');
var App = require('lfa-core/app');
var $ = require('jquery');
var _ = require('lodash');
var annotatorStore = require('./annotator-store');

var annotatorApp = null;

function initAnnotations(chapter) {
  if (annotatorApp) { deinitAnnotations(); }
  annotatorApp = new annotator.App();
  annotatorApp.include(annotator.ui.main, {
    element: $('#textbook')[0]
  });
  annotatorApp.include(annotatorStore);
  annotatorApp.start().then(function () {
    annotatorApp.annotations.load(chapter.chapter);
  });
}

function deinitAnnotations() {
  if (annotatorApp) {
    annotatorApp.destroy();
    annotatorApp = null;
  }
}

App.book.on('render', initAnnotations);
App.book.on('destroy-chapter', deinitAnnotations);
