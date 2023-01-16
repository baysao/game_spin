define(["app", "model/showroom","model/customer"], function ($app, $model_showroom, $model_customer) {
  var scope, showroom_id, user_id;
  var _games = {
    1: { id: "a6da4f4c-2794-418d-bb32-07876a035f42" },
    2: { id: "97da48cf-44cb-4e27-be4a-2244e6193d60" },
  };
  var _elements = [
    {
      view: "fieldset",

      css: "showroom_login",
      label: "Good luck ! Please fill your information",

      body: {
        rows: [
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
            view: "button",
            label: "Confirm",
            css: "webix_primary",
            id: "customer_confirm",
          },
          {},
        ],
      },
    },
  ];
  var _form = {
    view: "form",
    id: "customer_form",
    width: 400,
    scroll: "y",
    borderless: true,
    elementsConfig: {
      labelPosition: "top",
    },
    elements: _elements,
  };
  var _game = {
    view: "iframe",
    id: "game_url",
    hidden: true,
    //   src: "/api/game/v1?action=game.html&user_id=012b34fa-0b9f-4b1f-b568-664c29bc0010&id=f5345a14-37fa-4fea-8e60-954090985200",
  };
  var _layout = {
    borderless: true,
    cols: [_form, { width: 1 }, _game],
  };
    function _set_game(id, d, p) {
      var _url = location.origin + "/api/game/v1?action=game.html" +
	  "&showroom=" + showroom_id +
	  "&user_id=" + user_id +
	  "&d=" + d +
	  "&p=" + p +
	  "&id=" + id;
    console.log(_url);
    $$("game_url").define("src", _url);
  }
  return {
    $ui: _layout,
    $oninit: function (_view, _scope) {
      scope = _scope;
      var _params = $app.params();
      console.log(_params);
      if (_params && _params["showroom.game.play"]) {
        var _opt = _params["showroom.game.play"];
        showroom_id = _opt.id;
        user_id = _opt.user_id;
      }
     // _set_game(_games[1].id);
      $$("billing_type").attachEvent("onChange", function (_val) {
        _set_game(_games[_val].id);
      });
      $$("customer_confirm").attachEvent("onItemClick", function () {
          var _values = $$("customer_form").getValues();
	  _values.user_id = user_id;
	  _values.showroom = showroom_id;
          console.log(_values);
	  $model_customer.create(_values, function(_res){
	      console.log(_res);
	      if(_res.result) {
		  var _data = _res.data;
		  _set_game(_games[_values.billing_type].id, _data.d, _data.p);
		  $$("customer_form").disable();
		  $$("game_url").show();
	      }
	  })
       
      });
    },
  };
});
