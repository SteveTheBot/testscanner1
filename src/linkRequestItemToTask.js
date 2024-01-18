if (window.location.toString().indexOf('help?id=sc_cat_item&sys_id=')!= -1 &&
	window.location.toString().indexOf('&item=createrequest&reqID=')!= -1){	
	setTimeout(alertFunc1,1000);
}
function getUrlParameter(name) {
	name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
	var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
	var results = regex.exec(location.search);
	return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

function alertFunc1() {
	var ga = new GlideAjax('transferTicket');
	ga.addParam('sysparm_name','linkRequestItem');
	//	ga.addParam('sysparm_user_id',g_user.userID);
	ga.addParam('sysparm_sys_id',getUrlParameter('reqID'));
	ga.addParam('sysparm_table',getUrlParameter('sysparm_table'));
	ga.addParam('sysparm_item_sys_id',getUrlParameter('sysparm_id'));
	ga.getXML(HelloWorldParse);

	function HelloWorldParse(response) {
		var answer = response.responseXML.documentElement.getAttribute("answer");
	}
}
