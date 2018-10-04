const async = require('async');
const fs = require('fs');
const noop = function(){};
const logPrefix = '[nodebb-plugin-import-json]';

(function(Exporter) {

  Exporter.setup = function(config, callback) {
    Exporter.log('setup');

    Exporter.posts = fs.readFileSync('./input/postData.json', 'utf8');
    Exporter.categories = fs.readFileSync('./input/categoryData.json', 'utf8');
    Exporter.threads = fs.readFileSync('./input/threadData.json', 'utf8');
    Exporter.users = fs.readFileSync('./input/memberData.json', 'utf8');

    callback(null, Exporter.config());
  };

  Exporter.getUsers = function(callback) {
    return Exporter.getPaginatedUsers(0, -1, callback);
  };
  Exporter.getPaginatedUsers = function(start, limit, callback) {
    callback = !_.isFunction(callback) ? noop : callback;

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
    callback = !_.isFunction(callback) ? noop : callback;

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
    callback = !_.isFunction(callback) ? noop : callback;

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
    callback = !_.isFunction(callback) ? noop : callback;

    const map = Exporter.posts
      .slice(start, start + limit)
      .reduce((obj, val) => {
        obj[val._pid] = val;
        return obj;
      }, {});
      callback(null, map);
  };

  Exporter.teardown = function(callback) {
    Exporter.log('teardown');

    Exporter.log('Done');
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

  Exporter.warn = function() {
    const args = _.toArray(arguments);
    args.unshift(logPrefix);
    console.warn.apply(console, args);
  };

  Exporter.log = function() {
    const args = _.toArray(arguments);
    args.unshift(logPrefix);
    console.log.apply(console, args);
  };

  Exporter.error = function() {
    const args = _.toArray(arguments);
    args.unshift(logPrefix);
    console.error.apply(console, args);
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

  // from Angular https://github.com/angular/angular.js/blob/master/src/ng/directive/input.js#L11
  Exporter.validateUrl = function(url) {
    const pattern = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;
    return url && url.length < 2083 && url.match(pattern) ? url : '';
  };

  Exporter.truncateStr = function(str, len) {
    if (typeof str != 'string') return str;
    len = _.isNumber(len) && len > 3 ? len : 20;
    return str.length <= len ? str : str.substr(0, len - 3) + '...';
  };

  Exporter.whichIsFalsy = function(arr) {
    for (const i = 0; i < arr.length; i++) {
      if (!arr[i])
        return i;
    }
    return null;
  };

})(module.exports);