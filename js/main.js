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
    var ImageSurface = require('famous/surfaces/ImageSurface');
    var Modifier = require('famous/core/Modifier');
    var FlexibleLayout = require('famous/views/FlexibleLayout');

	var mainContext = Engine.createContext();


    var initialRatios = [];
    var finalRatios = [];
    var No= 40;
    var flex = new FlexibleLayout({
        ratios : initialRatios
    });

    var surfaces = [];
    for (var i = 0; i < No; i++) {
        size = [undefined, 200]
        surfaces.push(new ImageSurface({
            size: size,
	    content:'images/img'+(i%12)+'.jpg',
            properties: {
 //               backgroundColor: "hsl(" + (i * 360 / 50) + ", 100%, 50%)",
                border:"solid 1px black"
            }
        }));
        initialRatios.push(1);
        finalRatios.push(1);
    }

    flex.sequenceFrom(surfaces);
    function createRatio(x){
    	var active = No*x/window.innerWidth;
    	var min = 0.1;
    	//active = Math.round(active);
    	 for (var i = 0; i < No; i++) {
    		 finalRatios[i] = 1-2*(Math.abs(i-active)/No);
    		 finalRatios[i] = finalRatios[i]<min?min:finalRatios[i];
    		 finalRatios[i] = finalRatios[i]>1?1:finalRatios[i];
    	 }
    	 return finalRatios;
    }
    var toggle = false;
    Engine.on('click', function(){
        var ratios = toggle ? initialRatios : finalRatios;
        flex.setRatios(ratios, {curve : 'easeOut', duration : 500});
        toggle = !toggle;
    });
    Engine.on('mousemove', function(e){
        var ratios = createRatio(e.clientX);
        flex.setRatios(ratios, {curve : 'easeOut', duration : 30});
    });
    Engine.on('mouseleave', function(e){
        var ratios = initialRatios;
        flex.setRatios(ratios, {curve : 'easeOut', duration : 500});
    });
    mainContext.add(flex);
});
