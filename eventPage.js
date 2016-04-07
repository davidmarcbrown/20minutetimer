// this script exists solely to respond to the chrome alarm event
// creates a notification, plays a sound, and resets the timer
// if the popup is open
chrome.alarms.onAlarm.addListener(function(alarm){
    // audio source is <audio> element
    var alarmAudio = document.getElementById("alarmAudio");
    
    // set options object for notification
    var options = new Object();
    options.type = "basic";
    options.title = "20 Minute Timer";
    options.message = "Your 20 minutes are up!";
    options.iconUrl = "icon.png";
    options.priority = 2;
    
    // callback when notification is created
    var notificationsCallback = function (){
        alarmAudio.play();
    }
    
    // if the popup is open, it will receive this message and reset the timer
    chrome.runtime.sendMessage({"20MinuteAlarm": "20 Minutes is over!"});
    
    // display the notification
    chrome.notifications.create("20MinuteTimer", options, notificationsCallback);
});