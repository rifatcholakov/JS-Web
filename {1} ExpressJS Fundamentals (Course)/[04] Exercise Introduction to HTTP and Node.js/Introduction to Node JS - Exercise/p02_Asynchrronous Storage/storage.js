const fs = require('fs');

let storage = {};

module.exports = {
    put: (key, value) => {
        if(typeof key === 'string') {
            if(!storage.hasOwnProperty(key)) {
                storage[key] = value;
            } else {
                throw new Error('The key already exist');
            }
        } else {
            throw new Error('The key must be string');
        }
    },

    get: (key) => {
        if(typeof key === 'string') {
            if(storage.hasOwnProperty(key)) {
                return storage[key];
            } else {
                throw new Error("The key doesn't exist");
            }
        }
    },

    getAll: () => {
        if(Object.keys(storage).length === 0) {
            throw new Error('The storage is empty');
        }

        return storage;
    },

    update: (key, newValue) => {
        if(typeof key === "string") {
            if(storage.hasOwnProperty(key)) {
                storage[key] = newValue;
            } else {
                throw new Error("The key doesn't exist");
            }
        } else {
            throw new Error('The key must be string');
        }
    },

    delete: (key) => {
        if(typeof key === "string") {
            if(storage.hasOwnProperty(key)) {
                delete storage[key];
            } else {
                throw new Error("The key doesn't exist");
            }
        } else {
            throw new Error('The key must be string');
        }
    },

    clear: () => {
        storage = {};
    },

    save: () => {
        fs.writeFile('storage.json', JSON.stringify(storage), (err) => {
            if(err) throw err;
            console.log('The file has been saved');
        });
    },

    load: () => {
        fs.exists('storage.json', (exists) => {
            if(exists) {
                let data = fs.readFile('storage.json', (err, data) => {
                    if (err) throw err;
                    storage = JSON.parse(data);
                });
            } else {
                console.log("The file doesn't exist");
            }
        });
    }
};