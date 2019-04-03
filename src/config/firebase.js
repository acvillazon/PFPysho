import * as firebase from 'firebase';
import 'firebase/firestore';
import uuid from 'uuid';
let instance = null;
class FirebaseDb {

    constructor() {
        ///INICIAR FIREBASE
        if (!firebase.apps.length) {
            firebase.initializeApp(config);
            
        }
    }

    get firestore() { return (firebase.firestore())}

    get uid() { return (firebase.auth().currentUser || {}).uid; }

    get timestamp() { return firebase.database.ServerValue.TIMESTAMP; }

    get ref() { return firebase.database().ref('Messages'); }

    //VIEW {LOGIN}
    login = async (user, success_callback, failed_callback) => {
        await firebase.auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then(success_callback, failed_callback);
    }
    
    CheckNewUser = async() =>{
        var exists = false;

        await this.firestore.collection("Usuario")
        .doc(this.uid).get()
        .then(snapshot =>{exists = snapshot.exists})
        return exists
    }

    ///VIEW {REGISTER}
    RegisterUserForFirstAccess = async(usuario) =>{
        await this.firestore.collection("Usuario").doc(this.uid).set({
            usuario
        })
        return true
    }
    
    //VIEW {CHAT}
    RegisterTokenInUsers = (token) => {
        firebase.database().ref('Usuarios').child(this.uid).update({
            ExpoPushToken: token
        })
    }

    refOn = callback => {
        this.ref
        .limitToLast(20)
        .on('child_added', snapshot => callback(this.parse(snapshot)));
    }

    refOff() { this.ref.off();}
    
    parse = snapshot => {
        //console.log(snapshot.val())
        const { createdAt, text, user } = snapshot.val();
        console.log(snapshot.val())
        console.log(createdAt+">>><>><>>>>><<>>>>><<")
        var time = new Date()
        time.setTime(createdAt)
        console.log(time)

        var { key: _id } = snapshot;
        const message = { _id, createdAt:time, text, user };
        console.log(message)
        return message;
    };
    
    send = messages => {
        var data = {}
        for (let i = 0; i < messages.length; i++) {
            const { text, user } = messages[i];
            const message = { text, user, createdAt: this.timestamp};
            this.ref.push(message);
            this.firestore.collection("Usuario").doc("zy29RB7hbe1dvibg8JR").get().then(snapshot =>{
                console.log(snapshot.exists)
            })
            
            //ENVIAR PUSH NOTIFICATION
            data={
                "to": "ExponentPushToken[TwJErCJN8wFujCWCHdf211]",
                "body": "New Message!!"
            }
            
            fetch("https://exp.host/--/api/v2/push/send",
            {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }).then(data => {
                console.log(data)
            })
        };
    }

    
    


    ///NO FINISH
    sendMessage = async (messages, success_callback, failed_callback) => {
        await firebase.firestore().collection("messages").add({

        }).then(success_callback, failed_callback)
    }
}

var config = {
    apiKey: "AIzaSyAiUexW6cOY45eQzItbs_Gpu8MvQRuu54g",
    authDomain: "reactnativepf.firebaseapp.com",
    databaseURL: "https://reactnativepf.firebaseio.com",
    projectId: "reactnativepf",
    storageBucket: "reactnativepf.appspot.com",
    messagingSenderId: "16477471003"
};

const firebaseService = new FirebaseDb()

export default firebaseService