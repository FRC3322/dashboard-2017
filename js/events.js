// Events that occur in the DOM should be put in here
$(document).ready(function() {
	$("#camera-stream").css("background", camera1 + ", #222");
});

$('.dropdown > a').click(function(event) {
	$(this).parent().toggleClass('active');
});

$('#camera-stream').click(function(event) {
	$(this).css("background", ($(this).css("background").includes(camera1) ? camera2 : camera1) + ", #222");
});

$('#start_pos').change(function(event) {
	NetworkTables.setValue('/SmartDashboard/start_pos', parseInt($(this).val()));
});

$("#p_term").change(function(event) {
	NetworkTables.setValue('/SmartDashboard/drive_angle_p_term', parseInt($(this).val()));
})
