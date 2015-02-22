var Bloom = function(jellySvg, tankId, color, frequency, carryingCapacity) {
  this.isHidden = false;
  this.jellySvg = jellySvg;
  this.tank = document.getElementById(tankId);
  console.log(this.tank);
  this.color = color;
  this.frequency = frequency;
  this.carryingCapacity = carryingCapacity;

  //https://developer.mozilla.org/en-US/docs/Web/Guide/User_experience/Using_the_Page_Visibility_API
  var hidden, visibilityChange;
  if (typeof document.hidden !== "undefined") {
    hidden = "hidden";
    visibilityChange = "visibilitychange";
  } else if (typeof document.mozHidden !== "undefined") {
    hidden = "mozHidden";
    visibilityChange = "mozvisibilitychange";
  } else if (typeof document.msHidden !== "undefined") {
    hidden = "msHidden";
    visibilityChange = "msvisibilitychange";
  } else if (typeof document.webkitHidden !== "undefined") {
    hidden = "webkitHidden";
    visibilityChange = "webkitvisibilitychange";
  }
  var that = this;
  function handleVisibilityChange() {
    that.isHidden = document[hidden];
  }
  document.addEventListener(visibilityChange, handleVisibilityChange, false);
};

Bloom.prototype = {
  start: function () {
    var jellyCt = 0;
    var y = this.tank.offsetHeight;
    var dist = -y/4;
    var that = this;
    this.intervalId = setInterval(function () {
      if (that.isHidden) {
        return;
      }
      jellyCt++;
      if (that.carryingCapacity !== 0 && jellyCt > that.carryingCapacity) {
        clearInterval(that.intervalId);
        return;
      }
      var xOffset = Math.floor((Math.random() * that.tank.offsetWidth) + 1);
      var jelly = document.getElementById(that.jellySvg).cloneNode(true);
      jelly.id = "svg" + jellyCt;
      jelly.style.marginLeft = xOffset + "px";
      var tentacles = jelly.getElementsByClassName("tentacles")[0];
      that.tank.appendChild(jelly);

      var tx = new TimelineMax({onComplete: function(){jelly.remove()}});
      // there's definitely a better way to do this
      tx.to(jelly, 1, {fill: that.color}, 0)
        .to(jelly, 1, {autoAlpha: 1}, 1)
        .to(jelly, 3, {y : dist}, 1)
        .to(jelly, 1.5, {autoAlpha : 0.5}, 1)
        .to(jelly, 1.5, {autoAlpha : 1}, 2.5)
        .to(tentacles, 0.5, {y : 0}, 1)
        .to(tentacles, 2, {y : -3}, 2)
        .to(jelly, 3, {y : dist*2})
        .to(jelly, 1.5, {autoAlpha : 0.5}, 4)
        .to(jelly, 1.5, {autoAlpha : 1}, 5.5)
        .to(tentacles, 0.5, {y : 0}, 4)
        .to(tentacles, 2, {y : -3}, 5)
        .to(jelly, 3, {y : dist*3})
        .to(jelly, 1.5, {autoAlpha : 0.5}, 7)
        .to(jelly, 1.5, {autoAlpha : 1}, 8.5)
        .to(tentacles, 0.5, {y : 0}, 7)
        .to(tentacles, 2, {y : -3}, 8)
        .to(jelly, 3, {y : dist*4})
        .to(jelly, 1.5, {autoAlpha : 0.5}, 10)
        .to(jelly, 1.5, {autoAlpha : 1}, 11.5)
        .to(tentacles, 0.5, {y : 0}, 10)
        .to(tentacles, 2, {y : -3}, 11)
        .to(jelly, 3, {y : dist*5})
        .to(jelly, 1.5, {autoAlpha : 0.5}, 13)
        .to(jelly, 1.5, {autoAlpha : 1}, 14.5)
        .to(tentacles, 0.5, {y : 0}, 13)
        .to(tentacles, 2, {y : -3}, 14);
    }, that.frequency);
  },
  stop : function () {
    window.clearInterval(this.intervalId);
  }
};