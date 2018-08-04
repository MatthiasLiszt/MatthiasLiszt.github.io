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
                            {if(x.hasOwnProperty('screenshot'))
                              {var wrap=`<div class="project" >
                                          <!-- a href="${x.demo}" style="text-decoration:none;color:black;" -->
                                          <img src="screenshots/${x.screenshot}" onclick="window.open('${x.demo}')">
                                          <h4>${x.name}</h4>
                                          <a href="${x.source}">source</a>   
                                          <a href="${x.description}">description</a>  
                                          <!-- /a -->  
                                       </div>`;
                              }
                             else
                              {var wrap=`<div class="project" onclick="window.open('${x.demo}')">
                                          <!--a href="${x.demo}" style="text-decoration:none;color:black;" -->
                                          <iframe src="${x.demo}"></iframe>
                                          <h4>${x.name}</h4>
                                          <a href="${x.source}">source</a>   
                                          <a href="${x.description}">description</a>  
                                          <!-- /a -->  
                                       </div>`;
                               }
                             entries.push(wrap);
                            } 
                          }); 
  $('#entries').html(entries.join(' '));
}