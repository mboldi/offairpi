/**
 * getChannels
 * description
 */

const fs = require('fs');

module.exports = function (objectrepository) {

    return function (req, res, next) {
        const channelsData = JSON.parse(fs.readFileSync("config/channelSettings.json", 'utf8'));

        if(res.local === undefined) {
            res.local = {};
        }

        res.local.channelsData = channelsData.channels;

        return next();
    };
};