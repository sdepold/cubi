var loadedMethod = window.addEventListener || window.attachEvent

loadedMethod('load', function() {
  var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight

  var cellWidth  = 24
    , cellHeight = 28
    , cols       = ~~((x - 10) / cellWidth)
    , rows       = ~~((y - 30) / cellHeight)

  if(cols < 20) {
    document.body.className = document.body.className.split(' ').concat(['reduced']).join(' ')
  }

  game = new Game('body', { cols: cols, rows: rows }).render()

  document.getElementById('meta-data').style.width = (document.querySelector('table').offsetWidth - 10) + 'px'
}, false);
