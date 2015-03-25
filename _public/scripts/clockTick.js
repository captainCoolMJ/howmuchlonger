(function() {

	"use strict";

	function getCountdown(url, cb) {

		// var xmlhttp;
		
		// if (window.XMLHttpRequest) {
		// // code for IE7+, Firefox, Chrome, Opera, Safari
		// 	xmlhttp=new XMLHttpRequest();
		// } else {// code for IE6, IE5
		// 	xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		// }
		
		// xmlhttp.onreadystatechange=function() {
		// 	if (xmlhttp.readyState==4 && xmlhttp.status==200) {
		// 		var res = JSON.parse(xmlhttp.responseText);
		// 		cb.call(this, res);
		// 	}
		// };

		// xmlhttp.open("GET", url, true);
		// xmlhttp.send();

		var daysArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
			lastWeekdayPos = 5;

		function timeDiff( current, end ) {
			var t2 = end.getTime();
	        var t1 = current.getTime();

	        return t2-t1;
		}

		function setDate(now, daysLeft, time) {
			var end = new Date(now);

			end.setDate(now.getDate() + daysLeft);
			end.setHours(time.substr(0,2));
			end.setMinutes(time.substr(2,3));
			end.setSeconds(0);
			end.setMilliseconds(0);

			return end;
		}

		var now = new Date(),
			dayPos = now.getDay(),
			daysLeft = lastWeekdayPos - dayPos,
			daysSince = -1 * dayPos,
			weekstart = setDate(now, daysSince, "0830"),
			weekend = setDate(now, daysLeft, "1730");

		var resObj = {
			days : parseInt(timeDiff(now, weekend)/(24*60*60*1000)),
			hours : parseInt(timeDiff(now, weekend)/(60*60*1000)),
			minutes : parseInt(timeDiff(now, weekend)/(60*1000)),
			seconds : parseInt(timeDiff(now, weekend)/1000),
			ms : parseInt(timeDiff(now, weekend)),
			meta: {
				now: now.getTime(),
				start: weekstart.getTime(),
				end: weekend.getTime(),
				weekend: timeDiff(now, weekend) < 0
			}
		};

		cb.call(this, resObj);

	}

	function buildPercent( now, end, start ) {
		return Math.round(((now-start)/(end-start))*100000)/1000;
	}

	function determineS( num ) {
		return num !== 1 ? "s" : "";
	}

	function getStatusClass( percentVal ) {
		var statuses = ["horrible", "bad", "warning", "good", "great"],
			statusPos = Math.round((percentVal/100)*(statuses.length-1));

		console.log(statusPos, percentVal);

		return "color-" + statuses[statusPos];
	}

	var daysEl = document.getElementById("days"),
		hoursEl = document.getElementById("hours"),
		minutesEl = document.getElementById("minutes"),
		secondsEl = document.getElementById("seconds");

	var percentDone = document.getElementById("percentDone"),
	 	totalBar = document.getElementById("percentTotalBar"),
		sofarBar = document.getElementById("percentSofarBar");

	var timeObj = {
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0,
		now: 0,
		end: 0,
		start: 0
	};

	function tick( clock ) {
		clock.seconds--;

		clock.now++;

		if( clock.seconds < 0 ) {
			clock.seconds = 59;
			clock.minutes--;

			if( clock.minutes < 0 ) {
				clock.minutes = 59;
				clock.hours--;

				if( clock.hours < 0 ) {
					clock.hours = 23;						
					clock.days--;
				}
			}
		}

		seconds.innerHTML = clock.seconds + " second" + determineS(clock.seconds);
		minutes.innerHTML = clock.minutes + " minute" + determineS(clock.minutes);
		hours.innerHTML = clock.hours + " hour" + determineS(clock.hours);
		days.innerHTML = clock.days + " day" + determineS(clock.days);

		var percent = buildPercent(clock.now, clock.end, clock.start),
			status = getStatusClass(percent),
			bodyClasses = document.body.className.split(" ");

		sofarBar.style.width = percent + "%";
		percentDone.innerHTML = percent + "%";

		for( var i=0; i<bodyClasses.length; i++ ) {
			if( bodyClasses[i].indexOf("color") > -1 ) {
				bodyClasses.splice(i, 1);
				break;
			}
		}

		bodyClasses.push(status);
		document.body.className = bodyClasses.join(" ");

	}

	var initClock = function( clock ) {
		tick(clock);
		setInterval(function() {
			tick(clock);
		},1000);
	};

	// getCountdown("http://localhost:8080/api/countdown", function(res) {
	getCountdown("", function(res) {

		var clock = document.getElementById("clock"),
			clockClasses = clock.className.split(" ");
		
		clockClasses.push("loaded");
		clock.className = clockClasses.join(" ");

		if( res.meta.weekend ) {

			// tick(timeObj);

			seconds.innerHTML = timeObj.seconds + " second" + determineS(timeObj.seconds);
			minutes.innerHTML = timeObj.minutes + " minute" + determineS(timeObj.minutes);
			hours.innerHTML = timeObj.hours + " hour" + determineS(timeObj.hours);
			days.innerHTML = timeObj.days + " day" + determineS(timeObj.days);

			percentDone.innerHTML = "100%";
			sofarBar.style.width = "100%";
			document.body.className += " color-great";

			return false;
		}

		timeObj.days = res.days;
		timeObj.hours = res.hours%24;
		timeObj.minutes = res.minutes%60;
		timeObj.seconds = res.seconds%60;

		timeObj.now = parseInt(res.meta.now/1000);
		timeObj.end = parseInt(res.meta.end/1000);
		timeObj.start = parseInt(res.meta.start/1000);

		initClock( timeObj );

	});
	
})();