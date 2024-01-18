if (logged_in) {
	var fonts = {
		slick: new FontFace('slick', 'url(sys_attachment.do?sys_id=f284bb231bb30414ebbe43f8bc4bcb44)'),
		fontello: new FontFace('fontello', 'url(sys_attachment.do?sys_id=12792f9f1b26b7044862b8cc1d4bcbc5)')
	};

	for (var font in fonts) {
		fonts[font].load().then(function(loadedFace) {
			document.fonts.add(loadedFace);
		}).catch(function(error) {
			console.log(error);
		});
	}
}
