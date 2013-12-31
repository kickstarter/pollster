(function ($) {
  /*
    example:

    new Pollster(the_polling_endpoint, function() {
      if (polling_should_stop) {
        return true;
      }
    })
  */
  function Pollster(url, finished, options) {
    this.url = url;
    this.finished = finished || function () { return; };
    this.options = $.extend({
      delay: 30 * 1000,
      on_error: function () { return; },
      on_complete: function () { return; },
      continue_on_error: false
    }, options);
    this.xhr = false;
    this.running = false;
    this.go();
  }

  $.pollster = function (url, finished, options) {
    return new Pollster(url, finished, options);
  };

  window.Pollster = Pollster;

  Pollster.prototype.start = function () {
    var _this = this;
    this.running = true;
    this.timeout = setTimeout(function () {
      _this.go();
    }, this.options.delay);
  };

  Pollster.prototype.stop = function () {
    this.running = false;
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
  };

  Pollster.prototype.go = function () {
    var stop = false,
      _this = this;

    // wait for existing request to complete
    if (this.xhr) { return; }

    function cont() {
      if (stop) {
        _this.stop();
      } else {
        _this.start();
      }
    }

    //TODO: get rid of this jQuery dependecy
    this.xhr = jQuery.ajax({
      url: this.url,
      dataType: 'json',
      type: 'get',
      global: false,
      success: function (data) {
        stop = _this.finished(data);
        cont();
      },
      error: function () {
        if (_this.options.continue_on_error) {
          cont();
        }
        _this.options.on_error();
      },
      complete: function () {
        _this.xhr = false;
        _this.options.on_complete();
      }
    });

  };

}(jQuery));
