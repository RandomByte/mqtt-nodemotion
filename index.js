var gpio = require('omega_gpio'),
	Button = gpio.Button,
	mqtt = require('mqtt'),
	oConfig = require('./config.json'),

	iResetMotionTimeout, sTopic,
	oSensor, oClient;

/* Check config */
if (!oConfig.site || !oConfig.room || !oConfig.brokerUrl) {
	onsole.log("There's something missing in your config.json, please refer to config.example.json for an example");
    process.exit(1);
}

sTopic = oConfig.site + "/" + oConfig.room + "/Motion";
oClient = mqtt.connect(oConfig.brokerUrl);

oSensor = new Button(1);

// Clean up the pins on exit
process.on('SIGINT', function () {
	console.log("Cleaning up...");
	oSensor.destroy(); // If this doesn't help: 'echo 1 > /sys/class/gpio/gpiochip0/subsystem/unexport'
	process.exit();
});

function checkSensor (){
	if(oSensor.isPressed()){
		console.log("motion" + new Date().getTime());
		motion();
	}
}

function motion () {
	if (!iResetMotionTimeout) { // Last state was: no motion
		// New state: motion
		// -> publish state change to broker
		oClient.publish(sTopic, "true", {
			qos: 2, // must arrive and must arrive exactly once - also ensures order
		});
	} else {
		// Last state was already motion
		// -> reset timeout
		clearTimeout(iResetMotionTimeout)

	}
	iResetMotionTimeout = setTimeout(resetMotion, 5000);	
}

function resetMotion () {
	iResetMotionTimeout = null;
	// New state: no motion
	// -> publish state change to broker
	oClient.publish(sTopic, "false", {
		qos: 2, // must arrive and must arrive exactly once - also ensures order
	});
}


setInterval(checkSensor, 10);







