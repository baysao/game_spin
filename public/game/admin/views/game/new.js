define([
  "app",
  "model/game",
  "model/present",
  app_view + "/webix/dndlist/dndlist",
], function ($app, $model_game, $model_present) {
  var scope;

  var presents = {};
  var _elements = [

    { view: "text", label: "Name", name: "name" },
    { view: "textarea", name: "desc", label: "Desc", height: 100 },
    {
      cols: [
        {
          view: "dndlist",
          id: "game_presents",
          name: "presents",
          minWidth: 800,
          label: "Presents",
          choices: [],
          value: [],
        },
        {},
      ],
    },
  ];

  var _form = {
    view: "form",
    id: "game_form",
    scroll: "y",
    elements: _elements,
    elementsConfig: {
      labelPosition: "top",
    },
  };
  var _layout = {
    rows: [
      {
        height: 49,
        css: "title",
        template:
          "<div class='header'>Add Game</div><div class='details'>( Define your new game )</div>",
      },
      _form,
      {
        cols: [
          {
            view: "button",
            autowidth: true,
            id: "game_submit",
            label: "Save",
            css: "webix_primary",
          },
          {},
        ],
      },
    ],
  };
  return {
    $ui: _layout,

    $oninit: function (_view, _scope) {
      scope = _scope;
      $model_present.list(function (_res) {
        console.log(_res);
        if (_res.result) {
          var _data = _res.data;
          if (Object.keys(_data).length > 0) {
            $$("game_presents").setChoices(
              _data.map(function (_it) {
                presents[_it.name] = _it;
                return _it.name;
              })
            );
          }
        }
      });

      $$("game_submit").attachEvent("onItemClick", function () {
        var _values = $$("game_form").getValues();
        console.log(_values);
        if (_values.presents) {
          var _presents = _values.presents;
          if (_presents.length > 0) {
            _presents.map(function () {
              _values.presents = _presents.map(function (_it) {
                return presents[_it];
              });
            });
          }
        }
        console.log(_values);

        $model_game.create(_values, function (_res) {
          console.log(_res);
          if (_res && _res.result) {
            webix.message("Submit successful!");
          }
        });
      });
    },
  };
});
