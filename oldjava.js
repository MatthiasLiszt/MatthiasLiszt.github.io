var background=true;
var doubleSize=false;

function shrinkPicture(){
 //alert("picture clicked");
 var width=document.images[0].width;
 var height=document.images[0].height;
 console.log("current picture dimensions "+width+" x "+ height);
 window.document.images[0].setAttribute("width",Math.round(width/1.41));
 window.document.images[0].setAttribute("height",Math.round(height/1.41));
}

function changeTessellation(){
 console.log("body clicked");
 if(background)
  {document.body.style.background = "#eaeaea";
   background=false;
  }
 else
  {document.body.style.background = "url(arabesque.jpg) repeat";
   document.body.style.backgroundSize = "110px 110px";
   background=true;
  }
}

function bobChange(){
 document.body.style.background = "url(bobst.svg) repeat";
 if(doubleSize)
  {document.body.style.backgroundSize = "25px 15px";}
 else
  {document.body.style.backgroundSize = "50px 30px";}
 doubleSize=!doubleSize;
}

//setInterval(bobChange,7000);

function resumeLoad(){
 var win = window.open("CVMLiszt2018/index.html", '_blank');
 win.focus();
}