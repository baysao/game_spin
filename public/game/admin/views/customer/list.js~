define(["app", "model/showroom"], function ($app, $model_showroom) {
  var scope;

  var _list = {
    view: "list",
    id: "showroom_list",
    select: true,
    template: "#name#",
  };
  var _elements = [
    { view: "text", label: "ID", name: "id", readonly: true },
    {
      view: "text",
      label: "User ID",
      name: "user_id",
      id: "user_id",
      readonly: true,
    },
    { view: "text", label: "Name", name: "name" },
    { view: "text", label: "Secret", name: "secret" },
    { view: "text", label: "Address", name: "address" },
    { view: "textarea", name: "desc", label: "Desc", height: 100 },
    {},
    {
      cols: [
        {
          view: "button",
          autowidth: true,
          id: "showroom_editor_submit",
          label: "Save",
          css: "webix_primary",
        },
        {
          view: "button",
          autowidth: true,
          id: "showroom_editor_play",
          label: "Showroom Game",
          css: "webix_primary",
          click: function () {
            window.open(
              "/game/admin/#!/showroom.game.login:user_id=" +
                $$("user_id").getValue()
            );
          },
        },
        {},
        {
          view: "button",
          autowidth: true,
          id: "showroom_editor_delete",
          label: "Delete",
          css: "webix_danger",
        },
      ],
    },
  ];
  var _editor = {
    view: "form",
    id: "showroom_editor",
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
            options: [{ id: "showroom_editor", value: "Main" }],
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
          "<div class='header'>Showroom List</div><div class='details'>( list all showroom )</div>",
      },
      { cols: [_list, _detail] },
    ],
  };
  return {
    $ui: _layout,

    $oninit: function (_view, _scope) {
      scope = _scope;
      $$("showroom_editor").bind($$("showroom_list"));
      $$("showroom_editor_submit").attachEvent("onItemClick", function () {
        var _values = $$("showroom_editor").getValues();
        console.log(_values);
        $model_showroom.update(_values, function (_res) {
          console.log(_res);
          if (_res && _res.result) {
            webix.message("Update successful!");
          }
        });
      });
      $$("showroom_editor_delete").attachEvent("onItemClick", function () {
        var _values = $$("showroom_editor").getValues();
        console.log(_values);
        $model_showroom.delete(_values, function (_res) {
          console.log(_res);
          if (_res && _res.result) {
            webix.message("Delete successful!");
            $$("showroom_list").remove(_values.id);
          }
        });
      });
      $model_showroom.list({}, function (_res) {
        console.log(_res);
        if (_res.result) {
          var _data = _res.data;
          if (Object.keys(_data).length > 0) $$("showroom_list").parse(_data);
        }
      });
    },
  };
});
