define(["model/config"], function ($config) {
  var _create = function (_payload, _cb) {
    webix
      .ajax()
      .post($config.api_prefix + "?action=customer.create", _payload)
      .then(function (_ret) {
        _ret && _cb(_ret.json());
      });
  };
  var _update = function (_payload, _cb) {
    webix
      .ajax()
      .post($config.api_prefix + "?action=customer.update", _payload)
      .then(function (_ret) {
        _ret && _cb(_ret.json());
      });
  };
  var _get = function (_payload, _cb) {
    webix
      .ajax()
      .post($config.api_prefix + "?action=customer.get", _payload)
      .then(function (_ret) {
        _ret && _cb(_ret.json());
      });
  };
  var _delete = function (_payload, _cb) {
    webix
      .ajax()
      .post($config.api_prefix + "?action=customer.delete", _payload)
      .then(function (_ret) {
        _ret && _cb(_ret.json());
      });
  };
    var _list = function (_payload, _cb) {
    webix
      .ajax()
	    .post($config.api_prefix + "?action=customer.list", _payload)
      .then(function (_ret) {
        _ret && _cb(_ret.json());
      });
  };
  return {
    create: _create,
    update: _update,
    list: _list,
    get: _get,
    delete: _delete,
  };
});
