/* 
 * Author:
 * Glavin Wiechert
 * Feb 21, 2013
 * 
 * Description:
 * This file handles the SMU Rotating News Feed.
 *  
 */


function loadNewsFeed() {
    // Require Node.JS support for crawling SMU homepage.
    
}

function displayNewsFeed() {
    // Displays the HTML form of the NewsFeed
    // Requires loadNewsFeed() be called prior.
    
}


// Global working variables
var manuallyRotating = false;
var newsSelected = 1; // 0=Has not started, 1=First item, etc.
var rotatePosition = 0;
var rotatorId = null;
var rotationInterval = 5000; // milliseconds
var startingOffset = 0;
var startPositionX = 0;

function autoRotate(options) {
    //console.log("Rotating News Feed");
    if (!manuallyRotating)
    {

        // Calculate new position
        //var newRotatePosition = rotatePosition;
        //newRotatePosition -= $("#newsFeed ul.newsList li.newsItem").width();
        if (options == undefined || options['increment'] != false)
            newsSelected++;
        if ( newsSelected > $("#newsFeed ul.newsList li.newsItem").length )
            newsSelected = 1; // Reset position
        if ( newsSelected < 0 )
            newsSelected = 0;
        var newRotatePosition 
                = newsSelected 
                * ( $("#newsFeed ul.newsList li.newsItem").width() 
                + parseInt($("#newsFeed ul.newsList li.newsItem").css('margin-left'))
                + parseInt($("#newsFeed ul.newsList li.newsItem").css('margin-right')) );

        /*
        if ( -1*(newRotatePosition) > $("#newsFeed ul.newsList").width() )
            newRotatePosition = 0; // Reset position
        */

        // Rotate
        $("#newsFeed ul.newsList li.newsItem").stop();
        $("#newsFeed ul.newsList li.newsItem").animate({
            left: ( -1*newRotatePosition + startingOffset )
        }, rotationInterval/5);
        // Save new position
        rotatePosition = newRotatePosition;
        console.log("Rotating News Feed: pos:"+rotatePosition+", n:"+newsSelected);
    }
}

function resizeNewsFeed() {
    /*
    var maxWidth = ($.mobile.activePage).find("div[data-role='content']").width();
    var maxHeight = ($.mobile.activePage).find("div[data-role='content']").height();
     */
    var maxWidth = $(window).width() 
            - parseInt($("#newsFeed ul.newsList li.newsItem").css('margin-left')) 
            - parseInt($("#newsFeed ul.newsList li.newsItem").css('margin-right'));
    var maxHeight = ( window.innerHeight ? window.innerHeight : $(window).height() )
            - $("div.smuToolsPanel [data-role='footer']").height() 
            - ($.mobile.activePage).find("div[data-role='header']").height() 
            - parseInt(($.mobile.activePage).find("div[data-role='content']").css('padding-top'))
            - parseInt(($.mobile.activePage).find("div[data-role='content']").css('padding-bottom'));
    
    var boxSize = (maxWidth < maxHeight)?maxWidth:maxHeight;
    $('#newsFeed ul.newsList li.newsItem').width(boxSize).height(boxSize);
    startingOffset = (maxWidth / 2) + (boxSize / 2);
    
    autoRotate({'increment':false}); // Start off with first position.
}

$(document).ready( function () {

    // Start the news feed rotator
    rotatorId = setInterval( function () { autoRotate(); }, rotationInterval);
    
    // Enable touch/drag feature for rotator
    $('#newsFeed ul.newsList li.newsItem img').on('dragstart', function(event) { event.preventDefault(); } ); // Disable default action for dragging image
    $(document).on('vmousedown', "#newsFeed ul.newsList li.newsItem", function(clickEvent) {
    console.log("Mouse down on rotator item.");
    console.log(clickEvent.target);
    manuallyRotating = true;
    startPositionX = clickEvent.pageX;
    console.log("Starting position:"+startPositionX);
    $("#newsFeed ul.newsList li.newsItem").stop();
    
    $(document).on('vmousemove', function(moveEvent) {
        var newX = moveEvent.pageX;
        //console.log(newX);
        //console.log(startPositionX - newX);
        var newRotatePosition = rotatePosition + (startPositionX - newX);
        console.log("newRotatePosition:"+newRotatePosition);
        $("#newsFeed ul.newsList li.newsItem").css({
            left: ( -1*newRotatePosition + startingOffset )
        });

        
        if (scrollPrevented == false) {
            scrollPrevented = true;
            $(document).on('touchmove', function(ev) {
                //alert("bet you can't scroll!");
                if (scrollPrevented == true)
                  ev.preventDefault();
            });
        }
        
        
    });
 
 $(document).on('vmouseup', function(upEvent) {
     console.log("Released mouse click");
     manuallyRotating = false;
     // Find closest
     var newX = upEvent.pageX;
     console.log("newX:"+newX);
     var newRotatePosition = rotatePosition + (startPositionX - newX);
     newsSelected = Math.ceil(( 
             newRotatePosition 
             - startingOffset/2         
             - parseInt($("#newsFeed ul.newsList li.newsItem").css('margin-left')) 
             - parseInt($("#newsFeed ul.newsList li.newsItem").css('margin-right')) ) / 
        (
        $("#newsFeed ul.newsList li.newsItem").width() 
        + parseInt($("#newsFeed ul.newsList li.newsItem").css('margin-right'))
       ));
     if ( newsSelected < 1 )
         newsSelected = 1;
     console.log("newSelected:"+newsSelected);
     // Move to closest
     autoRotate({'increment':false});
     clearInterval(rotatorId);
     rotatorId = setInterval( function () { autoRotate(); }, rotationInterval);

     
     if (scrollPrevented == true) {
        //alert("should be able to scroll now!");
        $('body').unbind('touchmove');
        //$(document).off('touchmove');
        scrollPrevented = false;
     }
     

     $(document).off('vmousemove');
     $(document).off('vmouseup');
    
});

    
});


  
});
