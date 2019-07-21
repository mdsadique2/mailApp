(function (){
// reference of initial containers where list is rendered
var mainContainer = document.getElementsByClassName('mainContainer')[0];
var messageCardContainer = document.getElementsByClassName('messageCardContainer')[0];
var messageDetailsContainer = document.getElementsByClassName('messageDetailsContainer')[0];


var mailCards = {};


var messageDetails = new MailDetail({}, messageDetailsContainer);
messageDetails.registerClickEventEmitter(messageDetailsClicked);
var lib = messageDetails._lib;



function messageDetailsClicked (event, type, data) {
	if (type === 'delete') {
		deleteMessage(this.data.id);
	}
}


// deletes the email 
function deleteMessage (id) {
	var card = messageCardContainer.getElementsByClassName('id-'+id)[0];
	var index = card.dataset.messageindex;
	var path = '/api/message/'+id;
	var config = {
		method: 'DELETE'
	}
	var promise = makeApiCall(path, config).then((response) => {
			return response.json();
		}, ()=>{
			return 'Delete Failed';
	})
	promise.then((response) => {
		delete mailCards.index;
		messageCardContainer.removeChild(card);
		if (id === (messageDetails.data.id+'')) {
			messageDetails.deleteThisCard();
		}
	}, (rejectedData)=>{
		alert(rejectedData)
	})	
}



// toggles icons in card
function toggleIcon (event, id) {
	var className = event.target.className;
	if (className.indexOf('trash') > -1) {
		deleteMessage(id)
	} else {
		messageDetails.toggleIcon.call({}, event);
	}
}


// 
function makeApiCall (path) {
	var urlOrigin = window.location.origin;
	return lib.fetchApi(urlOrigin+path);
}


function loadAllMessages () {
	var path = '/api/message/';
	var promise = makeApiCall(path).then((response)=>{
			return response.json();
		}, ()=>{
	})
	promise.then((response) => {
		createMessageCardUI(response);
	})
}


function createMessageCardUI (data) {
	data.forEach((elm, index)=>{
		mailCards[index] = new MailCard(elm, index, messageCardContainer);
		mailCards[index].createMailCard();
	})
}


function loadThisMessage (event, id) {
	var path = '/api/message/'+id;
	var promise = makeApiCall(path).then(
		(response) => {
			return response.json();
		}, ()=>{
	});
	
	promise.then((response) => {
		messageDetails.createMailDetail(response);
	})
}


function selectThisCard (node) {
	var currentSelected = messageCardContainer.getElementsByClassName('selectedCard');
	if (currentSelected.length > 0) {
		currentSelected[0].classList.remove('selectedCard');
	}
	node.classList.add('selectedCard');
}


function init () {
	loadAllMessages();
	messageCardContainer.addEventListener('click', (event) => {
		event.stopPropagation();
		var classList = event.target.classList;

		var parent = event.target.closest('.messageCard');
		var id = parent.dataset.messageid;

		if (classList.contains('actionConatiner') || classList.contains('imageIcons')) {
			return;
		}
		else if (classList.contains('icon')) {
			toggleIcon(event, id);
			return;
		} else {
			selectThisCard(parent);
			loadThisMessage(event, id);
		}
	})


}
init();

})();

