NetworkTables.addRobotConnectionListener(onRobotConnection, true);
NetworkTables.addGlobalListener(onValueChanged, true);

var table;

$('.dropdown > a').click(function(event) {
	$(this).parent().toggleClass('active');
});

$('#start_pos').change(function(event) {
	NetworkTables.setValue('/SmartDashboard/start_pos', $(this).val());
});

table = $('#network-table').DataTable({
	columns: [
		{
			title: "Key",
		},
		{
			title: "Value",
		}
	]
});

/*var speedChart = new Chart($('#speed'), {
	type: 'line',
	data: {
		datasets: [{
			label: 'Speed',
			data: speed
		}]
	}
});*/

function onRobotConnection(connected) {
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
	// Sometimes, NetworkTables will pass booleans as strings. This corrects for that.
	if (value == 'true') {
		value = true;
	} else if (value == 'false') {
		value = false;
	}

	if (isNew) {
		table.row.add([key.replace('/SmartDashboard/', ''), value]).draw();
	} else {
		// Update existing row with new value
		table.rows().every(function() {
			if (key == this.row().data()) {
				row(i).data([key, value]);
				console.log("match found!");
			}
		});
	}
	table.draw();

	switch (key.replace('/SmartDashboard/', '')) {
		case 'robot_speed':
			$('#robot_speed').text(Math.round(value) + " feet/sec");
			break;
		case 'holder':
			setLight('#holder', value);
			break;
		case 'start_pos':
			setLight('#start_pos', value != 0);
			break;
		case 'shift_state':
			setLight('#shift-state', value);
			break;
		default:
			console.log(key + ' = ' + value);
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
