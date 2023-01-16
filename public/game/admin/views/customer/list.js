define(["app", "model/customer"], function ($app, $model_customer) {
  var scope;

  var _list = {
    view: "list",
    id: "customer_list",
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
       {
            view: "text",
            label: "Billing Number",
            name: "billing_number",
          },
          {
            view: "radio",
            label: "Billing Type",
            name: "billing_type",
            id: "billing_type",
            value: 1,
            options: [
              { id: 1, value: "Under 20tr" },
              { id: 2, value: "Over 20tr" },
            ],
          },

          {
            view: "text",
            label: "Full Name",
            name: "name",
          },
          {
            view: "text",
            label: "Phone number",
            name: "phone",
          },
          {
            view: "radio",
            label: "Document Type",
            name: "document_type",
            value: 1,
            options: [
              { id: 1, value: "CMND" },
              { id: 2, value: "CCCD" },
              { id: 3, value: "Passport" },
            ],
          },

          {
            view: "text",
            label: "Document ID",
            name: "document_id",
          },
       {
            view: "text",
            label: "Present",
            name: "present",
          },
      

    {},
    {
      cols: [
        {
          view: "button",
          autowidth: true,
          id: "customer_editor_submit",
          label: "Save",
          css: "webix_primary",
        },
        // {
        //   view: "button",
        //   autowidth: true,
        //   id: "customer_editor_play",
        //   label: "Customer Game",
        //   css: "webix_primary",
        //   click: function () {
        //     window.open(
        //       "/game/admin/#!/customer.game.login:user_id=" +
        //         $$("user_id").getValue()
        //     );
        //   },
        // },
        {},
        {
          view: "button",
          autowidth: true,
          id: "customer_editor_delete",
          label: "Delete",
          css: "webix_danger",
        },
      ],
    },
  ];
  var _editor = {
    view: "form",
    id: "customer_editor",
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
            options: [{ id: "customer_editor", value: "Main" }],
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
          "<div class='header'>Customer List</div><div class='details'>( list all customer )</div>",
      },
      { cols: [_list, _detail] },
    ],
  };
  return {
    $ui: _layout,

    $oninit: function (_view, _scope) {
      scope = _scope;
      $$("customer_editor").bind($$("customer_list"));
      $$("customer_editor_submit").attachEvent("onItemClick", function () {
        var _values = $$("customer_editor").getValues();
        console.log(_values);
        $model_customer.update(_values, function (_res) {
          console.log(_res);
          if (_res && _res.result) {
            webix.message("Update successful!");
          }
        });
      });
      $$("customer_editor_delete").attachEvent("onItemClick", function () {
        var _values = $$("customer_editor").getValues();
        console.log(_values);
        $model_customer.delete(_values, function (_res) {
          console.log(_res);
          if (_res && _res.result) {
            webix.message("Delete successful!");
            $$("customer_list").remove(_values.id);
          }
        });
      });
      $model_customer.list({}, function (_res) {
        console.log(_res);
          if (_res.result) {
	      console.log("vao day")
            var _data = _res.data;
	    console.log(_data);
          if (Object.keys(_data).length > 0) $$("customer_list").parse(_data);
        }
      });
    },
  };
});
