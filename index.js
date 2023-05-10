// variables con información de "require()"
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const JSZip = require('jszip');
const Dropbox = require('dropbox').Dropbox;

const prefix = /^[!/.]/;

var client = new function () {
    this.dropbox = new Dropbox({
        accessToken: "sl.BeGpwuw7rx54ePEEQ8nt-PB_AZenoMcqEha-WnNsnngXJL3-F4KkKF0gL__QBLLZATGxwD9LJAklnws3EvEU0kJ8vG9R4M_Gv29BP8Ziku0BlKrK6_spJtbr-JuJYIlk_O3b_Fw"
    });

    this.dropbox.filesDownloadZip({
        path: '/session/'
    }).then(response => {
        console.log(response);
        // Crear un objeto JSZip a partir de los datos del archivo ZIP
        return JSZip.loadAsync(response.result.fileBinary);
    }).then(zip => {
        // Descomprimir el archivo ZIP
        return zip.forEach((relativePath, file) => {
            // verificar si el archivo es una carpeta
            if (!file.dir) {
                var dir = relativePath.replace(/\/$/, '');
                fs.mkdir(`./${dir}`, (err) => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log(`[!] Descargando sesión de WhatsApp (FOLDER): ${relativePath}/...`);
                    }
                });
            } else {
                // Si es un archivo, extraer el contenido
                file.async('string').then(content => {
                    var filename = relativePath.split('/').pop();
                    fs.write(`./${filename}`, content, (err) => {
                        console.error(err)
                    })
                    console.log(`[!] Descargando sesión de WhatsApp (FILE): ${relativePath}/${file}...`);
                });
            }
        });
    });

    this.wweb_js = new Client({
        authStrategy: new LocalAuth({
            clientId: 'SKYZEEBOT',
            dataPath: '/session/'
        })
    });
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
    SkyzeeBOT.on('message', (wweb_allResult) => {
        const msgConfig = wweb_allResult.Message._data;
        const isCommand = prefix.test(msgContent);
        const command = isCommand ? msg.slice(1) : null;
        console.log(msg);
        if (!isCommand) return;
    })
});
