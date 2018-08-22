// sets a yellow navigation bar on the bottom of a page

var curSlideIndex=0;

$(document).ready(function(){

 console.log('jQuery running');
 var item0=$('<div id="presiconfBar">preferences <button id="showLast" onclick="lastSlide()">last</button><button id="showNext" onclick="nextSlide()">next</button></div>');
 var curSlide=$('<div id="curSlide"></div>');
 $("body").append(item0);
 $("body").append(curSlide);
 
});

function nextSlide(){
  var selector="div:eq("+curSlideIndex+")";
  var htmlString=$(selector).html();
  ++curSlideIndex;
  console.log('curSlideIndex '+curSlideIndex);
  //console.log(htmlString);
 $("#curSlide").html(htmlString);
}

function lastSlide(){
  var selector="div:eq("+curSlideIndex+")";
  var htmlString=$(selector).html();
  if(curSlideIndex>0){--curSlideIndex;}
  console.log('curSlideIndex '+curSlideIndex);
  //console.log(htmlString);
 $("#curSlide").html(htmlString);
}
