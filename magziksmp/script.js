function Clock()
{
	var date = new Date();
	var day = date.getDate();
	var month = date.getMonth() + 1;
	var year = date.getFullYear();
	var hour = date.getHours();
	var minute = date.getMinutes();
	var second = date.getSeconds();

	if (day < 10) day = '0' + day;
	if (month < 10) month = '0' + month;
	if (hour < 10) hour = '0' + hour;
	if (minute < 10) minute = '0' + minute;
	if (second < 10) second = '0' + second;

	document.getElementById("datetime").innerHTML = `Dzisiaj jest ${day}/${month}/${year}, godzina ${hour}:${minute}:${second}`;

	setTimeout("Clock()", 1000);
}

function ShowModList()
{
	document.getElementById("content-container-df0").innerHTML = `
	<p>Mody wymagane do zainstalowania, aby dołączyć do serwera:</p>
	&bull;&ensp;3D Skin Layers<br>
	&bull;&ensp;AppleSkin<br>
	&bull;&ensp;MinecraftCapes<br>
	&bull;&ensp;Cardinal Components API<br>
	&bull;&ensp;Cloth Config<br>
	&bull;&ensp;Clumps<br>
	&bull;&ensp;Extra Origins<br>
	&bull;&ensp;Fabric API<br>
	&bull;&ensp;Lithium<br>
	&bull;&ensp;Mob Origins<br>
	&bull;&ensp;Origins<br>
	&bull;&ensp;Origins Plus<br>
	&bull;&ensp;PAL<br>
	&bull;&ensp;Pehkui<br>
	&bull;&ensp;Sodium<br>
	&bull;&ensp;Voicechat<br><br>
	<i>(Mody 3D Skin Layers, Minecraft Capes, Lithium oraz Sodium są opcjonalne)</i>
	`;
}

function ShowOriginsList()
{
	document.getElementById("content-container-df0").innerHTML = `
	<p class="origins-list-header-1">Lista originsów (alfabetycznie)</p>
	<p class="origins-list-header-2">Air Bender</p>
	
	<p class="origins-list-header-2">Arachnid</p>

	<p class="origins-list-header-2">Avian</p>
	
	<p class="origins-list-header-2">Bee</p>
	
	<p class="origins-list-header-2">Blazeborn</p>
	
	<p class="origins-list-header-2">Creeper</p>
	
	<p class="origins-list-header-2">Demon</p>
	
	<p class="origins-list-header-2">Drowned</p>
	
	<p class="origins-list-header-2">Dwarven</p>
	
	<p class="origins-list-header-2">Earth Bender</p>
	
	<p class="origins-list-header-2">Element Bender</p>
	
	<p class="origins-list-header-2">Elytrian</p>
	
	<p class="origins-list-header-2">Enderian</p>
	
	<p class="origins-list-header-2">Evoker</p>
	
	<p class="origins-list-header-2">Feline</p>
	
	<p class="origins-list-header-2">Fire Bender</p>
	
	<p class="origins-list-header-2">Floran</p>
	
	<p class="origins-list-header-2">Fox</p>
	
	<p class="origins-list-header-2">Guardian</p>
	
	<p class="origins-list-header-2">Human</p>
	
	<p class="origins-list-header-2">Inchling</p>
	
	<p class="origins-list-header-2">Merling</p>
	
	<p class="origins-list-header-2">Monke</p>
	
	<p class="origins-list-header-2">Phantom</p>
	
	<p class="origins-list-header-2">Piglin</p>
	
	<p class="origins-list-header-2">Shulk</p>
	
	<p class="origins-list-header-2">Slime</p>
	
	<p class="origins-list-header-2">Snow Golem</p>
	
	<p class="origins-list-header-2">Snowman</p>
	
	<p class="origins-list-header-2">Strider</p>
	
	<p class="origins-list-header-2">Titan Shifter</p>
	
	<p class="origins-list-header-2">Truffle</p>
	
	<p class="origins-list-header-2">Water Bender</p>

	<p class="origins-list-header-2">Witch</p>
	
	<p class="origins-list-header-2">Wolf</p>
	
	<p class="origins-list-header-2">Wyvern</p>
	
	<p class="origins-list-header-2">Zombiefied</p>
	
	<p class="origins-list-header-2">Random</p>
	`;
}

function JoinDiscordServer()
{
	window.location.href = "https://discord.gg/CXhzxe3Vv2";
}

function CopyServerIP()
{
	var text = "magziksmp.csrv.pl";
	navigator.clipboard.writeText(text).then(function() {
		console.log('Copied server IP to clipboard!');
	}, function(err) {
		console.error('Could not copy server IP: ', err);
	});
}

function ShowPlayerList()
{
	window.location.href = "#PLAYER-LIST";
}