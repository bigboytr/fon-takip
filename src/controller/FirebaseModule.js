import firebase from 'firebase';
import firebaseConfig from '../firebaseConfig';

export default class FirebaseModule {

    constructor() {
        return firebase.initializeApp(firebaseConfig);
    }
}