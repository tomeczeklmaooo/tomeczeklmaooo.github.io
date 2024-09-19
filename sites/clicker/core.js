var cvars = {
	// GAMEPLAY
	game: {
		clicks: 0,
		experience: 0,
		bread_pieces: 0,
		level: 1,
		level_multiplier: 1.2, // how much the required XP will go up with each level up
		powerup_limit: 10,
		autoclick: 0,
		autoclick_delay: 2
	},
	// GFX
	gfx: {
		prettymode: 1, // enable or disable animations and effects
		theme: 'themes.default' // change the theme
	},
	// SFX
	audio: {
		sound_pack: 'audio.default',
		master_volume: 1,
		sfx_volume: 1,
		music_volume: 1
	},
	// ANTI-CHEAT
	anticheat: {
		enabled: 0
	},
	// MISC
	timeout: 100
}

function webOnload()
{
	clkPrintCvars(false);
	clkDisplayData();
}

function clkPrintCvars(visible)
{
	if (visible) document.getElementById('cvars').style.display = 'block';

	document.getElementById("cvars").innerHTML = ``;
	document.getElementById("cvars").innerHTML += JSON.stringify(cvars, null, 4).replaceAll('"', '').replaceAll(',', '');

	setTimeout(clkPrintCvars, cvars.timeout); // refresh every .1 seconds
}

function clkDisplayData()
{
	document.getElementById('clicks').innerHTML = `Clicks:<br>${cvars.game.clicks}`;
	document.getElementById('experience').innerHTML = `Experience:<br>${cvars.game.experience}`;
	document.getElementById('bread_pieces').innerHTML = `Bread:<br>${cvars.game.bread_pieces}`;
	document.getElementById('level').innerHTML = `Level:<br>${cvars.game.level}`;

	setTimeout(clkDisplayData, cvars.timeout);
}

function randomint(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function clkClickHandler()
{
	cvars.game.clicks++;
	if ((cvars.game.clicks % 5) == 0)
	{
		cvars.game.experience += randomint(1, 6);
	}
	if (cvars.game.experience >= 100)
	{
		cvars.game.level++;
		cvars.game.experience = 0;
	}
}

// RESET FUNCTION - resets every cvar to its default value
function clkResetToDefault()
{
	cvars = {
		// GAMEPLAY
		game: {
			clicks: 0,
			experience: 0,
			bread_pieces: 0,
			level: 1,
			level_multiplier: 1.2, // how much the required XP will go up with each level up
			powerup_limit: 10,
			autoclick: 0,
			autoclick_delay: 2
		},
		// GFX
		gfx: {
			prettymode: 1, // enable or disable animations and effects
			theme: 'themes.default' // change the theme
		},
		// SFX
		audio: {
			sound_pack: 'audio.default',
			master_volume: 1,
			sfx_volume: 1,
			music_volume: 1
		},
		// ANTI-CHEAT
		anticheat: {
			enabled: 0
		},
		// MISC
		timeout: 100
	}
}