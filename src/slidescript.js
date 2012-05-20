Transition = {
  none : function (a, b, time, adv) {
    a.style.display = 'none';
    a.style.opacity = 1;
    a.style.zIndex  = 10;
    b.style.display = 'block';
    b.style.opacity = 1;
    b.style.zIndex  = 20;
  }
};

SlideFunc = {
  animate : function (a, time) {
    a.style['-webkit-transition-duration'] = time / 1000 + 's';
    a.style['-moz-transition-duration']    = time / 1000 + 's';
    a.style['-ms-transition-duration']     = time / 1000 + 's';
    a.style['-o-transition-duration']      = time / 1000 + 's';
    a.style['transition-duration']         = time / 1000 + 's';
  },
  property : function (a, param) {
    a.style['-webkit-transition-property'] = param;
    a.style['-moz-transition-property']    = param;
    a.style['-ms-transition-property']     = param;
    a.style['-o-transition-property']      = param;
    a.style['transition-property']         = param;
  },
  after : function (a) {
    a.style.display = 'none';
    a.style.opacity = 1;
    a.style.zIndex = 10;
  },
  fadein : function (a, time) {
    SlideFunc.animate(a, time);
    a.style.display = 'block';
    setTimeout(function(){ a.style.opacity = 1 });
  },
  fadeout : function (a, time) {
    SlideFunc.animate(a, time);
    a.display = 'block';
    a.style.opacity = 0;
    setTimeout(function () {
      a.style.display = 'none';
    }, time);
  }
}

var SlideScript = function (opts) {



  var self = this,
      /* ELEMENT */theme, wrap, page, note, help, list,
      /* COUNTER */prev = 0, tout,
      time = 240,
      dftm = 240,
      dftr = 'none',
      sets = function (val, def) { return 'undefined' == typeof(val) ? def : val; },
      opts = sets(opts, {}),
      opts = { debug : sets(opts.debug, false) },
      elem = { block : [] },
      down = function (text) {
        var spl = ['<div class="page"><div class="sheet">','</div></div>'],
            mkd = Markdown(text, spl[0], spl[1]),
            reg = /(<p>|\n| )*@([a-zA-Z0-9]*?) *?: *?([#a-zA-Z0-9%\.]+?[#a-zA-Z0-9%\. ]+?)(<\/p>|\n)/gi,
            rep = '<input type="hidden" name="$2" value="$3">';
        return spl[0] + mkd.replace(reg, rep) + spl[1];
      };



  self.fn = {};




  // construct
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (4 == xhr.readyState) {
      if ('' == xhr.responseText) {
        window.alert('Not Found "content.markdown" or XHR Rejected.');
        return false;
      } else {
        theme = document.querySelector('link[name=theme]');
      }


      // Slide Page Create
      wrap = document.createElement('div');
      wrap.setAttribute('id', 'wrap');
      wrap.innerHTML = down(xhr.responseText);
      page = wrap.querySelectorAll('.page');
      page[0].style.display = 'block';
      document.body.appendChild(wrap);
      for (var i = 0; i < page.length; i++) {
        var args = page[i];
      }

      // Message Box
      note = document.createElement('div');
      note.setAttribute('id', 'note');
      document.body.appendChild(note);

      // Help Box
      help = document.createElement('div');
      help.setAttribute('id', 'help');
      help.setAttribute('class', 'repo');
      var txt = new Array(['← : Previous'], ['→ : Next'], ['Z : Help'], ['C : Index']);
      help.innerHTML = '<li>' + txt.join('</li><li>') + '</li>';
      document.body.appendChild(help);

      // List Index Box
      list = document.createElement('div');
      list.setAttribute('id', 'list');
      list.setAttribute('class', 'repo');
      document.body.appendChild(list);

      // Parameter Interpreter
      var idx = new Array();
      for (var i = 0; i < page.length; i++) {
        var param = page[i].querySelectorAll('input');
        for (var p = 0; p < param.length; p++) {
          var key = param[p].getAttribute('name');
          var val = param[p].getAttribute('value');
          switch (key) {
            case 'theme' :
            theme.setAttribute('href', './theme/' + val + '.css');
            break;
            case 'transition' :
            if ('undefined' == typeof(Transition[val])) {
              alert('undefined transition type "' + val + '" on page.' + i);
            }
            break;
            case 'defaultTransition' :
            if ('undefined' == typeof(Transition[val])) {
              alert('undefined default transition type "' + val + '" on page.' + i);
            } else {
              dftr = val;
            }
            break;
            case 'duration' :
            time = parseInt(val);
            break;
            case 'defaultDuration' :
            dftm = parseInt(val);
            break;
            default:
            time = dftm;
            page[i].style[key] = val + ' !important';
            break;
          }
        }
        for (var j = 0; j < 6; j++) {
          var heading = page[i].getElementsByTagName('h' + (j + 1));
          if (0 < heading.length) {
            var heading = heading[0].childNodes.item(0);
            if ('IMG' == heading.tagName) {
              var sheet = page[i].querySelector('.sheet');
              sheet.setAttribute('class', 'sheet image');
              page[i].style.backgroundImage = 'url(' + heading.getAttribute('src') + ')';
              heading.style.display = 'none';
              heading = 'IMAGE';
            } else {
              heading = heading.textContent;
            }
            break;
          } else if (5 == j) {
            heading = 'NO-HEADING';
          }
        }
        idx.push(heading);
      }
      list.innerHTML = '<li>' + idx.join('</li><li>') + '</li>';


    }
  };
  xhr.open('GET', './content.markdown', true);
  xhr.send();



  self.move = function (next) {
    if (next < 0 || page.length - 1 < next) {
      clearTimeout(tout);
      note.innerHTML = next < 0 ? 'Head of Slide.' : 'End of Slide.';
      SlideFunc.fadein(note, time);
      tout = setTimeout(function () {
        SlideFunc.fadeout(note, time);
      }, 600);
    } else {
      var tr = page[prev].querySelector('input[name="transition"]');
      SlideFunc.animate(page[prev], time);
      SlideFunc.animate(page[next], time);
      if (null != tr && 'undefined' == typeof(Transition[tr.value])) {
        window.alert('undefined transition type "' + tr.value + '".')
      }
      var prevTarget = page[prev];
      var nextTarget = page[next];
      Transition[null != tr ? tr.value : dftr](page[prev], page[next], time, prev < next);
      setTimeout(function () {
        SlideFunc.after(prevTarget);
      }, time);
      prev = next;
    }
  }



  var vs = {
    help : false,
    list : false
  };
  window.addEventListener('keydown', function (event) {
    if (opts.debug) console.log(event.keyCode);
    switch (event.keyCode) {
      case 37 : // ←
        vs.help = false;
        vs.list = false;
        self.move(prev - 1);
        break;
      case 39 : // →
        vs.help = false;
        vs.list = false;
        self.move(prev + 1);
        break;
      case 67 : // C
        vs.help = false;
        vs.list = !vs.list;
        break;
      case 90 : // Z
        vs.help = !vs.help;
        vs.list = false;
        break;
      default :
        vs.help = false;
        vs.list = false;
        break;
    }
    vs.help ? SlideFunc.fadein(help, time) : SlideFunc.fadeout(help, time);
    vs.list ? SlideFunc.fadein(list, time) : SlideFunc.fadeout(list, time);
  }, false);

}
