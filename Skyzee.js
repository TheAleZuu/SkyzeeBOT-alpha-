// variables con información de "require()"
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const { Dropbox } = require('dropbox').Dropbox;

const prefix = /^[!/.]/;

var client = {
    wweb_js: new Client({
        authStrategy: new LocalAuth({
            clientId: 'SKYZEEBOT',
            dataPath: './session'
        })
    }),
    dropbox: new Dropbox()
};

const SkyzeeBOT = client.wweb_js;

SkyzeeBOT.initialize();

SkyzeeBOT.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});

SkyzeeBOT.on('authenticated', () => {
    console.log('SkyzeeBOT activo');
});

SkyzeeBOT.on('ready', () => {
    SkyzeeBOT.on('message', (msg) => {
        const isCommand = prefix.test(msg);
        const command = isCommand ? msg.slice(1) : null;
        console.log(msg);
        if (!isCommand) return;
    })
});
