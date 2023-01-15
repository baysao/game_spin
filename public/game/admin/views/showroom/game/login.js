define(["app", "model/showroom"], function ($app, $model_showroom) {
  var scope;
  var _elements = [
    {
      view: "fieldset",

      css: "showroom_login",
      label: "Welcome! Login here",

      body: {
        rows: [
          {
            view: "combo",
            label: "Showroom",
            name: "id",
            id: "showroom_list",
            options: [],
          },
          {
            view: "text",
            type: "password",
            label: "Password",
            name: "user_id",
          },
          {
            view: "button",
            label: "Login",
            css: "webix_primary",
            id: "showroom_submit",
          },
        ],
      },
    },
  ];
  var _form = {
    view: "form",
    id: "showroom_form",
    borderless: true,
    elementsConfig: {
      labelPosition: "top",
    },
    elements: _elements,
  };
  var _layout = {
    borderless: true,
    cols: [{}, _form, {}],
  };
  return {
    $ui: _layout,
    $oninit: function (_view, _scope) {
      scope = _scope;
      $$("showroom_submit").attachEvent("onItemClick", function () {
        var _values = $$("showroom_form").getValues();
        if (_values.user_id.length > 36) {
          var _user_id = _values.user_id;
          _values.user_id = _user_id.substring(0, 36);
          _values.secret = _user_id.substring(36);
        }
        console.log(_values);
        $model_showroom.get(_values, function (_res) {
          console.log(_res);
            if (_res.result) {
		var _data = _res.data;
		location.hash = "#!/showroom.game.play:id=" + _data.id + ":user_id=" + _data.user_id;
          }
        });
      });
      var _params = $app.params();
      console.log(_params);
      var _user_id = "012b34fa-0b9f-4b1f-b568-664c29bc0010";
      if (
        _params &&
        _params["showroom.game.login"] &&
        _params["showroom.game.login"]["user_id"]
      ) {
        _user_id = _params["showroom.game.login"]["user_id"];
      }
      $model_showroom.list({ user_id: _user_id }, function (_res) {
        console.log(_res);
        if (_res.result) {
          var _data = _res.data;
          if (Object.keys(_data).length > 0) {
            var _showrooms = _data.map(function (_it) {
              return { id: _it.id, value: _it.name };
            });
            $$("showroom_list").define("options", _showrooms);
          }
        }
      });
    },
  };
});
