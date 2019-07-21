
class MailCard {

	constructor (mailData, index, parentContainer) {
		this.data = mailData
		this.index = index;
		this.parentContainer = parentContainer;
		this.mailCardRef = null;
		this.mailCardRefLeft = null;
		this.mailCardRefRight = null;
	}

	// returns icon and tooltip
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


	// create left section in the card
	createMailCardLeftBlock () {
		this.mailCardRefLeft = this._lib.createElement('div', 'imageIcons');

		var nameText = this.data.participants[0];
		var bgClass = 'bg-color-' + ((this.data.id % 5) + 1);
		let imageCircle = this._lib.createElement('div', 'image ' + bgClass, nameText[0]);

		var iconAndText = this.getCurrentIconsAndText();

		let star = this._lib.createElement('i', 'tooltip icon ' + iconAndText.star.icon);
		let starTooltip = this._lib.createElement('i', 'tooltiptext', iconAndText.star.text);
		star.appendChild(starTooltip);

		let read = this._lib.createElement('i', 'tooltip icon ' + iconAndText.read.icon);
		let readTooltip = this._lib.createElement('i', 'tooltiptext', iconAndText.read.text);
		read.appendChild(readTooltip);

		this.mailCardRefLeft.appendChild(imageCircle);
		this.mailCardRefLeft.appendChild(star);
		this.mailCardRefLeft.appendChild(read);
	}


	// manipulates the timestamp
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

	// checks and add number for more than 1 participant
	senderAppender () {
		var appender = '';
		if (this.data.participants.length > 1) {
			appender = ' + ' + (this.data.participants.length - 1);
		}
		return appender;
	}


	// create right section in the card
	createMailCardRightBlock () {
		this.mailCardRefRight = this._lib.createElement('div', 'textContainer');
		var sender = this._lib.createElement('div', 'senderName', this.data.participants[0] + this.senderAppender());
		var dateObj = this.getDate();
		var dateString = this.monthsArray[dateObj.month + 1].name + ' ' + dateObj.date;
		var date = this._lib.createElement('span', 'date', dateString);
		sender.appendChild(date);

		var subject = this._lib.createElement('div', 'subject', this.data.subject);
		var preview = this._lib.createElement('div', 'preview', this.data.preview);

		this.mailCardRefRight.appendChild(sender);
		this.mailCardRefRight.appendChild(subject);
		this.mailCardRefRight.appendChild(preview);
	}


	// creates the action block, at present only delete action is available
	createMailCardActionBlock () {
		var actionNode = this._lib.createElement('div', 'actionConatiner');
		var deleteIcon = this._lib.createElement('i', 'tooltip icon icon-trash-1');
		var deleteTooltip = this._lib.createElement('span', 'tooltiptext right', 'Delete Message');
		deleteIcon.appendChild(deleteTooltip);
		actionNode.appendChild(deleteIcon);
		return actionNode;
	}


	// checks if node exist for cloning
	checkForCloning () {
		var node = this.parentContainer.getElementsByClassName('messageCard');
		return node;
	}


	// change status of message to read when preview is opened in detail view
	changeReadStatus () {
		var elm = this.mailCardRefLeft.childNodes[2];
		var toolTipNode = elm.childNodes[0];
		var classList = elm.classList;
		if (classList.contains('icon-envelope-open-o')) {
			elm.classList.add('icon-mail');
			elm.classList.remove('icon-envelope-open-o', 'selected');
			toolTipNode.textContent = 'Mark as read';
		} else {
			elm.classList.remove('icon-mail');
			elm.classList.add('icon-envelope-open-o', 'selected');
			toolTipNode.textContent = 'Mark as not read';
		}
	}


	// update the node after cloning
	updateLeftNode (node) {
		var nameText = this.data.participants[0];
		var bgClass = 'bg-color-' + ((this.data.id % 5) + 1);
		var sender = node.childNodes[0];
		sender.className = 'image ' + bgClass;
		sender.innerHTML = nameText[0];

		var iconAndText = this.getCurrentIconsAndText();

		var star = node.childNodes[1];
		star.className = 'tooltip icon '+iconAndText.star.icon;
		star.childNodes[0].innerText = iconAndText.star.text;
		

		var read = node.childNodes[2];
		read.className = 'tooltip icon '+iconAndText.read.icon;
		read.childNodes[0].innerText = iconAndText.read.text;
	}


	// update the node after cloning
	updateRightNode (node) {
		var sender = node.childNodes[0];

		var dateObj = this.getDate();
		var dateString = this.monthsArray[dateObj.month + 1].name + ' ' + dateObj.date;
		
		sender.childNodes[0].textContent = this.data.participants[0] + this.senderAppender();
		sender.childNodes[1].innerText = dateString;

		var subject = node.childNodes[1];
		subject.innerText = this.data.subject;

		var preview = node.childNodes[2];
		preview.innerText = this.data.preview;

	}


	// clones the node
	cloneNode (node) {
		var cloneNode = node.cloneNode(true);
		cloneNode.setAttribute('data-messageId', this.data.id);
		cloneNode.setAttribute('data-messageIndex', this.index);
		cloneNode.setAttribute('class', 'messageCard id-'+this.data.id);

		var left = cloneNode.childNodes[0];
		var right = cloneNode.childNodes[1];
		this.mailCardRefLeft = left;
		this.mailCardRefRight = right;
		this.mailCardRef = cloneNode;
		this.updateLeftNode(left);
		this.updateRightNode(right);
		this.parentContainer.appendChild(cloneNode);
	}


	// creates the mail preview card
	createMailCard () {
		var cloneNode = this.checkForCloning();
		if (cloneNode.length > 0) {
			this.cloneNode(cloneNode[0]);
			return;
		}
		this.mailCardRef = this._lib.createElement('div', 'messageCard id-'+this.data.id);
		this.mailCardRef.setAttribute('data-messageId', this.data.id);
		this.mailCardRef.setAttribute('data-messageIndex', this.index);
		this.createMailCardLeftBlock();
		this.createMailCardRightBlock();
		var actionNode = this.createMailCardActionBlock();
		this.mailCardRef.appendChild(this.mailCardRefLeft);
		this.mailCardRef.appendChild(this.mailCardRefRight);
		this.mailCardRef.appendChild(actionNode);
		this.parentContainer.appendChild(this.mailCardRef);
	}

}

MailCard.prototype._lib = new Common();
MailCard.prototype.monthsArray = [{name: 'January', days: 31},{name: 'February', days: 29},{name: 'March', days: 31},{name: 'April', days: 30},{name: 'May', days: 31},{name: 'June', days: 30},{name: 'July', days: 31}, {name: 'August', days: 31},{name: 'September', days: 30},{name: 'October', days: 31},{name: 'November', days: 30},{name: 'December', days: 31}]







