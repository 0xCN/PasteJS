var toggle = false;
var butt = 'off';
var TO = false;
var BT = 'off';
var TOO = false;
var BTT = 'off';


chrome.browserAction.onClicked.addListener(function(tab) {
  toggle = !toggle;

  if(toggle){
  	butt = 'on';
    chrome.browserAction.setIcon({path: {"16": "images/paste16.png","32": "images/paste32.png"}});
  }

  else{
  	butt = 'off';
  	chrome.browserAction.setIcon({path: {"16": "images/paste16_off.png","32": "images/paste32_off.png"}});
  }
});



chrome.webNavigation.onCompleted.addListener(function(tabs) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": butt, "BT": BT, "BTT": BTT});
  });  
});


chrome.contextMenus.removeAll();
chrome.contextMenus.create({
      title: "Show Copied Items",
      contexts: ["browser_action"],
      onclick: function() {
        TO = !TO;

        if(TO){
          BT = 'on';
        }
        else{
          BT = 'off';
        }
      }
});
chrome.contextMenus.create({
      title: "Block All Iframes",
      contexts: ["browser_action"],
      onclick: function() {
        TOO = !TOO;

        if(TOO){
          BTT = 'on';
        }
        else{
          BTT = 'off';
        }
      }
});


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.badgeText) {
        chrome.tabs.get(sender.tab.id, function(tab) {
            if (chrome.runtime.lastError) {
                return; // the prerendered tab has been nuked, happens in omnibox search
            }
            if (tab.index >= 0) { // tab is visible
                chrome.browserAction.setBadgeBackgroundColor({ color: "#FF1493"});
                chrome.browserAction.setBadgeText({tabId:tab.id, text:message.badgeText});
            } else { // prerendered tab, invisible yet, happens quite rarely
                var tabId = sender.tab.id, text = message.badgeText;
                chrome.webNavigation.onCommitted.addListener(function update(details) {
                    if (details.tabId == tabId) {
                        chrome.browserAction.setBadgeText({tabId: tabId, text: text});
                        chrome.webNavigation.onCommitted.removeListener(update);
                    }
                });
            }
        });
    }
});