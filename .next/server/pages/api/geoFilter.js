module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = require('../../ssr-module-cache.js');
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./pages/api/geoFilter.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./pages/api/geoFilter.js":
/*!********************************!*\
  !*** ./pages/api/geoFilter.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return handler; });\nconst path = __webpack_require__(/*! path */ \"path\");\n\nconst dirPath = path.join(process.cwd(), '/twitterAPI');\n\nconst twitterAPI = __webpack_require__(/*! ../../twitterAPI/geoStream.js */ \"./twitterAPI/geoStream.js\");\n\nfunction handler(req, res) {\n  return new Promise(resolve => {\n    switch (req.method) {\n      case 'POST':\n        {\n          const parameters = {\n            track: req.body.track ? req.body.track : '',\n            follow: req.body.follow ? req.body.follow : '',\n            locations: req.body.coordinates ? req.body.coordinates : ''\n          };\n          const type = req.body.type;\n          const coordinates = req.body.coordinates;\n          console.log('starting stream on ', coordinates);\n          const streamID = twitterAPI.startStream(type, parameters);\n          res.setHeader('Content-Type', 'text/plain');\n          res.send(streamID);\n          return resolve();\n        }\n\n      case 'DELETE':\n        {\n          const streamID = req.body.id; //should be body\n\n          console.log(streamID);\n          const {\n            dataJson,\n            error\n          } = twitterAPI.closeStream(streamID);\n          res.json(dataJson);\n          return resolve();\n        }\n\n      default:\n        res.end();\n    }\n  });\n}//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9wYWdlcy9hcGkvZ2VvRmlsdGVyLmpzP2YxMWYiXSwibmFtZXMiOlsicGF0aCIsInJlcXVpcmUiLCJkaXJQYXRoIiwiam9pbiIsInByb2Nlc3MiLCJjd2QiLCJ0d2l0dGVyQVBJIiwiaGFuZGxlciIsInJlcSIsInJlcyIsIlByb21pc2UiLCJyZXNvbHZlIiwibWV0aG9kIiwicGFyYW1ldGVycyIsInRyYWNrIiwiYm9keSIsImZvbGxvdyIsImxvY2F0aW9ucyIsImNvb3JkaW5hdGVzIiwidHlwZSIsImNvbnNvbGUiLCJsb2ciLCJzdHJlYW1JRCIsInN0YXJ0U3RyZWFtIiwic2V0SGVhZGVyIiwic2VuZCIsImlkIiwiZGF0YUpzb24iLCJlcnJvciIsImNsb3NlU3RyZWFtIiwianNvbiIsImVuZCJdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQTtBQUFBLE1BQU1BLElBQUksR0FBR0MsbUJBQU8sQ0FBQyxrQkFBRCxDQUFwQjs7QUFDQSxNQUFNQyxPQUFPLEdBQUdGLElBQUksQ0FBQ0csSUFBTCxDQUFVQyxPQUFPLENBQUNDLEdBQVIsRUFBVixFQUF5QixhQUF6QixDQUFoQjs7QUFDQSxNQUFNQyxVQUFVLEdBQUdMLG1CQUFPLENBQUMsZ0VBQUQsQ0FBMUI7O0FBRWUsU0FBU00sT0FBVCxDQUFpQkMsR0FBakIsRUFBc0JDLEdBQXRCLEVBQTJCO0FBQ3hDLFNBQU8sSUFBSUMsT0FBSixDQUFhQyxPQUFELElBQWE7QUFDOUIsWUFBUUgsR0FBRyxDQUFDSSxNQUFaO0FBQ0UsV0FBSyxNQUFMO0FBQWE7QUFDWCxnQkFBTUMsVUFBVSxHQUFHO0FBQ2pCQyxpQkFBSyxFQUFFTixHQUFHLENBQUNPLElBQUosQ0FBU0QsS0FBVCxHQUFpQk4sR0FBRyxDQUFDTyxJQUFKLENBQVNELEtBQTFCLEdBQWtDLEVBRHhCO0FBRWpCRSxrQkFBTSxFQUFFUixHQUFHLENBQUNPLElBQUosQ0FBU0MsTUFBVCxHQUFrQlIsR0FBRyxDQUFDTyxJQUFKLENBQVNDLE1BQTNCLEdBQW9DLEVBRjNCO0FBR2pCQyxxQkFBUyxFQUFFVCxHQUFHLENBQUNPLElBQUosQ0FBU0csV0FBVCxHQUF1QlYsR0FBRyxDQUFDTyxJQUFKLENBQVNHLFdBQWhDLEdBQThDO0FBSHhDLFdBQW5CO0FBS0EsZ0JBQU1DLElBQUksR0FBR1gsR0FBRyxDQUFDTyxJQUFKLENBQVNJLElBQXRCO0FBQ0EsZ0JBQU1ELFdBQVcsR0FBR1YsR0FBRyxDQUFDTyxJQUFKLENBQVNHLFdBQTdCO0FBQ0FFLGlCQUFPLENBQUNDLEdBQVIsQ0FBWSxxQkFBWixFQUFtQ0gsV0FBbkM7QUFDQSxnQkFBTUksUUFBUSxHQUFHaEIsVUFBVSxDQUFDaUIsV0FBWCxDQUF1QkosSUFBdkIsRUFBNkJOLFVBQTdCLENBQWpCO0FBQ0FKLGFBQUcsQ0FBQ2UsU0FBSixDQUFjLGNBQWQsRUFBOEIsWUFBOUI7QUFDQWYsYUFBRyxDQUFDZ0IsSUFBSixDQUFTSCxRQUFUO0FBQ0EsaUJBQU9YLE9BQU8sRUFBZDtBQUNEOztBQUNELFdBQUssUUFBTDtBQUFlO0FBQ2IsZ0JBQU1XLFFBQVEsR0FBR2QsR0FBRyxDQUFDTyxJQUFKLENBQVNXLEVBQTFCLENBRGEsQ0FDaUI7O0FBQzlCTixpQkFBTyxDQUFDQyxHQUFSLENBQVlDLFFBQVo7QUFDQSxnQkFBTTtBQUFFSyxvQkFBRjtBQUFZQztBQUFaLGNBQXNCdEIsVUFBVSxDQUFDdUIsV0FBWCxDQUF1QlAsUUFBdkIsQ0FBNUI7QUFDQWIsYUFBRyxDQUFDcUIsSUFBSixDQUFTSCxRQUFUO0FBQ0EsaUJBQU9oQixPQUFPLEVBQWQ7QUFDRDs7QUFDRDtBQUNFRixXQUFHLENBQUNzQixHQUFKO0FBdkJKO0FBeUJELEdBMUJNLENBQVA7QUEyQkQiLCJmaWxlIjoiLi9wYWdlcy9hcGkvZ2VvRmlsdGVyLmpzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbmNvbnN0IGRpclBhdGggPSBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJy90d2l0dGVyQVBJJyk7XG5jb25zdCB0d2l0dGVyQVBJID0gcmVxdWlyZSgnLi4vLi4vdHdpdHRlckFQSS9nZW9TdHJlYW0uanMnKTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaGFuZGxlcihyZXEsIHJlcykge1xuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcbiAgICBzd2l0Y2ggKHJlcS5tZXRob2QpIHtcbiAgICAgIGNhc2UgJ1BPU1QnOiB7XG4gICAgICAgIGNvbnN0IHBhcmFtZXRlcnMgPSB7XG4gICAgICAgICAgdHJhY2s6IHJlcS5ib2R5LnRyYWNrID8gcmVxLmJvZHkudHJhY2sgOiAnJyxcbiAgICAgICAgICBmb2xsb3c6IHJlcS5ib2R5LmZvbGxvdyA/IHJlcS5ib2R5LmZvbGxvdyA6ICcnLFxuICAgICAgICAgIGxvY2F0aW9uczogcmVxLmJvZHkuY29vcmRpbmF0ZXMgPyByZXEuYm9keS5jb29yZGluYXRlcyA6ICcnLFxuICAgICAgICB9O1xuICAgICAgICBjb25zdCB0eXBlID0gcmVxLmJvZHkudHlwZTtcbiAgICAgICAgY29uc3QgY29vcmRpbmF0ZXMgPSByZXEuYm9keS5jb29yZGluYXRlcztcbiAgICAgICAgY29uc29sZS5sb2coJ3N0YXJ0aW5nIHN0cmVhbSBvbiAnLCBjb29yZGluYXRlcyk7XG4gICAgICAgIGNvbnN0IHN0cmVhbUlEID0gdHdpdHRlckFQSS5zdGFydFN0cmVhbSh0eXBlLCBwYXJhbWV0ZXJzKTtcbiAgICAgICAgcmVzLnNldEhlYWRlcignQ29udGVudC1UeXBlJywgJ3RleHQvcGxhaW4nKTtcbiAgICAgICAgcmVzLnNlbmQoc3RyZWFtSUQpO1xuICAgICAgICByZXR1cm4gcmVzb2x2ZSgpO1xuICAgICAgfVxuICAgICAgY2FzZSAnREVMRVRFJzoge1xuICAgICAgICBjb25zdCBzdHJlYW1JRCA9IHJlcS5ib2R5LmlkOyAvL3Nob3VsZCBiZSBib2R5XG4gICAgICAgIGNvbnNvbGUubG9nKHN0cmVhbUlEKTtcbiAgICAgICAgY29uc3QgeyBkYXRhSnNvbiwgZXJyb3IgfSA9IHR3aXR0ZXJBUEkuY2xvc2VTdHJlYW0oc3RyZWFtSUQpO1xuICAgICAgICByZXMuanNvbihkYXRhSnNvbik7XG4gICAgICAgIHJldHVybiByZXNvbHZlKCk7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXMuZW5kKCk7XG4gICAgfVxuICB9KTtcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./pages/api/geoFilter.js\n");

