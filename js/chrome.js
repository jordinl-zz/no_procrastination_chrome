try { NoProc } catch(error) { NoProc = {}; };

NoProc.is_paused = function(){
  return localStorage['no_procrast.is_paused'] == 'true';
},

NoProc.toggle_pause = function(){
  localStorage['no_procrast.is_paused'] = !NoProc.is_paused();
  NoProc.set_icon();
},

NoProc.icon = function(){
  file_path = NoProc.is_paused() ? '/img/hand_off_32.png' : '/img/hand_on_32.png';
  return chrome.extension.getURL(file_path);
},

NoProc.set_icon = function(){
  chrome.browserAction.setIcon({ 'path': NoProc.icon()});
},

NoProc.domain_list = function(){
  return JSON.parse(localStorage['no_procrast.list'] || '[]');
},

NoProc.set_domain_list = function(list){
  localStorage['no_procrast.list'] = JSON.stringify(list);
},

NoProc.initialize_background = function(){

  NoProc.set_icon();

  chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
      if (request.data == "domain_list"){
        sendResponse({data: JSON.stringify(NoProc.domain_list())});
      }
      if (request.data == "is_paused"){
        sendResponse({is_paused: NoProc.is_paused()});
      }
   });

  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
    chrome.tabs.executeScript(tabId, {
      file: "/js/block_domains.js" 
    });
  });
}
