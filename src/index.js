import 'jquery'
var token;
var currentUser;


function component() {
  let element = document.createElement('div');

  // Lodash, currently included via a script, is required for this line to work
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');

  return element;
}
function loadMyRecordings()
{
  document.getElementById("recordings").innerHTML = "";
console.log('http://localhost:5000/getFileList/'+currentUser);
  
$.ajax({
  url: 'http://localhost:5000/getFileList/'+currentUser,
  type: 'GET',
  datatype: 'json',
  beforeSend: function(request) {
    request.setRequestHeader("Authorization", token);
  },
  success: 
    function(result){
        for (let i = 0; i < result.length; i++)
        {
          console.log(result[i].email);
          console.log(result[i].name);
          //document.getElementById("recordings").innerHTML += '<div class="media border p-3"><div class="media-body"><h2>' + result[i].name + '</h2><br><h4>By '+ result[i].email + '</h4></div><audio controls><source src="http://localhost:5000/getFile/'+result[i].name+'.wav" type="audio/wav">Sum ting wong</audio></div>';
          document.getElementById("recordings").innerHTML += `
            <div class="border p-3">
                <h2>` + result[i].name + ` by ` + result[i].email + `</h2>
              <div class="p-2">
            <audio controls>`
            +/*<source src="http://localhost:5000/getFile/'+tempName+'.wav" type="audio/wav">Sum ting wong*/`
            </audio>`+
            `</div>
            <h4>Comments:</h4>`+`
          addCommentField() + <div class="form-group">
          <button type="submit" class="btn btn-warning red"><i class="fa fa-share"></i> Delete</button>
      </div>`;
        }
      },
  error: function(result) {
    console.log(result);
    alert('Failed!'); }     
});  
}

function loadRecordings()
{
	$.getJSON('http://localhost:5000/getFileList', function(result)
	{
		for (let i = 0; i < result.length; i++)
		{
			//document.getElementById("recordings").innerHTML += '<div class="media border p-3"><div class="media-body"><h2>' + result[i].name + '</h2><br><h4>By '+ result[i].email + '</h4></div><audio controls><source src="http://localhost:5000/getFile/'+result[i].name+'.wav" type="audio/wav">Sum ting wong</audio></div>';
      document.getElementById("recordings").innerHTML += `
        <div class="border p-3">
            <h2>` + result[i].name + ` by ` + result[i].email + `</h2>
          <div class="p-2">
        <audio controls>`
        +/*<source src="http://localhost:5000/getFile/'+tempName+'.wav" type="audio/wav">Sum ting wong*/`
        </audio>`+
        `</div>
        <h4>Comments:</h4>`+
			addCommentField(result[i].id) + `</div>
      </div></div>`;
		}
	});
}

function addCommentField(recordId)
{
  return(
            `<div class="form-group">
                  <textarea textarea class="form-control" id="description`+recordId +`" name="description" placeholder="Please comment..." ></textarea>
                  <br>
                  <button onclick="$.ajax({datatype: 'json', type: 'POST', url: 'http://localhost:5000/comments',type: 'POST',data:{recordingId:`+recordId+`,userId: `+currentUser+`,description: document.getElementById('description`+recordId+`').value},datatype: 'json',beforeSend: function(request) {request.setRequestHeader('Authorization', '`+token+`');},success: function(result){console.log(result)}});" class="btn btn-success green"><i class="fa fa-share"></i> Share</button>
                </div>
          `);
}

function login()
{
  let email = document.getElementById('emailInput').value;
  let password = document.getElementById('passwordInput').value;
  $.post('http://localhost:5000/login', {email: email, password: password}, function(data) 
    {
      if (data.success)
      {
        document.cookie = "userId="+data.userId.toString();
        document.cookie = "token="+data.token.toString();
        console.log(document.cookie);
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
  console.log(token + " " + currentUser);
  if (currentUser)
  {
    loginButton.style.display = "none";
    logged.style.display = "flex";
    logout.style.display = "flex";
  }
  else
  {
    loginButton.style.display = "flex";
    logged.style.display = "none";
    logout.style.display = "none";
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
  console.log(document.cookie);
  if(getCookieValue("userId") != 0)
  currentUser = getCookieValue("userId");
  else{
    currentUser = null; 
    token = null; 
  }
  document.getElementById('loginBtn').onclick = login;
  document.getElementById('logoutBtn').onclick = logout;
  document.getElementById('getMyFiles').onclick = loadMyRecordings;
  loadRecordings();
  checkLogin();
}


//$.ajax({url: 'http://localhost:5000/comment',type: 'GET',datatype: 'json',data:{recordingId:`+recordId+`,userId: `+currentUser+`,description: document.getElementById('description`+recordId+`')},type: 'GET',datatype: 'json',beforeSend: function(request) {request.setRequestHeader('Authorization', token);},success: function(result){console.log(result)}});