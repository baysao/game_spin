define(["app", "model/present"], function ($app, $model_present) {
  var scope;

  var _elements = [
    { view: "text", label: "Name", name: "name" },
    { view: "text", label: "Display Name", name: "display" },
    { view: "text", label: "Image", name: "image" },
    { view: "textarea", name: "desc", label: "Desc", height: 100 },
    { view: "text", label: "Price", name: "price" },
      { view: "counter", label: "Quantity", name: "quantity", value: 1 },
      { view: "counter", label: "Weight", name: "weight", value: 1},
  ];

  var _form = {
    view: "form",
    id: "present_form",
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
          "<div class='header'>Add Present</div><div class='details'>( Define your new present )</div>",
      },
      _form,
      {
        cols: [
          {
            view: "button",
            autowidth: true,
            id: "present_submit",
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
      $$("present_submit").attachEvent("onItemClick", function () {
        var _values = $$("present_form").getValues();
        console.log(_values);
        $model_present.create(_values, function (_res) {
          console.log(_res);
          if (_res && _res.result) {
            webix.message("Submit successful!");
          }
        });
      });
    },
  };
});
