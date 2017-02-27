(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SmoothPages = factory();
  }
}(this, function () {
  var init = function (options) {
    var htmlColor;
    var sheet = document.createElement('style');
    var overlay;
    var preloader;
    var attrname;
    var loadFunction;
    var hideFunction;
    var config = {
      overlayColor: '#ffffff',
      fadeOut: true,
      spinnerImage: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#808080" d="M17.25 1.5c-.14-.06-.28-.11-.44-.11-.55 0-1 .45-1 1 0 .39.23.72.56.89l-.01.01c3.2 1.6 5.39 4.9 5.39 8.71 0 5.38-4.37 9.75-9.75 9.75S2.25 17.39 2.25 12c0-3.82 2.2-7.11 5.39-8.71v-.02c.33-.16.56-.49.56-.89 0-.55-.45-1-1-1-.16 0-.31.05-.44.11C2.9 3.43.25 7.4.25 12c0 6.49 5.26 11.75 11.75 11.75S23.75 18.49 23.75 12c0-4.6-2.65-8.57-6.5-10.5z"></path></svg>',
      spinnerSize: 24
    };

    if (options && !options instanceof Object) {
      throw new Error('options parameter must be an object');
    }
    for (attrname in options) {
      if (options.hasOwnProperty(attrname)) {
        config[attrname] = options[attrname];
      }
    }

    sheet.type = 'text/css';
    (document.head || document.getElementsByTagName('head')[0]).appendChild(sheet);
    htmlColor = document.documentElement.style.backgroundColor;
    document.documentElement.style.backgroundColor = config.overlayColor;
    sheet.appendChild(document.createTextNode(
      '@keyframes preloader-spin {from {transform: rotate(0deg);} ' +
      'to {transform: rotate(360deg);}}\n' +
      '@keyframes preloader-fade-in {from {opacity: 0;} to {opacity: 1;}}\n' +
      'body { display: none; }\n'
    ));

    function handleLinkClick(e) {
      var href;
      if (e.target.nodeName.toLowerCase() !== 'a') {
        return;
      }
      href = e.target.getAttribute('href');
      if (/^javascript:|^mailto:|^tel:|^#|^\/#/.exec(href)) {
        return;
      }
      e.preventDefault();
      if (e.target.getAttribute('target') === '_blank') {
        window.open(href, '_blank');
      } else {
        preloader.style.display = 'none';
        overlay.style.transition = 'opacity 0.3s ease-in';
        overlay.style.opacity = '1';
        overlay.style.zIndex = '1000';
        setTimeout(function () {
          window.location.href = href;
        }, 300);
      }
    }

    document.addEventListener('DOMContentLoaded', function () {
      overlay = document.createElement('div');
      document.body.appendChild(overlay);
      overlay.style.cssText =
        'position: fixed; top: 0; right: 0; bottom: 0; left: 0; z-index: 1000; ' +
        'background: ' + config.overlayColor + '; opacity: 1; ' +
        'transition: opacity 0.3s ease-in, z-index 0.3s step-end';
      preloader = document.createElement('img');
      overlay.appendChild(preloader);
      preloader.setAttribute('src', config.spinnerImage);
      preloader.style.cssText =
        'position: absolute; top: 50%; left: 50%;' +
        'width: ' + config.spinnerSize + 'px;' +
        'height: ' + config.spinnerSize + 'px;' +
        'margin-top: -' + config.spinnerSize / 2 + 'px;' +
        'margin-left: -' + config.spinnerSize / 2 + 'px; ' +
        'animation: preloader-spin 1s linear infinite, preloader-fade-in 0.1s linear;';
      sheet.appendChild(document.createTextNode('body { display: block; }'));
      if (config.fadeOut) {
        document.body.addEventListener('click', handleLinkClick);
      }
    });

    hideFunction = function () {
      overlay.style.opacity = '0';
      overlay.style.zIndex = '-1';
      document.documentElement.style.backgroundColor = htmlColor;
    };

    loadFunction = function () {
      // Hack for safari back-forward cache
      if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
        setInterval(function () {
          hideFunction();
        }, 100);
      } else {
        hideFunction();
      }
    };
    window.addEventListener('load', loadFunction);
  };

  return { init: init };
}));
