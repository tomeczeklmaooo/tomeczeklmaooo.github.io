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
	chart: { type: 'line' },
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
			table += `<tr><th rowspan='2'>Godzina</th><th colspan='2'>Dzisiaj</th><th colspan='2'>Jutro</th></tr>`;
			table += `<tr><th>Sprzedaż</th><th>Zakup</th><th>Sprzedaż</th><th>Zakup</th></tr>`;
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
					if (price < 0) price = 0;
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

			// jeżeli w zwróconym JSON będzie więcej niż 96 elementów to 4 kolumny
			if (rce_len > 96 && data_buf.length > 24)
			{
				for (let i = 0; i < rce_len; i++)
				{
					if (rce_response["value"][i]["period"].substring(3, 5) == '45') // wypisywanie danych o cenie tylko raz z każdej godziny bo ta sama jest co 15 minut
					{
						table += `<tr><td>${rce_response["value"][i]["period"].substring(0, 5).replace("45", "00")}</td>`;
						
						// DZISIAJ SPRZEDAŻ
						table += `<td>${parseFloat(hourly_prices[loop_limiter])}</td>`;
						// if (rce_response["value"][i]["rce_pln"] <= 0)
						// {
						// 	table += `<td class="negative-price">${rce_response["value"][i]["rce_pln"].toFixed(2)}</td>`;
						// }
						// else
						// {
						// 	table += `<td>${rce_response["value"][i]["rce_pln"].toFixed(2)}</td>`;
						// }

						// DZISIAJ ZAKUP
						if (data_buf[loop_limiter] <= 0)
						{
							table += `<td class="negative-price-rcn">${parseFloat(data_buf[loop_limiter]).toFixed(2)}</td>`;
						}
						else
						{
							table += `<td>${parseFloat(data_buf[loop_limiter]).toFixed(2)}</td>`;
						}
						
						// JUTRO SPRZEDAŻ
						table += `<td>${parseFloat(hourly_prices[loop_limiter + 24])}</td>`;
						// if (rce_response["value"][i + 96]["rce_pln"] <= 0)
						// {
						// 	table += `<td class="negative-price">${rce_response["value"][i + 96]["rce_pln"].toFixed(2)}</td>`;
						// }
						// else
						// {
						// 	table += `<td>${rce_response["value"][i + 96]["rce_pln"].toFixed(2)}</td>`;
						// }

						// JUTRO ZAKUP
						if (data_buf[loop_limiter + 24] <= 0)
						{
							table += `<td class="negative-price-rcn">${parseFloat(data_buf[loop_limiter + 24]).toFixed(2)}</td>`;
						}
						else
						{
							table += `<td>${parseFloat(data_buf[loop_limiter + 24]).toFixed(2)}</td>`;
						}
						
						table += `</tr>`;

						// data_prices_today_sell.push(parseFloat(rce_response["value"][i]["rce_pln"]));
						data_prices_today_sell.push(parseFloat(hourly_prices[loop_limiter]));
						data_prices_today_buy.push(parseFloat(data_buf[loop_limiter]));
						// data_prices_tomorrow_sell.push(parseFloat(rce_response["value"][i + 96]["rce_pln"]));
						data_prices_tomorrow_sell.push(parseFloat(hourly_prices[loop_limiter + 24]));
						data_prices_tomorrow_buy.push(parseFloat(data_buf[loop_limiter + 24]));
						
						// limitowanie ilości pętli, bo jak w linku jest 'ge' to wtedy wyświetla się też północ dnia następnego
						loop_limiter += 1;
						if (loop_limiter == 24) { console.log(`✓ Successfully fetched price data for today (sell, buy), and for tomorrow (sell, buy)`); break; }
					}
				}

				document.getElementById("data").innerHTML = table;

				// pushing xAxis categories to chart (hours)
				chart_today.xAxis[0].setCategories(x_axis_categories, false);
				chart_tomorrow.xAxis[0].setCategories(x_axis_categories, false);

				// pushing arrays to charts
				chart_today.series[0].setData(data_prices_today_sell, false);
				chart_today.series[1].setData(data_prices_today_buy, false);
				chart_tomorrow.series[0].setData(data_prices_tomorrow_sell, false);
				chart_tomorrow.series[1].setData(data_prices_tomorrow_buy, false);

				document.getElementById("chart_tomorrow").style.display = 'block';

				console.log(`Data points - sell (today): ${data_prices_today_sell}`);
				console.log(`Data points - buy (today): ${data_prices_today_buy}`);
				console.log(`Data points - sell (tomorrow): ${data_prices_tomorrow_sell}`);
				console.log(`Data points - buy (tomorrow): ${data_prices_tomorrow_buy}`);

				chart_today.redraw();
				chart_tomorrow.redraw();
			}
			else if (rce_len > 96 && data_buf.length == 24) // to jeżeli nie będzie ceny zakupu na jutro jeszcze (3 kolumny)
			{
				console.warn(`Buy prices for tomorrow were not published yet.`);

				for (let i = 0; i < rce_len; i++)
				{
					if (rce_response["value"][i]["period"].substring(3, 5) == '45') // wypisywanie danych o cenie tylko raz z każdej godziny bo ta sama jest co 15 minut
					{
						table += `<tr><td>${rce_response["value"][i]["period"].substring(0, 5).replace("45", "00")}</td>`;
						
						// DZISIAJ SPRZEDAŻ
						table += `<td>${parseFloat(hourly_prices[loop_limiter])}</td>`;
						// if (rce_response["value"][i]["rce_pln"] <= 0)
						// {
						// 	table += `<td class="negative-price">${rce_response["value"][i]["rce_pln"].toFixed(2)}</td>`;
						// }
						// else
						// {
						// 	table += `<td>${rce_response["value"][i]["rce_pln"].toFixed(2)}</td>`;
						// }

						// DZISIAJ ZAKUP
						if (data_buf[loop_limiter] <= 0)
						{
							table += `<td class="negative-price-rcn">${parseFloat(data_buf[loop_limiter]).toFixed(2)}</td>`;
						}
						else
						{
							table += `<td>${parseFloat(data_buf[loop_limiter]).toFixed(2)}</td>`;
						}

						// JUTRO SPRZEDAŻ
						table += `<td>${parseFloat(hourly_prices[loop_limiter + 24])}</td>`;
						// if (rce_response["value"][i + 96]["rce_pln"] <= 0)
						// {
						// 	table += `<td class="negative-price">${rce_response["value"][i + 96]["rce_pln"].toFixed(2)}</td>`;
						// }
						// else
						// {
						// 	table += `<td>${rce_response["value"][i + 96]["rce_pln"].toFixed(2)}</td>`;
						// }

						table += `<td class="empty-field">b/d</td></tr>`;

						// data_prices_today_sell.push(parseFloat(rce_response["value"][i]["rce_pln"].toFixed(2)));
						data_prices_today_sell.push(parseFloat(hourly_prices[loop_limiter]));
						data_prices_today_buy.push(parseFloat(data_buf[loop_limiter]));
						// data_prices_tomorrow_sell.push(parseFloat(rce_response["value"][i + 96]["rce_pln"].toFixed(2)));
						data_prices_tomorrow_sell.push(parseFloat(hourly_prices[loop_limiter + 24]));
						
						// limitowanie ilości pętli, bo jak w linku jest 'ge' to wtedy wyświetla się też północ dnia następnego
						loop_limiter += 1;
						if (loop_limiter == 24) { console.log(`✓ Successfully fetched price data for today (sell, buy), and for tomorrow (sell)`); break; }
					}
				}

				document.getElementById("data").innerHTML = table;

				// pushing xAxis categories to chart (hours)
				chart_today.xAxis[0].setCategories(x_axis_categories, false);
				chart_tomorrow.xAxis[0].setCategories(x_axis_categories, false);

				// pushing arrays to charts
				chart_today.series[0].setData(data_prices_today_sell, false);
				chart_today.series[1].setData(data_prices_today_buy, false);
				chart_tomorrow.series[0].setData(data_prices_tomorrow_sell, false);

				document.getElementById("chart_tomorrow").style.display = 'block';

				console.log(`Data points - sell (today): ${data_prices_today_sell}`);
				console.log(`Data points - buy (today): ${data_prices_today_buy}`);
				console.log(`Data points - sell (tomorrow): ${data_prices_tomorrow_sell}`);

				chart_today.redraw();
				chart_tomorrow.redraw();
			}
			else // to jeżeli nie będzie ceny sprzedaży i zakupu na jutro jeszcze (2 kolumny)
			{
				console.warn(`Sell and buy prices for tomorrow were not published yet.`);

				for (let i = 0; i < rce_len; i++)
				{
					if (rce_response["value"][i]["period"].substring(3, 5) == '45') // wypisywanie danych o cenie tylko raz z każdej godziny bo ta sama jest co 15 minut
					{
						table += `<tr><td>${rce_response["value"][i]["period"].substring(0, 5).replace("45", "00")}</td>`;
						
						// DZISIAJ SPRZEDAŻ
						table += `<td>${parseFloat(hourly_prices[loop_limiter]).toFixed(2)}</td>`;
						// if (rce_response["value"][i]["rce_pln"] <= 0)
						// {
						// 	table += `<td class="negative-price">${rce_response["value"][i]["rce_pln"].toFixed(2)}</td>`;
						// }
						// else
						// {
						// 	table += `<td>${rce_response["value"][i]["rce_pln"].toFixed(2)}</td>`;
						// }

						// DZISIAJ ZAKUP
						if (data_buf[loop_limiter] <= 0)
						{
							table += `<td class="negative-price-rcn">${parseFloat(data_buf[loop_limiter]).toFixed(2)}</td>`;
						}
						else
						{
							table += `<td>${parseFloat(data_buf[loop_limiter]).toFixed(2)}</td>`;
						}

						table += `<td class="empty-field">b/d</td><td class="empty-field">b/d</td></tr>`;

						// data_prices_today_sell.push(parseFloat(rce_response["value"][i]["rce_pln"].toFixed(2)));
						data_prices_today_sell.push(parseFloat(hourly_prices[loop_limiter]));
						data_prices_today_buy.push(parseFloat(data_buf[loop_limiter]));
						
						// limitowanie ilości pętli, bo jak w linku jest 'ge' to wtedy wyświetla się też północ dnia następnego
						loop_limiter += 1;
						if (loop_limiter == 24) { console.log(`✓ Successfully fetched price data for today (sell, buy)`); break; }
					}
				}

				table += `</tbody>`;
				document.getElementById("data").innerHTML = table;

				// pushing xAxis categories to chart (hours)
				chart_today.xAxis[0].setCategories(x_axis_categories, false);
				chart_tomorrow.xAxis[0].setCategories(x_axis_categories, false);

				// pushing arrays to charts
				chart_today.series[0].setData(data_prices_today_sell, false);
				chart_today.series[1].setData(data_prices_today_buy, false);

				document.getElementById("chart_tomorrow").style.display = 'none';

				console.log(`Data points - sell (today): ${data_prices_today_sell}`);
				console.log(`Data points - buy (today): ${data_prices_today_buy}`);

				chart_today.redraw();
				chart_tomorrow.redraw();
			}
		}).catch((e) => console.error(e)); // THINGSPEAK
	}).catch((e) => console.error(e)); // RCE
}
