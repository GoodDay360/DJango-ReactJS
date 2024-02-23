import axios from "axios";

const static_db_version = 1
// Open an IndexedDB database
const openDB = (name, version, onUpgrade) => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(name, version);
        request.onupgradeneeded = event => onUpgrade(event.target.result);
        request.onsuccess = event => resolve(event.target.result);
        request.onerror = event => reject(event.target.error);
    });
};

// Store data in an IndexedDB object store
const storeData = (db, storeName, key, value) => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(value, key);
        request.onsuccess = resolve;
        request.onerror = event => reject(event.target.error);
    });
};

// Retrieve data from an IndexedDB object store
const retrieveData = (db, storeName, key) => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName);
        const store = transaction.objectStore(storeName);
        const request = store.get(key);
        request.onsuccess = event => resolve(event.target.result);
        request.onerror = event => reject(event.target.error);
    });
};

// Delete data from an IndexedDB object store
const deleteData = (db, storeName, key) => {
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(key);
        request.onsuccess = resolve;
        request.onerror = event => reject(event.target.error);
    });
};

export async function getImageByUrl(url) {
    try {
        // Open an IndexedDB database using the static_db_version variable
        const db = await openDB('static-cache', static_db_version, db => {
            db.createObjectStore('images');
        });

        // Check for a cached version of the image data
        const cachedData = await retrieveData(db, 'images', url);
        if (cachedData) {
            // Create an Image object and set its src attribute to the cached data
            const image = new Image();
            image.src = cachedData.value;

            // Check if the image loads successfully
            try {
                await new Promise((resolve, reject) => {
                    image.onload = resolve;
                    image.onerror = reject;
                });

                // Update the timestamp of the cached data
                await storeData(db, 'images', url, { value: cachedData.value, timestamp: Date.now() });

                return cachedData.value;
            } catch (error) {
                // If there is an error, continue to fetch the image data from the server
            }
        }

        // Fetch the image data from the server
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const binary = new Uint8Array(response.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ''
        );
        const base64 = btoa(binary);
        const mimeType = response.headers['content-type'];
        const base64Data = `data:${mimeType};base64,${base64}`;

        // Cache the image data in IndexedDB with a timestamp
        await storeData(db, 'images', url, { value: base64Data, timestamp: Date.now() });

        return base64Data;
    } catch (error) {
      console.error(error)
      return null;
    }
}


export async function clearStatic() {
    try {
        // Open an IndexedDB database using the static_db_version variable
        const db = await openDB('static-cache', static_db_version, db => {
            db.createObjectStore('images');
        });

        // Get all keys from the images object store
        const keys = await new Promise((resolve, reject) => {
            const transaction = db.transaction('images');
            const store = transaction.objectStore('images');
            const request = store.getAllKeys();
            request.onsuccess = event => resolve(event.target.result);
            request.onerror = event => reject(event.target.error);
        });

        // Check each key for stale data
        for (const key of keys) {
            const data = await retrieveData(db, 'images', key);

            // Check if the data is older than 5 week
            const ago = Date.now() - 5 * 7 * 24 * 60 * 60 * 1000;
            if (data.timestamp < ago) {
                // If the data is older than 5 week, delete it
                await deleteData(db, 'images', key);
            }
        }
    } catch (error) {
      console.error(error)
    }
}
