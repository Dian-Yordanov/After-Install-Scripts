var storage = chrome.storage.sync || chrome.storage.local;
var plat3 = navigator.platform.substr(0,3).toLowerCase();
var isWindows=plat3=='win';
var isMac=plat3=='mac';
var isFirefox = window.navigator.userAgent.indexOf('Firefox') > -1;
var isChrome = window.navigator.userAgent.indexOf('Chrome/') > -1;
var pOptions={};
var pAdvOptions={};
var pSyncItems={};

//WARNIGN you have to set defaults two places for now...
pOptions["pickEveryTime"]={def:isWindows?true:false,ind:0,img:'img/icons/no-shadow/icon16.png'}; //default also set in popup.html
pOptions["pixelatedPreview"]={def:true,ind:0};
pOptions["allowWebGl"]={def:false,ind:1,img:'img/warning.png'};
pOptions["fishEye"]={def:5,ind:1,select:{1:'1 '+chrome.i18n.getMessage('minimum')+'/'+chrome.i18n.getMessage('off'),2:2,3:3,4:4,5:'5 '+chrome.i18n.getMessage('default'),6:6,7:7,8:8,9:'9 '+chrome.i18n.getMessage('full'),10:10,11:11,12:12,13:13,14:14,15:'15 '+chrome.i18n.getMessage('maxZoom')}};
pOptions["EnableHex"]={def:true,ind:0,css:'display:inline-block;'};
pOptions["EnableRGB"]={def:true,ind:0,css:'display:inline-block;margin-left:8px;'};
pOptions["EnableHSL"]={def:false,ind:0,css:'display:inline-block;margin-left:8px;'};
pOptions["showPreviewInContent"]={def:true,ind:0};
// pOptions["contSprevZoomd"]={def:true,ind:1};
pOptions["ShowRGBHSL"]={def:true,ind:1};
pOptions["autocopyhex"]={def:'false',ind:0,select:{'false':chrome.i18n.getMessage('off'),'true':'hexadecimal','rgb':'rgb','hsl':'hsl'}};


//pAdvOptions["customCalibration"]={def:false,ind:0,name:'Enable the defunct calibration link above.'};
pAdvOptions["usePNG"]={def:true,ind:0};
pAdvOptions["useCSSValues"]={def:true,ind:0};
pAdvOptions["CSS3ColorFormat"]={def:'(#1,#2,#3)',ind:1};
pAdvOptions["supportColorInputs"]={def:isMac?false:true,ind:0,img:'img/icon16.png'};
pAdvOptions["hexIsLowerCase"]={def:false,ind:0};
pAdvOptions["hexHasHash"]={def:false,ind:0};
pAdvOptions["oldHistoryFirst"]={def:false,ind:0};
//pAdvOptions["iconIsPreview"]={def:false,ind:0,img:'img/opt_badge.png'};
pAdvOptions["appleIcon"]={def:false,ind:0,img:'img/apple/icon16.png'};
pAdvOptions["iconIsBitmap"]={def:false,ind:0,img:'img/icon_pixel.png'};
pAdvOptions["resetIcon"]={def:true,ind:1,name:'Back to normal icon when done'};
pAdvOptions["bbackgroundColor"]={def:'#FFF',ind:0};
pAdvOptions["usePrevColorBG"]={def:false,ind:1};
pAdvOptions["showPreviousClr"]={def:true,ind:0};
pAdvOptions["borderValue"]={def:'1px solid grey',ind:0};
pAdvOptions["confirmEmptyPalleteWhenLeaving"]={def:false,ind:0};
pAdvOptions["hideWatermark"]={def:false,ind:0};
//pOptions["localflScalePix"]={def:false,ind:1,name:'Local Flash Scale Pixel? (read help)'};
//pAdvOptions["showActualPickTarget"]={def:true,ind:0,name:'ShowActualPickTarget - Freeze Screen when Picking.  Also useful when ColorAccuracyOverPrecision checked, you see the image you\'re picking from instead of the webpage.'};
//pAdvOptions["clrAccuracyOverPrecision"]={def:false,ind:0,name:'ColorAccuracyOverPrecision - Never scale screenshot.  Improves color accuracy sometimes (rarely) but decreases location accuracy.  Negative: possibly inaccessible page locations.'};
//pAdvOptions["autoRedirectPickable"]={def:false,ind:0,name:'Automatically redirect to a pickable version when unavailable (no longer useful!)'};
//pAdvOptions["redirectSameWindow"]={def:false,ind:1,name:'Use the same window (warning: you may lose form data)'};
pOptions["hasAgreedToLicense"]={def:false,ind:0,css:'display:none;'};
pOptions["disableRewriting"]={def:true,ind:0}; //this option has no effect, but is required so that old reviews make logical sense, if people want to opt out of something that doesn't exist they can
pOptions["usageStatistics"]={def:false,ind:0};
pOptions["shareClors"]={def:false,ind:0};
pOptions["disableUninstallSurvey"]={def:false,ind:0};
pSyncItems["reg_chk"]={def:false};
pSyncItems["reg_hash"]={def:""};
pSyncItems["reg_name"]={def:""};
pSyncItems["reg_inapp"]={def:false};

function formatColorValues(a,b,c,pcta,pctb,pctc){
	return formatColorValuesWith(CSS3ColorFormat,a,b,c,pcta,pctb,pctc);
}

function formatColorValuesWith(fmt,a,b,c,pcta,pctb,pctc){
	return fmt.replace('#1',a/*+(pcta?'%':'')*/).replace('#2',b+(pctb?'%':'')).replace('#3',c+(pctc?'%':''));
}

// this helper avoids new tabs when they already exist...
function navTo(ev, html){
	chrome.runtime.sendMessage({goToOrVisitTab:html}, function(r){});
	ev.preventDefault();
}

function navToHelp(ev){
	navTo(ev, 'help.html');
}

function navToDesktop(ev){
	navTo(ev, 'desktop_app.html');
}

function navToMobile(ev){
	navTo(ev, 'mobile_app.html');
}

function navToReg(ev){
	navTo(ev, 'register.html');
}

function navToOptions(ev){
	navTo(ev, 'options.html');
}

function navToHistory(ev){
	navTo(ev, 'options.html?history');
}

function navToPallete(ev, addColor){ // probably unused
	navTo(ev, 'options.html?palette' + (addColor ? '='+addColor : ''));
}
