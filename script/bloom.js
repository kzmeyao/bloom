var Bloom = function(tank, pathToJelly, frequency, carryingCapacity) {
  // http://stackoverflow.com/questions/1060008/is-there-a-way-to-detect-if-a-browser-window-is-not-currently-active
  var hidden = "hidden";
  // Standards:
  if (hidden in document)
    document.addEventListener("visibilitychange", onchange);
  else if ((hidden = "mozHidden") in document)
    document.addEventListener("mozvisibilitychange", onchange);
  else if ((hidden = "webkitHidden") in document)
    document.addEventListener("webkitvisibilitychange", onchange);
  else if ((hidden = "msHidden") in document)
    document.addEventListener("msvisibilitychange", onchange);
  // IE 9 and lower:
  else if ('onfocusin' in document)
    document.onfocusin = document.onfocusout = onchange;
  // All others:
  else
    window.onpageshow = window.onpagehide
      = window.onfocus = window.onblur = onchange;

  function onchange (evt) {
    var v = 'visible', h = 'hidden',
      evtMap = {
        focus:v, focusin:v, pageshow:v, blur:h, focusout:h, pagehide:h
      };

    evt = evt || window.event;
    if (evt.type in evtMap)
      document.body.className = evtMap[evt.type];
    else
      document.body.className = this[hidden] ? "hidden" : "visible";
  }

  var tank = document.getElementById(tank);
  var jellyCt = 0;
  var w = tank.offsetWidth;
  var y = tank.offsetHeight;
  var dist = -y/4;
  var startingPoint = y - dist + "px";
  var intervalId = Snap.load(pathToJelly, function (data) {
    setInterval(function () {
      if (document.hidden) {
        return;
      }
      jellyCt++;
      if (carryingCapacity !== 0 && jellyCt > carryingCapacity) {
        clearInterval(intervalId);
        return;
      }
      var xOffset = Math.floor((Math.random() * w) + 1);
      var id = "svg" + jellyCt;
      var container = document.createElement("svg");
      container.id = id;
      container.className = "jelly-container";
      tank.appendChild(container);
      var jelly = Snap("#" + id);
      var svg = data.select("svg");
      jelly.append(svg.clone());
      jelly.select("svg").attr({height: "16px", width: "16px"});
      document.getElementById(id).style.marginLeft = xOffset + "px";
      var body = jelly.select("g");
      var tentacles = body.select("g");
      container.style.top = startingPoint;
      container.style.webkitTransform = "translateY(0px)";
      var charge = function () {
        var pixels = parseFloat(container.style.webkitTransform.split(/[()]/)[1]);
        container.style.webkitTransform = "translateY(" + (dist + pixels) + "px)";
        tentacles.animate({transform: "t 0 0"}, 1000, mina.easein, function () {
          push();
        });
      };
      var push = function() {
        tentacles.animate({transform: "t 0 -2"}, 2000, mina.easein, function () {
          charge();
        });
      }
      push();
      var $jelly = document.getElementById(id);
      $jelly.addEventListener('webkitAnimationEnd', function () {
        tentacles.stop();
        jelly.remove();
      }, false);
      $jelly.addEventListener('animationend', function () {
        tentacles.stop();
        jelly.remove();
      }, false);
    }, frequency);
  });
};