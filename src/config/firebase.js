import * as firebase from 'firebase';
import 'firebase/firestore';

let unsubscribeChat = null;
let unsubscribeTabChat = null;
let unsubscribeCalendar = null

class FirebaseDb {
    constructor() {
        ///INICIAR FIREBASE
        if (!firebase.apps.length) {
            firebase.initializeApp(config);

        }
    }

    get firestore() { return (firebase.firestore()) }

    get uid() { return (firebase.auth().currentUser || {}).uid; }

    get timestamp() { return firebase.database.ServerValue.TIMESTAMP; }

    get ref() { return firebase.database().ref('Messages'); }

    LogOutUsuario = async (id) => {
        await this.firestore.collection("Usuario").doc(id).update({
            "usuario.state": false
        })
        return true;
    }

    //VIEW {LOGIN}
    login = async (user, success_callback, failed_callback) => {
        await firebase.auth()
            .signInWithEmailAndPassword(user.email, user.password)
            .then(success_callback, failed_callback);

    }

    //LOGIN FIREBASE
    getUser = async() =>{
        var exists = false;
        var user = undefined
        await this.firestore.collection("Usuario")
        .doc(this.uid).get()
        .then(snapshot =>{
            exists = snapshot.exists 
            user = snapshot.data()
        })
        return [exists,user]
    }

    ///CAMBIAR ESTADO DE DB USUARIO. == (LOGIN EN DB USUARIO)
    LogInUsuario = async (id) => {
        await this.firestore.collection("Usuario").doc(id).update({
            "usuario.state": true
        })
        return false;
    }

    ///VER SI EL USUARIO QUE INGRESO, ESTA O NO REGISTRADO EN LA PLATAFORMA
    //TODOS LOS USUARIOS ESTAN "REGISTRADOS", MAS NO HAN INICIADO POR PRIMER VEZ.
    CheckNewUser = async () => {
        var exists = false;

        await this.firestore.collection("Usuario")
            .doc(this.uid).get()
            .then(snapshot => { exists = snapshot.exists })
        return exists
    }

    ///VIEW {REGISTER}
    RegisterUserForFirstAccess = async (usuario) => {
        await this.firestore.collection("Usuario").doc(this.uid).set({
            usuario
        })
        return true
    }

    refOnFirestore = (id,callback,palomas) =>{
        unsubscribeChat = this.firestore.collection("Chat").doc(id).collection("Message").orderBy("message.createdAt").onSnapshot(doc =>{
            if(doc.size>0){
                var changes = doc.docChanges()
                changes.forEach(ch =>{
                    if(ch.type=="added"){
                        callback(this.parse(ch.doc))
                        palomas()
                    }
                })
            }
        })
    }

    refOffFirestoreChat(){
        unsubscribeChat()
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

    refOff() { this.ref.off(); }

    parse = snapshot => {
        var time2 = undefined
        const { createdAt, text, user } = snapshot.data().message;
        var time = new Date()
        if (createdAt == null) {

        } else {
            time.setTime((createdAt.seconds) * 1000)
            time2 = createdAt.seconds

        }
        var { id: _id } = snapshot;
        const message = { _id, createdAt: time, text, user, time: time2 };
        return message;
    };

    send = (messages, id, thischat) => {
        var data = {}
        for (let i = 0; i < messages.length; i++) {
            const { text, user } = messages[i];
            const message = { text, user, createdAt: firebase.firestore.FieldValue.serverTimestamp() };
            this.firestore.collection("Chat").doc(id).collection("Message").add({
                message
            })
            //ENVIAR PUSH NOTIFICATION
            data = {
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
                })
        };
    }

    SaveRegister = (id, text) => {
        this.firestore.collection("Chat").doc(id).collection("Registro").add({
            date: firebase.firestore.FieldValue.serverTimestamp(),
            text: text
        })
    }

    ////CREAR NUEVA CONVERSACION
    LoadCategories = async () => {
        var categories = []
        await this.firestore.collection("CategoriaChat").get().then(snapshot => {
            snapshot.forEach((snap) => {
                var category = {
                    id: snap.id,
                    nombre: snap.data().nombre,
                    tipo: snap.data().tipo,
                    foto: snap.data().foto
                }
                categories.push(category)
            })
        })
        return categories
    }

