// declare widely scoped vars
var timeleft;
var alarm;
var scheduledTime;
var interval;
var storedtime;

// view members
var startbutton;
var resetbutton;
var statusdiv;

// populate the status div, a view member
function timerStatus(statusText) {
    statusdiv.textContent = statusText;
}

function update_timer() {
    if (alarm)
        timeleft = new Date(scheduledTime - Date.now());
    
    var minutesleft = timeleft.getMinutes();
    minutesleft = minutesleft < 10 ? "0" + minutesleft : minutesleft;

    var secondsleft = timeleft.getSeconds();
    secondsleft = secondsleft < 10 ? "0" + secondsleft : secondsleft;

    var displaystring = minutesleft + ":" + secondsleft;

    timerStatus(displaystring);
}

// dual function start/stop button.
// stop doesn't reset the timer.
function start_button_click() {
    // check if the alarm is set
    // if it's set, then stop the interval and clear the alarm
    // if it's not set, then set and start the interval 

    // if it exists, it is set, so stop it
    if (alarm) {
        // clear the alarm
        chrome.alarms.clear('20MinuteAlarm');
        // stop the countdown
        window.clearInterval(interval);
        timeleft = alarm.scheduledTime - Date.now();
        storedtime = (timeleft > 60000) ? timeleft : 60000;
        alarm = false;
        // store the result
        chrome.storage.local.set({
            'timeleft': storedtime
        });
        startbutton.textContent = "Start"
    }
    // if it doesn't exist, it's not set, so set the alarm
    // and set the interval
    else {
        chrome.storage.local.get('20MinuteAlarm', function(items) {
            // start from a stopped timer
            if (items['20MinuteAlarm']) {
                scheduledTime = Date.now() + items['20MinuteAlarm'];
                chrome.alarms.create('20MinuteAlarm', { 'when': scheduledTime });
            }
            // start from 20 minutes
            else {
                scheduledTime = Date.now() + (20 * 60000);
                chrome.alarms.create('20MinuteAlarm', { 'when': scheduledTime });
            }
            // update the view every second
            interval = window.setInterval(update_timer, 1000);
            alarm = true;
            // change button text
            startbutton.textContent = "Stop";
        });
    }
}

function reset_button_click() {
    // clear alarms
    chrome.alarms.clear('20MinuteAlarm');

    // stop countdown
    window.clearInterval(interval);

    // set timeleft to 20 minutes
    timeleft = 20 * 6000;

    // clear stored timeleft
    chrome.storage.local.clear();

    // set the timer status
    timerStatus("20:00");
    
    // enable start button                
    startbutton.setAttribute('enabled', true);

}

document.addEventListener('DOMContentLoaded', function() {
    // set click handlers
    startbutton = document.getElementById('startbutton');
    startbutton.addEventListener('click', start_button_click);

    resetbutton = document.getElementById('resetbutton');
    resetbutton.addEventListener('click', reset_button_click);

    // vars
    statusdiv = document.getElementById("status");

    var timeleft;

    // check if alarm has been set.    
    chrome.alarms.get('20MinuteAlarm', function(palarm) {
        if (palarm) {
            alarm = palarm;
            timeleft = new Date(alarm.scheduledTime - Date.now());
            // set the text to the current time remaining
            // and set the timer in motion
            // take into account paused alarms
            if (timeleft.getTime() > 0) {
                scheduledTime = alarm.scheduledTime;
                interval = window.setInterval(update_timer, 1000);
                startbutton.textContent = "Stop";
            } else {
                timerStatus("00:00");
                startbutton.setAttribute('disabled', true);
                alarm = false;
            }
        } else {
            chrome.storage.local.get('timeleft', function(items) {
                if (items['timeleft']) {
                    timeleft = items['timeleft'];
                    update_timer();
                }
                // start from 20 minutes
                else {
                    timerStatus("20:00");
                }
            });
        }
    });
});