/***/ }),

/***/ "./twitterAPI/.credentials.json":
/*!**************************************!*\
  !*** ./twitterAPI/.credentials.json ***!
  \**************************************/
/*! exports provided: consumer_key, consumer_secret, access_token_key, access_token_secret, default */
/***/ (function(module) {

eval("module.exports = JSON.parse(\"{\\\"consumer_key\\\":\\\"***REMOVED***\\\",\\\"consumer_secret\\\":\\\"***REMOVED***\\\",\\\"access_token_key\\\":\\\"1313488616656642049-PfW1Kfo7vVUukMChYrIgRZPYb5WvG0\\\",\\\"access_token_secret\\\":\\\"EOSHRRj6i4mPF6laHCZWgXqFP0VZliqcDszXSNasfyv7A\\\"}\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiIuL3R3aXR0ZXJBUEkvLmNyZWRlbnRpYWxzLmpzb24uanMiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./twitterAPI/.credentials.json\n");

/***/ }),

/***/ "./twitterAPI/geoStream.js":
/*!*********************************!*\
  !*** ./twitterAPI/geoStream.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const {\n  v4: uuidv4\n} = __webpack_require__(/*! uuid */ \"uuid\");\n\nconst Twitter = __webpack_require__(/*! twitter-lite */ \"twitter-lite\");\n\nconst credentials = __webpack_require__(/*! ./.credentials */ \"./twitterAPI/.credentials.json\");\n\nlet streams = {};\n\nfunction exportJSON(data) {\n  json = {\n    data: []\n  };\n  data.forEach(value => {\n    json.data.push(value);\n  });\n  var json = JSON.stringify(json.data);\n  return json;\n}\n\nconsole.log('hello');\nconst client = new Twitter({\n  subdomain: 'api',\n  version: '1.1',\n  consumer_key: credentials.consumer_key,\n  // from Twitter.\n  consumer_secret: credentials.consumer_secret,\n  // from Twitter.\n  access_token_key: credentials.access_token_key,\n  // from your User (oauth_token)\n  access_token_secret: credentials.access_token_secret // from your User (oauth_token_secret);\n\n});\n\nconst startStream = (type, parameters) => {\n  const streamId = uuidv4();\n  console.log(streamId);\n  const stream = client.stream('statuses/filter', parameters);\n  streams[streamId] = {\n    stream,\n    data: [],\n    error: null\n  };\n  console.log(`startStream: ${register.magic}`);\n  stream.on('start', () => console.log('stream started'));\n  stream.on('error', error => {\n    console.log(`ERROR! Twitter says: ${error.message}`);\n    streams[streamId].error = error;\n  }); //todo handler error\n\n  stream.on('data', tweet => {\n    switch (type) {\n      case 'hashtag':\n        if (tweet.user.location || tweet.geo || tweet.coordinates || tweet.place) {\n          streams[streamId].data.push(tweet);\n          streams[streamId].socket.emit('data', tweet);\n          console.log(tweet.text);\n        }\n\n        break;\n\n      default:\n        streams[streamId].data.push(tweet);\n        console.log(tweet.text);\n    }\n  });\n  return streamId;\n};\n\nconst closeStream = streamId => {\n  const {\n    stream,\n    data,\n    error\n  } = streams[streamId];\n  console.log('closeStream data:', data);\n  stream.destroy();\n  delete streams[streamId];\n  const dataJson = exportJSON(data);\n  return {\n    dataJson,\n    error\n  };\n};\n\nconst register = (socket, streamId) => {\n  console.log(`Register: ${register.magic}`);\n  streams[streamId].socket = socket;\n};\n\nregister.startStream = startStream;\nregister.closeStream = closeStream;\nregister.magic = Math.random();\nmodule.exports = register;//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi90d2l0dGVyQVBJL2dlb1N0cmVhbS5qcz9jYTBhIl0sIm5hbWVzIjpbInY0IiwidXVpZHY0IiwicmVxdWlyZSIsIlR3aXR0ZXIiLCJjcmVkZW50aWFscyIsInN0cmVhbXMiLCJleHBvcnRKU09OIiwiZGF0YSIsImpzb24iLCJmb3JFYWNoIiwidmFsdWUiLCJwdXNoIiwiSlNPTiIsInN0cmluZ2lmeSIsImNvbnNvbGUiLCJsb2ciLCJjbGllbnQiLCJzdWJkb21haW4iLCJ2ZXJzaW9uIiwiY29uc3VtZXJfa2V5IiwiY29uc3VtZXJfc2VjcmV0IiwiYWNjZXNzX3Rva2VuX2tleSIsImFjY2Vzc190b2tlbl9zZWNyZXQiLCJzdGFydFN0cmVhbSIsInR5cGUiLCJwYXJhbWV0ZXJzIiwic3RyZWFtSWQiLCJzdHJlYW0iLCJlcnJvciIsInJlZ2lzdGVyIiwibWFnaWMiLCJvbiIsIm1lc3NhZ2UiLCJ0d2VldCIsInVzZXIiLCJsb2NhdGlvbiIsImdlbyIsImNvb3JkaW5hdGVzIiwicGxhY2UiLCJzb2NrZXQiLCJlbWl0IiwidGV4dCIsImNsb3NlU3RyZWFtIiwiZGVzdHJveSIsImRhdGFKc29uIiwiTWF0aCIsInJhbmRvbSIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBLE1BQU07QUFBRUEsSUFBRSxFQUFFQztBQUFOLElBQWlCQyxtQkFBTyxDQUFDLGtCQUFELENBQTlCOztBQUNBLE1BQU1DLE9BQU8sR0FBR0QsbUJBQU8sQ0FBQyxrQ0FBRCxDQUF2Qjs7QUFDQSxNQUFNRSxXQUFXLEdBQUdGLG1CQUFPLENBQUMsc0RBQUQsQ0FBM0I7O0FBRUEsSUFBSUcsT0FBTyxHQUFHLEVBQWQ7O0FBRUEsU0FBU0MsVUFBVCxDQUFvQkMsSUFBcEIsRUFBMEI7QUFDeEJDLE1BQUksR0FBRztBQUFFRCxRQUFJLEVBQUU7QUFBUixHQUFQO0FBQ0FBLE1BQUksQ0FBQ0UsT0FBTCxDQUFjQyxLQUFELElBQVc7QUFDdEJGLFFBQUksQ0FBQ0Qs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QyxPQUFPLENBQUNxQixRQUFELENBQWQ7QUFDQSxRQUFNa0IsUUFBUSxHQUFHdEMsVUFBVSxDQUFDQyxJQUFELENBQTNCO0FBQ0EsU0FBTztBQUFFcUMsWUFBRjtBQUFZaEI7QUFBWixHQUFQO0FBQ0QsQ0FQRDs7QUFTQSxNQUFNQyxRQUFRLEdBQUcsQ0FBQ1UsTUFBRCxFQUFTYixRQUFULEtBQXNCO0FBQ3JDWixTQUFPLENBQUNDLEdBQVIsQ0FBYSxhQUFZYyxRQUFRLENBQUNDLEtBQU0sRUFBeEM7QUFDQXpCLFNBQU8sQ0FBQ3FCLFFBQUQsQ0FBUCxDQUFrQmEsTUFBbEIsR0FBMkJBLE1BQTNCO0FBQ0QsQ0FIRDs7QUFLQVYsUUFBUSxDQUFDTixXQUFULEdBQXVCQSxXQUF2QjtBQUNBTSxRQUFRLENBQUNhLFdBQVQsR0FBdUJBLFdBQXZCO0FBQ0FiLFFBQVEsQ0FBQ0MsS0FBVCxHQUFpQmUsSUFBSSxDQUFDQyxNQUFMLEVBQWpCO0FBRUFDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQm5CLFFBQWpCIiwiZmlsZSI6Ii4vdHdpdHRlckFQSS9nZW9TdHJlYW0uanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCB7IHY0OiB1dWlkdjQgfSA9IHJlcXVpcmUoJ3V1aWQnKTtcclxuY29uc3QgVHdpdHRlciA9IHJlcXVpcmUoJ3R3aXR0ZXItbGl0ZScpO1xyXG5jb25zdCBjcmVkZW50aWFscyA9IHJlcXVpcmUoJy4vLmNyZWRlbnRpYWxzJyk7XHJcblxyXG5sZXQgc3RyZWFtcyA9IHt9O1xyXG5cclxuZnVuY3Rpb24gZXhwb3J0SlNPTihkYXRhKSB7XHJcbiAganNvbiA9IHsgZGF0YTogW10gfTtcclxuICBkYXRhLmZvckVhY2goKHZhbHVlKSA9PiB7XHJcbiAgICBqc29uLmRhdGEucHVzaCh2YWx1ZSk7XHJcbiAgfSk7XHJcbiAgdmFyIGpzb24gPSBKU09OLnN0cmluZ2lmeShqc29uLmRhdGEpO1xyXG4gIHJldHVybiBqc29uO1xyXG59XHJcbmNvbnNvbGUubG9nKCdoZWxsbycpO1xyXG5jb25zdCBjbGllbnQgPSBuZXcgVHdpdHRlcih7XHJcbiAgc3ViZG9tYWluOiAnYXBpJyxcclxuICB2ZXJzaW9uOiAnMS4xJyxcclxuICBjb25zdW1lcl9rZXk6IGNyZWRlbnRpYWxzLmNvbnN1bWVyX2tleSwgLy8gZnJvbSBUd2l0dGVyLlxyXG4gIGNvbnN1bWVyX3NlY3JldDogY3JlZGVudGlhbHMuY29uc3VtZXJfc2VjcmV0LCAvLyBmcm9tIFR3aXR0ZXIuXHJcbiAgYWNjZXNzX3Rva2VuX2tleTogY3JlZGVudGlhbHMuYWNjZXNzX3Rva2VuX2tleSwgLy8gZnJvbSB5b3VyIFVzZXIgKG9hdXRoX3Rva2VuKVxyXG4gIGFjY2Vzc190b2tlbl9zZWNyZXQ6IGNyZWRlbnRpYWxzLmFjY2Vzc190b2tlbl9zZWNyZXQsIC8vIGZyb20geW91ciBVc2VyIChvYXV0aF90b2tlbl9zZWNyZXQpO1xyXG59KTtcclxuXHJcbmNvbnN0IHN0YXJ0U3RyZWFtID0gKHR5cGUsIHBhcmFtZXRlcnMpID0+IHtcclxuICBjb25zdCBzdHJlYW1JZCA9IHV1aWR2NCgpO1xyXG4gIGNvbnNvbGUubG9nKHN0cmVhbUlkKTtcclxuICBjb25zdCBzdHJlYW0gPSBjbGllbnQuc3RyZWFtKCdzdGF0dXNlcy9maWx0ZXInLCBwYXJhbWV0ZXJzKTtcclxuICBzdHJlYW1zW3N0cmVhbUlkXSA9IHsgc3RyZWFtLCBkYXRhOiBbXSwgZXJyb3I6IG51bGwgfTtcclxuICBjb25zb2xlLmxvZyhgc3RhcnRTdHJlYW06ICR7cmVnaXN0ZXIubWFnaWN9YCk7XHJcbiAgc3RyZWFtLm9uKCdzdGFydCcsICgpID0+IGNvbnNvbGUubG9nKCdzdHJlYW0gc3RhcnRlZCcpKTtcclxuICBzdHJlYW0ub24oJ2Vycm9yJywgKGVycm9yKSA9PiB7XHJcbiAgICBjb25zb2xlLmxvZyhgRVJST1IhIFR3aXR0ZXIgc2F5czogJHtlcnJvci5tZXNzYWdlfWApO1xyXG4gICAgc3RyZWFtc1tzdHJlYW1JZF0uZXJyb3IgPSBlcnJvcjtcclxuICB9KTsgLy90b2RvIGhhbmRsZXIgZXJyb3JcclxuICBzdHJlYW0ub24oJ2RhdGEnLCAodHdlZXQpID0+IHtcclxuICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICBjYXNlICdoYXNodGFnJzpcclxuICAgICAgICBpZiAodHdlZXQudXNlci5sb2NhdGlvbiB8fCB0d2VldC5nZW8gfHwgdHdlZXQuY29vcmRpbmF0ZXMgfHwgdHdlZXQucGxhY2UpIHtcclxuICAgICAgICAgIHN0cmVhbXNbc3RyZWFtSWRdLmRhdGEucHVzaCh0d2VldCk7XHJcbiAgICAgICAgICBzdHJlYW1zW3N0cmVhbUlkXS5zb2NrZXQuZW1pdCgnZGF0YScsIHR3ZWV0KTtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKHR3ZWV0LnRleHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBicmVhaztcclxuICAgICAgZGVmYXVsdDpcclxuICAgICAgICBzdHJlYW1zW3N0cmVhbUlkXS5kYXRhLnB1c2godHdlZXQpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHR3ZWV0LnRleHQpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIHJldHVybiBzdHJlYW1JZDtcclxufTtcclxuXHJcbmNvbnN0IGNsb3NlU3RyZWFtID0gKHN0cmVhbUlkKSA9PiB7XHJcbiAgY29uc3QgeyBzdHJlYW0sIGRhdGEsIGVycm9yIH0gPSBzdHJlYW1zW3N0cmVhbUlkXTtcclxuICBjb25zb2xlLmxvZygnY2xvc2VTdHJlYW0gZGF0YTonLCBkYXRhKTtcclxuICBzdHJlYW0uZGVzdHJveSgpO1xyXG4gIGRlbGV0ZSBzdHJlYW1zW3N0cmVhbUlkXTtcclxuICBjb25zdCBkYXRhSnNvbiA9IGV4cG9ydEpTT04oZGF0YSk7XHJcbiAgcmV0dXJuIHsgZGF0YUpzb24sIGVycm9yIH07XHJcbn07XHJcblxyXG5jb25zdCByZWdpc3RlciA9IChzb2NrZXQsIHN0cmVhbUlkKSA9PiB7XHJcbiAgY29uc29sZS5sb2coYFJlZ2lzdGVyOiAke3JlZ2lzdGVyLm1hZ2ljfWApO1xyXG4gIHN0cmVhbXNbc3RyZWFtSWRdLnNvY2tldCA9IHNvY2tldDtcclxufTtcclxuXHJcbnJlZ2lzdGVyLnN0YXJ0U3RyZWFtID0gc3RhcnRTdHJlYW07XHJcbnJlZ2lzdGVyLmNsb3NlU3RyZWFtID0gY2xvc2VTdHJlYW07XHJcbnJlZ2lzdGVyLm1hZ2ljID0gTWF0aC5yYW5kb20oKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcmVnaXN0ZXI7XHJcbiJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./twitterAPI/geoStream.js\n");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"path\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJwYXRoXCI/NzRiYiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJwYXRoLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///path\n");

/***/ }),

/***/ "twitter-lite":
/*!*******************************!*\
  !*** external "twitter-lite" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"twitter-lite\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ0d2l0dGVyLWxpdGVcIj85MTFhIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBIiwiZmlsZSI6InR3aXR0ZXItbGl0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInR3aXR0ZXItbGl0ZVwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///twitter-lite\n");

/***/ }),

/***/ "uuid":
/*!***********************!*\
  !*** external "uuid" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"uuid\");//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ1dWlkXCI/MzcxMiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSIsImZpbGUiOiJ1dWlkLmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidXVpZFwiKTsiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///uuid\n");

/***/ })

/******/ });