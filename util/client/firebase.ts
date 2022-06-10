// Import the functions you need from the SDKs you need

import { initializeApp } from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
	apiKey: 'AIzaSyASFWH9kk9BjdSB3YGXpylotEDSpgbFJPg',
	authDomain: 'topsongs-735c8.firebaseapp.com',
	projectId: 'topsongs-735c8',
	storageBucket: 'topsongs-735c8.appspot.com',
	messagingSenderId: '877716322682',
	appId: '1:877716322682:web:8b31bd18140eb1faa7fec3',
	measurementId: 'G-ELKDRXGTET',
};

// Initialize Firebase

export const firebaseApp = initializeApp(firebaseConfig);
