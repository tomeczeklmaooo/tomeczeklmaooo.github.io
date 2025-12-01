(function()
{
	const target = 'https://toaster000.codeberg.page';
	const redirected_url = target + window.location.pathname + window.location.search + window.location.hash;
	window.location.replace(redirected_url);
})();
