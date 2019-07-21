
class MailCard {

	constructor (mailData, parentContainer) {
		this.data = mailData
		this.parentContainer = parentContainer;
		this.mailCardRef = null;
		this.mailCardRefLeft = null;
		this.mailCardRefRight = null;
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

	senderAppender () {
		var appender = '';
		if (this.data.participants.length > 1) {
			appender = ' + ' + (this.data.participants.length - 1);
		}
		return appender;
	}


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

	checkForCloning () {
		var node = this.parentContainer.getElementsByClassName('messageCard');
		return node;
	}


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

	cloneNode (node) {
		var cloneNode = node.cloneNode(true);
		cloneNode.setAttribute('data-messageId', this.data.id);
		var left = cloneNode.childNodes[0];
		var right = cloneNode.childNodes[1];
		this.updateLeftNode(left);
		this.updateRightNode(right);
		this.parentContainer.appendChild(cloneNode);
	}


	createMailCard () {
		var cloneNode = this.checkForCloning();
		if (cloneNode.length > 0) {
			this.cloneNode(cloneNode[0]);
			return;
		}

		this.mailCardRef = this._lib.createElement('div', 'messageCard');
		this.mailCardRef.setAttribute('data-messageId', this.data.id);
		this.createMailCardLeftBlock();
		this.createMailCardRightBlock();
		this.mailCardRef.appendChild(this.mailCardRefLeft);
		this.mailCardRef.appendChild(this.mailCardRefRight);
		this.parentContainer.appendChild(this.mailCardRef);
	}



}

MailCard.prototype._lib = new Common();
MailCard.prototype.monthsArray = [{name: 'January', days: 31},{name: 'February', days: 29},{name: 'March', days: 31},{name: 'April', days: 30},{name: 'May', days: 31},{name: 'June', days: 30},{name: 'July', days: 31}, {name: 'August', days: 31},{name: 'September', days: 30},{name: 'October', days: 31},{name: 'November', days: 30},{name: 'December', days: 31}]







