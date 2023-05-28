var global_vars = {};

var engine_strings = {
	slx_core: "Starlight",
	slx_core_version: "design_preview_rev.2",
	slx_core_architecture: "x86_64",
	slx_core_operating_system: "Windows NT 10.0"
};

function Initialize()
{
	engine_footer();
	engine_response_success();
	engine_response_warning();
	engine_response_error();
	engine_timestamp();
	engine_design_preview_version();
}

function engine_footer()
{
	document.getElementById("engine_footer").innerHTML = `<pre>Built on ${engine_strings.slx_core} ${engine_strings.slx_core_version} (${engine_strings.slx_core_architecture}; ${engine_strings.slx_core_operating_system})</pre>`;
}

function engine_response_success() {}

function engine_response_warning() {}

function engine_response_error() {}

function engine_timestamp() {}

function engine_design_preview_version()
{
	document.getElementById("design-preview-revision").innerHTML = `rev. 2`;
}