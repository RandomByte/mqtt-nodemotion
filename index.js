var gpio = require("omega_gpio"),
	Button = gpio.Button,
	mqtt = require("mqtt"),
	oConfig = require("./config.json"),

	oResetMotionTimeout, iHighThreshold = 0, sTopic,
	oSensor, oClient;

/* Check config */
if (!oConfig.site || !oConfig.room || !oConfig.brokerUrl) {
	console.log("There's something missing in your config.json, please refer to config.example.json for an example");
	process.exit(1);
}

sTopic = oConfig.site + "/" + oConfig.room + "/Motion";
oClient = mqtt.connect(oConfig.brokerUrl);

console.log("MQTT Broker URL: " + oConfig.brokerUrl);
console.log("Topic: " + sTopic);

oSensor = new Button(1);

// Clean up the pins on exit
process.on('SIGINT', function () {
	console.log("Cleaning up...");
	oSensor.destroy(); // If this doesn't help: 'echo 1 > /sys/class/gpio/gpiochip0/subsystem/unexport'
	process.exit();
});

function checkSensor (){
	if(oSensor.isPressed()){
		if (iHighThreshold >= 19) { // 200ms threshold
			motion();
		} else {
			iHighThreshold++;
		}
	} else if (iHighThreshold) {
		iHighThreshold = 0;
	}
}

function motion () {
	if (!oResetMotionTimeout) { // Last state was: no motion
		console.log(new Date() + " - State change: motion");
		// New state: motion
		// -> publish state change to broker
		oClient.publish(sTopic, "true", {
			qos: 2, // must arrive and must arrive exactly once - also ensures order
		});
	} else {
		// Last state was already motion
		// -> reset timeout
		clearTimeout(oResetMotionTimeout)

	}
	oResetMotionTimeout = setTimeout(resetMotion, 5000); // 5sec = [200ms (20*10) to reach threshold] + [3sec cooldown (time delay) after going LOW] + [1.5sec of extra time]
}

function resetMotion () {
	console.log(new Date() + " - State change: no motion");
	oResetMotionTimeout = null;
	// New state: no motion
	// -> publish state change to broker
	oClient.publish(sTopic, "false", {
		qos: 2, // must arrive and must arrive exactly once - also ensures order
	});
}


setInterval(checkSensor, 10);
console.log("Running...");






