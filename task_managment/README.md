
  
browserify -t [ babelify --presets [ react ] ] src/index.js -o build/app.js
{
  "name": "task-managment",
  "version": "0.0.0",
  "description": "",
  "main": "app.js",
  "scripts": {
    "watch": "watchify app.js -o public/js/bundle.js -v",
    "browserify": "browserify app.js > public/js/bundle.js",
    "build": "npm run browserify",
    "start": "npm install"
  },
  "author": "",
  "license": "",
  "dependencies": {
    "axios": "^0.15.3",
    "babel-preset-react": "^6.23.0",
    "babelify": "^7.3.0",
    "bcrypt": "^1.0.2",
    "body-parser": "^1.17.1",
    "bootstrap": "^3.3.7",
    "browserify": "^14.1.0",
    "cookie-parser": "^1.4.3",
    "email-verification": "^0.4.6",
    "express": "~4.9.7",
    "express-handlebars": "~1.1.0",
    "express-session": "^1.15.1",
    "font-awesome": "^4.7.0",
    "jquery": "^3.1.1",
    "jsonwebtoken": "^7.3.0",
    "mongoose": "^4.2.6",
    "multer": "^1.3.0",
    "multiparty": "^4.1.3",
    "node-jsx": "~0.12.4",
    "nodemailer": "^3.1.8",
    "passport": "^0.3.2",
    "passport-local": "^1.0.0",
    "path": "^0.12.7",
    "react": "^15.4.2",
    "react-bootstrap": "^0.30.8",
    "react-dom": "^15.4.2",
    "react-router": "^3.0.2",
    "reactify": "^1.1.1",
    "validator": "^7.0.0",
    "webpack": "^2.2.1",
    "webpack-dev-server": "^2.4.1"
  },
  "devDependencies": {
    "browserify": "~6.0.3",
    "nodemon": "^1.2.1",
    "reactify": "~1.1.1",
    "uglify-js": "~2.4.15",
    "watchify": "^3.1.1"
  },
  "browserify": {
    "transform": [
      "reactify"
    ]
  }
}
