// ==UserScript==
// @name       Chatbox Notifications
// @namespace  https://github.com/ocbaker/SMFPack-Chatbox-Tools/
// @version    0.1
// @description  enter something useful
// @match      http://forum.legendsofequestria.com/index.php?action=chatpage
// @copyright  2012+, You
// ==/UserScript==


Shoutbox.setUserSettings = function setUserSettings(){
    notificationSettings.notifyWhenChatActive=true;
    notificationSettings.generalTimeout=10000;
    notificationSettings.mentionTimeout=0;
    notificationSettings.chatHeight=500;
    notificationSettings.phrases = ["ocbaker", "oliver", "admin", "mods", "moderator", "baker", "swear", "language"];
}

jQuery.getScript("https://rawgit.com/ocbaker/SMFPack-Chatbox-Tools/master/shoutbox.js", function(){});