    activeToInactive = async (id) => {
        var inactive = false
        await this.firestore.collection("Chat").doc(id).update({
            state: "inactivo"
        }).then((value) => {
            inactive = true
        })


        return inactive
    }

    disminuirNumChat = async (usuarios) =>{
        const user1 = await this.firestore.collection("Usuario").doc(usuarios.idC).get()
        const user2 = await this.firestore.collection("Usuario").doc(usuarios.idP).get()

        if(user1.data().usuario.numChat>=1){
            await this.firestore.collection("Usuario").doc(usuarios.idC).update({
                "usuario.numChat":(user1.data().usuario.numChat)-1
            })
        }
        
        if(user2.data().usuario.numChat>=1){
            await this.firestore.collection("Usuario").doc(usuarios.idP).update({
                "usuario.numChat":(user2.data().usuario.numChat)-1
            })
        }
    }

    CreateNewChat = async (tipo, user) => {
        var id = undefined
        try {
            var result = await this.firestore.collection("Usuario")
                .where("usuario.state", "==", true).where("usuario.tipo", "==", "1")
                .orderBy("usuario.numChat").limit(1)

            var user = await result.get().then(snapshot => {
                var pycho = {}
                var chtnum = undefined
                snapshot.forEach((data) => {
                    pycho = {
                        id: data.id,
                        user: data.data().usuario
                    }
                    chatnum = (data.data().usuario.numChat) + 1

                })

                this.firestore.collection("Usuario").doc(pycho.id).update({
                    'usuario.numChat': chatnum
                })

                if (user.usuario.tipo == "0") {
                    this.firestore.collection("Usuario").doc(this.uid).get().then((snapshot => {
                        this.firestore.collection("Usuario").doc(this.uid).update({
                            'usuario.numChat': (snapshot.data().usuario.numChat + 1)
                        })
                    }))
                }
                return pycho
            })

            await this.firestore.collection("Chat").add({
                date: firebase.firestore.FieldValue.serverTimestamp(),
                usuario: {
                    idC: this.uid,
                    idP: user.id
                },
                tipo: tipo,
                state: "activo"
            }).then(docRef => {
                id = docRef.id
            })
        } catch (r) {
            return false
        }
        console.log("NewID")
        alert(id)
        return [id, undefined]
    }

    refOffFirestoreTabChat(){
        unsubscribeTabChat()
    }

    getChat = async (tipo ,callback,callback2,update) =>{
        var chats=undefined
        var infoChats=[]
        var ids=[]

        var infoChats2=[]
        var ids2=[]

        if(tipo=="1"){
            chats = await this.firestore.collection("Chat").where("usuario.idP","==",this.uid)

        }else{
            chats = await this.firestore.collection("Chat").where("usuario.idC","==",this.uid)
        }

        unsubscribeTabChat = await chats.onSnapshot(doc =>{
            if(doc.size>0){
                var changes = doc.docChanges()
                changes.forEach( async change =>{
                    var snapshot = change.doc

                    if(change.type=="added" && snapshot.data().state=="activo"){
                        var estudent=undefined

                        if(tipo=="1"){
                            estudent = await this.firestore.collection("Usuario").doc(snapshot.data().usuario.idC).get() 
                        }else{
                            estudent = await this.firestore.collection("Usuario").doc(snapshot.data().usuario.idP).get()
                        }

                        infoChats.push({
                            id:snapshot.id,
                            body:snapshot.data(),
                            partner:estudent.data()
                        })
                        ids.push(snapshot.id)
                        var res = [ids,infoChats]
                        callback(res)


                        if(snapshot.data().new_message != undefined){
                            if(snapshot.data().new_message.id != this.uid && snapshot.data().new_message.status == true){
                                update(snapshot.id)
                            }
                        }

                    }else if(change.type=="added" && snapshot.data().state=="inactivo"){
                        var estudent=undefined

                        if(tipo=="1"){
                            estudent = await this.firestore.collection("Usuario").doc(snapshot.data().usuario.idC).get() 
                        }else{
                            estudent = await this.firestore.collection("Usuario").doc(snapshot.data().usuario.idP).get()
                        }

                        infoChats2.push({
                            id:snapshot.id,
                            body:snapshot.data(),
                            partner:estudent.data()
                        })
                        ids2.push(snapshot.id)
                        var res = [ids2,infoChats2]
                        callback2(res)

                        if(snapshot.data().new_message != undefined){
                            if(snapshot.data().new_message.id != this.uid && snapshot.data().new_message.status == true){
                                update(snapshot.id)
                            }
                        }
                    }
                    else if(change.type=="modified" && snapshot.data().state=="inactivo"){
                        
                        ids = await ids.filter((value,index)=>{
                            return value != snapshot.id
                        })

                        infoChats = await infoChats.filter((value,index)=>{
                            return value.id != snapshot.id
                        })
                        var res = [ids,infoChats]
                        callback(res)

                        var estudent=undefined

                        if(tipo=="1"){
                            estudent = await this.firestore.collection("Usuario").doc(snapshot.data().usuario.idC).get() 
                        }else{
                            estudent = await this.firestore.collection("Usuario").doc(snapshot.data().usuario.idP).get()
                        }

                        ids2.push(snapshot.id)
                        infoChats2.push({
                            id:snapshot.id,
                            body:snapshot.data(),
                            partner:estudent.data()
                        })

                        var res = [ids2,infoChats2]
                        callback2(res)
                    } else if(change.type=="modified" && snapshot.data().new_message != undefined){
                        if(snapshot.data().new_message.id != this.uid && snapshot.data().new_message.status == true){
                            update(snapshot.id)
                        }
                    }
                })
            }
        })
        //return res
    }

