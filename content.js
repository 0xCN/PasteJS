var text;
var urls;
var urlSource;
var fnum = 0;


function filter(JsSource, type) {
	var co1 = JsSource.match(/\.execCommand\(['"\\]copy['"\\]\)/gi);
	for (i = 1; i < 5; i++) {
		var co2 = JsSource.match(/\.execCommand\([\s\'\"\\]{i}['"\\]copy['"\\][\s\'\"\\]{i}\)/gi);		
		if(co2) {fnum+=co2.length;}
	}

	var cu1 = JsSource.match(/\.execCommand\(['"\\]cut['"\\]\)/gi);
	for (i = 1; i < 5; i++) {
		var cu2 = JsSource.match(/\.execCommand\([\s\'\"\\]['"\\]cut['"\\][\s\'\"\\]\)/gi);
		if(cu2) {fnum+=cu2.length;}
	}

	var cc0 = JsSource.match(/\.execCommand\(&#39;copy&#39;\)/gi);
	var cc1 = JsSource.match(/\.execCommand\(&#39;cut&#39;\)/gi);

	if(co1) {fnum+=co1.length;}
	if(cu1) {fnum+=cu1.length;}
	if(cc0) {fnum+=cc0.length}
	if(cc1) {fnum+=cc1.length}

	if(fnum != 0) {
		chrome.runtime.sendMessage({badgeText: String(fnum)});
		console.log('foundnum '+fnum);
		if(type=='outside') {
			return 'True';
		}
		if(type=='inside') {
			coo1 = JsSource.replace(/\.execCommand\(['"\\]copy['"\\]\)/gi, '');
			for (i = 1; i < 5; i++) {
				coo1 = coo1.replace(/\.execCommand\([\s\'\"\\]{i}['"\\]copy['"\\][\s\'\"\\]{i}\)/gi, '');	
			}


			cou1 = coo1.replace(/\.execCommand\(['"\\]cut['"\\]\)/gi, '');
			for (i = 1; i < 5; i++) {
				cou1 = cou1.replace(/\.execCommand\([\s\'\"\\]{i}['"\\]cut['"\\][\s\'\"\\]{i}\)/gi, '');	
			}

			cco0 = cou1.replace(/\.execCommand\(&#39;copy&#39;\)/gi, '');
			cco1 = cco0.replace(/\.execCommand\(&#39;cut&#39;\)/gi, '');

			return cco1;
		}
	}
}




chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "on" ) {

      var js = document.scripts;
      var iframes = document.getElementsByTagName('iframe');
      var spanTags = document.getElementsByTagName('span');

	  for (num = 0; num < js.length; num++) { 
	  	if(js[num].src == "") {
	  		try {
	  			sauce = filter(js[num].innerHTML, 'inside');
	  			js[num].innerHTML = sauce;
		    }
		    catch(err) {
		    }
	  	}
	    else {
	    	try {
		    	$.get(js[num].src, function(resp) {
		    	  output = filter(resp, 'outside');
		    	});
			    if(output=='True') {
			      js[num].src = "";
			    }
		    }
		    catch(err) {
		    }
	    }
	  }


	  for (num = 0; num < spanTags.length; num++) {
	  	spanTags[num].style = null;
	  	spanTags[num].style.left = '1px';
	  	spanTags[num].style.top = '1px';
	  	spanTags[num].style.position = null;
	  	chrome.runtime.sendMessage({badgeText: String(fnum+1)});
	  }


	  if(iframes) {
	  	for (num = 0; num < iframes.length; num++) {
	  		try {
				if(request.BTT === "on") {
		  			iframes[num].src = "";	
		  			chrome.runtime.sendMessage({badgeText: String(fnum+1)});
		  		}
			}
			catch(err) {

			}
		}
	  }

	  document.addEventListener("copy", function (event) {
	      event.stopPropagation();
	  }, true);
	  
	  document.addEventListener("cut", function (event) {
	      event.stopPropagation();
	  }, true);


	  if(request.BT === "on") {
		  document.addEventListener("copy", function (event) {
			navigator.clipboard.readText()
			  .then(text => {
			    console.log('Pasted content: ', text);
			  })
			  .catch(err => {
			    console.error('Failed to read clipboard contents: ', err);
			  });
		  }, true);
	  }
    }
  }
);