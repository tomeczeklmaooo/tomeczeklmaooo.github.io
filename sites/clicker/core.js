var cvars = {
	// GAMEPLAY
	game: {
		clicks: 0,
		experience: 0,
		experience_required: 100,
		experience_total: 0, // total amount of XP received, does not 
		bread_pieces: 0,
		bread_pieces_limit: 200,
		level: 1,
		level_multiplier: 2.4, // how much the required XP will go up with each level up
		powerup_limit: 10,
		powerups: {
			autoclick: 0,
			autoclick_delay: 2
		}
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

	document.getElementById('cvars').innerHTML = ``;
	document.getElementById('cvars').innerHTML += JSON.stringify(cvars, null, 4).replaceAll('"', '').replaceAll(',', '');

	setTimeout(clkPrintCvars, cvars.timeout); // refresh every .1 seconds
}

function clkDisplayData()
{
	var elClicks = document.getElementById('clicks');
	var elExperience = document.getElementById('experience');
	var elBread = document.getElementById('bread_pieces');
	var elLevel = document.getElementById('level');

	elClicks.innerHTML = `Clicks:<br>${cvars.game.clicks}`;
	elClicks.title = `Number of times you have clicked.`;

	elExperience.innerHTML = `Experience:<br>${cvars.game.experience}/${cvars.game.experience_required}`;
	elExperience.title = `Currently resets at 100; added on each click randomly from 1 to 6.`;

	elBread.innerHTML = `Bread:<br>${cvars.game.bread_pieces}`;
	elBread.title = `Added randomly from 0 to 2 on each click.`;

	elLevel.innerHTML = `Level:<br>${cvars.game.level}`;
	elLevel.title = `Your current level; this determines availability of powerups.`;

	setTimeout(clkDisplayData, cvars.timeout);
}

function randomint(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function clkClickHandler()
{
	cvars.game.clicks++;
	if ((cvars.game.clicks % 5) == 0)
	{
		cvars.game.experience += randomint(1, 6);
		if (cvars.game.bread_pieces < cvars.game.bread_pieces_limit)
		{
			cvars.game.bread_pieces += randomint(0, 2);
		} else { cvars.game.bread_pieces = cvars.game.bread_pieces_limit; }
	}
	if (cvars.game.experience >= cvars.game.experience_required)
	{
		cvars.game.level++;
		cvars.game.experience_total += cvars.game.experience;	
		cvars.game.experience = 0;
		cvars.game.experience_required = Math.floor(cvars.game.experience_required * cvars.game.level_multiplier);
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
			experience_required: 100,
			experience_total: 0, // total amount of XP received, does not 
			bread_pieces: 0,
			bread_pieces_limit: 200,
			level: 1,
			level_multiplier: 2.4, // how much the required XP will go up with each level up
			powerup_limit: 10,
			powerups: {
				autoclick: 0,
				autoclick_delay: 2
			}
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