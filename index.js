const functions = require('firebase-functions');
const admin = require('firebase-admin');
const CUT_OFF_TIME = 15 * 60 * 1000; //15 minutes

admin.initializeApp(functions.config().firebase);
admin.database.enableLogging(true);

exports.releaseTasks = functions.https.onRequest((req, res) => {
    var ref = admin.database().ref('Tasks');
    var now = Date.now();
    const cut_off = now - CUT_OFF_TIME;
    ref = ref.orderByChild("inProgress").equalTo("YES").once("value", function(snapshot) {
    res.status(200).send(JSON.stringify(snapshot.val()));
        snapshot.forEach(function(child) {
            if(child.val().inProgressSince < cut_off){
                child.ref.update({ inProgress: "NO", userID: 0 });
            }
        })
    });
});



