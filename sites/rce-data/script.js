// PAGE LOADER
function onReady(callback) {
	var intervalID = window.setInterval(checkReady, 1000);
	function checkReady() {
		if (document.getElementsByTagName('body')[0] !== undefined) {
			window.clearInterval(intervalID);
			callback.call(this);
		}
	}
}
function show(id, value)
{
	document.getElementById(id).style.display = value ? 'flex' : 'none';
	document.getElementsByTagName('body')[0].style.margin = '8px';
}

onReady(function () {
	show('container', true);
	show('loader', false);
});

// HELPER FUNCTIONS
function get_current_date(type)
{
	const date = new Date();
	const year = lt10(date.getFullYear());
	const month = lt10(date.getMonth() + 1);
	const day = lt10(date.getDate());
	const hour = lt10(date.getHours());
	const minute = lt10(date.getMinutes());
	const second = lt10(date.getSeconds());

	if (type === 'fulldate') return year + '-' + month + '-' + day;
	if (type === 'fetched') return `Dane pobrane: ${day}.${month}.${year} ${hour}:${minute}:${second}`
}

function get_fetch_urls(date_fmt)
{
	const base_url_rce = 'https://apimpdv2-bmgdhhajexe8aade.a01.azurefd.net/api/rce-pln?$filter=business_date%20ge%20';
	const fetch_url_rce = base_url_rce + '%27' +  date_fmt + '%27' + '&$first=192&$select=period,rce_pln';
	const fetch_url_ts = 'https://api.thingspeak.com/channels/783677/status.json?results=128'
	return { fetch_url_rce, fetch_url_ts };
}

// lessthan10
function lt10(n) { if (n < 10) { n = '0' + n; } return n; }

const chart_opt = {
	chart: {
		type: 'line',
		backgroundColor: '#f6f6f9',
		borderColor: '#363949',
		borderRadius: 12,
		borderWidth: 0,
		style: { fontFamily: "IBM Plex Sans" }
	},
	xAxis: { categories: [] },
	yAxis: {
		title: { text: undefined },
		labels: { enabled: false },
		plotLines: [{ value: 0, width: 2, color: '#1e202394', zIndex: 5 }]
	},
	plotOptions: {
		line: { dataLabels: { enabled: true, format: '{y:.2f}' }, enableMouseTracking: true },
		series: { animation: { duration: 1200 } }
	},
	tooltip: { shared: true, crosshairs: true },
	series: [
		{ name: 'Sprzedaż', data: [], animation: { defer: 1200 } },
		{ name: 'Zakup', data: [], animation: { defer: 2500 }, color: "#ff2014", dashStyle: 'dash' }
	],
	accessibility: { enabled: false },
	credits: { enabled: false }
};

function create_chart_object(container, options, title)
{
	return Highcharts.chart(container, {
		chart: options.chart,
		title: { text: title },
		xAxis: options.xAxis,
		yAxis: options.yAxis,
		plotOptions: options.plotOptions,
		tooltip: options.tooltip,
		series: options.series,
		accessibility: options.accessibility,
		credits: options.credits
	});
}

const chart_today = create_chart_object('chart_today', chart_opt, 'Dzisiaj');
const chart_tomorrow = create_chart_object('chart_tomorrow', chart_opt, 'Jutro');

let table = "";

const x_axis_categories = [
	'00:00', '01:00', '02:00', '03:00', '04:00', '05:00',
	'06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
	'12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
	'18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
];

let data_prices_today_sell = [];
let data_prices_today_buy = [];
let data_prices_tomorrow_sell = [];
let data_prices_tomorrow_buy = [];
let data_buf = []; // buffer array

