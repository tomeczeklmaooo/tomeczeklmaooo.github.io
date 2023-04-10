function Initialize()
{
	var core = "Asura";
	var core_version = "2.0-preview";
	var core_arch = "x86_64";
	var core_os = "windows64";

	document.getElementById("engine").innerHTML = `<pre>Built on ${core} ${core_version} (${core_arch}; ${core_os})</pre>`;
}