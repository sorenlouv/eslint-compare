Getting Started
----------

To add new configs:
1. Export config using:
```
npx eslint --print-config src > yourconfig.json
```
2. Copy it into ./src/data/configs
3. Add a picture to ./src/img
4. Add a your new config section to the list of configs in ./src/App.js

Develop
```
npm install
npm run start
```

Deploy
```
npm run build
npm run deploy
```