function api_get_price_data()
{
	const fulldate_rce = get_current_date('fulldate');
	const { fetch_url_rce, fetch_url_ts } = get_fetch_urls(fulldate_rce);
	console.log(`fulldate_rce: ${fulldate_rce}`);
	console.log(`fetch_url_rce: ${fetch_url_rce}`);
	console.log(`fetch_url_ts: ${fetch_url_ts}`);

	fetch(fetch_url_rce).then((res) => res.text()).then((rce_response) => { // RCE
		fetch(fetch_url_ts).then((res) => res.text()).then((thingspeak_response) => { // THINGSPEAK
			rce_response = JSON.parse(rce_response);
			thingspeak_response = JSON.parse(thingspeak_response);
			// var text_readable = JSON.stringify(thingspeak_response, undefined, 4);
			// document.body.appendChild(document.createElement('pre')).innerHTML = text_readable;
			let loop_limiter = 0;

			document.getElementById("header").innerHTML += get_current_date('fetched');
			table += `<thead>`;
			table += `<tr><th rowspan='2'>Godzina</th><th colspan='2'>Sprzedaż</th><th colspan='2'>Zakup</th></tr>`;
			table += `<tr><th>Dzisiaj</th><th>Jutro</th><th>Dzisiaj</th><th>Jutro</th></tr>`;
			table += `</thead>`;
			table += `<tbody>`;

			let rce_len = rce_response["value"].length;
			let ts_len = thingspeak_response["feeds"].length;
			console.log(`Received JSON objects in rce_response equal to ${rce_len}`);
			console.log(`Received JSON objects in thingspeak_response equal to ${ts_len}`);

			// calculate average price for each hour
			let hourly_prices = [];
			for (let i = 0; i < rce_len; i += 4)
			{
				let sum = 0;
				let count = 0;
				for (let j = i; j < i + 4 && j < rce_len; j++)
				{
					let price = parseFloat(rce_response["value"][j]["rce_pln"]);
					// if (price < 0) price = 0; // zamiana cen ujemnych na 0
					sum += price;
					count++;
				}
				let avg = sum / count;
				hourly_prices.push(parseFloat(avg.toFixed(2)));
			}
			console.log(`Hourly averages for RCE: ${hourly_prices}`);
			console.log(`Hourly averages for RCE (count): ${hourly_prices.length}`);

			// check if "status" field is null, if yes then continue, else put it in the array 'data_buf'
			for (let i = 0; i < ts_len; i++)
			{
				if (thingspeak_response["feeds"][i]["status"] == null || thingspeak_response["feeds"][i]["status"] == "Brak danych") { continue; }
				else
				{
					data_buf = thingspeak_response["feeds"][i]["status"].split(",");
				}
			}
			console.log(`Data points received from ThingSpeak: ${data_buf.length}`);

			// przygotowanie tablic z danymi
			for (let i = 0; i < 24; i++) {
				data_prices_today_sell.push(hourly_prices[i] ?? null);
				data_prices_today_buy.push(parseFloat(data_buf[i]) || null);
				data_prices_tomorrow_sell.push(hourly_prices[i + 24] ?? null);
				data_prices_tomorrow_buy.push(parseFloat(data_buf[i + 24]) || null);
			}

			// generowanie tabeli i wykresów
			for (let i = 0; i < 24; i++)
			{
				const hour_label = x_axis_categories[i];
				const today_sell = data_prices_today_sell[i];
				const tomorrow_sell = data_prices_tomorrow_sell[i];
				const today_buy = data_prices_today_buy[i];
				const tomorrow_buy = data_prices_tomorrow_buy[i];

				let row = `<tr><td>${hour_label}</td>`;
				
				// DZISIAJ SPRZEDAŻ
				if (today_sell == null) row += `<td class="empty-field">b/d</td>`;
				else if (today_sell <= 0) row += `<td class="negative-price">${today_sell.toFixed(2)}</td>`;
				else row += `<td>${today_sell.toFixed(2)}</td>`;

				// JUTRO SPRZEDAŻ
				if (tomorrow_sell == null) row += `<td class="empty-field">b/d</td>`;
				else if (tomorrow_sell <= 0) row += `<td class="negative-price">${tomorrow_sell.toFixed(2)}</td>`;
				else row += `<td>${tomorrow_sell.toFixed(2)}</td>`;
				
				// DZISIAJ ZAKUP
				if (today_buy == null) row += `<td class="empty-field">b/d</td>`;
				else if (today_buy <= 0) row += `<td class="negative-price-rcn">${today_buy.toFixed(2)}</td>`;
				else row += `<td>${today_buy.toFixed(2)}</td>`;

				// JUTRO ZAKUP
				if (tomorrow_buy == null) row += `<td class="empty-field">b/d</td>`;
				else if (tomorrow_buy <= 0) row += `<td class="negative-price-rcn">${tomorrow_buy.toFixed(2)}</td>`;
				else row += `<td>${tomorrow_buy.toFixed(2)}</td>`;

				row += `</tr>`;
				table += row;
			}

			table += `</tbody>`;
			document.getElementById('data').innerHTML = table;

			console.log(`Table generated from available data`);

			chart_today.xAxis[0].setCategories(x_axis_categories, false);
			chart_tomorrow.xAxis[0].setCategories(x_axis_categories, false);

			chart_today.series[0].setData(data_prices_today_sell, false);
			chart_today.series[1].setData(data_prices_today_buy, false);
			chart_tomorrow.series[0].setData(data_prices_tomorrow_sell, false);
			chart_tomorrow.series[1].setData(data_prices_tomorrow_buy, false);

			const does_tomorrow_sell_exist = data_prices_tomorrow_sell.some(v => v !== null);
			const does_tomorrow_buy_exist = data_prices_tomorrow_buy.some(v => v !== null);
			document.getElementById('chart_tomorrow').style.display = does_tomorrow_sell_exist || does_tomorrow_buy_exist ? 'block' : 'none';

			console.log(`Chart(s) generated from available data`);
			chart_today.redraw();
			chart_tomorrow.redraw();
		}).catch((e) => console.error(e)); // THINGSPEAK
	}).catch((e) => console.error(e)); // RCE
}
