var tessel = require('tessel');
var accel = require('accel-mma84').use(tessel.port['B']);


var old = [] // xyz data last call
var limit = 0.1 // How large change has to be between movement calls
var seconds = 3 // How long has to be door still to send data
var openTime = 0 // Time when was door opened
//var still = false // Are door closed?
var movement = false // Are door moving?
var rfidlib = require('rfid-pn532');
var rfid = rfidlib.use(tessel.port['A']);


// RFID
// 1. RFID tapped

// Accelerometer
// 1. computer opened

// Camera
// 1. take picture

// //if RFID tapped initiate alarm system
// > rfid.alarmArmed()

// //turn on accelerometer
// > accel.accelerometerOn()
// //if computer opened wait for RFID
// > accel.accelerometerOn()
// //30 seconds & no RFID === take photo, alert
// > cam.takePicture()
// > ?.tweet/text()
// //30 seconds & RFID == turn off accelerometer
// > accel.alarmDisarmed()

var masterState = {
    alarmOn: false,
    movement: false,
    accelReady: false,
    //currPosition: String("x: ", xyz[0].toFixed(3), "y: ", xyz[1].toFixed(3), "z: ", xyz[2].toFixed(3)),
    rfidMatch: false
}

accel.on('ready', function() {
    console.log("accelerometer ready") 
    masterState.accelReady = true
    // Stream accelerometer data
    accel.on('data', function(xyz) {

        //console.log("x: ", xyz[0].toFixed(3), "y: ", xyz[1].toFixed(3), "z: ", xyz[2].toFixed(3))

        // Moving computer
        if (masterState.alarmOn) {
            if (isDifferent(xyz) && !movement) {
                masterState.movement = true
                console.log('I just got moved!')
                if (masterState.alarmOn) {
                    console.log('SIIIIIIREEEEN WOOO WOOO WOOO WOOOO')
                }
                //     setTimeout(function(){
                //         if (masterState.rfidMatch) {
                //             //turn off acceleromter
                //             console.log('accelerometer should be turned off')
                //         } else {
                //             //activate alarm
                //             console.log('alarm on')
                //         }
                //     }, 30000)
                 }
            //within 30 seconds look for RFID.
            //if RFID match: turn off accelerometer
            //if no RFID match: alert!
        }
        old = xyz  //Setting actual value of axis to temporary variable
        })
        
    })


accel.on('error', function(err) {
    console.log('Error:', err)
})

rfid.on('ready', function (version) {
  console.log('Ready to read RFID card');

//trigger alarm
    rfid.on('data', function(card) {
        if (masterState.alarmOn === false && card.uid.toString('hex') === '3ca5a500'){
            console.log('alarm is on')
            masterState.alarmOn = true
        } 
        else if (masterState.alarmOn === true && card.uid.toString('hex') === '3ca5a500') {
            masterState.alarmOn = false
            console.log('ALARM IS OFF')
        }

                
         })
        
                
        
    

   

rfid.on('error', function (err) {
  console.error(err);
});

});



    // Check for door movement
    var isDifferent = function(xyz) {
        if (old) {

            // Movement on axis X is larger than limit
            if (Math.abs(old[0] - xyz[0]) > limit) {
                return true
            }

            // Movement on axis Y is larger than limit
            if (Math.abs(old[1] - xyz[1]) > limit) {
                return true
            }

            // Movement on axis Z is larger than limit
            if (Math.abs(old[2] - xyz[2]) > limit) {
                return true
            }
        }

        return false
    }