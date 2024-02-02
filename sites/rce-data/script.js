// var baseURL = 'https://www.pse.pl/getcsv/-/export/csv/PL_CENY_RYN_EN/data/';
// function getCurrentCSVData()
// {
// 	document.body.style.whiteSpace = "pre";
// 	var date = new Date();
// 	var year = date.getFullYear();
// 	var month = date.getMonth() + 1
// 	var day = date.getDate();
// 	var hour = date.getHours();
// 	if (month < 10) month = '0' + month;
// 	if (day < 10) day = '0' + day;
// 	var fulldate = year + month + day; // no spaces
// 	var csvURL_with_CORS_proxy =  'https://corsproxy.io/?' + encodeURIComponent(baseURL + fulldate);
// 	fetch(csvURL_with_CORS_proxy).then((res) => res.text()).then((text) => {
// 		var text_modified = text.replace(/[\r\n\x0B\x0C\u0085\u2028\u2029]+/g, '\n');
// 		console.log(text_modified);
// 		document.write(text_modified);
// 	}).catch((e) => console.error(e));
// 	setInterval('getCurrentCSVData', 300000); // 5 minute interval for refresh
// }