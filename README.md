SlideScript
===========

* [demo](http://ss.geta6.net)
* ver 1.0

What's this
-----------

* slidescript is generator which makes markupped slide from markdowned text.
* require only javascript

How to use
----------

1. get script from github
2. touch and edit content.markdown
3. access to `file://path/to/slidescript/index.html`

that's all.

How to play
-----------

* ← : Previous
* → : Next
* Z : Help
* C : Index
* B : Build for Print
* R : Switch build mode

### Build Mode

* Stylize slide for print.

How to write
------------

1. page splitter is `---`
2. when the first heading is image, image is set to slide background
  * `overlay` property is used when hard to be visible
3. in a format `@property:value`, can stylize per page
  * `property` is css property name with JS format (`font-size` -> `fontSize`)
  * `value` is corresponding value

### special property

#### theme

* load external css
* `@theme:foobar` -> `<link rel='stylesheet' href='./theme/foobar.css'>`

#### transition

* set transition for slide
* transition is adapted when leaving the slide
* at default, `none` or `dissolve` or `moveto` can be used

#### defaultTransition

* set default transition name
* at default, `none`

#### duration

* set transition duration in milli seconds

#### defaultDuration

* set default duration value
* at default, `240`

#### overlay

* set background overlay


Define original transition
--------------------------

* `touch ./transition/original.js`

~~~js
Transition.originalTransition = function (a, b, time, adv) {
  // a    == Current Slide       : NodeElement
  // b    == Next Slide          : NodeElement
  // time == Transition Duration : Numeric
  // adv  == Advance or Back     : Boolean
}
~~~

* load script

~~~html
<script src='./transition/original.js'></script>
~~~

* use in slide
  * value is __extended function name__, not filename

~~~
@transition : originalTransition
~~~

License
-------

This software is based on BSD license.

Free for modification, redistribution and embedding if copyright included.

Copyright
---------

* [tanakahisateru/js-markdown-extra](https://github.com/tanakahisateru/js-markdown-extra)
