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
      /* ELEMENT */theme, links, wrap, page, note, help, list,
      /* COUNTER */prev = 0, tout, li,
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
            reg = /(<p>|\n| )*@([a-zA-Z0-9]*?) *?: *?([#a-zA-Z0-9%\.]+?[#a-zA-Z0-9%\. (,)]+?)(<\/p>|\n)/gi,
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
        links = document.querySelector('link');
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
      var txt = new Array(['← : Previous'], ['→ : Next'], ['Z : Help'], ['C : Index'], ['B : Build for Print'], ['R : Switch build mode']);
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
            case 'overlay' :
              var sheet = page[i].querySelector('.sheet');
              sheet.style.backgroundColor = val;
              break;
            default:
              time = dftm;
              page[i].style[key] = val + ' !important';
              break;
          }
        }
        for (var j = 0; j < 6; j++) {
          var headings = page[i].getElementsByTagName('h' + (j + 1));
          if (0 < headings.length) {
            var heading = headings[0].childNodes.item(0);
            if ('IMG' == heading.tagName) {
              var sheet = page[i].querySelector('.sheet');
              sheet.setAttribute('class', 'sheet image');
              page[i].style.backgroundImage = 'url(' + heading.getAttribute('src') + ')';
              heading.style.display = 'none';
              if (1 < headings.length) {
                heading = headings[1].childNodes.item(0);
              } else {
                continue;
              }
            }
            heading = heading.textContent;
            break;
          } else if (5 == j) {
            heading = 'NO-HEADING';
          }
        }
        idx.push(heading);
      }
      list.innerHTML = '<li class="selected">' + idx.join('</li><li>') + '</li>';
      li = list.querySelectorAll('li');
      for (var i = 0; i < li.length; i++) {
        li[i].setAttribute('x-index', i);
        li[i].addEventListener('click', function (event) {
          var index = event.target.getAttribute('x-index');
          if (prev != index) {
            self.move(index);
          }
        }, false);
      }


    }
  };
  xhr.open('GET', './content.markdown', true);
  xhr.send();



  self.move = function (next) {
    next = next - 0;
    if (next < 0 || page.length - 1 < next) {
      clearTimeout(tout);
      note.innerHTML = next < 0 ? 'Head of Slide.' : 'End of Slide.';
      SlideFunc.fadein(note, time);
      tout = setTimeout(function () {
        SlideFunc.fadeout(note, time);
      }, 1000);
    } else {
      for (var i = 0; i < li.length; i++) {
        li[i].setAttribute('class', '');
      }
      li[next].setAttribute('class', 'selected');
      var tr = page[prev].querySelector('input[name="transition"]');
      SlideFunc.animate(page[prev], time);
      SlideFunc.animate(page[next], time);
      if (null != tr && 'undefined' == typeof(Transition[tr.value])) {
        window.alert('undefined transition type "' + tr.value + '".')
      }
      var prevTarget = page[prev];
      Transition[null != tr ? tr.value : dftr](page[prev], page[next], time, prev < next);
      setTimeout(function () {
        SlideFunc.after(prevTarget);
      }, time);
      prev = next;
    }
  }


  var vs = {
    help : false,
    list : false,
    over : false
  };
  window.addEventListener('keydown', function (event) {
    if (opts.debug) console.log(event.keyCode);
    switch (event.keyCode) {
      case 37 : // ←
        if (!vs.over) {
          vs.help = false;
          vs.list = false;
          self.move(prev - 1);
        }
        break;
      case 39 : // →
        if (!vs.over) {
          vs.help = false;
          vs.list = false;
          self.move(prev + 1);
        }
        break;
      case 66 : // B
        vs.over = !vs.over ? 'individual' : 'release';
        vs.help = false;
        vs.list = false;
        break;
      case 67 : // C
        vs.help = false;
        vs.list = !vs.list;
        break;
      case 82 : // R
        switch (vs.over) {
          case 'handout'    : vs.over = 'individual'; break;
          case 'individual' : vs.over = 'handout'; break;
          default : break;
        }
        break;
      case 90 : // Z
        vs.help = !vs.help;
        vs.list = false;
        break;
      default :
        vs.help = false;
        vs.list = false;
        vs.over = false;
        break;
    }
    vs.help ? SlideFunc.fadein(help, time) : SlideFunc.fadeout(help, time);
    vs.list ? SlideFunc.fadein(list, time) : SlideFunc.fadeout(list, time);

    if (false == vs.over) {
      console.log(false);
      return false;
    } else if ('release' == vs.over ) {
      if (note.getAttribute('x-notify')) {
        note.setAttribute('x-notify', '');
        SlideFunc.fadeout(note, time);
      }
      links.setAttribute('href', './src/styles.css');
      var image = document.querySelectorAll('.print');
      for (var i = 0; i < image.length; i++) {
        image[i].parentNode.removeChild(image[i]);
      }
      for (var i = 0; i < page.length; i++) {
        page[i].style.display = prev == i ? 'block' : 'none';
        page[i].style.height = 'auto';
      }
      vs.over = false;
    } else {
      note.innerHTML = 'Mode: ' + vs.over + '<br>To switch, Press [R].';
      note.setAttribute('x-notify', 'true');
      SlideFunc.fadein(note, time);
      // 個別にフルサイズ
      links.setAttribute('href', './src/' + vs.over + '.css');
      for (var i = 0; i < page.length; i++) {
        page[i].style.display = 'block';
        if ('initial' != page[i].style.backgroundImage && '' != page[i].style.backgroundImage) {
          if (null == page[i].querySelector('.print')) {
            var image = document.createElement('img');
            image.style.zIndex = 10;
            image.style.maxWidth = '100%';
            image.setAttribute('src', page[i].style.backgroundImage.replace(/^url\((.*)\)$/g,'$1'));
            image.setAttribute('class', 'print');
            page[i].appendChild(image);
          }
        }
      }
    }
  }, false);

}
