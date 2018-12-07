'use strict';

chrome.runtime.onInstalled.addListener(function() {
	console.log("loaded");
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		chrome.declarativeContent.onPageChanged.addRules([{
			conditions: [new chrome.declarativeContent.PageStateMatcher({
				pageUrl: { hostSuffix: 'mezz-in.com' },
			})],
			actions: [ new chrome.declarativeContent.ShowPageAction() ]
		}]);
	});
});

chrome.webRequest.onBeforeRequest.addListener(function(details) {
	console.log("Evaluating: " + details.url);
	if(details.url.includes("?focus")){
		console.log("already focused");
		return{}
	} else {
		console.log("focusing");
		return{redirectUrl: details.url+"?focus=y"};
	}
}, {urls: ["*://mezz-in.com/a/*"], types: ["main_frame"]}, ["blocking"] );

chrome.pageAction.onClicked.addListener(function(tab) {
	console.log("clicked icon on " + tab.url);
	if(tab.url.includes("?focus=y")){
		console.log("redirect to oldschool");
		chrome.tabs.update( tab.id, {'url': tab.url.substring(0, tab.url.lastIndexOf("?focus=y")) + "?focus"});
	} else if(tab.url.includes("?focus")){
		console.log("redirect to new hotness");
		chrome.tabs.update( tab.id, {'url': tab.url.substring(0, tab.url.lastIndexOf("?focus")) + "?focus=y"});
	}
});
