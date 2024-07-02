function webInitializeFunctionsOnload()
{
	console.log("script.js loaded")
}

// I think this way of changing content on a simple website like this one is the best of the ones I've tried so far
// but it could be better...
// still better than godzio01
function webChangeContainerContent(idx)
{
	var main = document.getElementById("main");
	if (idx == 0)
	{
		main.innerHTML = `
			<header class="section-header">About</header>
			<span class="section-content-text">
				I am a 4th grade IT student from Poland, and very passionate about computers and e-sports. I put my CS2 skills to test in a lot of tournaments (how they went is a whole different story).<br><br>
				My IT skills include:<br>
				&bull; Windows CMD<br>
				&bull; HTML<br>
				&bull; CSS<br>
				&bull; JavaScript<br>
				&bull; a slight amount of C/C++<br>
				&bull; and a little bit of Linux Terminal<br><br>
				Oh yeah, and I also love cats.
			</span>
		`;
	}
	else if (idx == 1)
	{
		main.innerHTML = `
			<header class="section-header">Education</header>
			<table>
				<tr>
					<th>Schools</th>
					<th>Qualifications</th>
					<th>Languages</th>
				</tr>
				<tr>
					<td>ZST Tarnowo Podgórne (2021 &mdash; now)</td>
					<td>INF.02</td>
					<td>Polish [native]</td>
				</tr>
				<tr>
					<td>&nbsp;</td>
					<td>&nbsp;</td>
					<td>English [B2+]</td>
				</tr>
				<tr>
					<td>&nbsp;</td>
					<td>&nbsp;</td>
					<td>German [A2]</td>
				</tr>
			</table>
			<span class="section-content-text-sub prevent-select">
				I am a very educated person yes.
			</span>
		`;
	}
	else if (idx == 2)
	{
		main.innerHTML = `
			<header class="section-header">Projects</header>
			<table>
				<tr>
					<td>rce-data</td>
					<td><div class="button prevent-select" onclick="window.location.href='https://tomeczeklmaooo.github.io/sites/rce-data/daily/'">Project site</div></td>
				</tr>
				<tr>
					<td>Project Copiec</td>
					<td><div class="button-inactive prevent-select" onclick="">Project site</div></td>
				</tr>
			</table>
			<span class="section-content-text-sub prevent-select">
				Not much to show here anyway.
			</span>
		`;
	}
	else if (idx == 3)
	{
		main.innerHTML = `
			<header class="section-header">CS2 Settings</header>
			<table>
				<tr>
					<td>CS2 Settings</td>
					<td><div class="button prevent-select" onclick="window.location.href='https://settings.gg/player/462497785'">settings.gg</div></td>
				</tr>
				<tr>
					<td>CS2 autoexec.cfg</td>
					<td><div class="button prevent-select" onclick="window.location.href='https://github.com/tomeczeklmaooo/tomeczeklmaooo.github.io/blob/main/configs/autoexec.cfg'">View on GitHub</div></td>
				</tr>
			</table>
			<span class="section-content-text-sub prevent-select">
				I try to update my CS2 settings every once in a while along with the autoexec.cfg.
			</span>
		`;
	}
	else if (idx == 4)
	{
		main.innerHTML = `
			<header class="section-header">Contact</header>
			<table>
				<tr>
					<td><i class="fa-brands fa-instagram"></i> Instagram</td>
					<td><div class="button prevent-select" onclick="window.location.href='https://www.instagram.com/toastercs_/'">instagram.com</div></td>
				</tr>
				<tr>
					<td><i class="fa-brands fa-discord"></i> Discord</td>
					<td><div class="button-not-clickable prevent-select" onclick="">toaster000_</div></td>
				</tr>
				<tr>
					<td><i class="fa-brands fa-steam"></i> Steam</td>
					<td><div class="button prevent-select" onclick="window.location.href='https://steamcommunity.com/id/toaster000/'">steamcommunity.com</div></td>
				</tr>
				<tr>
					<td><i class="fa-brands fa-github"></i> GitHub</td>
					<td><div class="button prevent-select" onclick="window.location.href='https://github.com/tomeczeklmaooo'">github.com</div></td>
				</tr>
			</table>
			<span class="section-content-text-sub prevent-select">
				All of them redirect to my personal accounts.
			</span>
		`;
	}
}