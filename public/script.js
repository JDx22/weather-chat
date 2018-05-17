
var city_posts=[];
var id=0;

$(".get-temp-form").on('submit',function(event){
  event.preventDefault();
  var place=$(".weather-input-text").val();
  fetch(place);
})

var fetch = function (place) {
  var posts=[];
  $.ajax({
    method: "GET",
    url: 'http://api.openweathermap.org/data/2.5/weather?q='+place+'&APPID=5cf9678e7428122aebeedce362a2bff9&units=metric',
    success: function(data) {
      console.log(data);   
      city_posts.unshift({data:data,id:++id,posts:posts,commentTextFieldVisible:false});
      renderScreen();
    },
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(textStatus);
    }
  }); 
};
function renderScreen(){
  localStorage.setItem('userSession',JSON.stringify(city_posts));
  var ans="";
  for(var i in city_posts){
          // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    var date = new Date(city_posts[i].data.dt*1000);
    // Hours part from the timestamp
    var hours = "0"+date.getHours();
    // Minutes part from the timestamp
    var minutes = "0" + date.getMinutes();
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var day= days[date.getDay()];
    // Will display time in 10:30 format
    var formattedTime = day+' '+hours.substr(-2) + ':' + minutes.substr(-2); 
    ans+='<div class="card-with-comments mt-4 " data-id="'+city_posts[i].id+'"  >\
            <div class="card text-white bg-dark " >\
              <div class="card-header">\
                '+city_posts[i].data.name+'\
                <button type="button" class="btn btn-link mbtn-trash"><i class="fa fa-trash"></i></button>\
              </div>\
              <div class="card-body ">\
                <p class="card-text">'+formattedTime+'</p>\
                <div class="card-temp">'+Math.round(city_posts[i].data.main.temp)+'<span>&#8451;</span></div> \
                <p class="card-text"><small class="text-muted last-updated">Last updated '+new Date()+'</small></p>\
              </div>\
              <div class="card-footer ">\
                  <!-- <button type="button" class="btn btn-outline-dark">Dark</button> -->\
                <button type="button" class="btn btn-outline-primary mbtn-like"><i class="fa  fa-thumbs-up"></i>Like!</button>\
                <button type="button" class="btn btn-outline-success  mbtn-comment">Comment...</button>\
                <button type="button" class="btn btn-outline-info mbtn-share">Share</button>\
              </div>\
            </div>\
            <div class="comments-container">\
            </div>\
          </div>'
  }

  $(".card-main").empty().append(ans);

  for(var i in city_posts){
    ans="";
    for(var ii in city_posts[i].posts){
      ans+='<div class="card  text-white bg-secondary ">\
              <div class="card-body ">\
                <div class="post" data-id="'+city_posts[i].posts[ii].id+'">'+city_posts[i].posts[ii].post+'<button type="button " class="ml-3 btn btn-outline-success replay-btn"> Replay  </button></div>\
              </div>\
            </div>';
    }
    $('*[data-id='+city_posts[i].id+']').find('.comments-container').empty().append(ans);
  }

  for ( var i in city_posts){
    if( city_posts[i].commentTextFieldVisible===true){
      $('*[data-id='+city_posts[i].id+']').find(".card-footer").append('\
        <form class="comment-form">\
          <div class="form-group">\
            <input type="text" class="form-control text-white bg-success comment-text-field"  aria-describedby="commentHelp" placeholder="Write a comment...">\
            <small id="commentHelp" class="form-text text-muted">press enter to post</small>\
          </div>\
        </form>');
    }
  }

  for( var city in city_posts){
    for( var post in city_posts[city].posts){
      ans="";
      for(var repl in city_posts[city].posts[post].replays){  
        ans+='\
          <div class="card  text-white bg-dark ml-4 ">\
            <div class="card-body" data-id="'+city_posts[city].posts[post].replays[repl].id+'">\
              <div>'+city_posts[city].posts[post].replays[repl].replay+'</div>\
            </div>\
          </div>'
      }
      $('*[data-id='+city_posts[city].posts[post].id+']').closest('.card').after(ans);
    }
  }
}
$('.card-main').on('click','.mbtn-comment',function(event){
  event.preventDefault();
  dataId=$(this).closest('.card-with-comments').data().id;
  var i=_findIndexOfIdInCityPosts(dataId);
  city_posts[i].commentTextFieldVisible=true;
  renderScreen();
})

  //gets ID as a string, returns position in city_posts array
function _findIndexOfIdInCityPosts(dataId){
  var i;
  for( i=0;  city_posts[i].id !== Number(dataId) && i<city_posts.length ; i++ );
  return i;
}

$('.card-main').on('submit','.comment-form',function(event){
  event.preventDefault();  
  var msg= $(this).find('.comment-text-field').val();
  var dataId=$(this).closest('.card-with-comments').data().id;
  var i=_findIndexOfIdInCityPosts(dataId);
  var replays=[];
  city_posts[i].posts.push({post:msg , id: ++id, replays: replays});
  renderScreen();
})

$('.card-main').on('submit','.replay-form',function(event){
  event.preventDefault();

  var replay=$(this).find('.replay-text-field').val();
  var postId=$(this).closest('.card').prev().find('.post').data().id;
  var cityId=$(this).closest('.card-with-comments').data().id;
  
  var index=_findIndexOfIdInCityPosts(cityId);
  var i;
  for (i=0;city_posts[index].posts[i].id!==Number(postId) && i< city_posts[index].posts.length ; i++);

  city_posts[index].posts[i].replays.push({replay:replay,id:++id});
  renderScreen();
})

$('.card-main').on('click','.replay-btn',function(){
  $(this).closest('.card').after('\
    <div class="card  text-white bg-dark ml-4 ">\
      <div class="card-body ">\
        <form class="replay-form">\
          <div class="form-group">\
            <input type="text" class="form-control text-white bg-success replay-text-field"  aria-describedby="commentHelp" placeholder="Write a replay...">\
            <small id="commentHelp" class="form-text text-muted">press enter to replay</small>\
          </div>\
        </form>\
      </div>\
    </div>\
  ');
})

$(".card-main").on('click','.mbtn-trash',function(){
  var cityIdToRemove=$(this).closest('.card-with-comments').data().id;
  city_posts.splice(_findIndexOfIdInCityPosts(cityIdToRemove),1);
  renderScreen();
})

function loadScreen(){
  city_posts=JSON.parse(localStorage.getItem("userSession") || '[]');
  renderScreen();
}

loadScreen();