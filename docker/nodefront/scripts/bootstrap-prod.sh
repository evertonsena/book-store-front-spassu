#!/bin/sh

cd /app

if [ ! -f ".env" ]; then
	cp .env-sample .env
fi

chmod 775 .env

# npm Install
npm install

# npm Build
npm run build