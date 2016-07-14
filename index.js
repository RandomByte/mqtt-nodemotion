var gpio = require('omega_gpio'),
	Button = gpio.Button,
	sensor;

sensor = new Button(1);

// Clean up the pins on exit
process.on('SIGINT', function () {
	console.log("Cleaning up...");
	sensor.destroy();
	process.exit();
});


var checkSensor = function(){
  if(sensor.isPressed()){
    console.log("motion" + new Date().getTime());
  }
  else{
    // console.log("no motion");
  }
}

setInterval(checkSensor, 10);