// Define UI elements
var ui = {
	timer: document.getElementById('timer'),
	robotState: document.getElementById('robot-state'),
	statusCode: document.getElementById('code'),
	robotSpeed: document.getElementById('motor-speed'),
	motorGear: {
	    gearG: document.getElementById('gear-shift'),
	    lowG:  document.getElementById('gear-lowG'),
	    highG: document.getElementById('gear-highG')
	},
	/*
	motorRpm: {
        left1:  document.getElementById('left-one'),
        left2:  document.getElementById('left-two'),
        left3:  document.getElementById('left-three'),
        right1: document.getElementById('right-one'),
        right2: document.getElementById('right-two'),
        right3: document.getElementById('right-three')
	},
	*/
};

// Sets function to be called on NetworkTables connect. Commented out because it's usually not necessary.
// NetworkTables.addWsConnectionListener(onNetworkTablesConnection, true);
// Sets function to be called when robot dis/connects
NetworkTables.addRobotConnectionListener(onRobotConnection, true);
// Sets function to be called when any NetworkTables key/value changes
NetworkTables.addGlobalListener(onValueChanged, true);


function onRobotConnection(connected) {
	var state = connected ? 'Connected' : 'Disconnected';
	console.log(state);
	ui.robotState.innerHTML = state;
}

function onValueChanged(key, value, isNew) {
	// Sometimes, NetworkTables will pass booleans as strings. This corrects for that.
	if (value == 'true') {
		value = true;
	} else if (value == 'false') {
		value = false;
	}

	// This switch statement chooses which UI element to update when a NetworkTables variable changes.
	switch (key) {
		case '/SmartDashboard/drive/navx/yaw': // Gyro rotation
			ui.gyro.val = value;
			ui.gyro.visualVal = Math.floor(ui.gyro.val - ui.gyro.offset);

			// Corrects for negative values
			while (ui.gyro.visualVal < 0)
				ui.gyro.visualVal += 360;
			while (ui.gyro.visualVal > 360)
			    ui.gyro.visualVal -= 360;

			ui.gyro.arm.style.transform = ('rotate(' + ui.gyro.visualVal + 'deg)');
			ui.gyro.number.innerHTML = ui.gyro.visualVal + 'º';
			break;
			// The following case is an example, for a robot with an arm at the front.
			// Info on the actual robot that this works with can be seen at thebluealliance.com/team/1418/2016.
		case '/SmartDashboard/arm/encoder':
			// 0 is all the way back, 1200 is 45 degrees forward. We don't want it going past that.

			if (value > 1140)
                value = 1140;
            else if (value < 0)
				value = 0;

			// Calculate visual rotation of arm
			var armAngle = value * 3 / 20 - 45;

			// Rotate the arm in diagram to match real arm
			ui.robotDiagram.arm.style.transform = 'rotate(' + armAngle + 'deg)';
			break;
			// This button is just an example of triggering an event on the robot by clicking a button.
		case '/SmartDashboard/example_variable':
			if (value) { // If function is active:
				// Add active class to button.
				ui.example.button.className = 'active';
				ui.example.readout.innerHTML = 'Value is true';
			} else { // Otherwise
				// Take it off
				ui.example.button.className = '';
				ui.example.readout.innerHTML = 'Value is false';
			}
			break;
		case '/SmartDashboard/Low gear':
		    if (value)
                ui.motorGear.lowG = value;
            break;
        case '/SmartDashboard/High gear':
            if (value)
              ui.motorGear.highG = value;
            break;
        case '/SmartDashboard/Gear':
            if (value)
                ui.motorGear.gearG = value;
            break;
        case '/SmartDashboard/Speed':
            if (value)
                ui.robotSpeed = value;
            break;

		case '/SmartDashboard/time_running':
			// When this NetworkTables variable is true, the timer will start.
			// You shouldn't need to touch this code, but it's documented anyway in case you do.
			var s = 135;
			if (value) {
				// Make sure timer is reset to black when it starts
				ui.timer.style.color = 'black';
				// Function below adjusts time left every second
				var countdown = setInterval(function() {
					s--; // Subtract one second
					// Minutes (m) is equal to the total seconds divided by sixty with the decimal removed.
					var m = Math.floor(s / 60);
					// Create seconds number that will actually be displayed after minutes are subtracted
					var visualS = (s % 60);

					// Add leading zero if seconds is one digit long, for proper time formatting.
					visualS = visualS < 10 ? '0' + visualS : visualS;

					if (s < 0) {
						// Stop countdown when timer reaches zero
						clearTimeout(countdown);
						return;
					} else if (s <= 15) {
						// Flash timer if less than 15 seconds left
						ui.timer.style.color = (s % 2 === 0) ? '#FF3030' : 'transparent';
					} else if (s <= 30) {
						// Solid red timer when less than 30 seconds left.
						ui.timer.style.color = '#FF3030';
					}
					ui.timer.innerHTML = m + ':' + visualS;
				}, 1000);
			} else {
				s = 135;
			}
			NetworkTables.setValue(key, false);
			break;
		case '/SmartDashboard/autonomous/options': // Load list of prewritten autonomous modes
			// Clear previous list
			while (ui.autoSelect.firstChild) {
				ui.autoSelect.removeChild(ui.autoSelect.firstChild);
			}
			// Make an option for each autonomous mode and put it in the selector
			for (i = 0; i < value.length; i++) {
				var option = document.createElement('option');
				option.innerHTML = value[i];
				ui.autoSelect.appendChild(option);
			}
			// Set value to the already-selected mode. If there is none, nothing will happen.
			ui.autoSelect.value = NetworkTables.getValue('/SmartDashboard/currentlySelectedMode');
			break;
		case '/SmartDashboard/autonomous/selected':
			ui.autoSelect.value = value;
			break;
	}
}
