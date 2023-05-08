// variables con información de "require()"
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

/* esta variable constante es un objeto que contiene las propiedades dadas por la clase constructora "Client()",
asimismo, se solicita que la propiedad "authStrategy" no se le asigne el valor predeterminado por
"Client()", sino que se asignará un objeto de otra clase constructora (LocalAuth()) el cual, del
mismo modo, su variable "dataPath" contendrá el valor indicado */
const SkyzeeBOT = new Client({
    authStrategy: new LocalAuth({
        dataPath: './session'
    })
});

SkyzeeBOT.on('qr', (qr) => {
    qrcode.generate(qr, {small: true});
});

SkyzeeBOT.on('authenticated', (res) => {
    console.log('SkyzeeBOT activo');
});

SkyzeeBOT.initialize();

SkyzeeBOT.on('ready', () => {
    SkyzeeBOT.on('message', (msg) => {
        if (msg === '!session.save') {
            fs.write('./session.json', sessionData, () => console.log('SESSION GUARDADA'))
        }
    })
});