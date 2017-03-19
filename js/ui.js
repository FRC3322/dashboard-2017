var table,
// Comp bot - 10.33.22.7:5809 & 10.33.22.7:5810
camera1 = 'url("http://10.33.22.7:5809/?action=stream")',
camera2 = 'url("http://10.33.22.7:5810/?action=stream")';

table = $('#network-table').DataTable({
	data: [],
	columns: [
		{
			title: "Key",
		},
		{
			title: "Value",
		}
	],
	"lengthChange": false
});

NetworkTables.addRobotConnectionListener(onRobotConnection, true);
NetworkTables.addGlobalListener(onValueChanged, true);

$('#camera-stream').click(function(event) {
	$("#camera-stream").css("background", ($("#camera-video").css("background").includes(camera1) ? camera2 : camera1));
});

$('#start_pos').change(function(event) {
	NetworkTables.setValue('/SmartDashboard/start_pos', $(this).val());
});

$("#network-table tbody").click(function() {
	table.rows(function(idx, data, node) {
		console.log(data[0].includes("cooldown"));
		return data[0].includes("cooldown");
	}).data(["cooldown", "312098"]).draw();
});

var speed = new Chart($('#speed'), {
	type: 'line',
	data: {
		datasets: [{
			label: 'Speed',
			data: []
		}]
	}
});

function onRobotConnection(connected) {
	var state = connected ? 'Connected' : 'Disconnected';

	console.log(state);
	$('#robot-state').text(state);

	if (connected) {
		setLight('#robot-state', true);
	} else {
		setLight('*', null);
		setLight('#robot-state', false);
		setLight('#enabled', false);

		// Reset the DataTable
		//table.clear().draw();
	}
}

function onValueChanged(key, value, isNew) {
	var k_sub = key.replace("/SmartDashboard/", "");

	// Sometimes, NetworkTables will pass booleans as strings. This corrects for that.
	if (value == 'true') {
		value = true;
	} else if (value == 'false') {
		value = false;
	}

	// Update the DataTable to reflect the SmartDashboard variables
	if (isNew) {
		table.row.add([k_sub, value]).draw();
	} else {
		// Update existing row with new value
		table.rows(function(idx, data, node) {
			console.log(data[0]);
			return data[0].includes(key);
		}).data([k_sub, value]);
	}

	// Automatically set the lights of certain indicators
	if ($("#" + k_sub).hasClass("light auto")) {
		setLight("#" + k_sub, value);
	}

	switch (k_sub) {
		case 'robot_speed':
			$('#robot_speed').text(Math.round(value) + " feet/sec");
			break;
		case 'shift_state':
			setLight('#gearing', value == "high" ? true : false);
			break;
		case 'start_pos':
			$("#start_pos").val(value);
			setLight('#auton-ready', value != 0);
			break;
		case 'drive_angle_p_term':
			$("#p_term").val(value);
			break;
		case 'blegh':
			if (value) {
				$("#overlay").addClass("active");
				setTimeout(function() {
					$("#overlay").removeClass("active");
				}, 1000);
				}
			break;
		case 'enabled':
			var timeLeft = 150;

			setInterval(function() {
				if (135 > timeLeft > 0) {
					timeLeft--;

					// MM:SS format
					var m, s;
					m = Math.floor(timeLeft % 3600 / 60) > 9 ? Math.floor(timeLeft % 3600 / 60) : "0" + Math.floor(timeLeft % 3600 / 60);
					s = timeLeft % 60 > 9 ? timeLeft % 60 : "0" + timeLeft % 60;

					$("#timer").text(m + ":" + s);
				}
			}, 1000);
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
