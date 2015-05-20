function defaultNotificationFormat(txt){
    if(txt.substr(0,txt.indexOf("[")-1) == 0)
      return txt.substring(txt.indexOf("]:")+2);
    return txt.substr(0,txt.indexOf("[")-1) + ": " + txt.substring(txt.indexOf("]:")+2);
}

var notificationSettings = {
  phrases: ["ocbaker","oliver","admin","mods","moderator","baker","swear","language"],
  general: true,
  mentions: true,
  generalTimeout: 5 * 1000,
  mentionTimout: 10 * 1000,
  notifyWhenChatActive: false,
  generalFormat: defaultNotificationFormat,
  mentionFormat: defaultNotificationFormat
};

Shoutbox_PutMsgs = function Shoutbox_PutMsgs(XMLDoc) 
{
    if (Shoutbox.msgs !== false)
        window.clearTimeout(Shoutbox.msgs);
    if (XMLDoc && XMLDoc.getElementsByTagName("banned")[0]) 
    {
        setOuterHTML(document.getElementById("shoutbox_banned"), '');
        document.getElementById("shoutbox_status").style.visibility = 'hidden';
        document.getElementById("shoutbox_message").value = '';
        document.getElementById("shoutbox_message").disabled = true;
        return window.alert(Shoutbox.lang.banned);
    }
    var error = false;
    if (XMLDoc && XMLDoc.getElementsByTagName("error")[0])
        error = XMLDoc.getElementsByTagName("error")[0].childNodes[0].nodeValue;
    if (!XMLDoc || !XMLDoc.getElementsByTagName("msgs")[0]) 
    {
        if (!Shoutbox.hide) 
        {
            Shoutbox.msgs = window.setTimeout("Shoutbox_GetMsgs();", Shoutbox.refresh);
            Shoutbox.loading = false;
        }
        document.getElementById("shoutbox_status").style.visibility = 'hidden';
        if (error)
            window.alert(error);
        Shoutbox.first = false;
        return;
    }
    var toReset = !Shoutbox.first && XMLDoc.getElementsByTagName("reset")[0];
    if (!Shoutbox.ie) 
    {
        if (toReset) 
        {
            if (Shoutbox.msgdown)
                setInnerHTML(document.getElementById("shoutbox_banned"), '<table cellspacing="0" cellpadding="0" border="0" align="left"><tr><td valign="bottom" height="' + Shoutbox.height + '"><table id="shoutbox_table" cellspacing="0" cellpadding="2" border="0"><tr id="shoutbox_msgs"></tr></table></td></tr></table>');
            else
                setInnerHTML(document.getElementById("shoutbox_banned"), '<table id="shoutbox_table" cellspacing="0" cellpadding="2" border="0" align="left"><thead id="shoutbox_msgs"></thead></table>');
        }
        setOuterHTML(document.getElementById("shoutbox_msgs"), XMLDoc.getElementsByTagName("msgs")[0].childNodes[0].nodeValue);
    } 
    else 
    {
        var msgs = '';
        if (Shoutbox.msgdown) 
        {
            msgs += '<table cellspacing="0" cellpadding="0" border="0" align="left"><tr><td valign="bottom" height="' + Shoutbox.height + '"><table id="shoutbox_table" cellspacing="0" cellpadding="2" border="0">';
            msgs += (toReset ? '' : getInnerHTML(document.getElementById("shoutbox_table"))) + XMLDoc.getElementsByTagName("msgs")[0].childNodes[0].nodeValue;
            msgs += '</table></td></tr></table>';
        } 
        else 
        {
            msgs += '<table id="shoutbox_table" cellspacing="0" cellpadding="2" border="0" align="left">';
            msgs += XMLDoc.getElementsByTagName("msgs")[0].childNodes[0].nodeValue + (toReset ? '' : getInnerHTML(document.getElementById("shoutbox_table")));
            msgs += '</table>';
        }
        setInnerHTML(document.getElementById("shoutbox_banned"), msgs);
    }
    if (toReset) 
    {
        Shoutbox.currentmsg = 1;
        Shoutbox.countmsgs = Shoutbox.maxmsgs = 0;
    }
    var count = parseInt(XMLDoc.getElementsByTagName("count")[0].childNodes[0].nodeValue);
    if (Shoutbox.countmsgs + count > Shoutbox.keepmsgs) 
    {
        for (var i = Shoutbox.currentmsg; i < Shoutbox.currentmsg + Shoutbox.countmsgs + count - Shoutbox.keepmsgs; i++)
            document.getElementById("shoutbox_row" + i).parentNode.removeChild(document.getElementById("shoutbox_row" + i));
        Shoutbox.currentmsg += Shoutbox.countmsgs + count - Shoutbox.keepmsgs;
    }
    Shoutbox.maxmsgs += count;
    Shoutbox.countmsgs = Shoutbox.countmsgs + count > Shoutbox.keepmsgs ? Shoutbox.keepmsgs : Shoutbox.countmsgs + count;
    if (!Shoutbox.hide) 
    {
        Shoutbox.msgs = window.setTimeout("Shoutbox_GetMsgs();", Shoutbox.refresh);
        Shoutbox.loading = false;
    }
    document.getElementById("shoutbox_status").style.visibility = 'hidden';
    if (Shoutbox.msgdown && (document.getElementById("shoutbox_banned").scrollTop >= Shoutbox.scroll || Shoutbox.scroll == 0)) 
    {
        document.getElementById("shoutbox_banned").scrollTop = document.getElementById("shoutbox_banned").scrollHeight;
        document.getElementById("shoutbox_banned").scrollTop = document.getElementById("shoutbox_banned").scrollHeight;
        Shoutbox.scroll = document.getElementById("shoutbox_banned").scrollTop;
    }
    if (error)
        window.alert(error);
    if (!Shoutbox.first && XMLDoc.getElementsByTagName("newmsgs")[0]){
        var msgs = $(XMLDoc.getElementsByTagName("msgs")[0].childNodes[0].nodeValue);
        if((notificationSettings.notifyWhenChatActive || isHidden()) && (notificationSettings.general || notificationSettings.mentions)) 
          msgs.each(function (a,b,c){
              var txt = $(b).text();
              if(txt != ""){
                var stxt = txt.toLowerCase();
                var found = false;
                notificationSettings.phrases.forEach(function(phrase, i){
                  if(!found && stxt.indexOf(phrase.toLowerCase()) != -1)
                    found = true;
                });

                if(found && notificationSettings.mentions)
                  notifyMe("LoE Chat Mention", notificationSettings.mentionFormat(txt), notificationSettings.mentionTimout);
                if(!(found && notificationSettings.mentions) && notificationSettings.general)
                  notifyMe("LoE Chat", notificationSettings.generalFormat(txt), notificationSettings.generalTimeout);
              }

          });
        Shoutbox_NewMsgs();
    }
    Shoutbox.first = false;
};

