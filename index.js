const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const JSZip = require('jszip');
const Dropbox = require('dropbox').Dropbox;

const SESSION_FOLDER_PATH = './session/'

const prefix = /^[!/.]/;

const client = {        
    dropbox: new Dropbox({
        accessToken: "sl.BeNG9yLIZWIvKORK-yg0yBGm6gyq6uztLeNSYVQE-iWpgPLTRo_5yi8dzkKnd-GLo9-SFDMK3Gb20lUahBypayKCnEH3q4DljIAxsMZrRuqUcWM3Jr3OkXoamW9KtU4wE7e0-es"
    }),
    wweb_js: new Client({
        authStrategy: new LocalAuth({
            clientId: 'SKYZEEBOT',
            dataPath: SESSION_FOLDER_PATH
        })
    })
};

const SkyzeeBOT = client.wweb_js;

if (fs.existsSync(SESSION_FOLDER_PATH)) {
    console.log('[✓] Archivo de sesión encontrada!');
} else {
    console.log('[!] No se encontró el archivo de sesión!');
};

(async function() {
    SkyzeeBOT.on('qr', (qr) => {
        qrcode.generate(qr, {small: true});
    });
    
    SkyzeeBOT.on('authenticated', () => {
        console.log('SkyzeeBOT activo');
    });
    
    SkyzeeBOT.on('ready', () => {
        SkyzeeBOT.on('message', (wweb_allResult) => {
            const msgConfig = wweb_allResult.Message._data;
            const isCommand = prefix.test(msgContent);
            const command = isCommand ? msg.slice(1) : null;
            console.log(msg);
            if (!isCommand) return;
        })
    });
}());

SkyzeeBOT.initialize();