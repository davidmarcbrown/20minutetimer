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

function pause_button_click() {

}

function reset_button_click() {

}

document.addEventListener('DOMContentLoaded', function() {
    var statusdiv = document.getElementById("status");

    var startbutton = document.getElementById('startbutton');
    startbutton.addEventListener('click', start_button_click);

    var pausebutton = document.getElementById('pausebutton');
    pausebutton.addEventListener('click', pause_button_click);

    var resetbutton = document.getElementById('resetbutton');
    resetbutton.addEventListener('click', reset_button_click);

    chrome.alarms.get('20MinuteAlarm', function(alarm) {
        if (alarm) {
            // set the text to the current time remaining
            // and set the timer in motion
            // take into account paused alarms    
        } else {
            // set timer to its last position
            // or initial position
            chrome.storage.local.get("timeleft", function(timeleft) {
                if (!chrome.runtime.lasterror) {
                    // no previous time saved.
                    // set display to 20 minutes
                } else {
                    // set display to the value

                }
            });
        }
    });
});
