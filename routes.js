module.exports = function( router ) {

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

	router.get("/", function( req, res ) {
		res.json({ message: "404 Not Found" });
	});
	
	router.get("/countdown", function( req, res ){
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

		res.json(resObj);
	});

	router.get("/countdown/:timeParam", function( req, res ){
		var now = new Date(),
			dayPos = now.getDay(),
			daysLeft = lastWeekdayPos - dayPos,
			daysSince = -1 * dayPos,
			weekstart = setDate(now, daysSince, "0830"),
			weekend = setDate(now, daysLeft, "1730");

		var resObj = {
			meta: {
				now: now.getTime(),
				start: weekstart.getTime(),
				end: weekend.getTime(),
				weekend: timeDiff(now, weekend) < 0
			}
		};

		switch( req.params.timeParam ) {
			case "days":
				resObj.days = parseInt(timeDiff(now, weekend)/(24*60*60*1000));
				break;
			case "hours":
				resObj.hours = parseInt(timeDiff(now, weekend)/(60*60*1000));
				break;
			case "minutes":
				resObj.minutes = parseInt(timeDiff(now, weekend)/(60*1000));
				break;
			case "seconds":
				resObj.seconds = parseInt(timeDiff(now, weekend)/1000);
				break;
			case "ms":
				resObj.ms = parseInt(timeDiff(now, weekend));
				break;
			default: 
				resObj = { err: "ERROR" };
		}

		res.json(resObj);
	});

	// router.get("/elapsed/seconds", function( req, res ) {
	// 	var now = new Date(),
	// 		dayPos = now.getDay(),
	// 		daysLeft = lastWeekdayPos - dayPos,
	// 		daysSince = -1 * dayPos,
	// 		weekstart = setDate(now, daysSince, "0830"),
	// 		weekend = setDate(now, daysLeft, "1730");

	// 	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
	// 	res.setHeader('Access-Control-Allow-Origin', req.headers.origin);

	// 	res.json({
	// 		seconds: parseInt(timeDiff(now, weekstart)/1000),
	// 		meta: {
	// 			now: now.getTime(),
	// 			start: weekstart.getTime(),
	// 			end: weekend.getTime()
	// 		}
	// 	});
	// });

};