chrome.alarms.onAlarm.addListener(function(alarm){
    var alarmAudio = document.getElementById("alarmAudio");
    
    // set options object
    var options;
    options.type = "basic";
    options.title = "20 Minute Timer";
    options.message = "Your 20 minutes are up!";
    options.iconUrl = "icon.png";
    
    // called when notification is created
    var notificationsCallback = function (){
        alarmAudio.play();
    }
    
    chrome.notifications.create("20MinuteTimer", options, notificationsCallback);
})