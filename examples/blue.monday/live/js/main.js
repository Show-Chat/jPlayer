$(function(){
	/* jPlayer initialization **/
 	var stream = {
		title: stationname,
		mp3: station

		},
	ready = false;

	$("#jquery_jplayer_1").jPlayer({
		ready: function (event) {
			ready = true;
			if(autoplay == true){
				$(this).jPlayer("play","setMedia", stream);
			}
		},
		pause: function() {
			$(this).jPlayer("clearMedia");
		},
		error: function(event) {
			if(ready && event.jPlayer.error.type === $.jPlayer.error.URL_NOT_SET) {
				// Setup the media stream again and play it.
				$(this).jPlayer("setMedia", stream).jPlayer("play");
				return;
			}
		},
		solution:"html",
		swfPath: "../../dist/jplayer",
		supplied: "mp3",
		preload: "none",
		wmode: "window"
	});
	/** end jPlayer **/
	
	/** Function to shorten long artist/song titles **/
	function fixLength(string, x){
		if(string.length > x){ 
			return string.substring(0, x) + '...'; 
		} 
		else { 
			return string;
		} 
	}
	/** end shortening function **/
	
	
	/* JSON Function for now-playing data */
	function getData() {
	   
		$.getJSON("_js/metadata.php?callback=?",
		  {
			server: station,
			type: servertype
		  },
		  function(data) {
			  
			song = (data.songs[0] != "") ? data.songs[0].split(" - ") : "Unknown artist - Unkown title".split(" - ");
			var title = (song.length > 1) ? fixLength(song[1],30) : "";
				artist = fixLength(song[0],24);
			if(song != $("#checker").val()){
				$(".artist").empty().append(artist);
				$(".title").empty().append(title);
				$("#checker").val(song);
				if(title != "Unknown title"){
					$.getJSON("https://itunes.apple.com/search?callback=?",
					{
						term: data.songs[0],
						entity: "song",
						media: "music",
						country: "US"
					},
					function(data) {
						if (data.results.length == 0) { $("#albumcover").css("background-image", "url(\"./_img/no_cover.png\")"); return;}
						var coverURL = (typeof data.results[0].artworkUrl100 != 'undefined') ? data.results[0].artworkUrl100 : "./_img/no_cover.png";
						$("#albumcover").css("background-image", "url(" + coverURL + ")");
					});
				} else {
					$("#albumcover").css("background-image", "url(\"./_img/no_cover.png\")");
				}
			}
			}).fail(function(jqxhr, textStatus, error){
        var err = textStatus + ', ' + error;
        console.log("Request Failed: " + err);
});
	}
	/** end JSON function **/
	
	/** optimations and special behaviours **/
	/** FF remembers the song and mucks up the JSON function, reset checker **/
	$("#checker").attr('autocomplete', 'off');
	
	/* simple check to prevent JSON from being fetches if metadata is not enabled */
	if(metadata == true){
	getData();
	window.setInterval(function(){getData();}, 10000);
	} else {
		$("#station").hide();
		$(".artist").empty().append(stationname);
		$(".title").empty().append(slogan);
	}
	
	/* hide the stuff that's not defined */
	if(slogan == ""){
		$("#divider").hide();
	}
	if(twitter == false){
		$("#twitter").hide();
	}
	if(facebook == false){
		$("#facebook").hide();
	}
	if(navigator.userAgent.toLowerCase().match("mobile") != null){
		$("#winamp").hide();
	}
	
	/* popout button function */
	$("#popout").click(function(e){
		e.preventDefault();
		$("#jquery_jplayer_1").jPlayer("clearMedia");
		var url = $(this).attr("href");
		window.open(url, 'player', 'location=0,status=0,scrollbars=0, width=780, height=230');
	});
});
