import 'jquery'

function component() {
  let element = document.createElement('div');

  // Lodash, currently included via a script, is required for this line to work
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');

  return element;
}

function loadRecordings()
{
	//$.getJSON('http://localhost:5000/getFileList', function(result)
	{
		//console.log(result);
		//for (let i = 0; i < result.length; i++)
    for (let i = 0; i < 2; i++)
		{
			//console.log(result[i].email);
      let tempUsr = "example@example.com"
      let tempName = "exampleName"
			//document.getElementById("recordings").innerHTML += '<div class="media border p-3"><div class="media-body"><h2>' + result[i].name + '</h2><br><h4>By '+ result[i].email + '</h4></div><audio controls><source src="http://localhost:5000/getFile/'+result[i].name+'.wav" type="audio/wav">Sum ting wong</audio></div>';
      document.getElementById("recordings").innerHTML += `
        <div class="border p-3">
            <h2>` + tempName + `</h2>
            <br>
            <h4>By` + tempUsr + `</h4>
          <div class="p-2">
        <audio controls>`
        +/*<source src="http://localhost:5000/getFile/'+tempName+'.wav" type="audio/wav">Sum ting wong*/`
        </audio>`+
        `</div>
        <h4>Comments:</h4>`+
			addCommentField();
		}
	}//);
}

function addCommentField()
{
  return(
            `<div class="form-group">
									<textarea class="form-control" placeholder="Please comment..." ></textarea>
                  <br>
									<button type="submit" class="btn btn-success green"><i class="fa fa-share"></i> Share</button>
							</div>
            </div>
          </div></div>`);
}

window.onload = function()
{
	loadRecordings();
}
