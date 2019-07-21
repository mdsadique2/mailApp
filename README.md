
## API's
- `GET /api/message/` - get a list of messages
- `GET /api/message/:id` - get one message
- `DELETE /api/message/:id` - delete one message

Here are few details which you might need:

- Serves static content from the static_content & bower_components directory
- You can have your JS, CSS files & images/sprites in static_content & any plugins can go in bower_components
- Router is at controllers/router.js
- Web controllers are at controllers/web/
- API controllers are at controller/api/

## How to setup

- Make sure you have got node & npm installed
- Fork & clone this repo
- Navigate into src directory
- Execute `npm install` - this installs the dependencies
- Execute `npm start` - this will start the server

change app.html to index.html
open localhost:8088 to acess the app
