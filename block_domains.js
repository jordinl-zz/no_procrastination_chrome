chrome.extension.sendRequest({ data: "is_paused" }, function(response) {

  if(response.is_paused == true){
    return;
  }

  chrome.extension.sendRequest({ data: "domain_list" }, function(response) {

    domains = JSON.parse(response.data);

    for (i = 0; i < domains.length; i++){
      domain = domains[i].replace(/\./g, '\\.').replace(/\//g, '\\/')
      if(document.location.href.match("^https?://(?:[^\/]*)?" + domain)){
        document.location = chrome.extension.getURL('you_should_be_working.html');
      }
    }

  });

});

