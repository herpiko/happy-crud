'use strict';
const pluralize = require('pluralize');

class CrudApi {

constructor(server, controller, options) {
  this.server = server;
  this.options = options;
  this.attributes = require('../package.json');
  this.register = function() {};

  let prefix = {};
  if (options.mount) {
    prefix = {
      prefix: options.mount
    }
  }
  server.register({
    register: this
  }, {
    select: ['api'],
    routes: prefix
  })
  this.controller = controller;
  this.install(options);
}

install(options) {
  const self = this;
  //
  // options:
  /*

     options: {
      path: '/api',
      word: 'word' || ['word', 'words'],
      authentications: {
        'create': <name>,
        'read': <name>,
        'update': <name>,
        'delete': <name>,
        'list': <name>,
      }
     }

   */

  if (!options.word) {
    throw Error('options.word is not defined');
  }
  if (!options.path) {
    throw Error('options.path is not defined');
  }

  // Validate and safety checks of options
  // # pluralize
  // If options.word is a single word, make the plural version of it
  if (typeof options.word === 'string') {
    options.word = [ options.word, pluralize(options.word)];
  }

  // # authentications
  if (!options.authentications) {
    options.authentications = {};
  }

  self.installCreate(options);
  self.installRead(options);
  self.installUpdate(options);
  /*
  installDelete(options);
  installList(options);
  */
}

installCreate(options) {
  const self = this;
  var config =
  {
    method: 'POST',
    path: `${options.path}/${options.word[1]}`,
    handler: function handleCreate(request, reply) {
      return self.controller.create(request, reply);
    },
    config: {
      auth: options.authentications.create || null,
    }
  };
  if (self.controller.validation().create) {
    config.config.validate = config.config.validate || {};
    config.config.validate.payload = self.controller.validation().create;
  }
  self.server.route(config);
}

installRead(options) {
  const self = this;
  var config =
  {
    method: 'GET',
    path: `${options.path}/${options.word[0]}/{key}`,
    handler: function handleRead(request, reply) {
      return self.controller.read(request, reply);
    },
    config: {
      auth: options.authentications.read || null,
    }
  };
  if (self.controller.validation().read) {
    config.config.validate = config.config.validate || {};
    config.config.validate.params = self.controller.validation().read;
  }
  self.server.route(config);
}

installUpdate(options) {
  const self = this;
  var config =
  {
    method: 'PUT',
    path: `${options.path}/${options.word[0]}/{key}`,
    handler: function handleUpdate(request, reply) {
      return self.controller.update(request, reply);
    },
    config: {
      auth: options.authentications.update|| null,
    }
  };
  if (self.controller.validation().update) {
    config.config.validate = config.config.validate || {};
    config.config.validate.params = self.controller.validation().update;
  }
  self.server.route(config);
}





} // Class


module.exports = CrudApi;


