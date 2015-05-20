# SMFPack-Chatbox-Tools
Some simple tools for the SMFChatbox on LoE

### Introduction

**Will Not Work in Internet Explorer**

Simple script for SMFPack Shoutbox that adds desktop notifications to Chat.

See: http://vgy.me/VNReu0.png

This script will also sticky notifications to the desktop if they contain a phrase. (Like admin) These are configurable in the script.

To have mentions remain on your desktop until you close them set the timeout to 0.

Easy way to use:

Add the following as a bookmarklet: (Select the blocked text and drag into your bookmark bar)

`javascript:(function(){jQuery.getScript("https://rawgit.com/ocbaker/SMFPack-Chatbox-Tools/master/shoutbox.js",function(){notificationSettings.phrases=["admin"];notifyMe("LoE Chat","Loaded Notifications",10000);});})();`

This: `["admin"]` can be set to a list of words you want as mentions. IE: `["admin","ocbaker"]`

If you want to modify any of the settings just add that setting after phrases. As an example this bookmarklet would always show notifications even if you have the chat active:

`javascript:(function(){jQuery.getScript("https://rawgit.com/ocbaker/SMFPack-Chatbox-Tools/master/shoutbox.js",function(){notificationSettings.phrases=["admin"];notificationSettings.notifyWhenChatActive=true;notifyMe("LoE Chat","Loaded Notifications",10000);});})();`
