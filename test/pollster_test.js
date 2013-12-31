(function() {
  /*
    ======== A Handy Little QUnit Reference ========
    http://api.qunitjs.com/

    Test methods:
      module(name, {[setup][ ,teardown]})
      test(name, callback)
      expect(numberOfAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      throws(block, [expected], [message])
  */

  module('pollster', {
    setup: function () {
      this.makeServer = function () {
        this.server = this.sandbox.useFakeServer();
        this.server.respondWith([200, { "Content-Type": "application/json" },
                           '["item1", "item2"]']);
      };
      this.waitAndRespond = function () {
        this.clock.tick(30 * 1000);
        this.server.respond();
      };
    }
  });

  test('is a function', function() {
    expect(1);
    ok(typeof Pollster === 'function');
  });

  test('polls at least once', function() {
    this.makeServer();
    var callback = this.spy();
    new Pollster('/ping', callback);
    this.waitAndRespond();
    ok(callback.calledOnce);
  });

  test('stops polling when the callback returns true', function() {
    this.makeServer();
    var response = false;
    var callback = function () {
      return response;
    };
    callback = this.spy(callback);
    new Pollster('/ping', callback);
    this.waitAndRespond();
    response = true;
    this.waitAndRespond();
    this.waitAndRespond();

    ok(callback.calledTwice);
  });

}(jQuery));
