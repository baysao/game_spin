define(["app", "model/showroom"], function ($app, $model_showroom) {
  var scope;

  var _elements = [
    { view: "text", label: "Name", name: "name" },
    { view: "text", label: "Address", name: "address" },
    { view: "text", label: "Secret", name: "secret" },
    { view: "textarea", name: "desc", label: "Desc", height: 100 },
  ];

  var _form = {
    view: "form",
    id: "showroom_form",
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
          "<div class='header'>Add Showroom</div><div class='details'>( Define your new showroom )</div>",
      },
      _form,
      {
        cols: [
          {
            view: "button",
            autowidth: true,
            id: "showroom_submit",
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
      $$("showroom_submit").attachEvent("onItemClick", function () {
        var _values = $$("showroom_form").getValues();
        console.log(_values);
        $model_showroom.create(_values, function (_res) {
          console.log(_res);
          if (_res && _res.result) {
            webix.message("Submit successful!");
          }
        });
      });
    },
  };
});
