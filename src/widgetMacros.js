(function () {
	//object to store macros in
	var macrosObj = {};

	var fn = function (e) {
		var keyCode = e.keyCode || e.which;

		//check if key pressed is TAB
		if (keyCode == 9) {

			//get DOM element for active pane
			var cmEl = jQuery(document.activeElement).parents('.CodeMirror')[0];

			//get CodeMirror object for active pane. CodeMirror is the Syntax Editor library used in the Widget Editor
			var cmObj = cmEl.CodeMirror;

			//get position of cursor and end of line
			var tmpCursor = cmObj.getCursor();
			var eol = cmObj.getLine(tmpCursor.line).length;

			//do nothing if cursor is not at end of line
			//this allows users to continue using TAB key for formatting/indentation
			if (tmpCursor.ch < eol) {
				return true;
			}

			//do nothing if any text is selected
			if (cmObj.somethingSelected()) {
				return true;
			}

			//find the start and end position of the word preceeding the cursor
			var wordObj = cmObj.findWordAt({
				line: tmpCursor.line,
				ch: tmpCursor.ch - 2
			});

			//get the actual word preceeding the cursor
			var word = cmObj.getRange(wordObj.anchor, wordObj.head);

			//do nothing if a corresponding Syntax Editor Macro does not exist
			if (typeof macrosObj[word] === 'undefined')
				return true;

			//select the word preceeding the cursor
			var sel = cmObj.setSelection(wordObj.anchor, wordObj.head);

			//replace selection with the text of the Syntax Editor Macro
			cmObj.replaceSelection(macrosObj[word].text);
		}
	};

	//add keyup event listener
	jQuery(window).on('keyup', fn);

	//populate macrosObj with records from the Syntax Editor Macro table
	var requestBody = "";
	var client = new XMLHttpRequest();
	client.open("get", "/api/now/table/syntax_editor_macro?sysparm_fields=name%2Ctext");
	client.setRequestHeader('Accept', 'application/json');
	client.setRequestHeader('Content-Type', 'application/json');
	client.setRequestHeader('X-UserToken', window.g_ck);

	var rsc = function () {
		if (this.readyState == this.DONE) {
			var rspObj = JSON.parse(this.response).result;
			for (var macro in rspObj) {
				if (!rspObj.hasOwnProperty(macro))
					continue;

				var currentMacro = rspObj[macro];
				macrosObj[currentMacro.name] = currentMacro;
			}
		}
	};

	client.onreadystatechange = rsc;
	client.send(requestBody);
})();
