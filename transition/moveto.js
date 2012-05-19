Transition.moveto = function (a, b, time, adv) {
  var w = window.innerWidth;
  document.body.style.overflow = 'hidden';
  a.style.zIndex  = 10;
  b.style.zIndex  = 20;
  b.style.display = 'block';
  if (adv) {
    b.style.left = w + 'px';
  } else {
    b.style.left = -1 * w + 'px';
  }
  setTimeout(function () { b.style.left = 0 });
  setTimeout(function () {
    document.body.style.overflow = 'auto';
  }, time);
};
