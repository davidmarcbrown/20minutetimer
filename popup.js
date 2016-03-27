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
    var startbutton = document.getElementById('startbutton');
    startbutton.addEventListener('click', start_button_click);

    var pausebutton = document.getElementById('pausebutton');
    pausebutton.addEventListener('click', pause_button_click);

    var resetbutton = document.getElementById('resetbutton');
    resetbutton.addEventListener('click', reset_button_click);

    chrome.alarms.get('20MinuteAlarm', function(alarm) {
        if (alarm) {
            timerStatus('There is one!');
        } else {
            timerStatus('There is not one!');
        }
    });


});
