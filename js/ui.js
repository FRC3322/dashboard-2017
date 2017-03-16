NetworkTables.addRobotConnectionListener(onRobotConnection, true);
NetworkTables.addGlobalListener(onValueChanged, true);

var table,
// Change these to 5809 and 5810 for comp bot
camera1 = 'url("http://10.33.22.7:5809/?action=stream")',
camera2 = 'url("http://10.33.22.7:5810/?action=stream")';


<<<<<<< HEAD
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
=======
$('#camera-video').click(function(event)
 {
    $("#camera-video").css("background", ($("#camera-video").css("background").includes('url("http://10.33.22.7:5809/?action=stream")')) ? ('url("http://10.33.22.7:5810/?action=stream")') : ('url("http://10.33.22.7:5809/?action=stream")'));

 });

$('#start_pos').change(function(event) {
	NetworkTables.setValue('/SmartDashboard/start_pos', $(this).val());
>>>>>>> c2b091e4d5688add2cef5bf24b535948fc11bb41
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
		//table.row.add([key, value]).draw();
	} else {
		// Update existing row with new value
		table.rows().every(function(i) {
			if (key == this.row().data()) {
				row(i).data([key, value]);
				console.log("match found!");
			}
		});
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
