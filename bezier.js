
function SVG(width, height, containerID){
  
  this.width = width;
  this.height = height;
  this.viewBoxMultipier = 2;
  this.viewBoxWidth = this.width * this.viewBoxMultipier;
  this.viewBoxHeight = this.height * this.viewBoxMultipier;

  this.container = document.getElementById(containerID);
  this.element = null;
  this.id = 'svg';
  this.source = 'bezier.svg';
  this.box = null;
  this.ns = 'http://www.w3.org/2000/svg';
  
  this.element = this.create('svg', {
    'width': width + 'px',
    'height': height + 'px',
    'viewBox': '0 0 ' + this.viewBoxWidth + ' ' + this.viewBoxHeight,
    'xmlns:xlink': 'http://www.w3.org/1999/xlink',
    'version': '1.1'
  })
  
  this.box = this.create('rect', {
    'x': 0,
    'y': 0,
    'width': this.viewBoxWidth,
    'height': this.viewBoxHeight,
    'fill': '#f0f0f0',
    'stroke': '#c0c0c0',
    'stroke-width': 1
  })

  this.element.appendChild(this.box);
  this.container.appendChild(this.element);
      
}

SVG.prototype.addChild = function(o){
  this.element.appendChild(o);
}

SVG.prototype.create = function(name, props){

  var svgElement = document.createElementNS(this.ns, name)
  for(prop in props){
    svgElement.setAttribute(prop, props[prop]);
  }
  
  return svgElement;
}



function Point(x, y, r){

  this.x = x;
  this.y = y;
  this.r = r;
  this.element = null;
    
  this._createElement = function(){
    this.element = document.createElementNS('http://www.w3.org/2000/svg','circle');
    this.element.className = 'point';
    this.element.setAttribute('cx', x);
    this.element.setAttribute('cy', y);
    this.element.setAttribute('r', r);
    this.element.setAttribute('fill', '#666666');
  }
  
  this.coordinates = function(){
    return this.x.toString() + ',' + this.y.toString();
  }
  
  this._createElement();
  return this;
  
}


function Bezier(points, controls, svg){

  this.svg = svg;
  this.element = null;
  this.points = new Array();
  this.controls = new Array();
  var _this = this;
    
  var point;
  var control;
  var radius = 7;

  for(var i in points){
    point = new Point(points[i].x, points[i].y, radius);
    this.points.push(point);
  }

  for(var j in controls){
    control = new Point(controls[j].x, controls[j].y, radius);
    this.controls.push(control);
  }

  this.init = function(){
    this.element = create('path',{
      'class': 'bezier',
      'd': _this._getDataPath(),
      'fill': 'none',
      'stroke': 'red',
      'stroke-width': 1
    });

    
  }
  
  var draw = function(){
  
    //create circles for each point on curve
    //create circles cor each control
    //create path for the main curve
    //create lines for controls    

    console.log(this.element);    
  }
  
  //draw();
  
  var create = function(name, props){

    var svgElement = document.createElementNS('http://www.w3.org/2000/svg', name)
    for(prop in props){
      svgElement.setAttribute(prop, props[prop]);
    }
    
    return svgElement;
  }
  
  this.attachTo = function(svg){
    this.svg = svg;
    this.svg.addChild(this.element);
    
    for(point in this.points){
      this.svg.addChild(this.points[point].element);
    }
    
    for(control in this.controls){
      this.svg.addChild(this.controls[control].element);
    }
    
  }
  
  this.updateControl = function(index, control){
    if(index < 0 || index > this.controls.length - 1)
      return;
  
    this.controls[index] = control;
    this.draw();
    
  }
  
  this.showControls = function(show){
    if(!show) return;
        
  }
  

    
};

Bezier.prototype._getDataPath = function(){

  var d = '';

  for(i in this.points){
    
    if(i == 0){
      d += 'M' + this.points[i].coordinates();
      d += ' C' + this.controls[i].coordinates();
    } else{
      d += ' ' + this.controls[i].coordinates();
      d += ' ' + this.points[i].coordinates();
    }
  }
  
  return d;
}

Bezier.prototype.create = function(name, props){
  var svgElement = document.createElementNS(this.ns, name)
  for(prop in props){
    svgElement.setAttribute(prop, props[prop]);
  }
  
  return svgElement;
  
}

selected = null;
type = null;

