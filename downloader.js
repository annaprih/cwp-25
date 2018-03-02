/**
 * Created by annae on 28.02.2018.
 */
const request = require("request");
const fs = require("fs");
const url = "http://localhost:8443/app.js";

const types = ["gzip","deflate", "br", ""];

types.forEach(el => {
    request(
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept-Encoding": el
            },
            uri: url,
            method: "GET"
        },
        function(err, res, body) {
            if(err){
                console.log(err);
            }

            fs.writeFile('app-' + el + '.js',body , (err) => {
                if (err) throw err;
                console.log(el);
            });
              }
    );
});