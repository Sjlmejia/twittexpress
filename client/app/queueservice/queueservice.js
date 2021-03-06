'use strict';
/* globals createjs */

/**
 * @ngdoc service
 * @name pbshowApp.QueueService
 * @description
 * # QueueService
 * Service in the pbshowApp.
 */
angular.module('twittexpressApp')
.service('QueueService', ['$http', 'configuration', '$rootScope', function ($http, configuration, $rootScope) {
  var slides = [];

  function loadManifest(){
    var queue = new createjs.LoadQueue(true);

    $http.get(configuration.manifestUrl)
    .success(function (result) {
      //load the splash always
      slides = [{id: 'splash', src: './images/splash.jpg', title: 'Este es el splash', subtitle: 'cool', type: 'splash'}];
      //PV load slides if they are available
      if(result.slides){
        slides = slides.concat(result.slides);
        queue.loadManifest(slides);
      }

      queue.on('progress', function (event) {
        $rootScope.$broadcast('queueProgress', event);
      });

      queue.on('complete', function () {
        $rootScope.$broadcast('queueComplete', slides);
      });

    }).error(function (result) {
      console.log('ERROR getting manifest', result);
      return null;
    });
  }

  return {
    loadManifest: loadManifest,
    slides: function(){return slides;}
  };
}]);
