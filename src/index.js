import 'jquery'
var token;
var currentUser;
const PATH = 'http://localhost:5000'

function loadMyRecordings()
{
  document.getElementById("recordings").innerHTML = "";
  $.ajax({
    url: PATH + '/getFileList/'+currentUser,
    type: 'GET',
    datatype: 'json',
    beforeSend: function(request) {
      request.setRequestHeader("Authorization", token);
    },
    success: 
      function(result){
        document.getElementById("heading").innerHTML = "Your recordings:";  
        for (let i = 0; i < result.length; i++)
          {
            $.getJSON(PATH+"/upVotes/"+result[i].id, function(numbers)
            {
              document.getElementById("recordings").innerHTML += ` 
                <div class="border p-3">
                    <h2 class="alert alert-dark">` + result[i].name + ` by ` + result[i].email + `</h2>
                  <div style="background-color: azure" class="p-2">
                  <div class="row">
                  <div class="col-md-7">
                    <audio controls style="margin-left: 5%">
                      <source src="`+ PATH +`/getFile/`+ result[i].name +`" type="audio/wav">
                    </audio>
                  </div>
                  <div class="col-md-3 span-md-1">
                  </div>
                  <div class="col-md-2 justify-content-md-right">
                  <img src="./star.png" style="width: auto; vertical-align: middle;"></img><h2 style="vertical-align: middle;display: inline;"> ` + numbers.number + `</h2>
                  </div>
                </div>
                <button type="submit" onclick ="$.ajax({datatype: 'json', type: 'DELETE', url: '`+ PATH + `/deleteFile/` + result[i].id + `',beforeSend: function(request) {request.setRequestHeader('Authorization', '`+token+`');},error: function(result){alert('Failed to delete file')}, success: function(result) {console.log(result); document.location.reload();}});" class="btn btn-warning red" style="margin-left: 2.8%; width: 26.9%;"><i class="fa fa-share"></i> Delete</button>
                </div>
                </div>`;
            })
          }
        },
    error: function(result) {
      console.log(result);
      alert('Failed!'); }     
  });  
}

function register(){
  let email = document.getElementById("regLogin").value;
  let password = document.getElementById("regPassword").value;
$.post(PATH + "/register",  {email: email, password: password}, function(data)
{
  if(data.status == 'success')
  {
    document.location.reload();
  }
  else{
    alert("Registration failed");
  }
})
}

async function loadRecording(fileId)
{
  console.log("FILEID: "+fileId);
  $.getJSON(PATH + '/getFileList', async function(result)
	{
		for (let i = 0; i < result.length; i++)
		{
      if(result[i].id == fileId){
        console.log(result);
      await $.getJSON(PATH+"/upVotes/"+result[i].id, function(numbers)
      {
        document.getElementById("heading").innerHTML = "";
        document.getElementById("recordings").innerHTML = "";
        document.getElementById("recordings").innerHTML += `
          <div class="border p-3">
            <h2 class="alert alert-dark">` + result[i].name + ` by ` + result[i].email + `</h2>
            <div style="background-color: azure" class="p-2">
            <div class="row" id="infoRow`+ i + `">
              <div class="col-md-7">
                <audio controls style="margin-left: 5%">
                  <source src="`+ PATH +`/getFile/`+ result[i].name +`" type="audio/wav">
                </audio>
              </div>`
              if(checkLogin())
              {
                document.getElementById("infoRow"+i).innerHTML +=  `
                <div class="col-md-3 ">
                <button type="button" onclick="$.ajax({datatype: 'json', type: 'POST', url: '`+ PATH + `/upVotes', data:{recordingId: `+ result[i].id +`},beforeSend: function(request) {request.setRequestHeader('Authorization', '`+token+`');},error: function(result){alert('Failed to add upvote')}, success: function(result) {console.log(result); document.location.reload();}});" style="width: 100%" class="btn btn-success">Upvote!</button>
                </div>
                <div class="col-md-2 justify-content-md-right">
                <img src="./star.png" style="width: auto; vertical-align: middle;"></img><h2 style="vertical-align: middle;display: inline;"> ` + numbers.number + `</h2>
                </div>`
              }
              document.getElementById("recordings").innerHTML += `
            </div>
            </div>
            <h3 class="rounded" style="background-color: silver; margin-top: 2%; margin-bottom: 0%; align: center;">&emsp;Comments:</h3>
            <div class="rounded" style="background-color: azure; margin: 0;"  id="commentSection`+ fileId +`">
            </div>
            <div id="commentForm`+ fileId + `">
            </div>
          </div>`;
        addComments(fileId);
        addCommentField(fileId);
        //document.getElementById('recording'+result[i].id).onclick = login;
      })
    }
    }
  });
}
function loadRecordings()
{
	$.getJSON(PATH + '/getFileList', async function(result)
	{
		for (let i = 0; i < result.length; i++)
		{
      $.getJSON(PATH+"/upVotes/"+result[i].id, function(numbers)
      {
        document.getElementById("heading").innerHTML = "Latest recordings:";
        document.getElementById("recordings").innerHTML += `
          <div class="border p-3">
            <button class="alert alert-dark fileBtn" value="`+result[i].id+`"style="width: 100%;" id="recording`+result[i].id+`"><h2>` + result[i].name + ` by ` + result[i].email + `</h2></button>
            <div style="background-color: azure" class="p-2">
                    <div class="row" id="infoRow`+ i +`">
                      <div class="col-md-7">
                        <audio controls style="margin-left: 5%">
                          <source src="`+ PATH +`/getFile/`+ result[i].name +`" type="audio/wav">
                        </audio>
                      </div>`
                      if(checkLogin())
                      {
                        document.getElementById("infoRow"+i).innerHTML +=  `
                        <div class="col-md-3 ">
                        <button type="button" onclick="$.ajax({datatype: 'json', type: 'POST', url: '`+ PATH + `/upVotes', data:{recordingId: `+ result[i].id +`},beforeSend: function(request) {request.setRequestHeader('Authorization', '`+token+`');},error: function(result){alert('Failed to add upvote')}, success: function(result) {console.log(result); document.location.reload();}});" style="width: 100%" class="btn btn-success">Upvote!</button>
                        </div>
                        <div class="col-md-2 justify-content-md-right">
                        <img src="./star.png" style="width: auto; vertical-align: middle;"></img><h2 style="vertical-align: middle;display: inline;"> ` + numbers.number + `</h2>
                        </div>`
                      }
                      document.getElementById("recordings").innerHTML += `
                    </div>
                  </div>
            </div>
          </div>`;
          $('.fileBtn').click(function()
        {
          console.log(this.value);
          loadRecording(this.value);
        })
      })
		}
	});
}

