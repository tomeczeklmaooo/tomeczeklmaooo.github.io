function initialize_functions()
{
	console.log("script.js loaded")
}

function changecontainer(container_id)
{
	if (container_id == 0)
	{
		document.getElementById("main").style.display = 'block';
		document.getElementById("education-subcontainer").style.display = 'none';
		document.getElementById("projects-subcontainer").style.display = 'none';
		document.getElementById("skills-subcontainer").style.display = 'none';
		document.getElementById("esports-subcontainer").style.display = 'none';
		document.getElementById("links-subcontainer").style.display = 'none';
	}
	else if (container_id == 1)
	{
		document.getElementById("main").style.display = 'none';
		document.getElementById("education-subcontainer").style.display = 'block';
		document.getElementById("projects-subcontainer").style.display = 'none';
		document.getElementById("skills-subcontainer").style.display = 'none';
		document.getElementById("esports-subcontainer").style.display = 'none';
		document.getElementById("links-subcontainer").style.display = 'none';
	}
	else if (container_id == 2)
	{
		document.getElementById("main").style.display = 'none';
		document.getElementById("education-subcontainer").style.display = 'none';
		document.getElementById("projects-subcontainer").style.display = 'block';
		document.getElementById("skills-subcontainer").style.display = 'none';
		document.getElementById("esports-subcontainer").style.display = 'none';
		document.getElementById("links-subcontainer").style.display = 'none';
	}
	else if (container_id == 3)
	{
		document.getElementById("main").style.display = 'none';
		document.getElementById("education-subcontainer").style.display = 'none';
		document.getElementById("projects-subcontainer").style.display = 'none';
		document.getElementById("skills-subcontainer").style.display = 'block';
		document.getElementById("esports-subcontainer").style.display = 'none';
		document.getElementById("links-subcontainer").style.display = 'none';
	}
	else if (container_id == 4)
	{
		document.getElementById("main").style.display = 'none';
		document.getElementById("education-subcontainer").style.display = 'none';
		document.getElementById("projects-subcontainer").style.display = 'none';
		document.getElementById("skills-subcontainer").style.display = 'none';
		document.getElementById("esports-subcontainer").style.display = 'block';
		document.getElementById("links-subcontainer").style.display = 'none';
	}
	else if (container_id == 5)
	{
		document.getElementById("main").style.display = 'none';
		document.getElementById("education-subcontainer").style.display = 'none';
		document.getElementById("projects-subcontainer").style.display = 'none';
		document.getElementById("skills-subcontainer").style.display = 'none';
		document.getElementById("esports-subcontainer").style.display = 'none';
		document.getElementById("links-subcontainer").style.display = 'block';
	}
}

var broadcast_seasons = {
	winter_2023: 'TP Major 2023',
	summer_2024: 'Falcon League 4',
	winter_2024: 'TBD',
	summer_2025: 'TBD',
	winter_2025: 'TBD'
};

// displaying for how long I have been in a team
function player_team()
{
	var now = new Date();
	var team_joined_date = new Date("2023-02-27T20:12:00");
	var day = 1000 * 60 * 60 * 24; // one day length in milliseconds
	var difference_time = now.getTime() - team_joined_date.getTime();
	var difference_days = Math.round(difference_time / day);
	document.getElementById("player-team").innerHTML = `<b>Current CS2 team:</b> Descent E-Sports (joined 27/02/2023, ${difference_days} days ago)`;
	setTimeout("player_team()", 1000);
}