    /*getChatInactivos = async (tipo, callback) => {
        var chats = undefined
        var infoChats = []
        var ids = []

        if (tipo == "1") {
            chats = await this.firestore.collection("Chat").where("usuario.idP", "==", this.uid)

        } else {
            chats = await this.firestore.collection("Chat").where("usuario.idC", "==", this.uid)
        }

        var result = await chats.onSnapshot(doc => {
            if (doc.size > 0) {
                var changes = doc.docChanges()
                changes.forEach(async change => {
                    var snapshot = change.doc

                    if (snapshot.data().state == "inactivo") {

                        var estudent = undefined

                        if (tipo == "1") {
                            estudent = await this.firestore.collection("Usuario").doc(snapshot.data().usuario.idC).get()
                        } else {
                            estudent = await this.firestore.collection("Usuario").doc(snapshot.data().usuario.idP).get()
                        }

                        infoChats.push({
                            id: snapshot.id,
                            body: snapshot.data(),
                            partner: estudent.data()
                        })
                        ids.push(snapshot.id)

                        var res = [ids, infoChats]
                        callback(res)
                    }
                })
            }
        })
        //return res
    }*/

    allRegisterUser = async (id) => {
        var contenido = []
        await this.firestore.collection("Chat").doc(id).collection("Registro").get().then(snapshot => {
            snapshot.forEach((snap) => {
                var title = new Date()
                title.setTime(snap.data().date.seconds * 1000)

                var content = snap.data().text
                contenido.push({
                    title: "Fecha de Creación " + title.toDateString(),
                    content: content
                })
            })
        })
        return contenido
    }


    getEventOfMonth = async () =>{
        var event = await this.firestore.collection("Eventos").get()
        var response = event.forEach((snapshot) =>{
            console.log(snapshot.data())
            var id = snapshot.data().dateformat
            
            var date = new Object()
            date[id]=snapshot.data()
            console.log(date)
        })
    }

    getAllEvent = async (callback) =>{
        var date = new Object()
        var dateMarked = new Object()
        var event = await this.firestore.collection("Eventos").orderBy("hour","asc")

        unsubscribeCalendar = event.onSnapshot(doc =>{
            if(doc.size>0){
                var changes = doc.docChanges()
                changes.forEach(async change =>{
                    var snapshot = change.doc

                    if(change.type=="added"){

                        var id = snapshot.data().dateformat

                        if(date[id]==undefined){
                            date[id] = []
                            dateMarked[id] = {selected: false, marked: true, dotColor: "#03A9F4"}
                        }
                        date[id].push(snapshot.data())

                    }
                })
            }
            callback(date,dateMarked)
        })
    }

