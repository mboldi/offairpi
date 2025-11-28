/**
 * startChannelStream
 * Stop Youtube stream on given channel
 */

const fs = require('fs');
const {exec, spawn} = require('child_process');
const stream = require("node:stream");

module.exports = function (objectrepository) {

    return function (req, res, next) {
        if (res.local.channelData === undefined) {
            res.local.err = "Missing channel data";
            return next();
        }

        try {

            const killProcess = exec('kill ' + res.local.channelData.currentStreamPid);

            killProcess.on('close', function () {
                console.log(res.local.channelData.name + " channel process killed");

                updateStreamPidInDb(res.local.channelData.id, "")
            });

        } catch (e) {
            console.log(e);
            res.local.err = "Couldn't stop stream";
        }

        return next();
    };
};

function updateStreamPidInDb(channelId, streamPid) {
    const channelsData = JSON.parse(fs.readFileSync("config/channelSettings.json", 'utf8'));

    for(let i = 0; i < channelsData.channels.length; i++) {
        if(channelsData.channels[i].id  == channelId) {
            channelsData.channels[i].currentStreamPid = streamPid;

            break;
        }
    }

    fs.writeFileSync("config/channelSettings.json", JSON.stringify(channelsData, null, 4));
}