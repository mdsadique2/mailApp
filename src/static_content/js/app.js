(function (){
// reference of initial containers where list is rendered
var mainContainer = document.getElementsByClassName('mainContainer')[0];
var messageCardContainer = document.getElementsByClassName('messageCardContainer')[0];
var messageDetailsContainer = document.getElementsByClassName('messageDetailsContainer')[0];

var data = [{
"subject": "Critique of Pure Reason - 20 copies",
"participants": [
"Bertrand Russel", 'Aristotle'
],
"preview": "Hello,\n Thanks for the quote. I appreciate the swift response!",
"isRead": false,
"isStarred": false,
"ts": 1563687076,
"id": 4
},
{
"subject": "Top exotic beaches in Greece",
"participants": [
"Aristotle", 'Russel', 'Russel', 'Russel'
],
"preview": "Plato,\nThis is what I was talking about for the bachelor party!",
"isRead": false,
"isStarred": true,
"ts": 1563687016,
"id": 5
}];


var message = {"subject":"With regard to our conversation earlier today","participants":[{"name":"Socrates","email":"socrates@gmail.com"},{"name":"Confucius","email":"confucius@gmail.com"}],"preview":"With regard to our conversation earlier today","isRead":false,"isStarred":false,"id":1,"body":"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas egestas leo sit amet justo vehicula tincidunt. Nullam a ipsum vitae ipsum feugiat sodales gravida quis nibh. Integer sed condimentum mauris. Maecenas venenatis purus quis nisl consequat, ac iaculis mi congue. Nunc ac turpis vel sapien maximus iaculis. Nunc in mollis lectus. Cras sem nisi, auctor eu malesuada consectetur, bibendum et tortor. Ut interdum nisl sed magna ullamcorper, ut pulvinar ligula luctus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.Etiam in tempor est. Praesent egestas rutrum ex sed ornare. Duis mi neque, vehicula et vehicula ut, convallis nec felis. Morbi mattis vitae massa sed rhoncus. Integer pulvinar tincidunt eros. Etiam ornare metus ac viverra placerat. Integer vel nunc et quam varius accumsan at in nibh. Fusce at luctus odio, vitae dictum mauris. Nulla facilisi. Cras non lorem porta, porta neque quis, ornare urna. Proin eleifend pretium neque id vestibulum. Ut condimentum mauris nec ipsum mollis molestie. Vivamus at erat lorem. In odio dui, molestie a accumsan sit amet, semper sed arcu. Sed ornare sed justo a ultrices. Fusce non consectetur lacus.","ts":1563695886};


// var card = new MailCard(data[0], messageCardContainer);
var messageDetails = new MailDetail(message, messageDetailsContainer);
var lib = messageDetails._lib;

var mailCards = [];


function getMessageDetails (path) {
	var urlOrigin = window.location.origin;
	return lib.fetchApi(urlOrigin+path);
}



function toggleIcon (event) {
	messageDetails.toggleIcon.call({}, event);
}


function loadAllMessages () {
	var path = '/api/message/';
	var promise = getMessageDetails(path);
	promise.then((response)=>{
			return response.json();
		}, ()=>{
	}).then((response) => {
		createMessageCardUI(response);
	})

}


function createMessageCardUI (data) {
	data.forEach((elm, index)=>{
		mailCards[index] = new MailCard(elm, messageCardContainer);
		mailCards[index].createMailCard();
	})
}


function loadThisMessage (event) {
	var elm = event.target;
	var classList = elm.classList;
	if (classList.contains('messageCard') === false) {
		elm = elm.closest('.messageCard');
	}
	var id = elm.dataset.messageid;
	console.log(id);
	var path = '/api/message/'+id;

	var promise = getMessageDetails(path);
	
	promise.then((response) => {
			return response.json();
		}, ()=>{}).then((response) => {
				messageDetails.createMailDetail(response);
		})
}


function init () {
	

	loadAllMessages();

	messageCardContainer.addEventListener('click', (event) => {
		event.stopPropagation();
		console.log(event.target.className);
		var classList = event.target.classList;

		if (classList.contains('icon')) {
			toggleIcon(event);
			return;
		} else {
			loadThisMessage(event);
		}
	})


}
init();

})();

