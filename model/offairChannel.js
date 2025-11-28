const Schema = require('mongoose').Schema;
const db = require('../config/db');

const OffairChannel = db.model('offair-channel', {
    name: String,
    youtube_channel_id: String,
    video_device: String,
    audio_device: String,
    currentStreamLink: String,
    streamRunning: Boolean,
});

module.exports = OffairChannel;