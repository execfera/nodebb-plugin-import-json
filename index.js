const async = require('async');
const noop = function(){};

(function(Exporter) {

  Exporter.setup = function(_, callback) {
    Exporter.log('setup');

    Exporter.posts = require('./input/postData.json');
    Exporter.categories = require('./input/categoryData.json');
    Exporter.threads = require('./input/threadData.json');
    Exporter.users = require('./input/memberData.json');

    callback(null, Exporter.config());
  };

  Exporter.getUsers = function(callback) {
    return Exporter.getPaginatedUsers(0, -1, callback);
  };
  Exporter.getPaginatedUsers = function(start, limit, callback) {
    callback = !Exporter.isFunction(callback) ? noop : callback;

    const map = Exporter.users
      .slice(start, start + limit)
      .reduce((obj, val) => {
        obj[val._uid] = val;
        return obj;
      }, {});
    callback(null, map);
  };

  Exporter.getCategories = function(callback) {
    return Exporter.getPaginatedCategories(0, -1, callback);  
  };
  Exporter.getPaginatedCategories = function(start, limit, callback) {
    callback = !Exporter.isFunction(callback) ? noop : callback;

    const map = Exporter.categories
      .slice(start, start + limit)
      .reduce((obj, val) => {
        obj[val._cid] = val;
        return obj;
      }, {});
      callback(null, map);
  };

  Exporter.getTopics = function(callback) {
    return Exporter.getPaginatedTopics(0, -1, callback);
  };
  Exporter.getPaginatedTopics = function(start, limit, callback) {
    callback = !Exporter.isFunction(callback) ? noop : callback;

    const map = Exporter.threads
      .slice(start, start + limit)
      .reduce((obj, val) => {
        obj[val._tid] = val;
        return obj;
      }, {});
      callback(null, map);
  };

  Exporter.getPosts = function(callback) {
    return Exporter.getPaginatedPosts(0, -1, callback);
  };
  Exporter.getPaginatedPosts = function(start, limit, callback) {
    callback = !Exporter.isFunction(callback) ? noop : callback;

    const map = Exporter.posts
      .slice(start, start + limit)
      .reduce((obj, val) => {
        obj[val._pid] = val;
        return obj;
      }, {});
      callback(null, map);
  };

  Exporter.teardown = function(callback) {
    callback();
  };

  Exporter.testrun = function(config, callback) {
    async.series([
      function(next) {
        Exporter.setup(config, next);
      },
      function(next) {
        Exporter.getUsers(next);
      },
      function(next) {
        Exporter.getCategories(next);
      },
      function(next) {
        Exporter.getTopics(next);
      },
      function(next) {
        Exporter.getPosts(next);
      },
      function(next) {
        Exporter.teardown(next);
      }
    ], callback);
  };
  
  Exporter.paginatedTestrun = function(config, callback) {
    async.series([
      function(next) {
        Exporter.setup(config, next);
      },
      function(next) {
        Exporter.getPaginatedUsers(0, 1000, next);
      },
      function(next) {
        Exporter.getPaginatedCategories(0, 1000, next);
      },
      function(next) {
        Exporter.getPaginatedTopics(0, 1000, next);
      },
      function(next) {
        Exporter.getPaginatedPosts(1001, 2000, next);
      },
      function(next) {
        Exporter.teardown(next);
      }
    ], callback);
  };

  Exporter.config = function(config, val) {
    if (config != null) {
      if (typeof config === 'object') {
        Exporter._config = config;
      } else if (typeof config === 'string') {
        if (val != null) {
          Exporter._config = Exporter._config || {};
          Exporter._config[config] = val;
        }
        return Exporter._config[config];
      }
    }
    return Exporter._config;
  };

  Exports.isFunction = function(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
  }

})(module.exports);