global.fs = require('fs');
global.chalk = require('chalk');
global.wwebjs = { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
global.qrcode = require('qrcode-terminal');
// global.Dropbox = require('dropbox').Dropbox;
global.youtubedl = require('youtube-dl-exec');

global.SESSION_FOLDER_PATH = './session/';
global.botName = 'Skyzee';
global.prefix = ['!', '/', '#'];
global.prefixRoot = ['>', '$'];
global.currentDate = new Date();
global.public = true;