notifyMe = function notifyMe(title, msg, timeout) {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }

  // Let's check whether notification permissions have alredy been granted
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var notification = new Notification(title, {body: msg, icon: "https://pbs.twimg.com/profile_images/1910794026/LoE_Web_Logo2_400x400.png"});
    if(timeout != 0)
      setTimeout(function(){notification.close();}, timeout);
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var notification = new Notification(title, {body: msg, icon: "https://pbs.twimg.com/profile_images/1910794026/LoE_Web_Logo2_400x400.png"});
    if(timeout != 0)
      setTimeout(function(){notification.close();}, timeout);
      }
    });
  }

  // At last, if the user has denied notifications, and you 
  // want to be respectful there is no need to bother them any more.
}
function getHiddenProp(){
    var prefixes = ['webkit','moz','ms','o'];
    
    // if 'hidden' is natively supported just return it
    if ('hidden' in document) return 'hidden';
    
    // otherwise loop over all the known prefixes until we find one
    for (var i = 0; i < prefixes.length; i++){
        if ((prefixes[i] + 'Hidden') in document) 
            return prefixes[i] + 'Hidden';
    }

    // otherwise it's not supported
    return null;
}
function isHidden() {
    var prop = getHiddenProp();
    if (!prop) return false;
    
    return document[prop];
}
