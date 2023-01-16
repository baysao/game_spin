define([
  "app",
  "model/game",
  "model/present",
  app_view + "/webix/dndlist/dndlist",
], function ($app, $model_game, $model_present) {
  var scope;
  var presents = {};
  var presents_name = [];
  var games = {};

  var _list = {
    view: "list",
    id: "game_list",
    select: true,
    template: "#name#",
  };

  var _elements = [
    { view: "text", label: "ID", id: "game_id", name: "id", readonly: true },
    { view: "text", label: "User ID", id: "game_uid", name: "user_id", readonly: true },
    { view: "text", label: "Name", name: "name" },
    { view: "textarea", name: "desc", label: "Desc", height: 100 },
    {},
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

    {
      cols: [
        {
          view: "button",
          autowidth: true,
          id: "game_editor_submit",
          label: "Save",
          css: "webix_primary",
        },

        // {
        //   view: "button",
        //   autowidth: true,
        //   id: "game_play",
        //   label: "Open Game",
        //   css: "webix_primary",
        //   click: function () {
        //     window.open(
	// 	"/api/game/v1?action=game.html" +
	// 	    "&user_id=" + $$("game_uid").getValue() + 
	// 	    "&id=" + $$("game_id").getValue()
        //     );
        //   },
        // },

        {},
        {
          view: "button",
          autowidth: true,
          id: "game_editor_delete",
          label: "Delete",
          css: "webix_danger",
        },
      ],
    },
  ];
  var _editor = {
    view: "form",
    id: "game_editor",
    elementsConfig: {
      labelWidth: 130,
    },
    scroll: true,
    elements: _elements,
  };
  var _detail = {
    gravity: 2.2,
    type: "line",
    rows: [
      {
        rows: [
          {
            view: "tabbar",
            multiview: true,
            optionWidth: 100,
            options: [{ id: "game_editor", value: "Main" }],
          },
        ],
      },
      {
        cells: [_editor],
      },
    ],
  };

  var _layout = {
    rows: [
      {
        height: 49,
        css: "title",
        template:
          "<div class='header'>Game List</div><div class='details'>( list all game )</div>",
      },
      { cols: [_list, _detail] },
    ],
  };
  return {
    $ui: _layout,

    $oninit: function (_view, _scope) {
      scope = _scope;
      $$("game_editor").bind($$("game_list"));
      $$("game_editor_submit").attachEvent("onItemClick", function () {
        var _values = $$("game_editor").getValues();
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
        $model_game.update(_values, function (_res) {
          console.log(_res);
          if (_res && _res.result) {
            webix.message("Update successful!");
          }
        });
      });
      $$("game_editor_delete").attachEvent("onItemClick", function () {
        var _values = $$("game_editor").getValues();
        console.log(_values);
        $model_game.delete(_values, function (_res) {
          console.log(_res);
          if (_res && _res.result) {
            webix.message("Delete successful!");
            $$("game_list").remove(_values.id);
          }
        });
      });
      $$("game_list").attachEvent("onAfterSelect", function (id) {
        console.log(id);
        var _game = games[id];
        console.log(_game);
        // $$("game_presents").setChoices(presents_name);
        $$("game_presents").setValue([]);
        $$("game_presents").setValue(_game.presents);
      });
      $model_game.list(function (_res) {
        console.log(_res);
        if (_res.result) {
          var _data = _res.data;
          if (Object.keys(_data).length > 0) {
            $model_present.list(function (_res) {
              console.log(_res);
              if (_res.result) {
                var _data = _res.data;
                if (Object.keys(_data).length > 0) {
                  presents_name = _data.map(function (_it) {
                    presents[_it.name] = _it;

                    return _it.name;
                  });
                  console.log(games);
                  console.log(presents_name);
                  console.log(presents);
                  $$("game_presents").setChoices(presents_name);
                }
              }
            });
            _data = _data.map(function (_it) {
              games[_it.id] = _it;
              if (_it.presents) {
                var _presents = _it.presents;
                if (_presents.length > 0) {
                  _it.presents = _presents.map(function (_it1) {
                    return _it1.name;
                  });
                }
              }
              return _it;
            });
            console.log(_data);
            $$("game_list").parse(_data);
          }
        }
      });
    },
  };
});
