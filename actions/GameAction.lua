local gbc = cc.import "#gbc"
local mytype = "game"
local Action = cc.class(mytype, gbc.ActionBase)
-- local env = require "env"
local inspect = require "inspect"
local CodeGen = require "CodeGen"
local Crud = cc.import("#crud")
local Session = cc.import("#session")
local json = cc.import("#json")
--local snappy = require "resty.snappy"
local uuid = require "jit-uuid"

local _game_templates = {
    ["index.html"] = [[
<!DOCTYPE html>
<html>
	<head>
  <base href="/game/spin/" target="_blank">
	<style type="text/css">
		body{
			padding:0px;
			margin:0px;
		}
		body canvas {
			margin: auto;
		}
	</style>
     <script src="phaser.min.js"></script>
     <script src="/api/game/v1?action=game.gamejs${params}"></script>
	</head>
	<body>
	</body>
</html>
]],
    ["game.js"] = [[
// the game itself
var game;
// the spinning wheel
var wheel;
// can the wheel spin?
var canSpin;
// slices (prizes) placed in the wheel
var slices = ${_slices};
// prize names, starting from 12 o'clock going clockwise
var slicePrizes = ${_presents};
// the prize you are about to win
var prize;
// text field where to show the prize
var prizeText;

window.onload = function () {
  // creation of a 458x488 game
  game = new Phaser.Game(458, 488, Phaser.AUTO, "");
  // adding "PlayGame" state
  game.state.add("PlayGame", playGame);
  // launching "PlayGame" state
  game.state.start("PlayGame");
};

// PLAYGAME STATE

var playGame = function (game) {};

playGame.prototype = {
  // function to be executed once the state preloads
  preload: function () {
    // preloading graphic assets
    game.load.image("wheel", "wheel.png");
    game.load.image("pin", "pin.png");
  },
  // funtion to be executed when the state is created
  create: function () {
    // giving some color to background
    game.stage.backgroundColor = "#fff";
    // adding the wheel in the middle of the canvas
    wheel = game.add.sprite(game.width / 2, game.width / 2, "wheel");
    // setting wheel registration point in its center
    wheel.anchor.set(0.5);
    // adding the pin in the middle of the canvas
    var pin = game.add.sprite(game.width / 2, game.width / 2, "pin");
    // setting pin registration point in its center
    pin.anchor.set(0.5);
    // adding the text field
    prizeText = game.add.text(game.world.centerX, 480, "");
    // setting text field registration point in its center
    prizeText.anchor.set(0.5);
    // aligning the text to center
    prizeText.align = "center";
    // the game has just started = we can spin the wheel
    canSpin = true;
    // waiting for your input, then calling "spin" function
    game.input.onDown.add(this.spin, this);
  },
  // function to spin the wheel
  spin() {
    // can we spin the wheel?
    if (canSpin) {
      // resetting text field
      prizeText.text = "";
      // the wheel will spin round from 2 to 4 times. This is just coreography
      var rounds = game.rnd.between(4, 8);
      // then will rotate by a random number from 0 to 360 degrees. This is the actual spin
      var degrees = ${d};// game.rnd.between(0, 360);
      // before the wheel ends spinning, we already know the prize according to "degrees" rotation and the number of slices
      prize = ${p};//slices - 1 - Math.floor(degrees / (360 / slices));
      // now the wheel cannot spin because it's already spinning
      canSpin = false;
      // animation tweeen for the spin: duration 3s, will rotate by (360 * rounds + degrees) degrees
      // the quadratic easing will simulate friction
      var spinTween = game.add.tween(wheel).to(
        {
          angle: 360 * rounds + degrees,
        },
        3000,
        Phaser.Easing.Quadratic.Out,
        true
      );
      // once the tween is completed, call winPrize function
      spinTween.onComplete.add(this.winPrize, this);
    }
  },
  // function to assign the prize
  winPrize() {
    // now we can spin the wheel again
    canSpin = true;
    // writing the prize you just won
    // prizeText.text = slicePrizes[prize];
    alert("You have won " + slicePrizes[prize].display);
  },
};
]]
}
local _opensession

