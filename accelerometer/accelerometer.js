// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/publicdomain/zero/1.0/

/*********************************************
This basic accelerometer example logs a stream
of x, y, and z data from the accelerometer
*********************************************/

var tessel = require('tessel');
var accel = require('accel-mma84').use(tessel.port['B']);


var old = [] // xyz data last call
var limit = 0.1 // How large change has to be between movement calls
var seconds = 3 // How long has to be door still to send data
var openTime = 0 // Time when was door opened
//var still = false // Are door closed?
var movement = false // Are door moving?


//tap to activate alarm system.  
// Initialize the accelerometer.
accel.on('ready', function() {

    console.log("Accelerometer ready")

    // Stream accelerometer data
    accel.on('data', function(xyz) {

        console.log("x: ", xyz[0].toFixed(3), "y: ", xyz[1].toFixed(3), "z: ", xyz[2].toFixed(3))

        // Moving computer
        if (isDifferent(xyz) && !movement) {
            movement = true
            startTime = new Date().getTime()
            console.log('I just got moved!')
            //within 30 seconds look for RFID.
            //if RFID match: turn off accelerometer
            //if no RFID match: alert!
        }

        old = xyz // Setting actual value of axis to temporary variable
    })
})

accel.on('error', function(err) {
    console.log('Error:', err)
})


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


