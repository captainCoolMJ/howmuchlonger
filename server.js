var express = require("express");
var app = express();
var http = require("http").Server(app);
var router = express.Router();
var port = process.env.PORT || 8080;

require("./routes")(router);

app.use("/api", router);
app.use(express.static(__dirname + "/_public"));
app.get("*", function( req, res ) {
	res.redirect("/");
});

http.listen(port, function() {
	console.log("Brought to you by port", port);
});