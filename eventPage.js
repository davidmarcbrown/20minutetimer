chrome.alarms.onAlarm.addListener(function(alarm){
    var alarmAudio = document.getElementById("alarmAudio");
    
    // set options object
    var options = new Object();
    options.type = "basic";
    options.title = "20 Minute Timer";
    options.message = "Your 20 minutes are up!";
    options.iconUrl = "icon.png";
    
    // called when notification is created
    var notificationsCallback = function (){
        alarmAudio.play();
    }
    
    chrome.runtime.sendMessage({"20MinuteAlarm": "20 Minutes is over!"});
    
    chrome.notifications.create("20MinuteTimer", options, notificationsCallback);
});