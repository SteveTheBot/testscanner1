var x_bb_communities = x_bb_communities || {};
x_bb_communities.onLoadRedirectCom= function() {
	var LocationSearch = window.location.search;
		if(LocationSearch.indexOf('community') !== -1 || LocationSearch.indexOf('communities') !== -1) {
			if(LocationSearch.indexOf('bb_community_landing') !== -1)
				return 0;
			window.location.replace('/bb?id=bb_community_landing');
		}		
};
$(document).ready(x_redha_communities.onLoadRedirectCom);
