var branch = "master";

function getGitScript(script) {
    return "https://rawgit.com/" + script;
}
function getRepoScript(script) {
    return getGitScript("ocbaker/SMFPack-Chatbox-Tools/" + branch + "/" + script);
}

var templateToLoad;
templateToLoad = templateToLoad || getRepoScript("settingsTemplate.html");

function getName(element) {
    var txt = element.text();
    if (txt.substr(0, txt.indexOf("[") - 1) == 0)
        return element.text().substr(1, element.text().indexOf(element.find(".me").text()) - 2).substring(element.text().indexOf("]:") + 1);
    return txt.substr(0, txt.indexOf("[") - 1);
}

function defaultNotificationFormat(txt) {
    if (txt.substr(0, txt.indexOf("[") - 1) == 0)
        return txt.substring(txt.indexOf("]:") + 2);
    return txt.substr(0, txt.indexOf("[") - 1) + ": " + txt.substring(txt.indexOf("]:") + 2);
}

var accountName = $(".greeting > span").text();

if(accountName == ""){
    $.get("index.php?action=profile", function(data) {
      var data = $(data);
      var text = data.find(".username").text();
      accountName = text.substr(0, text.indexOf(data.find(".username .position").text()) - 1);
    });
}

var notificationFunctions = {
    generalFormat: defaultNotificationFormat,
    mentionFormat: defaultNotificationFormat    
};
var notificationSettings = {
    phrases: [],
    general: true,
    mentions: true,
    generalTimeout: 5 * 1000,
    mentionTimeout: 10 * 1000,
    notifyWhenChatActive: false,
    chatHeight: 180
};

var ret = [];
var people = [];
var addPerson = function(elem) {
    var name = getName(elem);
    if (name != "") {
        if (people.indexOf(name) == -1) {
            ret.push({label: name});
            people.push(name);
        }
    }
};

function loadChatbox() {
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
                    setInnerHTML(document.getElementById("shoutbox_banned"), '<table cellspacing="0" cellpadding="0" border="0" align="left"><tr><td valign="bottom" height="' + notificationSettings.chatHeight + '"><table id="shoutbox_table" cellspacing="0" cellpadding="2" border="0"><tr id="shoutbox_msgs"></tr></table></td></tr></table>');
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
                msgs += '<table cellspacing="0" cellpadding="0" border="0" align="left"><tr><td valign="bottom" height="' + notificationSettings.chatHeight + '"><table id="shoutbox_table" cellspacing="0" cellpadding="2" border="0">';
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
        if (Shoutbox.height != notificationSettings.chatHeight) {
            Shoutbox.height = notificationSettings.chatHeight;
            Shoutbox.scroll = 0;
        }
        if (Shoutbox.msgdown && (document.getElementById("shoutbox_banned").scrollTop >= Shoutbox.scroll || Shoutbox.scroll == 0)) 
        {
            document.getElementById("shoutbox_banned").scrollTop = document.getElementById("shoutbox_banned").scrollHeight;
            document.getElementById("shoutbox_banned").scrollTop = document.getElementById("shoutbox_banned").scrollHeight;
            Shoutbox.scroll = document.getElementById("shoutbox_banned").scrollTop;
        }
        if (error)
            window.alert(error);
        if (!Shoutbox.first && XMLDoc.getElementsByTagName("newmsgs")[0]) {
            var msgs = $(XMLDoc.getElementsByTagName("msgs")[0].childNodes[0].nodeValue);
            msgs.each(function(a, b, c) {
                addPerson($(b));
                if ((notificationSettings.notifyWhenChatActive || isHidden()) && (notificationSettings.general || notificationSettings.mentions)) {
                    var txt = $(b).text();
                    if (txt != "") {
                        var stxt = txt.toLowerCase();
                        var found = false;
                        if (stxt.indexOf(("@" + accountName).toLowerCase()) != -1) {
                            found = true;
                            $("#" + $(b).attr("id")).highlight("@" + accountName);
                        }
                        if (!found)
                            notificationSettings.phrases.forEach(function(phrase, i) {
                                if (stxt.indexOf(phrase.text.toLowerCase()) != -1){
                                    found = true;
                                    $("#" + $(b).attr("id")).highlight(phrase);
                                }
                            });
                        
                        if (found && notificationSettings.mentions && getName($(b)) != accountName)
                            notifyMe("LoE Chat Mention", notificationFunctions.mentionFormat(txt), notificationSettings.mentionTimeout);
                        if (!(found && notificationSettings.mentions) && notificationSettings.general)
                            notifyMe("LoE Chat", notificationFunctions.generalFormat(txt), notificationSettings.generalTimeout);
                    }
                }
            
            });
            Shoutbox_NewMsgs();
        }
        Shoutbox.first = false;
    };
}

notifyMe = function notifyMe(title, msg, timeout) {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    } 

    // Let's check whether notification permissions have alredy been granted
    else if (Notification.permission === "granted") {
        // If it's okay let's create a notification
        var notification = new Notification(title, {body: msg,icon: "https://pbs.twimg.com/profile_images/1910794026/LoE_Web_Logo2_400x400.png"});
        if (timeout != 0)
            setTimeout(function() {
                notification.close();
            }, timeout);
    } 

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function(permission) {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                var notification = new Notification(title, {body: msg,icon: "https://pbs.twimg.com/profile_images/1910794026/LoE_Web_Logo2_400x400.png"});
                if (timeout != 0)
                    setTimeout(function() {
                        notification.close();
                    }, timeout);
            }
        });
    }

