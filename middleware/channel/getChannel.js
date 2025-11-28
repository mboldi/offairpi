/**
 * getChannel
 * description
 */

const fs = require('fs');

module.exports = function (objectrepository) {

    return function (req, res, next) {
        const channelsData = JSON.parse(fs.readFileSync("config/channelSettings.json", 'utf8'));

        if(res.local === undefined) {
            res.local = {};
        }

        for(let i = 0; i < channelsData.channels.length; i++) {
            if(channelsData.channels[i].id  == req.params.id) {
                res.local.channelData = channelsData.channels[i];
            }
        }

        return next();
    };
};