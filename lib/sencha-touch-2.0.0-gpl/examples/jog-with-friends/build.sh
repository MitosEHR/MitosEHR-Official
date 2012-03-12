#!/bin/bash

# Builds the Sencah Touch app to one minimized file and copies the neccessary resources

rm -rf server-side/public/resources
cp -r resources server-side/public
mkdir -p server-side/public/resources/js

sencha create jsb -a index.html -p app.jsb3
sencha build -p app.jsb3 -d .

mv app-all.js server-side/public/resources/js

cp ../../build/sencha-touch.js ./server-side/public/resources/js
