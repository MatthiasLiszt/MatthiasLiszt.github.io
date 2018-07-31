var tags=[];
projects.map(function(x){
 x.tags.map(function(y){var str=tags.join(' ');
                        if(str.indexOf(y)==-1)
                         {tags.push(y);}
                        }); 
});


addTagButton(tags);

 
function addTagButton(data){
 data.map(function(x){var wrap=`<button class="tagbutton" onclick="showEntryWithTag('${x}')">${x}</button>`;
                      //document.write(wrap); 
                      $("#mytags").append(wrap);
                     }); 
}

function showEntryWithTag(tag){
  var entries=[];
  //alert(tag);
  projects.map(function(x){var tagged=x.tags.join('');
                           if(tagged.indexOf(tag)!=-1)
                            {var wrap=`<div class="project" onclick="alert('clicked')">
                                          <a href="${x.demo}"><iframe src="${x.demo}"></iframe>
                                          <h4>${x.name}</h4>
                                          <a href="${x.source}">source</a>   
                                          <a href="${x.description}">description</a>  
                                          </a>  
                                       </div>`;
                             entries.push(wrap);
                            } 
                          }); 
  $('#entries').html(entries.join(' '));
}