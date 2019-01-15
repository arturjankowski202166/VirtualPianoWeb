import 'jquery'

function component() {
  let element = document.createElement('div');

  // Lodash, currently included via a script, is required for this line to work
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');

  return element;
}

function loadRecordings()
{
	document.getElementById("recordings").innerHTML = '<div class="jumbotron">test</div>';
	$.getJSON('http://localhost:5000/getFileList', function(result)
	{
		console.log(result);
		for (let i = 0; i < result.length; i++)
		{
			console.log(result[i].email);
			document.getElementById("recordings").innerHTML += '<div class="media border p-3"><div class="media-body"><h2>' + result[i].name + '</h2><br><h4>By '+ result[i].email + '</h4></div><audio controls><source src="http://localhost:5000/getFile/'+result[i].name+'.wav" type="audio/wav">Sum ting wong</audio></div>';
			addCommentField();
		}
	});
}

function addCommentField()
{
  document.getElementById("recordings").innerHTML += `<div class="status-upload">
									<form>
										<textarea placeholder="What are you doing right now?" ></textarea>
										<ul>
											<li><a title="" data-toggle="tooltip" data-placement="bottom" data-original-title="Audio"><i class="fa fa-music"></i></a></li>
											<li><a title="" data-toggle="tooltip" data-placement="bottom" data-original-title="Video"><i class="fa fa-video-camera"></i></a></li>
											<li><a title="" data-toggle="tooltip" data-placement="bottom" data-original-title="Sound Record"><i class="fa fa-microphone"></i></a></li>
											<li><a title="" data-toggle="tooltip" data-placement="bottom" data-original-title="Picture"><i class="fa fa-picture-o"></i></a></li>
										</ul>
										<button type="submit" class="btn btn-success green"><i class="fa fa-share"></i> Share</button>
									</form>
								</div>"`
}

window.onload = function()
{
	loadRecordings();
}
