try { NoProc } catch(error) { NoProc = {}; };

NoProc.is_paused = function(){
  return localStorage['no_procrast.is_paused'] == 'true';
},

NoProc.toggle_pause = function(){
  localStorage['no_procrast.is_paused'] = !NoProc.is_paused();
  NoProc.reset_timer();
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

NoProc.reset_timer = function(){
  localStorage['no_procrast.last_change'] = (new Date).getTime();
  NoProc.set_timer();
},

NoProc.last_change = function(){
  return parseInt(localStorage['no_procrast.last_change']) || (new Date).getTime();
},

NoProc.current_time = function(){
  return (new Date).getTime();
},

NoProc.time_diference = function(){
  var difference = Math.floor((NoProc.current_time() - NoProc.last_change()) / 60000);
  var minutes = difference % 60;
  var hours = Math.floor(difference / 60);
  if(hours > 9){
    return hours + 'h';
  }
  if(hours == 0){
    return minutes + 'm';
  }
  return hours + 'h' + minutes;
},

NoProc.initialize_timer = function(){
  NoProc.refresh_timer(NoProc.time_diference());
},

NoProc.set_timer = function(){
  if(!NoProc.is_paused()){
    chrome.browserAction.setBadgeText({ text: '' });
  }
  else{
    chrome.browserAction.setBadgeText({ text: NoProc.time_diference() });
  }
  if(chrome.extension.getViews({ type: "popup" }).length){
    method = 'NoProc.refresh_timer("' + NoProc.time_diference() + '")';
    chrome.extension.getViews({ type: "popup" })[0].eval(method); // whoops!
  }
}

NoProc.initialize_background = function(){

  NoProc.set_icon();

  NoProc.reset_timer();
  setInterval('NoProc.set_timer()', 60000);

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
