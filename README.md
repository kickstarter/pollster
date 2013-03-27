Pollster
========

Pollster is a small library for doing repeated polling events:

    var pollster = new Pollster('/url/to/ping', function (data) {
      if (data.stop_polling === true) {
        return true;
      } else {
        return false;
      }
    });

Dependencies
-----------

jQuery. I only use it for the XHR. I would love to port this to just
a vanilla XMLHttpRequest.

Contributers
------------

* Samuel Cole <sam@samuelcole.name>
* Lance Ivy <lance@cainlevy.net>
