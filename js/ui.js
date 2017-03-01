NetworkTables.addRobotConnectionListener(onRobotConnection, true);
NetworkTables.addGlobalListener(onValueChanged, true);

var connected, i;
var nt = [
	["/SmartDashboard/test", 2],
	["/SmartDashboard/test2", "string"],
	["/SmartDashboard/bool", false]
];

$('.dropdown > a').click(function(event) {
	$(this).parent().toggleClass('active');
});

$('#start_pos').change(function(event) {
	NetworkTables.setValue('/SmartDashboard/start_pos', $(this).val());
});

$('#network-table').DataTable({
	data: nt,
	columns: [
		{ title: "Key" },
		{ title: "Value" }
	]
});

var speedChart = new Chart($('#speed'), {
	type: 'line',
	data: {
		datasets: [{
			label: 'Speed',
			data: speed
		}]
	}
});

function onRobotConnection(connected) {
	this.connected = connected;
	var state = connected ? 'Connected' : 'Disconnected';
	console.log(state);
	$('#robot-state').text(state);

	if (connected) {
		setLight('#robot-state', true);
	} else {
		setLight('*', null);
		setLight('#robot-state', false);
	}
}

function onValueChanged(key, value, isNew) {
	if (!connected) {
		return false;
	}

	// Sometimes, NetworkTables will pass booleans as strings. This corrects for that.
	if (value == 'true') {
		value = true;
	} else if (value == 'false') {
		value = false;
	}

	if (isNew) {
		nt.push([key, value]);
	} else {
		// Update table
	}

	switch (key) {
		case '/SmartDashboard/robot_speed':
			$('#robot_speed').text(Math.round(value) + " feet/sec")
			break;
		case '/SmartDashboard/holder':
			setLight('#holder', value)
			break;
		case '/SmartDashboard/start_pos':
			setLight('#start_pos', value != 0);
			break;
		case '/SmartDashboard/shift_state':
			setLight('#shift-state', value);
			break;
		default:
			console.log(key + ' | ' + value);
			break;
	}
}

function setLight(object, state) {
	switch(state) {
		case null:
			// off
			$(object).removeClass('grn red');
			break;
		case false:
			// red
			$(object).switchClass('grn', 'red');
			break;
		case true:
			// green
			$(object).switchClass('red', 'grn');
			break;
	}
}
