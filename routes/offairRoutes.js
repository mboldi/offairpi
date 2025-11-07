const renderMW = require('../middleware/common/render');

const mainRedirectMW = require('../middleware/common/mainRedirect');


module.exports = function (app) {

    let objectRepository = {
    };

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
        renderMW(objectRepository,'selectoffair')
    );

    /*
    single offair status and edit page
     */
    app.use('/offair/:id',
        //checkUserLoginMW(objectRepository),
        function(req, res, next) {
            if(req.params.id === undefined){
                return res.redirect('/select');
            }

            if (res.local === undefined) {
                res.local = {};
            }

            res.local.offairID = req.params.id;

            return next();
        },
        renderMW(objectRepository,'editoffair')
    );

};