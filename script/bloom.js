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

  var intervalId = setInterval(function () {
    if (document.hidden) {
      return;
    }
    jellyCt++;
    if (carryingCapacity !== 0 && jellyCt > carryingCapacity) {
      clearInterval(intervalId);
      return;
    }
    var xOffset = Math.floor((Math.random() * w) + 1);
    var jelly = document.getElementById("jelly-hidden").cloneNode(true);
    jelly.id = "svg" + jellyCt;
    jelly.className = "jelly-container";
    jelly.style.marginLeft = xOffset + "px";
    var tentacles = jelly.getElementsByClassName("tentacles")[0];
    tank.appendChild(jelly);

    TweenLite.to(jelly, 1, {scale : 2});
    TweenLite.to(jelly, 1, {autoAlpha: 1});
    var tx = new TimelineMax({onComplete: function(){jelly.remove()}});
    // there's definitely a better way to do this
    tx.to(jelly, 3, {y : dist})
      .to(jelly, 1.5, {autoAlpha : 0.5}, 0)
      .to(jelly, 1.5, {autoAlpha : 1}, 1.5)
      .to(tentacles, 1, {y : 0}, 0)
      .to(tentacles, 2, {y : -3}, 1)
      .to(jelly, 3, {y : dist*2})
      .to(jelly, 1.5, {autoAlpha : 0.5}, 3)
      .to(jelly, 1.5, {autoAlpha : 1}, 4.5)
      .to(tentacles, 1, {y : 0}, 3)
      .to(tentacles, 2, {y : -3}, 4)
      .to(jelly, 3, {y : dist*3})
      .to(jelly, 1.5, {autoAlpha : 0.5}, 6)
      .to(jelly, 1.5, {autoAlpha : 1}, 7.5)
      .to(tentacles, 1, {y : 0}, 6)
      .to(tentacles, 2, {y : -3}, 7)
      .to(jelly, 3, {y : dist*4})
      .to(jelly, 1.5, {autoAlpha : 0.5}, 9)
      .to(jelly, 1.5, {autoAlpha : 1}, 10.5)
      .to(tentacles, 1, {y : 0}, 9)
      .to(tentacles, 2, {y : -3}, 10)
      .to(jelly, 3, {y : dist*5})
      .to(jelly, 1.5, {autoAlpha : 0.5}, 12)
      .to(jelly, 1.5, {autoAlpha : 1}, 13.5)
      .to(tentacles, 1, {y : 0}, 12)
      .to(tentacles, 2, {y : -3}, 13);
  }, frequency);
};