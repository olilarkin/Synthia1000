
  var Module = typeof Module !== 'undefined' ? Module : {};
  
  if (!Module.expectedDataFileDownloads) {
    Module.expectedDataFileDownloads = 0;
  }
  Module.expectedDataFileDownloads++;
  (function() {
   var loadPackage = function(metadata) {
  
      var PACKAGE_PATH;
      if (typeof window === 'object') {
        PACKAGE_PATH = window['encodeURIComponent'](window.location.pathname.toString().substring(0, window.location.pathname.toString().lastIndexOf('/')) + '/');
      } else if (typeof location !== 'undefined') {
        // worker
        PACKAGE_PATH = encodeURIComponent(location.pathname.toString().substring(0, location.pathname.toString().lastIndexOf('/')) + '/');
      } else {
        throw 'using preloaded data can only be done on a web page or in a web worker';
      }
      var PACKAGE_NAME = 'svgs.data';
      var REMOTE_PACKAGE_BASE = 'svgs.data';
      if (typeof Module['locateFilePackage'] === 'function' && !Module['locateFile']) {
        Module['locateFile'] = Module['locateFilePackage'];
        err('warning: you defined Module.locateFilePackage, that has been renamed to Module.locateFile (using your locateFilePackage for now)');
      }
      var REMOTE_PACKAGE_NAME = Module['locateFile'] ? Module['locateFile'](REMOTE_PACKAGE_BASE, '') : REMOTE_PACKAGE_BASE;
    
      var REMOTE_PACKAGE_SIZE = metadata['remote_package_size'];
      var PACKAGE_UUID = metadata['package_uuid'];
    
      function fetchRemotePackage(packageName, packageSize, callback, errback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', packageName, true);
        xhr.responseType = 'arraybuffer';
        xhr.onprogress = function(event) {
          var url = packageName;
          var size = packageSize;
          if (event.total) size = event.total;
          if (event.loaded) {
            if (!xhr.addedTotal) {
              xhr.addedTotal = true;
              if (!Module.dataFileDownloads) Module.dataFileDownloads = {};
              Module.dataFileDownloads[url] = {
                loaded: event.loaded,
                total: size
              };
            } else {
              Module.dataFileDownloads[url].loaded = event.loaded;
            }
            var total = 0;
            var loaded = 0;
            var num = 0;
            for (var download in Module.dataFileDownloads) {
            var data = Module.dataFileDownloads[download];
              total += data.total;
              loaded += data.loaded;
              num++;
            }
            total = Math.ceil(total * Module.expectedDataFileDownloads/num);
            if (Module['setStatus']) Module['setStatus']('Downloading data... (' + loaded + '/' + total + ')');
          } else if (!Module.dataFileDownloads) {
            if (Module['setStatus']) Module['setStatus']('Downloading data...');
          }
        };
        xhr.onerror = function(event) {
          throw new Error("NetworkError for: " + packageName);
        }
        xhr.onload = function(event) {
          if (xhr.status == 200 || xhr.status == 304 || xhr.status == 206 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
            var packageData = xhr.response;
            callback(packageData);
          } else {
            throw new Error(xhr.statusText + " : " + xhr.responseURL);
          }
        };
        xhr.send(null);
      };

      function handleError(error) {
        console.error('package error:', error);
      };
    
        var fetchedCallback = null;
        var fetched = Module['getPreloadedPackage'] ? Module['getPreloadedPackage'](REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE) : null;

        if (!fetched) fetchRemotePackage(REMOTE_PACKAGE_NAME, REMOTE_PACKAGE_SIZE, function(data) {
          if (fetchedCallback) {
            fetchedCallback(data);
            fetchedCallback = null;
          } else {
            fetched = data;
          }
        }, handleError);
      
    function runWithFS() {
  
      function assert(check, msg) {
        if (!check) throw msg + new Error().stack;
      }
  Module['FS_createPath']('/', 'resources', true, true);
Module['FS_createPath']('/resources', 'img', true, true);

      /** @constructor */
      function DataRequest(start, end, audio) {
        this.start = start;
        this.end = end;
        this.audio = audio;
      }
      DataRequest.prototype = {
        requests: {},
        open: function(mode, name) {
          this.name = name;
          this.requests[name] = this;
          Module['addRunDependency']('fp ' + this.name);
        },
        send: function() {},
        onload: function() {
          var byteArray = this.byteArray.subarray(this.start, this.end);
          this.finish(byteArray);
        },
        finish: function(byteArray) {
          var that = this;
  
          Module['FS_createDataFile'](this.name, null, byteArray, true, true, true); // canOwn this data in the filesystem, it is a slide into the heap that will never change
          Module['removeRunDependency']('fp ' + that.name);
  
          this.requests[this.name] = null;
        }
      };
  
          var files = metadata['files'];
          for (var i = 0; i < files.length; ++i) {
            new DataRequest(files[i]['start'], files[i]['end'], files[i]['audio']).open('GET', files[i]['filename']);
          }
  
    
      function processPackageData(arrayBuffer) {
        assert(arrayBuffer, 'Loading data file failed.');
        assert(arrayBuffer instanceof ArrayBuffer, 'bad input to processPackageData');
        var byteArray = new Uint8Array(arrayBuffer);
        var curr;
        
          // Reuse the bytearray from the XHR as the source for file reads.
          DataRequest.prototype.byteArray = byteArray;
    
            var files = metadata['files'];
            for (var i = 0; i < files.length; ++i) {
              DataRequest.prototype.requests[files[i].filename].onload();
            }
                Module['removeRunDependency']('datafile_svgs.data');

      };
      Module['addRunDependency']('datafile_svgs.data');
    
      if (!Module.preloadResults) Module.preloadResults = {};
    
        Module.preloadResults[PACKAGE_NAME] = {fromCache: false};
        if (fetched) {
          processPackageData(fetched);
          fetched = null;
        } else {
          fetchedCallback = processPackageData;
        }
      
    }
    if (Module['calledRun']) {
      runWithFS();
    } else {
      if (!Module['preRun']) Module['preRun'] = [];
      Module["preRun"].push(runWithFS); // FS is not initialized yet, wait for it
    }
  
   }
   loadPackage({"files": [{"filename": "/resources/img/Rogan2PSBlue.svg", "start": 0, "end": 12154, "audio": 0}, {"filename": "/resources/img/Davies1900hLargeRed.svg", "start": 12154, "end": 16596, "audio": 0}, {"filename": "/resources/img/Rogan3PGreen.svg", "start": 16596, "end": 28256, "audio": 0}, {"filename": "/resources/img/Rogan2SGray.svg", "start": 28256, "end": 40066, "audio": 0}, {"filename": "/resources/img/Davies1900hLargeWhite.svg", "start": 40066, "end": 44509, "audio": 0}, {"filename": "/resources/img/Rogan6PSWhite.svg", "start": 44509, "end": 56761, "audio": 0}, {"filename": "/resources/img/Rogan1PSGreen.svg", "start": 56761, "end": 68903, "audio": 0}, {"filename": "/resources/img/Rogan2PRed.svg", "start": 68903, "end": 80553, "audio": 0}, {"filename": "/resources/img/Rogan3PRed.svg", "start": 80553, "end": 92204, "audio": 0}, {"filename": "/resources/img/BefacoSlidePot.svg", "start": 92204, "end": 94550, "audio": 0}, {"filename": "/resources/img/Rogan3PBlue.svg", "start": 94550, "end": 106217, "audio": 0}, {"filename": "/resources/img/Rogan2PBlue.svg", "start": 106217, "end": 117885, "audio": 0}, {"filename": "/resources/img/Rogan3PWhite.svg", "start": 117885, "end": 129548, "audio": 0}, {"filename": "/resources/img/Rogan3PSRed.svg", "start": 129548, "end": 141676, "audio": 0}, {"filename": "/resources/img/Rogan3PSGreen.svg", "start": 141676, "end": 153799, "audio": 0}, {"filename": "/resources/img/Rogan1PWhite.svg", "start": 153799, "end": 165473, "audio": 0}, {"filename": "/resources/img/Rogan2PGreen.svg", "start": 165473, "end": 177125, "audio": 0}, {"filename": "/resources/img/Davies1900hBlack.svg", "start": 177125, "end": 181560, "audio": 0}, {"filename": "/resources/img/Rogan1PRed.svg", "start": 181560, "end": 193223, "audio": 0}, {"filename": "/resources/img/BefacoTinyKnob.svg", "start": 193223, "end": 197205, "audio": 0}, {"filename": "/resources/img/Rogan2PSGreen.svg", "start": 197205, "end": 209339, "audio": 0}, {"filename": "/resources/img/Rogan1PSBlue.svg", "start": 209339, "end": 221490, "audio": 0}, {"filename": "/resources/img/Rogan5PSGray.svg", "start": 221490, "end": 233651, "audio": 0}, {"filename": "/resources/img/Rogan1PSRed.svg", "start": 233651, "end": 245789, "audio": 0}, {"filename": "/resources/img/Rogan1PGreen.svg", "start": 245789, "end": 257451, "audio": 0}, {"filename": "/resources/img/BefacoSlidePotHandle.svg", "start": 257451, "end": 257939, "audio": 0}, {"filename": "/resources/img/Davies1900hRed.svg", "start": 257939, "end": 262381, "audio": 0}, {"filename": "/resources/img/Rogan2PWhite.svg", "start": 262381, "end": 274040, "audio": 0}, {"filename": "/resources/img/Rogan3PSWhite.svg", "start": 274040, "end": 286184, "audio": 0}, {"filename": "/resources/img/Rogan1PBlue.svg", "start": 286184, "end": 297860, "audio": 0}, {"filename": "/resources/img/Rogan3PSBlue.svg", "start": 297860, "end": 310002, "audio": 0}, {"filename": "/resources/img/SynthTechAlco.svg", "start": 310002, "end": 323110, "audio": 0}, {"filename": "/resources/img/Davies1900hWhite.svg", "start": 323110, "end": 327555, "audio": 0}, {"filename": "/resources/img/Davies1900hLargeBlack.svg", "start": 327555, "end": 331997, "audio": 0}, {"filename": "/resources/img/Rogan2PSRed.svg", "start": 331997, "end": 344140, "audio": 0}, {"filename": "/resources/img/Rogan1PSWhite.svg", "start": 344140, "end": 356292, "audio": 0}, {"filename": "/resources/img/BefacoBigKnob.svg", "start": 356292, "end": 360147, "audio": 0}, {"filename": "/resources/img/Rogan2PSWhite.svg", "start": 360147, "end": 372303, "audio": 0}], "remote_package_size": 372303, "package_uuid": "9a86b699-51e8-4fbe-a04f-ae6daba48eb2"});
  
  })();
  