const express = require('express');
const app = express();
const port = process.env.PORT || 3030;
const server = app.listen(port);
server.timeout = 1000 * 60 * 10;
app.use(function (req, res, next) {
    res.header('Content-Type', 'application/json');
    next();
});
app.get('/api/endpoint1', (req, res) => {
    res.send(JSON.stringify({ value: 1 }));
});
//# sourceMappingURL=test-rest-server.js.map