    refOffFirestoreCalendar(){
        unsubscribeCalendar()
    }

    addNewEvent = (date,dateformat,timeStart,timeEnd,nombre,descripcion) =>{
        console.log(date,dateformat,timeStart,timeEnd,nombre,descripcion)
        this.firestore.collection("Eventos").add({
            dateformat,
            date,
            timeStart,
            hour:timeStart.slice(0,2),
            timeEnd,
            nombre,
            descripcion
        })
    }

    deleteChat_NewMessage = async (Chat) =>{
        var {body, id, partner} = Chat
        var currentUpdate = await this.firestore.collection("Chat").doc(id).get()
        if(currentUpdate.data().new_message != undefined){
            if(currentUpdate.data().new_message.id != this.uid && currentUpdate.data().new_message.status == true){

                await this.firestore.collection("Chat").doc(id).update({
                    "new_message.status":false,
                })
            }
        }
    }

    changeChat = async (Chat) =>{
        var {body, id, partner} = Chat

        await this.firestore.collection("Chat").doc(id).update({
            "new_message.id":this.uid,
            "new_message.status":true,
            "new_message.date":firebase.firestore.FieldValue.serverTimestamp()
        })
        
    }



    


    uploadImage = async (blob, name) => {
        await firebase.storage().ref().child("images/" + name).put(blob)
        this.UploadNameImage(name)
        return true
    }

    uploadDocument = async (blob, name) => {
        await firebase.storage().ref().child("documents/" + name).put(blob)
        this.UploadNameDocument(name)
        return true
    }

    getAllImage = (callback) => {
        var images = []
        this.firestore.collection("Images").onSnapshot(doc => {
            var changes = doc.docChanges()

            changes.forEach(async change => {
                var snap = change.doc
                var data = snap.data()
                var uri = data.url

                images.push({
                    uri
                })
                callback(images)
            })

        })
    }

    getAllDocument = (callback) => {
        var names = []
        var url = []
        this.firestore.collection("Documents").onSnapshot(doc => {
            var changes = doc.docChanges()

            changes.forEach(async change => {
                var snap = change.doc
                var data = snap.data()
                var uri = data.url
                var name = data.name

                url.push({ uri })
                names.push({ name })
                callback(url, names)
            })
        })
    }

    UploadNameImage = (name) => {
        firebase.storage().ref().child('images/' + name).getDownloadURL().then(url => {
            this.firestore.collection('Images').add({
                name: name,
                url: url
            })
        })
    }

    UploadNameDocument = (name) => {
        firebase.storage().ref().child('documents/' + name).getDownloadURL().then(url => {
            this.firestore.collection('Documents').add({
                name: name,
                url: url
            })
        })
    }

    UploadDatosForo = (tit, mensaje, cate) => {
        this.firestore.collection("Foro").add({
            titulo: tit,
            pregunta: mensaje,
            categoria: cate,
            fecha: firebase.firestore.FieldValue.serverTimestamp(),
            user:this.uid
        })
    }

    getAllQuestionsForum = (cate, callback) => {
        var questions = []
        var ids=[]
        this.firestore.collection("Foro").where("categoria", "==", cate).onSnapshot(doc => {
            var changes = doc.docChanges()

            changes.forEach(async change => {
                if (change.type == "added") {
                    var snap = change.doc
                    var data = snap.data()
                    var id = snap.id
                    //alert('add')
                    questions.push(data)
                    ids.push(id)
                    callback(questions,ids)
                }
            })

        })
    }

    getAllCommentsForum = (id, callback) =>{
        var comentarios = []
        this.firestore.collection("Foro").doc(id).collection("Comentarios").onSnapshot(doc=> {
            var changes = doc.docChanges()

            changes.forEach(change =>{

                if(change.type=="added"){
                    var snap = change.doc
                    var comment = snap.data()
    
                    comentarios.push(comment)
                    callback(comentarios)
                }
                
            })
        
        })
    }

    UploadCommentsForum = (message,id)=>{
        this.firestore.collection("Foro").doc(id).collection("Comentarios").add({
            mensaje: message,
            fecha: firebase.firestore.FieldValue.serverTimestamp(),
            user:this.uid
        })
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