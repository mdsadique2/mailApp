
class MailDetail {

	constructor (mailData, parentContainer) {
		this.data = mailData
		this.parentContainer = parentContainer;
		this.mailDetailRef = null;
		
	}

	registerClickEventEmitter (fn) {
		this.clickedFn = fn;
	}

	getCurrentIconsAndText () {
		var obj = {
			read: {},
			star: {}
		}

		if (this.data.isStarred === true) {
			obj.star.icon = 'icon-star selected';
			obj.star.text = 'Mark as not important';
		} else {
			obj.star.icon = 'icon-star-empty';
			obj.star.text = 'Mark as important';
		}

		if (this.data.isRead === false) {
			obj.read.icon = 'icon-mail';
			obj.read.text = 'Mark as read';
		} else {
			obj.read.icon = 'icon-envelope-open-o selected';
			obj.read.text = 'Mark as not read';
		}

		return obj;

	}

	

	getDate () { 
		var d = new Date(this.data.ts);
		var obj = {
			date: d.getDate(),
			month: d.getMonth(),
			year: d.getFullYear(),
			hours: d.getHours(),
			minutes: d.getMinutes()
		}
		return obj;
	}


	createSentOthers () {
		var sentOthers = this._lib.createElement('div', 'sentOthers');
		for (var i=1; i < this.data.participants.length; i++) {
			var participant = this.data.participants[i]
			var node = this._lib.createElement('span', 'othersRecievers', participant.name);
			node.setAttribute('data-emailId', participant.email);
			node.setAttribute('data-emailName', participant.name);
			sentOthers.appendChild(node);
		}
		return sentOthers;
	}

	createTimeIconBlock () {
		var dateObj = this.getDate(this.data.ts);
		var dtString = this.monthsArray[dateObj.month + 1].name + ' ' + dateObj.date + ', ' + dateObj.year; // + ' - ' + dateObj.hours +':'+dateObj.minutes;

		var starTime = this._lib.createElement('div', 'starTime', dtString);
		var iconAndText = this.getCurrentIconsAndText();

		let star = this._lib.createElement('i', 'tooltip icon ' + iconAndText.star.icon);
		let starTooltip = this._lib.createElement('i', 'tooltiptext right', iconAndText.star.text);
		star.appendChild(starTooltip);

		let read = this._lib.createElement('i', 'tooltip icon ' + iconAndText.read.icon);
		let readTooltip = this._lib.createElement('i', 'tooltiptext right', iconAndText.read.text);
		read.appendChild(readTooltip);

		starTime.appendChild(star);
		starTime.appendChild(read);

		return starTime;

	}


	mailSenderContainer () {
		var senderContainer = this._lib.createElement('div', 'senderContainer');

		var sender = this.data.participants[0];

		var bgClass = 'bg-color-' + ((this.data.id % 5) + 1);
		var thumbNail = this._lib.createElement('div', 'thumbnail ' + bgClass, this.data.participants[0].name[0]);

		var senderName = this._lib.createElement('div', 'senderName', this.data.participants[0].name);
		senderName.setAttribute('data-emailId', this.data.participants[0].email);
		senderName.setAttribute('data-emailName', this.data.participants[0].name);

		var sentTo = this._lib.createElement('div', 'sentTo', 'to Me');
		var sentOtherNodes = this.createSentOthers();
		senderName.appendChild(sentTo);
		senderName.appendChild(sentOtherNodes);


		var timeIconBlock = this.createTimeIconBlock();

		senderContainer.appendChild(thumbNail);
		senderContainer.appendChild(senderName);
		senderContainer.appendChild(timeIconBlock);

		this.mailCardRef.appendChild(senderContainer);
	}

	mailSubject () {
		var subject = this._lib.createElement('div', 'messageSubject', this.data.subject);
		this.mailCardRef.appendChild(subject);
	}

	mailBody () {
		var message = this._lib.createElement('div', 'messageBody', this.data.body);
		this.mailCardRef.appendChild(message);
	}

	toggleEmailName (event) {
		var node = event.target.childNodes[0];
		var dataSet = event.target.dataset;
		var text = node.textContent === dataSet.emailid ? dataSet.emailname : dataSet.emailid;
		node.textContent = text;
	}

	toggleIcon (event) {
		var classList = event.target.classList;
		var type = event.target.className.indexOf('star') > -1 ? 'star' : 'read';

		var toolTipNode = event.target.childNodes[0]
		if (type === 'star') {
			if (classList.contains('selected')) {
				classList.remove('selected', 'icon-star');
				classList.add('icon-star-empty');
				toolTipNode.textContent = 'Mark as important';
			} else {
				classList.remove('icon-star-empty');
				classList.add('selected', 'icon-star');
				toolTipNode.textContent = 'Mark as not important';
			}
		} else {

			if (classList.contains('selected')) {
				classList.remove('selected', 'icon-envelope-open-o');
				classList.add('icon-mail');
				toolTipNode.textContent = 'Mark as read';
			} else {
				classList.remove('icon-mail');
				classList.add('selected', 'icon-envelope-open-o');
				toolTipNode.textContent = 'Mark as not read';

			}
		}
	}


	eventHandlers (event) {
		event.stopPropagation();
		console.log(event.target.className);
		var classList = event.target.classList;

		if (classList.contains('senderName') || classList.contains('othersRecievers')) {
			this.toggleEmailName(event);
			return;
		}

		if (classList.contains('icon')) {
			this.toggleIcon(event);
			this.clickedFn(event, type);
			return;
		}

	}

	checkParentcontainerNode () {
		var node = this.parentContainer.getElementsByClassName('detailedMessage');
		return node;
	}

	updateMailDetail (data) {
		this.data = data;
	}

	createMailDetail (data) {
		if (data !== undefined) {
			this.updateMailDetail(data);
		}

		var checkParentcontainer = this.checkParentcontainerNode();
		if (checkParentcontainer.length > 0) {
			this.mailCardWrapperRef.innerHTML = '';
		} else {
			this.mailCardWrapperRef = this._lib.createElement('div', 'detailedMessageWrapper');
		}

		this.mailCardRef = this._lib.createElement('div', 'detailedMessage');
		this.mailSubject();
		this.mailSenderContainer();
		this.mailBody();
		
		this.mailCardWrapperRef.appendChild(this.mailCardRef);
		this.mailCardWrapperRef.addEventListener('click', (event) => {
			this.eventHandlers(event)
		})

		this.parentContainer.appendChild(this.mailCardWrapperRef)
	}



}

MailDetail.prototype._lib = new Common();
MailDetail.prototype.monthsArray = [{name: 'January', days: 31},{name: 'February', days: 29},{name: 'March', days: 31},{name: 'April', days: 30},{name: 'May', days: 31},{name: 'June', days: 30},{name: 'July', days: 31}, {name: 'August', days: 31},{name: 'September', days: 30},{name: 'October', days: 31},{name: 'November', days: 30},{name: 'December', days: 31}]







