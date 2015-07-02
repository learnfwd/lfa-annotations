var uuid = require('node-uuid');
var App = require('lfa-core').App;
var Storage = require('lfa-core').Storage;

var chapter = null;
App.book.on('render', function (_chapter) {
  chapter = _chapter.chapter;
});

module.exports = function () {
  return {
    annotations: {},

    create: function (annotation) {
      if (typeof annotation.id === 'undefined' ||
        annotation.id === null) {
        annotation.id = uuid.v4();
      }
      if (typeof annotation.chapter === 'undefined' ||
        annotation.chapter === null) {
        annotation.chapter = chapter;
      }
      var annotations = this.query(annotation.chapter).meta;
      annotations[annotation.id] = annotation;
      this.save(annotations, annotation.chapter);
      return annotation;
    },

    update: function (annotation) {
      var annotations = this.query(annotation.chapter).meta;
      annotations[annotation.id] = annotation;
      this.save(annotations, annotation.chapter);
      return annotation;
    },

    'delete': function (annotation) {
      var annotations = this.query(annotation.chapter).meta;
      delete annotations[annotation.id];
      this.save(annotations, annotation.chapter);
      return annotation;
    },

    save: function (annotations, ch) {
      if (_.isEmpty(annotations)) {
        Storage.removeItem('annotations:' + ch);
      } else {
        Storage.setItem('annotations:' + ch, JSON.stringify(annotations));
      }
    },

    query: function (ch) {
      var data = {};
      try {
        data = JSON.parse(Storage.getItem('annotations:' + ch));
      } catch (ex) {}

      data = data || {};

      var r = { results: [], meta: data };
      _.each(data, function(value) {
        r.results.push(value);
      });
      return r;
    },

    configure: function (registry) {
        registry.registerUtility(this, 'storage');
    }
  };
};
