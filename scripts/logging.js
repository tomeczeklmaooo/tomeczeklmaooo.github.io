var color_red = "color: #ff0000;font-weight: 700;";
var color_green = "color: #00ff00;font-weight: 700;";
var color_blue = "color: #6aaffd;font-weight: 700;";
var color_yellow = "color: #ffde21;font-weight: 700;";
var color_orange = "color: #ffa500;font-weight: 700;";
var color_normal = "color: inherit;";

function lerror(message)
{
	console.log(`%c✕ %c${message}`, color_red, color_normal);
}
function lwarning(message)
{
	console.log(`%c! %c${message}`, color_orange, color_normal);
}
function lsuccess(message)
{
	console.log(`%c✓ %c${message}`, color_green, color_normal);
}
function linfo(message)
{
	console.log(`%cⓘ %c${message}`, color_blue, color_normal);
}
function llog(message)
{
	console.log(`%c📜 %c${message}`, color_yellow, color_normal);
}

// lerror("Error message here.");
// lwarning("Warning message here.");
// lsuccess("Success message here.");
// linfo("Info message here.");
// llog("Log message here.");

// console.log("   ");