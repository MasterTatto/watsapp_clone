import firebase from 'firebase';

const firebaseConfig = {
	// 	apiKey: process.env.API_KEY,
	// 	authDomain: process.env.AUTH_DOMAIN,
	// 	projectId: process.env.PROJECT_ID,
	// 	storageBucket: process.env.STORAGE_BASKET,
	// 	messagingSenderId: process.env.MESSAGE_SENDER_ID,
	// 	appId: process.env.APP_ID,
	apiKey: 'AIzaSyDVq-cKoKNt1EHQxJ2MnxZzQIjKtnrLUW8',
	authDomain: 'chatimg-730ba.firebaseapp.com',
	projectId: 'chatimg-730ba',
	storageBucket: 'chatimg-730ba.appspot.com',
	messagingSenderId: '185994771045',
	appId: '1:185994771045:web:e2c99c64d3dfbbe563a48c',
};

const app = firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

const db = app.firestore();

const googleProvider = new firebase.auth.GoogleAuthProvider();

export { auth, googleProvider };

export default db;
