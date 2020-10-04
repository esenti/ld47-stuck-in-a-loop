(function() {
  var DEBUG, before, c, ctx, delta, draw, elapsed, keysDown, keysPressed, load, loading, now, ogre, setDelta, tick, update;

  c = document.getElementById('draw');
  ctx = c.getContext('2d');

  delta = 0;
  now = 0;
  before = Date.now();
  elapsed = 0;
  loading = 0;

  DEBUG = false;
  // DEBUG = true;

  c.width = 800;
  c.height = 600;

  keysDown = {};

  keysPressed = {};
  click = {};

  framesThisSecond = 0;
  fpsElapsed = 0;
  fps = 0;
  totalElapsed = 0;

  round = 0;
  correctOption = 0;

  correctKeys = [
    89, 79, 85, 65, 82, 69, 83, 84, 85, 67, 75, 73, 78, 65, 76, 79, 79, 80,
  ]

  currentOptions = [0, 1, 2];
  currentKeys = [89, getRandomInt(65, 70), getRandomInt(71, 88)];

  text = "Choose what to do next";

  goodTexts = [
    "OK",
    "Good",
    "Yes",
    "Keep going",
    "Yup",
    "That's right",
    "Wise choice",
  ]

  badTexts = [
    "No",
    "Nooo.",
    "No no no!",
    "Absolutely not",
    "Incorrect",
    "Please no",
    "Nope",
    "That's wrong",
  ]

  fontSize = 50;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

  window.addEventListener("keydown", function(e) {

    if (e.keyCode < 65 || e.keyCode > 90) {
      return;
    }

    correctKey = correctKeys[round];
    console.log(e.keyCode);
    console.log(correctKey);

    if (e.keyCode == correctKey) {
      console.log("GOOD");
      text = goodTexts[getRandomInt(0, goodTexts.length - 1)];
    } else {
      console.log("BAD");
      text = badTexts[getRandomInt(0, badTexts.length - 1)];
      return;
    }

    round = (round + 1) % correctKeys.length;
    correctOption = (correctOption + 1) % 3;

    if(correctKeys[round] < 78) {
      currentKeys[0] = getRandomInt(correctKeys[round] + 1, 80);
      currentKeys[1] = getRandomInt(81, 86);
      currentKeys[2] = getRandomInt(87, 90);
    } else {
      currentKeys[0] = getRandomInt(65, 69);
      currentKeys[1] = getRandomInt(70, 73);
      currentKeys[2] = getRandomInt(74, correctKeys[round] - 1);
    }

    currentKeys[correctOption] = correctKeys[round];

    keysDown[e.keyCode] = true;
    return keysPressed[e.keyCode] = true;
  }, false);

  window.addEventListener("keyup", function(e) {
    return delete keysDown[e.keyCode];
  }, false);

  c.addEventListener("click", function(e) {
    click = {
      'x': e.offsetX,
      'y': e.offsetY,
    }

    console.log(click);
  })

  setDelta = function() {
    now = Date.now();
    delta = (now - before) / 1000;
    return before = now;
  };

  if (!DEBUG) {
    console.log = function() {
        return null;
    };
  }

  ogre = false;

  clicked = function(c, x, y, w, h) {
    return c.x >= x && c.x <= x + w && c.y >= y && c.y <= y + h;
  }

  tick = function() {
    setDelta();
    elapsed += delta;
    update(delta);
    draw(delta);
    keysPressed = {};
    click = null;
    if (!ogre) {
        return window.requestAnimationFrame(tick);
    }
  };

  update = function(delta) {
    framesThisSecond += 1;
    fpsElapsed += delta;
    totalElapsed += delta;

    fontSize = 50 + Math.sin(totalElapsed * 3) * 3;

    if(fpsElapsed >= 1) {
      fps = framesThisSecond / fpsElapsed;
      framesThisSecond = fpsElapsed = 0;
    }
  };

  draw = function(delta) {

    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, c.width, c.height);

    ctx.textAlign = "center";

    ctx.fillStyle = "#888888";
    ctx.font = fontSize + "px Visitor";
    ctx.fillText(text, 400, 150);

    ctx.fillStyle = "#eeeeee";
    ctx.font = "32px Visitor";

    ctx.fillText("WAKE UP", 150, 350);
    ctx.fillText("WORK", 400, 350);
    ctx.fillText("GO TO SLEEP", 650, 350);

    ctx.fillStyle = "#888888";
    ctx.font = "20px Visitor";

    ctx.fillText("[" + String.fromCharCode(currentKeys[0]) + "]", 150, 400);
    ctx.fillText("[" + String.fromCharCode(currentKeys[1]) + "]", 400, 400);
    ctx.fillText("[" + String.fromCharCode(currentKeys[2]) + "]", 650, 400);


    if(DEBUG) {
        ctx.fillStyle = "#888888";
        ctx.font = "20px Visitor";
        ctx.fillText(Math.round(fps), 20, 590);
    }
  };

  (function() {
    var targetTime, vendor, w, _i, _len, _ref;
    w = window;
    _ref = ['ms', 'moz', 'webkit', 'o'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    vendor = _ref[_i];
    if (w.requestAnimationFrame) {
    break;
    }
    w.requestAnimationFrame = w["" + vendor + "RequestAnimationFrame"];
    }
    if (!w.requestAnimationFrame) {
    targetTime = 0;
    return w.requestAnimationFrame = function(callback) {
    var currentTime;
    targetTime = Math.max(targetTime + 16, currentTime = +(new Date));
    return w.setTimeout((function() {
            return callback(+(new Date));
            }), targetTime - currentTime);
    };
    }
  })();

  load = function() {
    ctx.font = "101px Visitor";
    ctx.fillText("", 0, 0);

    if(loading) {
      window.requestAnimationFrame(load);
    } else {
      window.requestAnimationFrame(tick);
    }
  };

  load();

}).call(this);