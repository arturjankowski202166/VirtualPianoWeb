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
			document.getElementById("recordings").innerHTML = '<div class="media border p-3"><div class="media-body"><h2>' + result[i].name + '</h2><br><h4>By '+ result[i].email + '</h4></div><audio controls><source src="http://localhost:5000/getFile/'+result[i].name+'.wav" type="audio/wav">Sum ting wong</audio></div>';
			
		}
	});
}

function getRequest(path)
{
}

function postRequest(path)
{
	}

window.onload = function()
{
	loadRecordings();
}