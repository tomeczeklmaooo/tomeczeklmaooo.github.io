var console_view, footer;

function init()
{
	console_view = document.getElementsByTagName('console-view')[0];
	footer = document.getElementsByTagName('footer')[0];
	footer.innerHTML = `version 0.1 [DESIGN_PREVIEW]`;
}

function random_msg()
{
	var types = ['ERROR', 'WARN', 'INFO', 'LOG'];
	var msgs = [
		'New device connected: MAC_ADDR -> IPv4_ADDR, setting name DEVICE_NAME',
		'Disabled custom DNS, using router defaults',
		'Enabled custom DNS, enforcing on all connected devices',
		'Removed Internet access from device DEVICE_NAME (IPv4_ADDR) during TIMESPAN',
		'Allowed Internet access to device DEVICE_NAME (IPv4_ADDR) during TIMESPAN',
		'Device DEVICE_NAME (IPv4_ADDR) tried to use the Internet, but couldn\'t due to set restrictions',
		'Couldn\'t estabilish connection to the Internet, retrying...',
	];
	var rand = Math.floor(Math.random() * 4);
	switch (rand)
	{
		case 0:
			push_msg(types[rand], msgs[6]);
			break;
		case 1:
			push_msg(types[rand], msgs[5]);
			break;
		case 2:
			push_msg(types[rand], msgs[Math.floor(Math.random() * 4) + 1]);
			break;
		case 3:
			push_msg(types[rand], msgs[0]);
			break;
	}
	setTimeout(random_msg, 1000);
}

function push_msg(_type, _msg)
{
	var console_msg = document.createElement('span');
	var date = new Date();
	var seconds = (date.getSeconds() < 10) ? `0${date.getSeconds()}` : date.getSeconds();
	var minutes = (date.getMinutes() < 10) ? `0${date.getMinutes()}` : date.getMinutes();
	var hours = (date.getHours() < 10) ? `0${date.getHours()}` : date.getHours();
	var day = (date.getDate() < 10) ? `0${date.getDate()}` : date.getDate();
	var month = (date.getMonth() + 1 < 10) ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
	var year = date.getFullYear();
	var formatted_time = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

	switch (_type)
	{
		case 'ERROR':
			prepare_msg(console_msg, `[${formatted_time}] <span style="color: #ff2014;">${_msg}</span>`);
			break;
		case 'WARN':
			prepare_msg(console_msg, `[${formatted_time}] <span style="color: #ffa447;">${_msg}</span>`);
			break;
		case 'INFO':
			prepare_msg(console_msg, `[${formatted_time}] <span style="color: #a2bffe;">${_msg}</span>`);
			break;
		case 'LOG':
			prepare_msg(console_msg, `[${formatted_time}] <span style="color: #eeedf0;">${_msg}</span>`);
			break;
	}
}

function prepare_msg(_elem, _msg)
{
	_elem.innerHTML += `${_msg}<br>`;
	console_view.appendChild(_elem);
	_elem.scrollIntoView();
}

window.onload = function()
{
	init();
	random_msg();
}