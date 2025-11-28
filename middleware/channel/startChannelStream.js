/**
 * startChannelStream
 * Starts Youtube stream on given channel
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
            const findstream = spawn('yt-dlp', ['--print', 'urls', res.local.channelData.currentStreamLink]);
            const utfDecoder = new TextDecoder('UTF-8');

            findstream.stdout.on('data', (data) => {
                const stringData = utfDecoder.decode(data);

                console.log("Stream URL data received: " + stringData);
                if (stringData.includes("manifest.googlevideo.com")) {
                    setTimeout(() =>
                        exec('ps -ef | grep ffplay', (err, stdout, stderr) => {
                            if(err) {
                                console.log(err);
                            }

                            const outElements = stdout.split('\n')[1].split(' ');
                            let i = 1
                            let streamPid = "";
                            for (i; (streamPid = outElements[i]) === "" ; i++) {}

                            console.log('pid of ffplay process: ' + streamPid);
                            res.local.channelData.currentStreamPid = streamPid;

                            updateStreamPidInDb(res.local.channelData.id, streamPid);

                        }), 5000)
                }
            });

            findstream.stderr.on('data', (data) => {
                console.log("String URL error: " + utfDecoder.decode(data));
            });

            findstream.on('close', () => {
                console.log("Findstream closed");
            });


            const streamProcess = exec('ffplay -fs $(yt-dlp --print urls ' + res.local.channelData.currentStreamLink + ')');

            streamProcess.on('close', function () {
                console.log(res.local.channelData.name + " channel stopped streaming.");

                updateStreamPidInDb(res.local.channelData.id, "")
            });


        } catch (e) {
            console.log(e);
            res.local.err = "Couldn't start stream";
        }

        return next();
    };
};

function updateStreamPidInDb(channelId, streamPid) {
    const channelsData = JSON.parse(fs.readFileSync("config/channelSettings.json", 'utf8'));

    for(let i = 0; i < channelsData.channels.length; i++) {
        if(channelsData.channels[i].id  == channelId) {
            channelsData.channels[i].streamPid = streamPid;

            break;
        }
    }

    fs.writeFileSync("config/channelSettings.json", JSON.stringify(channelsData, null, 4));
}