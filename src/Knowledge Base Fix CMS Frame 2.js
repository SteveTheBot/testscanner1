document.addEventListener('DOMContentLoaded', function () {
	
	if (!parent || parent.location.pathname.indexOf('rh_ess') == -1)
		return;
	
	var isSafari = navigator.vendor && navigator.vendor.indexOf('Apple') > -1 && 
		navigator.userAgent && !navigator.userAgent.match('CriOS'),
		frameHeightFix;
	
	if (isSafari != true) {
		frameHeightFix = $('<style>body { height: initial; }</style>');
		$('head').append(frameHeightFix);
		
	} else {
		frameHeightFix = $('<style>div.page, section.page { height: initial !important; }</style>');
		$('head').append(frameHeightFix);
	}
	
	if (typeof window.fixcmsframeintvl == 'undefined')
		window.fixcmsframeintvl = setInterval(fixCMSFrameHeight, 500);
	//window.fixcmsframecount = 0;
});

function fixCMSFrameHeight () {
	
	/*if (window.fixcmsframecount > 20)
		clearInterval(window.fixcmsframeintvl);*/

	var frame = parent.window.$j('iframe[name="gsft_main"]')[0];
	if (typeof frame == 'undefined') return;

	var body = document.body,
		html = document.documentElement,
		height = Math.max(body.offsetHeight, html.scrollHeight, html.offsetHeight);
	
	frame.height = height;
	//window.fixcmsframecount++;
}
