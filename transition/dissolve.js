Transition.dissolve = function (a, b, time, adv) {
  a.style.zIndex  = 20;
  a.style.opacity = 0;
  b.style.display = 'block';
  b.style.zIndex  = 10;
  b.style.opacity = 1;
  setTimeout(function () {
    a.style.display = 'none';
    a.style.zIndex  = 10;
    a.style.opacity = 1;
    b.style.zIndex  = 20;
  }, time);
};