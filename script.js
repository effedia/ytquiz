var pl, ss, rt, rc, wn, mb, an, gu, po, videos, results, player, state, timeout, to1, to2, tries, nrepeats, q, ts;
function onPlayerReady() {
	if (ss == 3900)
		nrepeats = 14;
	else if (ss == 2400)
		nrepeats = 9;
	else if (ss == 1400)
		nrepeats = 4;
	else if (ss == 800)
		nrepeats = 3;
	else
		nrepeats = 2;
	ts = Math.floor(Math.random() * (player.getDuration() - 20) + 10);
	player.setVolume(100);
	player.setPlaybackRate(1);
	player.seekTo(ts, true);
	player.playVideo();
};
function onPlayerStateChange() {
	state = player.getPlayerState();
	if (state == 1 && timeout) {
		setTimeout(function () {
			player.pauseVideo();
			if (!$("#q2").length)
				mb.append("<div id=\"q2\"><button type=\"button\" onclick=\"risposta()\">Conferma titolo</button><br/><button type=\"button\" id=\"repeat\" onclick=\"riascolta()\">Riascolta audio 🔊</button></div>");
		}, ss);
	}
	else if (state == 5) {
		if (ss == 3900)
			nrepeats = 14;
		else if (ss == 2400)
			nrepeats = 9;
		else if (ss == 1400)
			nrepeats = 4;
		else if (ss == 800)
			nrepeats = 3;
		else
			nrepeats = 2;
		ts = Math.floor(Math.random() * (player.getDuration() - 20) + 10);
		player.setVolume(100);
		player.setPlaybackRate(1);
		player.seekTo(ts, true);
		player.playVideo();
	};
};
function onPlayerError() {
	tries++;
	if (tries > 3) {
		if (!alert("Ricontrolla i video disponibili nella tua playlist!"))
			window.location.reload();
	} else {
		q = Math.floor(Math.random() * videos.length);
		player.cueVideoById(videos[q][0]);
	};
};
function piuinfo() {
	$("#moretitle").replaceWith("<h2 id=\"lesstitle\" onclick=\"menoinfo()\">Altre informazioni ▲</h2>");
	$("#morebox").css("display", "block");
	setTimeout(function () {
		$("#morebox").css("opacity", 1);
	});
};
function menoinfo() {
	$("#lesstitle").replaceWith("<h2 id=\"moretitle\" onclick=\"piuinfo()\">Altre informazioni ▼</h2>");
	$("#morebox").css("opacity", 0);
	setTimeout(function () {
		$("#morebox").css("display", "none");
	}, 300);
};
function copia(plid) {
	clearTimeout(to1);
	clearTimeout(to2);
	navigator.clipboard.writeText("https://effedia.github.io/ytquiz/index.html?pl=" + plid);
	$("#tooltiptext").css("visibility", "visible");
	$("#tooltiptext").css("opacity", 1);
	to1 = setTimeout(function () {
		$("#tooltiptext").css("opacity", 0);
		to2 = setTimeout(function () {
			$("#tooltiptext").css("visibility", "hidden");
		}, 300);
	}, 2000);
};
function rigioca() {
	rc = 1;
	po = 0;
	tries = 0;
	res = [];
	timeout = true;
	mb.html("<p><i>Turno <span id=\"rc\">1</span>/"+ rt +"</i></p><div id=\"q1\"><label>Qual è il titolo?</label><br/><input list=\"an\" type=\"text\"/><datalist id=\"an\"></datalist></div><br/><div id=\"player\"></div><p id=\"wn2\"></p>");
	an = $("#an");
	wn = $("#wn2");
	for (var i in videos)
		an.append("<option value=\"" + videos[i][1] + "\"/>");
	q = Math.floor(Math.random() * videos.length);
	player = new YT.Player("player", {
		videoId: videos[q][0],
		events: {
			"onReady": onPlayerReady,
			"onStateChange": onPlayerStateChange,
			"onError": onPlayerError
		}
	});
};
function risposta() {
	gu = $("input[list=an]").val();
	if (gu == "")
		wn.html("Inserisci un titolo!");
	else {
		$("#q1").css("display", "none");
		$("#q2").remove();
		if (gu == videos[q][1]) {
			wn.html("Risposta esatta, è <b>" + gu + "</b>!");
			po++;
			res.push([gu, 1]);
		} else {
			wn.html("Risposta errata, è <b>" + videos[q][1] + "</b>...");
			res.push([videos[q][1], 0]);
		};
		timeout = false;
		player.seekTo(ts, true);
		player.playVideo();
		mb.append("<button type=\"button\" id=\"rn\" onclick=\"prosegui()\">Prosegui</button>");
	};
};
function riascolta() {
	nrepeats--;
	if (nrepeats == 0)
		$("#repeat").remove();
	player.seekTo(ts, true);
	player.playVideo();
};
function prosegui() {
	player.pauseVideo();
	timeout = true;
	$("#rn").remove();
	rc++;
	if (rc > rt) {
		mb.html("Partita terminata, hai totalizzato <b>" + po + "</b> punti su " + rt + "!</p><h2 id=\"moretitle\" onclick=\"piuinfo()\">Altre informazioni ▼</h2><ol id=\"morebox\"></ol><br/><button type=\"button\" onclick=\"rigioca()\">Rigioca!</button><br/><button type=\"button\" onclick=\"window.location.reload()\">Cambia impostazioni</button><div id=\"tooltip\"><button type=\"button\" onclick=\"copia('" + pl + "')\"><span id=\"tooltiptext\">Copiato!</span>🔗 Copia il link del gioco con questa playlist 🔗</button></div>");
		for (var i in res) {
			if (res[i][1])
				$("#morebox").append("<li class=\"right\">Hai indovinato <b>" + res[i][0] + "</b></li>");
			else
				$("#morebox").append("<li class=\"wrong\">Hai sbagliato <b>" + res[i][0] + "</b></li>");
		};
	} else {
		$("#rc").html(rc);
		$("input[list=an]").val("");
		$("#q1").css("display", "block");
		wn.empty();
		q = Math.floor(Math.random() * videos.length);
		player.cueVideoById(videos[q][0]);
	};
};
function chiamata(npt) {
	if (npt == "s") {
		$.ajax({
			url: "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=" + pl  + "&key=AIzaSyCB6USJyZV5cPmy51P0PGsF4ojvQ9_AydE",
			statusCode: {
				404: function () {
					wn.html("Playlist non trovata!");
				}
			},
			success: function (data) {
				rc = 1;
				po = 0;
				tries = 0;
				res = [];
				timeout = true;
				mb.html("<p><i>Turno <span id=\"rc\">1</span>/"+ rt +"</i></p><div id=\"q1\"><label>Qual è il titolo?</label><br/><input list=\"an\" type=\"text\"/><datalist id=\"an\"></datalist></div><br/><div id=\"player\"></div><p id=\"wn2\"></p>");
				an = $("#an");
				wn = $("#wn2");
				for (var i in data["items"]) {
					videos.push([data["items"][i]["snippet"]["resourceId"]["videoId"], data["items"][i]["snippet"]["title"]]);
					an.append("<option value=\"" + data["items"][i]["snippet"]["title"] + "\"/>");
				};
				chiamata(data["nextPageToken"]);
			}
		});
	} else if (npt != null) {
		$.ajax({
			url: "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=" + pl  + "&key=AIzaSyCB6USJyZV5cPmy51P0PGsF4ojvQ9_AydE&pageToken=" + npt,
			success: function (data) {
				for (var i in data["items"]) {
					videos.push([data["items"][i]["snippet"]["resourceId"]["videoId"], data["items"][i]["snippet"]["title"]]);
					an.append("<option value=\"" + data["items"][i]["snippet"]["title"] + "\"/>");
				};
				chiamata(data["nextPageToken"]);
			}
		});
	} else {
		q = Math.floor(Math.random() * videos.length);
		player = new YT.Player("player", {
			videoId: videos[q][0],
			events: {
				"onReady": onPlayerReady,
				"onStateChange": onPlayerStateChange,
				"onError": onPlayerError
			}
		});
	};
};
function gioca() {
	videos = [];
	pl = $("#pl").val();
	ss = $("input[name=ss]:checked").val();
	rt = $("#rt").val();
	wn = $("#wn");
	mb = $("#mb");
	if (pl.length == 0 || rt < 3 || rt > 50)
		wn.html("Parametri non validi!");
	else
		chiamata("s");
};
window.addEventListener("load", function () {
	var urlParams = new URLSearchParams(window.location.search);
	var querypl = urlParams.get("pl");
	if (querypl)
		$("#pl").val(querypl);
});