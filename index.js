const express = require('express');
const app = express();
app.use(express.static('docs'));

const server = require('http').Server(app);
const PORT = 3000;
server.listen(PORT, function () {
	console.log('ESLint Compare is listening at http://localhost:%s', PORT);
});