function Action:init()
    ngx.log(ngx.ERR, "app init")
    self._crud = Crud:new(self:getInstance(), mytype)
end

function Action:htmlAction(args)
   local _opt = {params =
		    "&user_id=" .. args.user_id ..
		    "&id=" .. args.id ..
		    "&d=" .. args.d ..
		    "&p=" .. args.p
   }
    table.merge(_opt, _game_templates)
    local _tmpl = CodeGen(_opt)
    local _output = _tmpl("index.html")
    ngx.header["Content-type"] = "text/html"
    return _output
end

function Action:gamejsAction(args)
    local _opt, _err = self._crud:getall(args)
    cc.printerror(inspect(_opt))
    if _opt.presents then
       _opt._slices = #_opt.presents
       _opt._presents = json.encode(_opt.presents)
    end
    _opt.d = args.d
    _opt.p = args.p
    
    table.merge(_opt, _game_templates)
    local _tmpl = CodeGen(_opt)
    local _output = _tmpl("game.js")
    ngx.header["Content-type"] = "application/javascript"
    return _output
end

function Action:configAction(args)
    args.action = nil
    local _is_alive = _opensession(self:getInstance(), args)
    if not _is_alive then
        return {result = false}
    end

    return {
        result = true,
        data = {
            version = "0.0.1"
        }
    }
end

function Action:listAction(args)
    args.action = nil
    local session, _err = _opensession(self:getInstance(), args)
    if not session then
        return {result = false, error_code = _err}
    end
    local _user_id = session:get("id")
    -- uuid.seed(os.time())
    -- args.id = uuid()
    args.user_id = _user_id
    local _ret, _err = self._crud:list(args)
    -- cc.printerror(inspect(_ret))
    if _ret then
        return {result = true, data = _ret}
    end

    return {result = false}
end

function Action:deleteAction(args)
    args.action = nil

    local session, _err = _opensession(self:getInstance(), args)
    if not session then
        return {result = false, error_code = _err}
    end
    local _user_id = session:get("id")
    args.user_id = _user_id
    -- cc.printerror(inspect(args))
    local _ret, _err = self._crud:delete(args)
    if _ret then
        return {result = true}
    end

    return {result = false}
end

function Action:getAction(args)
    args.action = nil

    local session, _err = _opensession(self:getInstance(), args)
    if not session then
        return {result = false, error_code = _err}
    end
    local _user_id = session:get("id")
    args.user_id = _user_id
    local _ret, _err = self._crud:getall(args)
    if _ret then
        return {result = true, data = _ret}
    end

    return {result = false}
end

function Action:createAction(args)
    args.action = nil
    local session, _err = _opensession(self:getInstance(), args)
    if not session then
        return {result = false, error_code = _err}
    end
    local _user_id = session:get("id")
    local _now = os.time()
    uuid.seed(_now)
    args.created_at = _now
    args.id = uuid()
    -- math.randomseed(_now)
    -- args.api_key = uuid(math.random() + os.time())
    args.user_id = _user_id
    local _ret, _err = self._crud:update(args)
    if _ret then
        return {result = true}
    end

    return {result = false}
end

function Action:updateAction(args)
    args.action = nil
    local session, _err = _opensession(self:getInstance(), args)
    if not session then
        return {result = false, error_code = _err}
    end
    local _user_id = session:get("id")

    if args.user_id ~= _user_id then
        return {result = false}
    end

    -- cc.printerror(inspect(args))
    local _ret, _err = self._crud:update(args)
    if _ret then
        return {result = true}
    end

    return {result = false}
end

--private

_opensession = function(instance, args)
    local sid = args.token or ngx.var.cookie_OauthMbrAccessToken
    if not sid then
        --cc.throw('not set argsument: "sid"')
        return nil, 400
    end

    local session = Session:new(instance:getRedis())
    if not session:start(sid) then
        --cc.throw("session is expired, or invalid session id")
        return nil, 401
    end

    if session then
        session:setKeepAlive()
    end

    return session
end

return Action
