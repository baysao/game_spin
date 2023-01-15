define(["model/side_menu"], function (model_side_menu) {
  var scope;

  var _menu = {
    // view: "menu",
    view: "sidebar",
    layout: "y",
    scroll: "y",
    width: 200,
    // collapsed: true,
    // collapsedWidth: 43,
    select: true,
    // collapsed: true,
    data: model_side_menu,
    on: {
      // onMenuItemClick: function (id) {
      onAfterSelect: function (id) {
        scope.show("./" + id);
      },
    },
  };

  var _layout = _menu;
  // {
  //   rows: [
  //     {
  //       view: "button",
  //       type: "icon",
  //       icon: "mdi mdi-plus-circle",
  //       label: "Create Node",
  //       css: "webix_primary",
  //       click: function () {
  //         scope.show("/app/node.create/$zone");
  //       },
  //     },
  //     _menu,
  //   ],
  // };
  return {
    $ui: _layout,
    $oninit: function (_view, _scope) {
      scope = _scope;
    },
  };
});
