const { key } = require('./secrets.js');
const subtle = window.crypto.subtle;

function str2ab(str) {
    var buf = new ArrayBuffer(str.length);
    var bufView = new Uint8Array(buf);
    for (var i=0, strLen=str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

module.exports = () => {
    console.log('Decrypting...');
    const enc = new TextEncoder();
    const dec = new TextDecoder();
    subtle.importKey(
        'jwk', //can be 'jwk' (public or private), 'spki' (public only), or 'pkcs8' (private only)
        key,
        {   //these are the algorithm options
            name: 'RSA-OAEP',
            hash: { name: 'SHA-256' }, //can be 'SHA-1', 'SHA-256', 'SHA-384', or 'SHA-512'
        },
        false, //whether the key is extractable (i.e. can be used in exportKey)
        ['decrypt'] //'encrypt' or 'wrapKey' for public key import or
        //'decrypt' or 'unwrapKey' for private key imports
    ).then(privateKey => {
        //returns a publicKey (or privateKey if you are importing a private key)
        console.log(privateKey);
        const promises = [];
        const elements = document.getElementsByClassName('encrypted');
        for (let element of elements) {
            console.log(enc.encode(element.innerText));
            promises.push(subtle.decrypt(
                {
                    name: "RSA-OAEP",
                    //label: Uint8Array([...]) //optional
                },
                privateKey, //from generateKey or importKey above
                str2ab(element.innerText) //ArrayBuffer of the data
            ).catch(err => console.error(err)));
        }
        Promise.all(promises).then(decrypted => {
            decrypted.forEach((text, i) => {
                console.log(text, i);
                elements[i].innerText = dec.decode(text[i]);
                elements[i].className = 'decrypted';
            });
        });
    }).catch(err => console.error(err));
};