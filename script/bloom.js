var Bloom = function(tank, pathToJelly, frequency, carryingCapacity) {
  // http://stackoverflow.com/questions/1060008/is-there-a-way-to-detect-if-a-browser-window-is-not-currently-active
  var hidden = "hidden";
  if (hidden in document)
    document.addEventListener("visibilitychange", onchange);
  else if ((hidden = "mozHidden") in document)
    document.addEventListener("mozvisibilitychange", onchange);
  else if ((hidden = "webkitHidden") in document)
    document.addEventListener("webkitvisibilitychange", onchange);
  else if ((hidden = "msHidden") in document)
    document.addEventListener("msvisibilitychange", onchange);
  else if ('onfocusin' in document)
    document.onfocusin = document.onfocusout = onchange;
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
      var jelly = document.createElement("svg");
      jelly.id = id;
      jelly.className = "jelly-container";
      tank.appendChild(jelly);
      var snap = Snap("#" + id);
      var svg = data.select("svg");
      snap.append(svg.clone());
      snap.select("svg").attr({height: "16px", width: "16px"});
      var $jelly = document.getElementById(id);
      $jelly.style.marginLeft = xOffset + "px";
      var body = snap.select("g");
      var tentacles = body.select("g");
      jelly.style.top = startingPoint;
      jelly.style.webkitTransform = "translateY(0px)";
      jelly.style.transform = "translateY(0px)";
      var charge = function () {
        var pixels = parseFloat(jelly.style.webkitTransform.split(/[()]/)[1]);
        var newDist = dist + pixels;
        jelly.style.transform = "translateY(" + newDist + "px)";
        jelly.style.webkitTransform = "translateY(" + newDist + "px)";
        tentacles.animate({transform: "t 0 0"}, 1000, mina.easein, function () {
          push();
        });
      };
      var push = function() {
        tentacles.animate({transform: "t 0 -3"}, 2000, mina.easein, function () {
          charge();
        });
      };
      push();
      var cleanUp = function() {
        tentacles.stop();
        jelly.remove();
      };
      $jelly.addEventListener('webkitAnimationEnd', cleanUp);
      $jelly.addEventListener('animationend', cleanUp);
    }, frequency);
  });
};