define(["app", "model/present"], function ($app, $model_present) {
  var scope;

  var _list = {
    view: "list",
    id: "present_list",
    select: true,
    template: "#name#",
  };
  var _elements = [
    { view: "text", label: "Name", name: "name" },
    { view: "text", label: "Display Name", name: "display" },
    { view: "text", label: "Image", name: "image" },
    { view: "textarea", name: "desc", label: "Desc", height: 100 },
    { view: "text", label: "Price", name: "price" },
    { view: "counter", label: "Quantity", name: "quantity", value: 1 },
    { view: "counter", label: "Weight", name: "weight", value: 1 },
    {},
    {
      cols: [
        {
          view: "button",
          autowidth: true,
          id: "present_editor_submit",
          label: "Save",
          css: "webix_primary",
        },
        {},
        {
          view: "button",
          autowidth: true,
          id: "present_editor_delete",
          label: "Delete",
          css: "webix_danger",
        },
      ],
    },
  ];
  var _editor = {
    view: "form",
    id: "present_editor",
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
            options: [{ id: "present_editor", value: "Main" }],
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
          "<div class='header'>Present List</div><div class='details'>( list all present )</div>",
      },
      { cols: [_list, _detail] },
    ],
  };
  return {
    $ui: _layout,

    $oninit: function (_view, _scope) {
      scope = _scope;
      $$("present_editor").bind($$("present_list"));
      $$("present_editor_submit").attachEvent("onItemClick", function () {
        var _values = $$("present_editor").getValues();
        console.log(_values);
        $model_present.update(_values, function (_res) {
          console.log(_res);
          if (_res && _res.result) {
            webix.message("Update successful!");
          }
        });
      });
      $$("present_editor_delete").attachEvent("onItemClick", function () {
        var _values = $$("present_editor").getValues();
        console.log(_values);
        $model_present.delete(_values, function (_res) {
          console.log(_res);
          if (_res && _res.result) {
            webix.message("Delete successful!");
            $$("present_list").remove(_values.id);
          }
        });
      });
      $model_present.list(function (_res) {
        console.log(_res);
        if (_res.result) {
          var _data = _res.data;
          if (Object.keys(_data).length > 0) $$("present_list").parse(_data);
        }
      });
    },
  };
});
