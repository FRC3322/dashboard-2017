NetworkTables.addRobotConnectionListener(onRobotConnection, true);
NetworkTables.addGlobalListener(onValueChanged, true);

var nt = [
	["/SmartDashboard/test", 2]
];
var speed = [
	[1, 2, 3, 4],
	[3, 7, 6, 1]
];

//5810 & 5809 ports
$('.dropdown > a').click(function(event) {
	$(this).parent().toggleClass('active');
});

$('#camera-video').click(function(event)
 {
    $("#camera-video").css("background", ($("#camera-video").css("background").includes('url("http://10.33.22.7:5809/?action=stream")')) ? ('url("http://10.33.22.7:5810/?action=stream")') : ('url("http://10.33.22.7:5809/?action=stream")'));

 });

$('#start_pos').change(function(event) {
	NetworkTables.setValue('/SmartDashboard/start_pos', $(this).val());
});


function onRobotConnection(connected) {
	var state = connected ? 'Connected' : 'Disconnected';
	console.log(state);
	$('#robot-state').text(state);

	if (connected) {
		setLight('#robot-state', 2);
	} else {
		setLight('*', 0);
		setLight('#robot-state', 1);
	}
}

function onValueChanged(key, value, isNew) {
	// Sometimes, NetworkTables will pass booleans as strings. This corrects for that.
	if (value == 'true') {
		value = true;
	} else if (value == 'false') {
		value = false;
	}

	switch (key) {
		case '/SmartDashboard/time_running':
			// When this NetworkTables variable is true, the timer will start.
			var s = 135;
			if (value) {
				// Make sure timer is reset to black when it starts
				$('#timer').css(color, 'black');
				var countdown = setInterval(function() {
					s--;
					var m = Math.floor(s / 60);
					var visualS = (s % 60);

					visualS = visualS < 10 ? '0' + visualS : visualS;

					if (s < 0) {
						clearTimeout(countdown);
						return;
					} else if (s <= 15) {
						$('#timer').css(color, (s % 2 === 0) ? '#FF3030' : 'transparent');
					} else if (s <= 30) {
						$('#timer').css(color, '#FF3030');
					}
					$('#timer').innerHTML = m + ':' + visualS;
				}, 1000);
			} else {
				s = 135;
			}
			NetworkTables.setValue(key, false);
			break;
		case '/SmartDashboard/robot_speed':
			speed[0].push(1);
			speed[1].push(value);
			$('#robot_speed').text(Math.round(value) + " feet/sec")
			break;
		case '/SmartDashboard/holder':
			if (value) {
				$('#holder').addClass('grn');
			} else {
				$('#holder').removeClass('grn');
			}
			break;
		case '/SmartDashboard/start_pos':
			setLight('#start_pos', value != 0 ? 1 : 2);
			break;
		case '/SmartDashboard/shift_state':
			setLight('#shift-state', value ? 2 : 1);
			break;
		default:
			console.log(key + ' | ' + value);
			break;
	}
}

function setLight(object, state) {
	switch(state) {
		case 0:
			// off
			$(object).removeClass('grn red');
			break;
		case 1:
			// red
			$(object).switchClass('grn', 'red');
			break;
		case 2:
			// green
			$(object).switchClass('red', 'grn');
			break;
	}
}

var speedChart = new Chart($('#speed'), {
	type: 'line',
	data: {
		labels: speed[0],
		datasets: [{
			label: 'Speed',
			data: speed[1],
			backgroundColor: [
				'rgba(255, 99, 132, 0.2)',
				'rgba(54, 162, 235, 0.2)',
				'rgba(255, 206, 86, 0.2)',
				'rgba(75, 192, 192, 0.2)',
				'rgba(153, 102, 255, 0.2)',
				'rgba(255, 159, 64, 0.2)'
			],
			borderColor: [
				'rgba(255,99,132,1)',
				'rgba(54, 162, 235, 1)',
				'rgba(255, 206, 86, 1)',
				'rgba(75, 192, 192, 1)',
				'rgba(153, 102, 255, 1)',
				'rgba(255, 159, 64, 1)'
			],
			borderWidth: 1
		}]
	},
	options: {
		scales: {
			yAxes: [{
				ticks: {
					beginAtZero:true
				}
			}]
		}
	}
});
