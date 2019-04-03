const functions = require('firebase-functions');
const fetch = require('node-fetch')

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase)

exports.sendPushNotifications = functions.database.ref('/Messages/{id}')
.onCreate( (change, context) =>{

    console.log("->AQUI"+change.val())
    var messages=[]

    return admin.database().ref('Usuarios').once('value').then( snapshot => {
        snapshot.forEach(element => {
        
            var token = element.val().ExpoPushToken
            console.log("TOKEN"+token)

            if(token){
                messages.push({
                    "to":token,
                    "body":"New Message!!"
                })
            }

        });

        return Promise.all(messages)

    }).then(messages =>{

        fetch("https://exp.host/--/api/v2/push/send",
        {
            method:"POST",
            headers:{
                "Accept": "application/json",
                "Content-Type": "application/json"
            },    
            body : JSON.stringify(messages)
        }).then(data => {
            console.log(data)
        })
    })
});