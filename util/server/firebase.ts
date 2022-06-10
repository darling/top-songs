import admin from 'firebase-admin';

if (!process.env.FIREBASE_JSON_KEY) {
	throw new Error('FIREBASE_JSON_KEY environment variable is not set');
}

// import firebase.json
const firebaseConfig = require('../../firebase.json');

// Initialize Firebase if it's not already initialized

if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert(firebaseConfig),
	});
}

// export admin as firebaseAdmin

export const firebaseAdmin = admin;
