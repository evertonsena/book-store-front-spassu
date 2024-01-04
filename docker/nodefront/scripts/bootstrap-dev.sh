#!/bin/sh

cd /app

if [ ! -f ".env" ]; then
	cp .env-sample .env
fi

chmod 775 .env

# npm install
npm install

# yarn Install
yarn

# npm Build
yarn start
