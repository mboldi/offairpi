const Schema = require('mongoose').Schema;
const db = require('../config/db');

const OffairChannel = db.model('offair-channel', {
    youtube_channel_id: String,
    video_device: String,
    audio_device: String,
    streaming: Boolean,
});

module.exports = OffairChannel;