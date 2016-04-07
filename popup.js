// constants
const TIMER_LENGTH = Math.floor(0.1 * 60000);

// haven't found a more elegant way to clear an interval
// without keeping the interval in global scope
var interval;

// populates the status div, a view member
function timerStatus(statusText) {
    var statusDiv = document.getElementById("status");
    statusDiv.textContent = statusText;
}

// updates the timer to the time remaining
function updateTimer() {
    getTimeLeft(function(timeLeft) {
        timeLeft = new Date(timeLeft);

        var minutesLeft = timeLeft.getMinutes();
        minutesLeft = minutesLeft < 10 ? "0" + minutesLeft : minutesLeft;

        var secondsLeft = timeLeft.getSeconds();
        secondsLeft = secondsLeft < 10 ? "0" + secondsLeft : secondsLeft;

        var displaystring = minutesLeft + ":" + secondsLeft;

        timerStatus(displaystring);
    });
}

// return the time remaining on the timer.
// if an alarm is set, timeleft is calculated from the alarm,
// so if the alarm is already over timeleft could be negative.
// if an alarm is not set, timeleft is pulled from storage.
// if timeleft is not in storage, use the default value of
// TIMER_LENGTH.
function getTimeLeft(callback) {
    var timeLeft;
    getAlarm(function(alarm) {
        if (alarm) {
            timeLeft = alarm.scheduledTime - Date.now();
            if (typeof callback === "function")
                callback(timeLeft);
        } else {
            getTimeLeftFromStorage(function(storedTimeLeft) {
                if (storedTimeLeft) {
                    timeLeft = storedTimeLeft;
                } else {
                    timeLeft = TIMER_LENGTH;
                }
                if (typeof callback === "function")
                    callback(timeLeft);
            });
        }
    });
}

// used by getTimeLeft to get the timeleft from storage
function getTimeLeftFromStorage(callback) {
    var timeLeft;
    chrome.storage.local.get('20MinuteAlarm', function(items) {
        if (items['20MinuteAlarm'])
            timeLeft = items['20MinuteAlarm'];
        if (typeof callback === "function")
            callback(timeLeft);
    });
}

// gets the alarm. callback fires with undefined 'alarm'
// argument if no alarm is found.
function getAlarm(callback) {
    chrome.alarms.get('20MinuteAlarm', function(alarm) {
        if (typeof callback === "function")
            callback(alarm);
    });
}

// dual function start/stop button.
// stop doesn't reset the timer.
function start_button_click() {
    // check if the alarm is set
    // if it's set, then stop the interval and clear the alarm
    // if it's not set, then set and start the interval 
    var startButton = document.getElementById('startbutton');

    getTimeLeft(function(timeLeft) {
        getAlarm(function(alarm) {
            if (alarm) {
                chrome.alarms.clear('20MinuteAlarm', function() {
                    if (interval)
                        window.clearInterval(interval);
                    // production chrome apps can't set an alarm less than one minute away
                    timeLeft = timeLeft > 60000 ? timeLeft : 60000;
                    chrome.storage.local.set({ '20MinuteAlarm': timeLeft }, function() {
                        startButton.textContent = "Start";
                    });
                });
            } else {
                var scheduledTime = Date.now() + timeLeft;
                chrome.alarms.create('20MinuteAlarm', { 'when': scheduledTime });
                startbutton.textContent = "Stop";
                interval = window.setInterval(updateTimer, 1000);
            }
        });
    });
}

function reset_button_click() {
    var startButton = document.getElementById('startbutton');
    // clear alarms
    chrome.alarms.clear('20MinuteAlarm', function() {
        chrome.storage.local.clear(function() {
            window.clearInterval(interval);
            updateTimer();
            startButton.setAttribute('enabled', true);
            startButton.textContent = "Start";
        });
    });
}

// event listeners
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request['20MinuteAlarm'])
            reset_button_click();
    });

// run at page load
document.addEventListener('DOMContentLoaded', function() {
    // set click handlers
    var startbutton = document.getElementById('startbutton');
    startbutton.addEventListener('click', start_button_click);

    var resetbutton = document.getElementById('resetbutton');
    resetbutton.addEventListener('click', reset_button_click);

    getTimeLeft(function(timeLeft) {
        getAlarm(function(alarm) {
            if (alarm) {
                if (timeLeft > 0) {
                    interval = window.setInterval(updateTimer, 1000);
                    startbutton.textContent = "Stop";
                } else {
                    timerStatus("00:00");
                    startbutton.setAttribute('disabled', true);
                }
            } else {
                updateTimer();
            }
        });
    });
});