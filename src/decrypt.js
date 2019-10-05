const { key } = require('./secrets.js');
const subtle = window.crypto.subtle;

function str2ab(str) {
    var buf = new ArrayBuffer(str.length);
    var bufView = new Uint8Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

module.exports = (messages) => {
    console.log('Decrypting...');
    return new Promise((resolve, reject) => {
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
            const promises = [];
            let itemCount = 0;
            const items = [];
            let itemsCounted = false;
            for (let message of messages) {
                for (let item in message) {
                    if (item === '_id') continue;
                    if (!itemsCounted) {
                        ++itemCount;
                        items.push(item);
                    }
                    promises.push(subtle.decrypt(
                        {
                            name: "RSA-OAEP",
                            //label: Uint8Array([...]) //optional
                        },
                        privateKey, //from generateKey or importKey above
                        str2ab(message[item]) //ArrayBuffer of the data
                    ).catch(err => reject(err)));
                }
                itemsCounted = true;
            }
            resolve({
                promise: Promise.all(promises),
                items: items,
                itemCount: itemCount
            });
        }).catch(err => reject(err));
    });

};