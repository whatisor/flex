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
    var StateModifier = require('famous/modifiers/StateModifier');
    var FlexibleLayout = require('famous/views/FlexibleLayout');
	var mainContext = Engine.createContext();
    var initialRatios = [];
    var finalRatios = [];
    var No= 30;
    if (window.innerWidth < 600)
        No = 15;
    var flex = new FlexibleLayout({
        ratios : initialRatios
    });
    var flexMod = new StateModifier({
            origin: [0,0.05]
    });
    var surfaces = [];
    var size = [undefined, 200];
    for (var i = 0; i < No; i++) {
        var temp = new ImageSurface({
            size: size,
	        content:'images/img'+(i%12)+'.jpg',
            properties: {
 //               backgroundColor: "hsl(" + (i * 360 / 50) + ", 100%, 50%)",
                border:"solid 1px black"
            }
        });
        surfaces.push(temp);
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
        flex.setRatios(ratios, {curve : 'easeOut', duration : 100});
        toggle = !toggle;
    });
    Engine.on('mousemove', function(e){
        var ratios = createRatio(e.clientX);
         console.log('touch start' + e.clientX);
        flex.setRatios(ratios, {curve : 'easeOut', duration : 30});
    });
    Engine.on('touchstart',function(e) {
        var ratios = createRatio(e.touches[0].clientX);
        console.log('touch start' + e.touches[0].clientX);
        flex.setRatios(ratios);
       // , {curve : 'easeOut', duration : 30});
    });
    Engine.on('touchmove', function(e){
        var ratios = createRatio(e.touches[0].clientX);
        console.log('touch start' + e.touches[0].clientX);
        flex.setRatios(ratios);
        // {curve : 'easeOut', duration : 30});
    });
    Engine.on('mouseleave', function(e){
        var ratios = initialRatios;
        console.log('touch start' + e.clientX);
        flex.setRatios(ratios, {curve : 'easeOut', duration : 500});
    });
    Engine.on('touchend', function(e){
        var ratios = initialRatios;
        console.log('touch end');
        flex.setRatios(ratios);
        //, {curve : 'easeOut', duration : 500});
    });
    mainContext.add(flexMod).add(flex);
});
