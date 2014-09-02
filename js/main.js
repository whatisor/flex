/**
 * FlexibleLayout
 * ------------
 *
 * FlexibleLayout is a component for making ratio based layouts
 * similar to HTML5 Flexbox.
 *
 * In this example, use a FlexibleLayout to arrange an array of
 * renderables based on both the parent size and the defined
 * size of the renderables
 */

define(function(require, exports, module) {
    var Engine = require('famous/core/Engine');
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var FlexibleLayout = require('views/FlexibleLayout');
    var View = require('famous/core/View');

    var No= 25;
    var mainContext = Engine.createContext();
    var initialRatios = [];
    var finalRatios = [];
    var activate=0;
    var flex = new FlexibleLayout({
        ratios : initialRatios,
        transition: {
            curve: 'easeInOut',
            duration: 30
          }
    });

    var surfaces = [];
    var WIDTH = 105;
    var slug = "narciso-rodriguez";
    var imageSrc =  "http://graphics8.nytimes.com/newsgraphics/2013/09/13/fashion-week-editors-picks/assets/thumbs-" + 1 + "/" + slug + ".jpg";
    var initialScale =(window.innerWidth/No)/WIDTH;
    for (var i = 0; i < No; i++) {
        size = [WIDTH, 225]
        var surface =new Surface({
            size: size,
            properties: {
                background: "url("+imageSrc+") "+(WIDTH*i-WIDTH*initialScale)+"px 0",
                border:"solid 1px "+"hsl(" + (i * 360 / 50) + ", 100%, 100%)",
                textAlign:"left"
            },
           // content:data[i]
        })
        surface.appId = i;
        surfaces.push(surface);
        initialRatios.push(initialScale);
        finalRatios.push(initialScale);
        
        surface.on('mousemove', function(e){
            activate = this.appId;
            //console.log(activate);
            var ratios = createRatio(e.clientX,e.offsetX);
            flex.setRatios(ratios, {curve : 'easeOut', duration : 200});
            //Update property
            updateProperties(ratios);
         }.bind(surface));
    }

    flex.sequenceFrom(surfaces);
    function createRatio(x){
    	var active = No*x/window.innerWidth;
		//console.log(active);
    	var min = 0.1;
    	var scale = WIDTH/(window.innerWidth/No) *active/Math.round(active);
    	var left = active;
    	var right = No-active;
    	//active = Math.round(active);
    	 for (var i = 0; i < No; i++) {
    		 //finalRatios[i] = ((i==activate?scale:1));//-2*(Math.abs(i-active)/No));
			 var site = i<=active?left:right;
    		 var smooth = Math.abs(i-active);///site;
    		
    		 finalRatios[i] =1 -1.8*smooth/(site+1);
    		 finalRatios[i] = finalRatios[i]<min?min:finalRatios[i];
			 //console.log(finalRatios[i]);
    		 //Update property
    	 }
    	 return finalRatios;
    }
    function updateProperties(ratios){
    	if(!ratios)ratios = initialRatios;
    	for (var i = 0; i < No; i++) {
    		var off = -WIDTH*(1-ratios[i])/2;
    		surfaces[i].setProperties({backgroundPosition:(WIDTH*i+off)+"px 0"});
    	}
    }
    mainContext.add(flex);
    flex.setRatios(initialRatios, {curve : 'easeOut', duration : 800});
    Engine.pipe(flex);
});
