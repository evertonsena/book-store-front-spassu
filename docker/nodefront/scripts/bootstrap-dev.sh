#!/bin/sh

cd /app

if [ ! -f ".env" ]; then
	cp .env-sample .env
fi
# cd src/
# if [ ! -f ".navConfig.jsx" ]; then
# 	cp navConfig-sample.jsx navConfig.jsx
# fi
# if [ ! -f ".routes.jsx" ]; then
# 	cp routes-sample.jsx routes.jsx
# fi

chmod 775 .env

# ativa SSL Self-Signed (atras Palo Alto)
# npm config set strict-ssl false

# npm install
npm install

# yarn Install
yarn

# npm Build
yarn start
