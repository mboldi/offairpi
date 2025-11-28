const renderMW = require('../middleware/common/render');

const mainRedirectMW = require('../middleware/common/mainRedirect');

const getChannelsMW = require('../middleware/channel/getChannels');
const getChannelMW = require('../middleware/channel/getChannel');
const startChannelStreamMW = require('../middleware/channel/startChannelStream');

module.exports = function (app) {

    let objectRepository = {};

    /*
    main page, redirects to login if not logged in, otherwise offair selection
     */
    app.get('/',
        mainRedirectMW(objectRepository)
    );

    /*
    show offair list to select one for editing
     */
    app.get('/select',
        getChannelsMW(objectRepository),
        renderMW(objectRepository, 'selectoffair')
    );

    /*
    single offair status and edit page
     */
    app.use('/channel/:id',
        //checkUserLoginMW(objectRepository),
        getChannelMW(objectRepository),
        renderMW(objectRepository, 'editoffair')
    );

    /*
    start stream of given channel
     */
    app.use('/startchannel/:id',
        getChannelMW(objectRepository),
        startChannelStreamMW(objectRepository),
        function (req, res, next) {
            return res.redirect("/select");
        }
    )

    /*
    stop stream of given channel
     */
    app.use('/stopchannel/:id',
        function (req, res, next) {
            return next();
        }
    )

};