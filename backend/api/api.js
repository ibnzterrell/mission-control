const express = require('express');

const app = express();


function defaultRoute(req, res) {
    res.send(req.path);
}

app.use(defaultRoute);

exports.handler = app;