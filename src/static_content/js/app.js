(function (){

	// reference of initial containers where list is rendered
	var mainContainer = document.getElementsByClassName('mainContainer')[0];
	var messageCardContainer = document.getElementsByClassName('messageCardContainer')[0];
	var messageDetailsContainer = document.getElementsByClassName('messageDetailsContainer')[0];


	// contains reference of all card objects created
	var mailCards = {};

	// creating instance of message details view
	var messageDetails = new MailDetail({}, messageDetailsContainer);
	
	// registering a method which is invoked for icon clicked in detailed view
	messageDetails.registerClickEventEmitter(messageDetailsClicked);
	
	// taking library methods reference from prototype of messageDetails object
	var lib = messageDetails._lib;


	// adds aplaceholder when no message is dispalyed in detailed view
	function addPlaceHolder () {
		var elm = lib.createElement('div', 'placeholderMessage', 'Select a message to see the details');
		messageDetailsContainer.appendChild(elm);
	}


	// method is invoked when action icons are clicked in detailed view
	function messageDetailsClicked (event, type, data) {
		if (type === 'delete') {
			deleteMessage(this.data.id);
			addPlaceHolder();
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
			}, () => {
				return 'Delete Failed';
		})
		promise.then((response) => {
			delete mailCards.index;
			messageCardContainer.removeChild(card);
			if (id === (messageDetails.data.id+'')) {
				messageDetails.deleteThisCard();
			}
		}, (rejectedData) => {
			alert(rejectedData)
		})	
	}


	// toggles icons in card when clicked
	function toggleIcon (event, id) {
		var className = event.target.className;
		if (className.indexOf('trash') > -1) {
			deleteMessage(id)
		} else {
			messageDetails.toggleIcon.call({}, event);
		}
	}


	// common method for all api calls
	function makeApiCall (path) {
		var urlOrigin = window.location.origin;
		return lib.fetchApi(urlOrigin+path);
	}


	// loads all the messages when page loads
	function loadAllMessages () {
		var path = '/api/message/';
		var promise = makeApiCall(path).then((response)=>{
				return response.json();
			}, () => {
		})
		promise.then((response) => {
			createMessageCardUI(response);
		})
	}


	// creates the card UI after API call
	function createMessageCardUI (data) {
		data.forEach((elm, index)=>{
			mailCards[elm.id] = new MailCard(elm, index, messageCardContainer);
			mailCards[elm.id].createMailCard();
		})
	}


	// loads the details view of a message
	function loadThisMessage (event, id) {
		var path = '/api/message/'+id;
		var promise = makeApiCall(path).then(
			(response) => {
				return response.json();
			}, () => {
		});
		
		promise.then((response) => {
			messageDetails.createMailDetail(response);
			if (mailCards[id].data.isRead === false) {
				mailCards[id].data.isRead = true;
				mailCards[id].changeReadStatus();
			}
		})
	}


	// highlights a card as selected for which detail view is been checked
	function selectThisCard (node) {
		var currentSelected = messageCardContainer.getElementsByClassName('selectedCard');
		if (currentSelected.length > 0) {
			currentSelected[0].classList.remove('selectedCard');
		}
		node.classList.add('selectedCard');
	}


	// inializes the app
	function init () {
		loadAllMessages();

		// adding the event listener on card cotainer
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

