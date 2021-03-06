(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SmoothPages = factory();
  }
}(this, function () {
  var spinnerImage =
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNC' +
    'IgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjODA4MDgwIiBkPSJNMTcuMjUgMS41Yy' +
    '0uMTQtLjA2LS4yOC0uMTEtLjQ0LS4xMS0uNTUgMC0xIC40NS0xIDEgMCAuMzkuMjMuNzIuNTYuODlsLS4wMS4wMWMzLj' +
    'IgMS42IDUuMzkgNC45IDUuMzkgOC43MSAwIDUuMzgtNC4zNyA5Ljc1LTkuNzUgOS43NVMyLjI1IDE3LjM5IDIuMjUgMT' +
    'JjMC0zLjgyIDIuMi03LjExIDUuMzktOC43MXYtLjAyYy4zMy0uMTYuNTYtLjQ5LjU2LS44OSAwLS41NS0uNDUtMS0xLT' +
    'EtLjE2IDAtLjMxLjA1LS40NC4xMUMyLjkgMy40My4yNSA3LjQuMjUgMTJjMCA2LjQ5IDUuMjYgMTEuNzUgMTEuNzUgMT' +
    'EuNzVTMjMuNzUgMTguNDkgMjMuNzUgMTJjMC00LjYtMi42NS04LjU3LTYuNS0xMC41eiI+PC9wYXRoPjwvc3ZnPg==';
  var init = function (options) {
    var htmlColor;
    var sheet = document.createElement('style');
    var overlay;
    var preloader;
    var attrname;
    var hideFunction;
    var config = {
      overlayColor: '#ffffff',
      fadeOut: true,
      spinnerImage: spinnerImage,
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
      if (config.fadeOut && !/^((?!chrome|android).)*safari|firefox/i.test(navigator.userAgent)) {
        document.body.addEventListener('click', handleLinkClick);
      }
    });

    hideFunction = function () {
      overlay.style.opacity = '0';
      overlay.style.zIndex = '-1';
      document.documentElement.style.backgroundColor = htmlColor;
    };

    window.addEventListener('load', hideFunction);
  };

  return { init: init };
}));
