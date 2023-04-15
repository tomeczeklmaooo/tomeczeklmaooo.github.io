function Initialize()
{
	engine_footer();
	engine_response_success();
	engine_response_warning();
	engine_response_error();
	engine_timestamp();
}

function engine_footer()
{
	document.getElementById("engine_footer").innerHTML = `<pre>Built on slx_core slx_core_version (slx_core_architecture; slx_core_operating_system)</pre>`;
}