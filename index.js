function loadRecordings()
{
	document.getElementById("recordings").innerHTML="<h1>GET DUNKEDDD ON</h1>"
		var request = new XMLHttpRequest();
	request.open('GET', 'localhost:5000/' + path, true);
	request.onload = function () {

	  var data = JSON.parse(this.response);
	  if (request.status >= 200 && request.status < 400) {
		  console.log(data);
		data.forEach(movie => {
		  const card = document.createElement('div');
		  card.setAttribute('class', 'card');

		  const h1 = document.createElement('h1');
		  h1.textContent = movie.title;

		  const p = document.createElement('p');
		  movie.description = movie.description.substring(0, 300);
		  p.textContent = `${movie.description}...`;

		  container.appendChild(card);
		  card.appendChild(h1);
		  card.appendChild(p);
		});
	  } else {
		console.log("something went wrong: " + errorMessage);
		app.appendChild(errorMessage);
	  }
	}

	request.send();

}
function getRequest(path)
{
}

function postRequest(path)
{
	}

window.onload = function()
{
	loadRecordings
}