function svgDidLoad(){

  var svgDoc = svg.contentDocument; //get the inner DOM of alpha.svg
  bezier = svgDoc.getElementById('curve');
  handle1 = svgDoc.getElementById('handle1');

  var path;
  
  path = document.createElement('path');
  path.className = 'bezier';
  path.setAttribute('d', 'M200,300 C400,50 400,550 600,300');
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke', 'red')
  path.setAttribute('stroke-width', '5');
    
    console.log(path);

/*
  var points = new Array();
  var controls = new Array();
*/
  
  svgDoc.addEventListener('click', didClick, false);
  svgDoc.addEventListener('dblclick', didDoubleClick, false);
  svgDoc.addEventListener('mousedown', didMouseDown, false);
  svgDoc.addEventListener('mouseup', didMouseUp, false);
  svgDoc.addEventListener('mousemove', didMouseMove, false);
  
  var points = svgDoc.getElementsByClassName('point');
  var controls = svgDoc.getElementsByClassName('control');
  
  for(var i=0; i<points.length; i++){
    console.log(points[i]);
    points[i].addEventListener('click', didClickPoint, false);
    points[i].addEventListener('dblclick', didDoubleClickPoint, false);
    points[i].addEventListener('mousedown', didMouseDownPoint, false);
    points[i].addEventListener('mouseup', didMouseUpPoint, false);
    points[i].addEventListener('mousedown', didMouseDownPoint, false);
  }

  for(var i=0; i<controls.length; i++){
    console.log(controls[i]);
    controls[i].addEventListener('click', didClickControl, false);
    controls[i].addEventListener('dblclick', didDoubleClickControl, false);
    controls[i].addEventListener('mousedown', didMouseDownControl, false);
    controls[i].addEventListener('mouseup', didMouseUpControl, false);
    controls[i].addEventListener('mousedown', didMouseDownControl, false);
  }
    
}

function didClick(evt){
  console.log('did click');
}

function didDoubleClick(evt){
  console.log('did double click');
}

function didMouseDown(evt){
  console.log('did mouse down');
}

function didMouseUp(evt){
  selected = null;
  type = null;
  console.log('did mouse up');
}

function didMouseMove(evt){
    var newX = evt.clientX*2;
    var newY = evt.clientY*2;

  if(selected  && type === 'point'){
    console.log(selected);
    selected.setAttribute('cx', newX);
    selected.setAttribute('cy', newY);
    
    bezier.setAttribute('d', 'M' + newX + ',' + newY+ ' C400,50 400,550 600,300');
    
  }
  
  if(selected && type === 'control'){
    selected.setAttribute('cx', newX);
    selected.setAttribute('cy', newY);
    
    handle1.setAttribute('d', 'M200,300 L' + newX + ',' + newY);
    bezier.setAttribute('d', 'M200,300 C' + newX + ',' + newY + ' 400,550 600,300');
    
  }
  
}



function didClickPoint(evt){
  evt.target.setAttribute('fill', '#ff0000');
}

function didDoubleClickPoint(evt){
  console.log('did double click');
}

function didMouseDownPoint(evt){
  selected = evt.target;
  type = 'point';
  console.log('did mouse down');
}

function didMouseUpPoint(evt){
  selected = null;
  type = null;
  console.log('did mouse up');
}

function didMouseMovePoint(evt){
  //console.log('x: ' + evt.clientX + ', y: ' + evt.clientY);
}



function didClickControl(evt){
  evt.target.setAttribute('fill', '#ff0000');
}

function didDoubleClickControl(evt){
  console.log('did double click');
}

function didMouseDownControl(evt){
  selected = evt.target;
  type = 'control';
  console.log('did mouse down');
}

function didMouseUpControl(evt){
  selected = null;
  type = null;
  console.log('did mouse up');
}

function didMouseMoveControl(evt){
  //console.log('x: ' + evt.clientX + ', y: ' + evt.clientY);
}


window.onload = function(){

/*
  requestAnimFrame(animloop);
  render();
*/ 

  svg = new SVG(600, 300, 'canvas');

  var points = [ {x:200,y:300}, {x:600,y:300} ];
  var controls = [ {x:400,y:50}, {x:400,y:550} ];


  bezier = new Bezier(points, controls, svg);
  bezier.init();
  bezier.attachTo(svg);
/*
  bezier.draw();
  console.log(bezier);
*/

  //svg.addChild(bezier.element);
  //console.log(svg);
  //svgDidLoad();
  //svg.addEventListener('load', svgDidLoad, false);

};