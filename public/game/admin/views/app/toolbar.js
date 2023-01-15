define(["model/menu_profile", "model/user"], function (
  model_menu_profile,
  $model_user
) {
  var scope;

  var _layout = {
    view: "toolbar",
    css: "mytoolbar",
    height: 50,
    elements: [
      {
        view: "button",
        type: "image",
        css: "webix_transparent",
          image: "assets/images/logo_kingsport_fixed.svg",
          // "https://cdn.kingsport.vn/image/catalog/logo/logo_kingsport_fixed.svg",
        // image: "assets/images/logo/logo.png",
        width: 80,
      },
      {
        template: "<p style='font-size:large;font-weight:bold;'>KingSport</p>",
        width: 100,
        borderless: true,
      },
      {},
      {
        view: "button",
        width: 80,
        // badge: 1,
        type: "icon",
        icon: "mdi mdi-bell",
        label: "Notification",
      },

      {
        view: "icon",
        icon: "mdi mdi-account",
        popup: {
          view: "contextmenu",
          data: model_menu_profile,
          on: {
            onMenuItemClick(id) {
              if (id === "signin") {
                location.hash = "#!/auth/login";
              } else if (id === "signout") {
                $model_user.signout(function (_res) {
                  location.hash = "#!/auth/login";
                });
              } else scope.show("./settings/$" + id);
            },
          },
        },
      },
    ],
  };

  return {
    $ui: _layout,
    $oninit: function (_view, _scope) {
      scope = _scope;
    },
  };
});