// At last, if the user has denied notifications, and you 
// want to be respectful there is no need to bother them any more.
}
function getHiddenProp() {
    var prefixes = ['webkit', 'moz', 'ms', 'o'];

    // if 'hidden' is natively supported just return it
    if ('hidden' in document)
        return 'hidden';

    // otherwise loop over all the known prefixes until we find one
    for (var i = 0; i < prefixes.length; i++) {
        if ((prefixes[i] + 'Hidden') in document)
            return prefixes[i] + 'Hidden';
    }

    // otherwise it's not supported
    return null;
}
function isHidden() {
    var prop = getHiddenProp();
    if (!prop)
        return false;
    
    return document[prop];
}

function loadSettings(localStorageService) {

}

function setupPeople() {
    $("#shoutbox_table > tbody > tr").each(function(a, b, c) {
        var elem = $(b);
        var name = getName(elem);
        if (name != "") {
            if (people.indexOf(name) == -1) {
                ret.push({label: name});
                people.push(name);
            }
        }
    });
    return ret;
}

function loadAngular() {
    
    angular.module('Foo', ['LocalStorageModule', 'mentio', 'ngTagsInput', 'ui.bootstrap'], function($controllerProvider) {
        controllerProvider = $controllerProvider;
    });
    // Bootstrap Foo
    angular.bootstrap($('#shoutbox'), ['Foo']);

    // .. time passes ..

    // Load javascript file with Ctrl controller
    var myApp = angular.module('Foo');
    myApp.config(function(localStorageServiceProvider) {
        localStorageServiceProvider
        .setPrefix('myApp')
        .setStorageType('localStorage')
        .setNotify(true, true)
    });
    myApp.controller('Ctrl', function($scope, $rootScope, localStorageService) {
        if(localStorageService.isSupported){
            console.log(localStorageService);
            if(localStorageService.keys().indexOf("settings") == -1){
                localStorageService.set("settings", notificationSettings);
            }
            notificationSettings = undefined;
            localStorageService.bind($scope, 'settings');
            notificationSettings = $scope.settings;
        }else{
            $scope.settings = notificationSettings;
        }
        $scope.getChatStyle = function() {
            return {'height': $scope.settings.chatHeight + 'px','max-height': $scope.settings.chatHeight + 'px'};
        };
        $scope.people = setupPeople();
        
        console.log($scope);
        loadChatbox();
        notifyMe("LoE Chat", "Loaded Notifications", 10000);
        if(Shoutbox.setUserSettings != undefined)
            notifyMe("LoE Chat Warning", "You are using an outdated method of settings user settings. Local storage is now used.", 0);
    });

    // Load html file with content that uses Ctrl controller
    $('<div id="nSettings" class="bootstrap">').appendTo('#shoutbox .content');
    $('#shoutbox .content').attr("ng-controller", "Ctrl");
    $('#shoutbox .content').attr("id", "ctrl");
    $('#shoutbox_banned').attr("ng-style", "getChatStyle()");
    $('#shoutbox_message').attr("mentio", "");
    $('#shoutbox_message').attr("ng-model", "myval");
    $('#shoutbox_message').attr("mentio-items", "people | filter:label:typedTerm");
    $('#shoutbox_message').attr("mentio-typed-text", "typedTerm");
    $("#shoutbox_banned > table > tbody > tr > td").attr("height", "{{settings.chatHeight}}")
    $('#nSettings').load(templateToLoad, function() {
        registerController("Foo", "Ctrl");
        // compile the new element
        $('#shoutbox .content').injector().invoke(function($compile, $rootScope, localStorageService) {
            $compile($('#ctrl'))($rootScope);
            $rootScope.$apply();
        });
    });
}

var controllerProvider = null;

$('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', getRepoScript("stylesheet.css")));
$('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', "https://cdnjs.cloudflare.com/ajax/libs/ng-tags-input/2.3.0/ng-tags-input.css"));
jQuery.getScript("//ajax.googleapis.com/ajax/libs/angularjs/1.4.0-rc.2/angular.min.js", function() {
    jQuery.getScript(getGitScript("jeff-collins/ment.io/master/dist/mentio.js"), function() {
        jQuery.getScript(getGitScript("grevory/angular-local-storage/master/dist/angular-local-storage.js"), function() {
            jQuery.getScript(getRepoScript("templates.js"), function() {
                jQuery.getScript(getGitScript("bartaz/sandbox.js/master/jquery.highlight.js"), function() {
                    jQuery.getScript("https://cdnjs.cloudflare.com/ajax/libs/ng-tags-input/2.3.0/ng-tags-input.js", function() {
                        jQuery.getScript(getGitScript("angular-ui/bootstrap/gh-pages/ui-bootstrap-0.13.0.js"), function() {
                            jQuery.getScript(getGitScript("angular-ui/bootstrap/gh-pages/ui-bootstrap-tpls-0.13.0.js"), function() {
                                loadAngular();
                            });
                        });
                    });
                });
            });
        });
    });
});

// Register Ctrl controller manually
// If you can reference the controller function directly, just run:
// $controllerProvider.register(controllerName, controllerFunction);
// Note: I haven't found a way to get $controllerProvider at this stage
//    so I keep a reference from when I ran my module config
function registerController(moduleName, controllerName) {
    // Here I cannot get the controller function directly so I
    // need to loop through the module's _invokeQueue to get it
    var queue = angular.module(moduleName)._invokeQueue;
    for (var i = 0; i < queue.length; i++) {
        var call = queue[i];
        if (call[0] == "$controllerProvider" && 
        call[1] == "register" && 
        call[2][0] == controllerName) {
            controllerProvider.register(controllerName, call[2][1]);
        }
    }
}
