function timerStatus(statusText) {
    document.getElementById('status').textContent = statusText;
}

function startTimer() {
    var opts = {
        type: "basic",
        iconUrl: "icon.png",
        title: "Title!",
        message: "A message, too!"
    };

    var n = chrome.notifications.create('', opts);
    n.show();
}

function start_button_click() {

}

function reset_button_click() {

}

document.addEventListener('DOMContentLoaded', function() {
    // set click handlers
    var startbutton = document.getElementById('startbutton');
    startbutton.addEventListener('click', start_button_click);

    var resetbutton = document.getElementById('resetbutton');
    resetbutton.addEventListener('click', reset_button_click);

    // vars
    var statusdiv = document.getElementById("status");

    var timeleft;

    // check if alarm has been set.    
    chrome.alarms.get('20MinuteAlarm', function(alarm) {
        if (alarm) {
            timeleft = new Date(alarm.scheduledTime - Date.now());
            // set the text to the current time remaining
            // and set the timer in motion
            // take into account paused alarms
            if (timeleft.getTime() > 0) {
                timerStatus(timeleft.getMinutes + ":" + timeleft.getSecond());
            } else {
                timerStatus("00:00");
            }
        } else {
            timerStatus("20:00");
        }
    });
});
