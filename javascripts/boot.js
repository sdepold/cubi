window.addEventListener('load', function() {
  var w=window,d=document,e=d.documentElement,g=d.getElementsByTagName('body')[0],x=w.innerWidth||e.clientWidth||g.clientWidth,y=w.innerHeight||e.clientHeight||g.clientHeight

  var cellWidth  = 24
    , cellHeight = 28

  game = new Game('body', {
    cols: ~~(x / cellWidth),
    rows: ~~((y - 30) / cellHeight)
  }).render()

  document.getElementById('meta-data').style.width = (document.querySelector('table').offsetWidth - 10) + 'px'
}, false);
