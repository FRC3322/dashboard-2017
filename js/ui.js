NetworkTables.addRobotConnectionListener(onRobotConnection, true);
NetworkTables.addGlobalListener(onValueChanged, true);

var nt = {};

function onRobotConnection(connected) {
	var state = connected ? 'Connected' : 'Disconnected';
	console.log(state);
	$('#robot-state').text(state);
	if (connected) {
		$('#robot-state').addClass("connected");
	} else {
		$('#robot-state').removeClass("connected");
	}
}

function onValueChanged(key, value, isNew) {
	// Sometimes, NetworkTables will pass booleans as strings. This corrects for that.
	if (value == 'true') {
		value = true;
	} else if (value == 'false') {
		value = false;
	}

	// Log value changes
	console.log(key + " = " + value);

	switch (key) {
		case '/SmartDashboard/time_running':
			// When this NetworkTables variable is true, the timer will start.
			var s = 135;
			if (value) {
				// Make sure timer is reset to black when it starts
				$("#timer").css(color, 'black');
				var countdown = setInterval(function() {
					s--;
					var m = Math.floor(s / 60);
					var visualS = (s % 60);

					visualS = visualS < 10 ? '0' + visualS : visualS;

					if (s < 0) {
						clearTimeout(countdown);
						return;
					} else if (s <= 15) {
						$("#timer").css(color, (s % 2 === 0) ? '#FF3030' : 'transparent');
					} else if (s <= 30) {
						$("#timer").css(color, '#FF3030');
					}
					$("#timer").innerHTML = m + ':' + visualS;
				}, 1000);
			} else {
				s = 135;
			}
			NetworkTables.setValue(key, false);
			break;
	}

	// Update a table that reflects
	nt[key] = value;
}

$('#network-table').DataTable({
	"data": nt
});
