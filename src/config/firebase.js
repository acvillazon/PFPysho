import * as firebase from 'firebase';
import 'firebase/firestore';

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

    LogOutUsuario = async (id)=>{
        await this.firestore.collection("Usuario").doc(id).update({
            "usuario.state":false
        })
        return false;
    }

    //VIEW {LOGIN}
    login = async (user, success_callback, failed_callback) => {
        await firebase.auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then(success_callback, failed_callback);

    }

    //LOGIN FIREBASE
    getAuth = async () =>{
        var user = await this.firestore.collection("Usuario")
        .doc(this.uid).get()
        return user.data()
    }

    ///CAMBIAR ESTADO DE DB USUARIO. == (LOGIN EN DB USUARIO)
    LogInUsuario = async (id)=>{
        await this.firestore.collection("Usuario").doc(id).update({
            "usuario.state":true
        })
        return false;
    }
    
    ///VER SI EL USUARIO QUE INGRESO, ESTA O NO REGISTRADO EN LA PLATAFORMA
    //TODOS LOS USUARIOS ESTAN "REGISTRADOS", MAS NO HAN INICIADO POR PRIMER VEZ.
    CheckNewUser = async() =>{
        var exists = false;

        await this.firestore.collection("Usuario")
        .doc(this.uid).get()
        .then(snapshot =>{exists = snapshot.exists})
        return exists
    }

    getUser = async (id) =>{
        var user= undefined
        await this.firestore.collection("Usuario")
        .doc(id).get()
        .then(snapshot =>{user = snapshot.data()})
        return user
    }

    ///VIEW {REGISTER}
    RegisterUserForFirstAccess = async(usuario) =>{
        await this.firestore.collection("Usuario").doc(this.uid).set({
            usuario
        })
        return true
    }
    
    //VIEW {CHAT}
    refOnFirestore = (id,callback) =>{
        this.firestore.collection("Chat").doc(id).collection("Message").orderBy("message.createdAt").onSnapshot(doc =>{
            if(doc.size>0){
                var changes = doc.docChanges()
                changes.forEach(ch =>{
                    if(ch.type=="added"){
                        callback(this.parse(ch.doc))
                    }
                })
            }
        })
    }

    RegisterTokenInUsers = (token) => {
        this.firestore.collection("Usuario").doc(this.uid).update({
          ExpoPushToken: token
        })
        /*firebase.database().ref('Usuarios').child(this.uid).update({
            ExpoPushToken: token 
        })*/
    }
 
    refOn = callback => {
        this.ref
        .limitToLast(20)
        .on('child_added', snapshot => callback(this.parse(snapshot)));
    }

    refOff() { this.ref.off();}
    
    parse = snapshot => {
        var time2=undefined
        const { createdAt, text, user } = snapshot.data().message;
        var time = new Date()
        if(createdAt==null){

        }else{
            time.setTime((createdAt.seconds)*1000)
            time2 = createdAt.seconds

        }
        var { id: _id } = snapshot;
        const message = { _id, createdAt:time, text, user, time:time2};
        console.log("Listening.....")
        console.log(message)
        return message;
    }; 
    
    send = (messages,id,thischat) => {
        var data = {}
        for (let i = 0; i < messages.length; i++) {
            const { text, user } = messages[i];
            const message = { text, user, createdAt: firebase.firestore.FieldValue.serverTimestamp()};
            this.firestore.collection("Chat").doc(id).collection("Message").add({
                message
            })
            //ENVIAR PUSH NOTIFICATION
            data={
                "to": thischat.partner.ExpoPushToken,
                "body": text
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

    ////CREAR NUEVA CONVERSACION
    LoadCategories = async () =>{
        var categories=[]
        await this.firestore.collection("CategoriaChat").get().then(snapshot =>{
            snapshot.forEach((snap) =>{
                var category={
                    id:snap.id,
                    nombre:snap.data().nombre,
                    tipo:snap.data().tipo
                }
                categories.push(category)
                //console.log(categories)            
            })
        })
        return categories
    }

    CreateNewChat = async (tipo) =>{
        var id=undefined
        try{
            var result = await this.firestore.collection("Usuario")
            .where("usuario.state","==",true).where("usuario.tipo","==","1")
            .orderBy("usuario.numChat").limit(1)

        var user = await result.get().then(snapshot => {
            var pycho = {}
            var chtnum = undefined
            snapshot.forEach((data) =>{
                pycho ={
                    id:data.id,
                    user:data.data().usuario
                }
                chatnum = (data.data().usuario.numChat)+1

            })
            this.firestore.collection("Usuario").doc(pycho.id).update({
                'usuario.numChat': chatnum
            })

            return pycho
        })

        var chat = await this.firestore.collection("Chat").add({
            date:firebase.firestore.FieldValue.serverTimestamp(),
            usuario:{
                idC:this.uid,
                idP:user.id
            },
            tipo:tipo
        }).then(docRef =>{
            id = docRef.id
        })
        }catch(r){
            return false
        }
        return [id,chat]
        //Aumentar el contador al psycologo
    }

    getChat = async (tipo, callback) =>{
        var chats=undefined
        var infoChats=[]
        var ids=[]

        if(tipo=="1"){
            chats = await this.firestore.collection("Chat").where("usuario.idP","==",this.uid)

        }else{
            chats = await this.firestore.collection("Chat").where("usuario.idC","==",this.uid)
        }

        var result = await chats.onSnapshot(doc =>{
            if(doc.size>0){
                var changes = doc.docChanges()
                changes.forEach( async change =>{
                    if(change.type=="added"){
                        var snapshot = change.doc
                        console.log("TIPO->"+tipo)

                        var estudent=undefined

                        if(tipo=="1"){
                            estudent = await this.firestore.collection("Usuario").doc(snapshot.data().usuario.idC).get() 
                            console.log(estudent.data())
                        }else{
                            estudent = await this.firestore.collection("Usuario").doc(snapshot.data().usuario.idP).get()
                            console.log(estudent.data())
                        }

                        infoChats.push({
                            id:snapshot.id,
                            body:snapshot.data(),
                            partner:estudent.data()
                        })
                        ids.push(snapshot.id)
                    }
                })
                var res = [ids,infoChats]
                console.log(res)
                callback(res)
            }
        })
        //return res
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


export default (firebaseService)