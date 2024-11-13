async function init_functions()
{
	console.log("script.js loaded");
	var project_links = document.getElementsByTagName('x-project-link');
	project_links[0].addEventListener('click', function() { window.location.href = 'https://github.com/tomeczeklmaooo/yarpl/'; });
	var imgs = document.getElementsByTagName('img');
	for (var i = 0; i < imgs.length; i++)
	{
		imgs[i].style.animation = 'img_onload';
		imgs[i].style.animationDuration = '1s';
		imgs[i].style.animationTimingFunction = 'ease';
		imgs[i].style.opacity = 1;
		await sleep(100);
	}
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}