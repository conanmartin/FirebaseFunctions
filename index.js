const functions = require('firebase-functions');
const admin = require('firebase-admin');
const CUT_OFF_TIME = 15 * 60 * 1000; //15 minutes

admin.initializeApp(functions.config().firebase);
admin.database.enableLogging(true);

// method to release tasks that have not been confirmed 15 minutes after being taken.

exports.releaseTasks = functions.https.onRequest((req, res) => {
    var ref = admin.database().ref('Tasks');
    var now = Date.now();
    const cut_off = now - CUT_OFF_TIME;
    ref = ref.orderByChild("inProgress").equalTo("YES").once("value", function(snapshot) {
    res.status(200).send(JSON.stringify(snapshot.val()));
        snapshot.forEach(function(child) {
            if(child.val().inProgressSince < cut_off){
                var ward = child.val().ward;
                child.ref.update({ inProgress: "NO", userID: "0", searchValue: ward + "_NO" });
            }
        })
    });
});



