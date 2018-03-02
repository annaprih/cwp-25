/**
 * Created by annae on 27.02.2018.
 */
const express = require('express');
const shrinkRay = require('shrink-ray');

const app = express();

app.use(shrinkRay());
app.use(express.static('public'));

app.listen(8443, function () {
    console.log("Connected");
});