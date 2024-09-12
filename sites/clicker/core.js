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
	}
}

function clkPrintCvars()
{
	document.getElementById("cvars").innerHTML  = `Game Configuration Variables:<br>`;
	document.getElementById("cvars").innerHTML += `Clicks: ${cvars.game.clicks}<br>`;
	document.getElementById("cvars").innerHTML += `Experience: ${cvars.game.experience}<br>`;
	document.getElementById("cvars").innerHTML += `Bread Pieces: ${cvars.game.bread_pieces}<br>`;
	document.getElementById("cvars").innerHTML += `Level: ${cvars.game.level}<br>`;
	document.getElementById("cvars").innerHTML += `Level Multiplier: ${cvars.game.level_multiplier}<br>`;
	document.getElementById("cvars").innerHTML += `Powerup Limit: ${cvars.game.powerup_limit}<br>`;
	document.getElementById("cvars").innerHTML += `Autoclick: ${cvars.game.autoclick}<br>`;
	document.getElementById("cvars").innerHTML += `Autoclick Delay: ${cvars.game.autoclick_delay}<br>`;
	
	document.getElementById("cvars").innerHTML += `<br>Graphics Configuration Variables:<br>`;
	document.getElementById("cvars").innerHTML += `Pretty Mode: ${cvars.gfx.prettymode}<br>`;
	document.getElementById("cvars").innerHTML += `Theme: ${cvars.gfx.theme}<br>`;

	document.getElementById("cvars").innerHTML += `<br>Audio Configuration Variables:<br>`;
	document.getElementById("cvars").innerHTML += `Sound Pack: ${cvars.audio.sound_pack}<br>`;
	document.getElementById("cvars").innerHTML += `Master Volume: ${cvars.audio.master_volume}<br>`;
	document.getElementById("cvars").innerHTML += `SFX Volume: ${cvars.audio.sfx_volume}<br>`;
	document.getElementById("cvars").innerHTML += `Music Volume: ${cvars.audio.music_volume}<br>`;

	document.getElementById("cvars").innerHTML += `<br>Anti-Cheat Configuration Variables:<br>`;
	document.getElementById("cvars").innerHTML += `Enabled: ${cvars.anticheat.enabled}<br>`;

	setTimeout(clkPrintCvars, '100'); // refresh every .1 seconds
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
			enabled: 1
		}
	}
}