function addComments(recordId)
{
  console.log("Comment record id: " +recordId)
  document.getElementById("commentSection"+recordId).innerHTML = "";
  $.get(PATH + '/comments',function(result)
{
  console.log(result);
  for (let i = 0; i < result.length; i++)
  {
    let comment = result[i].Description;
    let user = result[i].email;
    if(result[i].recordingId == recordId)
    document.getElementById("commentSection"+recordId).innerHTML += `<div class="well rounded" style="margin: 2% 0 2% 0; padding: 3%; background-color="white"><h5 style="padding: 0.5%" class="alert-dark rounded">`+user +`</h5><h6 class="alert-light rounded" style="padding: 0.5%">`+comment+`</h6></div>`;
  }
})
}

function addCommentField(recordId)
{
  document.getElementById("commentForm"+recordId).innerHTML +=
            `<div class="form-group">
                  <textarea textarea class="form-control" id="description`+recordId +`" name="description" placeholder="Please comment..." ></textarea>
                  <br>
                  <button onclick="$.ajax({datatype: 'json', type: 'POST', url: '`+ PATH + `/comments', data:{recordingId: `+ recordId +`, description: document.getElementById('description`+recordId+`').value,},beforeSend: function(request) {request.setRequestHeader('Authorization', '`+token+`');},error: function(result){alert('Failed to add comment :(')}, success: function(result) {console.log(result); document.location.reload();}});" class="btn btn-success green"><i class="fa fa-share"></i> Share</button>
              </div>`
}

function login()
{
  let email = document.getElementById('emailInput').value;
  let password = document.getElementById('passwordInput').value;
  $.post(PATH + '/login', {email: email, password: password}, function(data) 
    {
      if (data.success)
      {
        document.cookie = "userId="+data.userId.toString();
        document.cookie = "token="+data.token.toString();
      }
      else
      {
        alert("Login failed");
      }
   checkLogin();
   document.location.reload();
    });
}

function checkLogin()
{
  var loginButton = document.getElementById("notLogged");
  var logged = document.getElementById("logged");
  var logout = document.getElementById("logout");
  if (currentUser)
  {
    loginButton.style.display = "none";
    logged.style.display = "flex";
    logout.style.display = "flex";
    return true;
  }
  else
  {
    loginButton.style.display = "flex";
    logged.style.display = "none";
    logout.style.display = "none";
    return false;
  }
}

function getCookieValue(a) {
  var b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
  return b ? b.pop() : '';
}

function logout()
{
  document.cookie = "userId=0; token=0;";
  document.location.reload();
}

window.onload = function()
{
  var cookie = document.cookie;
  token = getCookieValue("token");
  if(getCookieValue("userId") != 0)
  currentUser = getCookieValue("userId");
  else{
    currentUser = null; 
    token = null; 
  }
  document.getElementById('loginBtn').onclick = login;
  document.getElementById('logoutBtn').onclick = logout;
  document.getElementById('registerBtn').onclick = register;
  document.getElementById('getMyFiles').onclick = loadMyRecordings;
  loadRecordings();
  checkLogin();
}