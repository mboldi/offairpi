const express = require('express');
const app = new express();
//const session = require('express-session');
const bodyParser = require('body-parser');

app.use('/static', express.static('static'));

app.set('view engine', 'ejs');

/*app.use(session({
    secret: 'kakaoscsiga',
    cookie: {
        maxAge: 6000000
    },
    resave: true,
    saveUninitialized: false
}));*/

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

require('./routes/offairRoutes')(app);

const port = 3000;
app.listen(port, function () {
    console.log('Server listening on port ' + port);
});