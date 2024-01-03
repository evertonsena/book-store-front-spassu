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
# cd ..
chmod 775 .env
# quando erro de certificado SELF_SIGNED_CERT_IN_CHAIN
# npm config set strict-ssl false

# npm Install
npm install

# npm Build
npm run build

# npm install -g serve
# serve -s build