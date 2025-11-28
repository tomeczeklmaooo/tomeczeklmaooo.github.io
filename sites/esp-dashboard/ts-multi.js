let chart = null;
const chart_container = document.getElementById('chart-container');
let channels_loaded = 0;
let channel_keys = [
	{
		channel_number: 432818, name: 'Stacja pogodowa', key: 'XXXXXXXXXXXXXXXX',
		field_list:
		[
			{ field: 1, axis: 'O', suffix: 'l/m2', type: 'sum' },
			{ field: 2, axis: 'T', suffix: '°C',   type: 'average' },
			{ field: 3, axis: 'C', suffix: 'hPa',  type: 'average' },
			{ field: 4, axis: 'O', suffix: 'l',    type: 'sum' },
			{ field: 5, axis: 'T', suffix: '°C',   type: 'average' },
			{ field: 6, axis: 'O', suffix: '%',    type: 'average' },
			{ field: 7, axis: 'O', suffix: 'l',    type: 'sum' },
			{ field: 8, axis: 'T', suffix: 'l',    type: 'sum' },
		]
	},
	{
		channel_number: 864444, name: 'Vaillant EcoTec', key: 'XXXXXXXXXXXXXXXX',
		field_list:
		[
			{ field: 1, axis: 'T', suffix: '°C', type: 'average' },
			{ field: 2, axis: 'T', suffix: '°C', type: 'average' },
			{ field: 3, axis: 'T', suffix: '°C', type: 'average' },
			{ field: 4, axis: 'T', suffix: '°C', type: 'average' },
			{ field: 5, axis: 'T', suffix: '°C', type: 'average' },
			{ field: 6, axis: 'T', suffix: '°C', type: 'average' },
			{ field: 7, axis: 'O', suffix: 'm3', type: 'sum' },
			{ field: 8, axis: 'O', suffix: 'm3', type: 'sum' },
		]
	},
	{
		channel_number: 897438, name: 'Sum/Avg', key: 'XXXXXXXXXXXXXXXX',
		field_list:
		[
			{ field: 1, axis: 'T', suffix: '°C',   type: 'average' },
			{ field: 2, axis: 'O', suffix: 'l/m2', type: 'sum' },
			{ field: 3, axis: 'O', suffix: 'l',    type: 'sum' },
			{ field: 4, axis: 'O', suffix: 'l',    type: 'sum' },
			{ field: 5, axis: 'T', suffix: 'm3',   type: 'sum' },
			{ field: 7, axis: 'O', suffix: 'l/m2', type: 'sum' },
			{ field: 8, axis: 'T', suffix: '°C',   type: 'average' },
		]
	},
	{
		channel_number: 783677, name: 'Sum/Avg', key: 'XXXXXXXXXXXXXXXX',
		field_list:
		[
			{ field: 1, axis: 'O', suffix: 'kWh',  type: 'sum' },
			{ field: 2, axis: 'O', suffix: 'l',    type: 'sum' },
			{ field: 3, axis: 'T', suffix: '',     type: 'sum' },
			{ field: 4, axis: 'O', suffix: 'l/m2', type: 'sum' },
			{ field: 5, axis: 'O', suffix: 'm3',   type: 'sum' },
			{ field: 6, axis: 'T', suffix: 'm3',   type: 'sum' },
			{ field: 7, axis: 'O', suffix: 'l',    type: 'sum' },
			{ field: 8, axis: 'O', suffix: 'm3',   type: 'sum' },
		]
	}
];

const zone_offset = new Date().getTimezoneOffset();

function get_chart_date(date)
{
	return Date.parse(date) - zone_offset * 60000;
}

function hide_all()
{
	for (let i = 0; i < chart.series.length; i++)
	{
		if (chart.series[i].name == 'Navigator') continue;
		chart.series[i].hide();
	}
}

async function load_single_channel()
{
	const sel_channel_idx = document.getElementById('sel-channel').selectedIndex;
	const max_loads = parseInt(document.getElementById('sel-loads').value) || 5;

	await load_channel_history(
		sel_channel_idx,
		channel_keys[sel_channel_idx].channel_number,
		channel_keys[sel_channel_idx].key,
		channel_keys[sel_channel_idx].field_list,
		0,
		max_loads
	);
}

// possibly merge with load_channel_history()
async function load_thingspeak_channel(sent_channel_idx, channel_number, key, sent_field_list)
{
	const field_list = sent_field_list;
	const channel_idx = sent_channel_idx;

	try
	{
		const response = await fetch(`https://api.thingspeak.com/channels/${channel_number}/feed.json?offset=0&results=8000&key=${key}`);

		if (!response.ok)
		{
			throw new Error('Failed to fetch data from API');
		}

		const data = await response.json();

		if (data == "-1")
		{
			chart_container.innerHTML = `Kanał ${channel_number} nie jest ustawiony jako publiczny!`;
			console.error('Failed to load data from ThingSpeak');
		}

		for (let field_idx = 0; field_idx < field_list.length; field_idx++)
		{
			field_list[field_idx].data = [];
			for (let feed_idx = 0; feed_idx < data.feeds.length; feed_idx++)
			{
				let point = [];
				const field_string = `data.feeds[${feed_idx}].field${field_list[field_idx].field}`;
				const value = eval(field_string);
				point[0] = get_chart_date(data.feeds[feed_idx].created_at);
				point[1] = parseFloat(value);
				if (!isNaN(parseFloat(value)))
					field_list[field_idx].data.push(point);
			}

			field_list[field_idx].name = eval(`data.channel.field${field_list[field_idx].field}`);
		}

		console.log(`JSON field name at index 0: ${field_list[0].name}`);
		channel_keys[channel_idx].field_list = field_list;
		channel_keys[channel_idx].loaded = true;
		channels_loaded++;
		console.log(`channels_loaded: ${channels_loaded}`);
		console.log(`channel_idx: ${channel_idx}`);

		if (channels_loaded == channel_keys.length)
			await create_chart();
	}
	catch (error)
	{
		console.error(`Error: ${error}`);
	}
}

// possibly merge with load_thingspeak_channel()
async function load_channel_history(sent_channel_idx, channel_number, key, sent_field_list, sent_loads, max_loads)
{
	let loads_amount = sent_loads;
	const field_list = sent_field_list;
	const channel_idx = sent_channel_idx;

	const date_start = new Date();

	for (let i = 0; i < field_list.length; i++)
	{
		if (typeof field_list[i].data[0] != "undefined")
			date_start.setTime(field_list[i].data[0][0] + 7 * 60 * 60 * 1000);
	}

	const date_end = date_start.toJSON().replace('.000Z', 'Z');

	try
	{
		const response = await fetch(`https://api.thingspeak.com/channels/${channel_number}/feed.json?offset=0&start=2020-01-01T00:00:00Z&end=${date_end}&key=${key}`);

		if (!response.ok)
		{
			throw new Error('Failed to fetch data from API');
		}

		const data = await response.json();

		if (data == "-1")
		{
			chart_container.innerHTML = `Kanał ${channel_number} nie jest ustawiony jako publiczny!`;
			console.error('Failed to load data from ThingSpeak');
		}

		for (let field_idx = 0; field_idx < field_list.length; field_idx++)
		{
			for (let feed_idx = 0; feed_idx < data.feeds.length; feed_idx++)
			{
				let point = [];
				const field_string = `data.feeds[${feed_idx}].field${field_list[field_idx].field}`;
				const value = eval(field_string);
				point[0] = get_chart_date(data.feeds[feed_idx].created_at);
				point[1] = parseFloat(value);
				if (!isNaN(parseFloat(value)))
					field_list[field_idx].data.push(point);
			}

			field_list[field_idx].data.sort(
				function (a, b) {
					return a[0] - b[0];
				}
			);

			chart.series[field_list[field_idx].series].setData(field_list[field_idx].data, false);
		}

		channel_keys[channel_idx].field_list = field_list;
		chart.redraw();
		console.log(`channel_idx: ${channel_idx}`);

		//

		console.log(`date: ${date_end}`);
		console.log(`sent_channel_idx: ${channel_idx}`);
		console.log(`loads_amount: ${loads_amount}`);
		
		loads_amount++;
		if (loads_amount < max_loads)
			await load_channel_history(channel_idx, channel_number, key, field_list, loads_amount, max_loads);
	}
	catch (error)
	{
		console.error(`Error: ${error}`);
	}
}

const chart_options = {
	chart:
	{
		renderTo: 'chart-container',
		zoomType: 'x',
		events: { load: null },
		backgroundColor: null
	},
	rangeSelector:
	{
		buttons:
		[
			{ count: 30, type: 'minute', text: '30M' },
			{ count: 1, type: 'hour', text: '1H' },
			{ count: 2, type: 'hour', text: '2H' },
			{ count: 6, type: 'hour', text: '6H' },
			{ count: 12, type: 'hour', text: '12H' },
			{ count: 1, type: 'day', text: 'D' },
			{ count: 1, type: 'week', text: 'W' },
			{ count: 1, type: 'month', text: 'M' },
			{ count: 1, type: 'year', text: 'Y' },
			{ type: 'all', text: 'All' },
		],
		inputEnabled: true,
		selected: 1,
	},
	title: { text: "" },
	plotOptions:
	{
		line: { gapSize: 5 },
		series:
		{
			marker: { radius: 2 },
			animation: true,
			step: false,
			turboThreshold: 1000,
			borderWidth: 0
		}
	},
	tooltip: { xDateFormat: '%A, %b %e, %Y<br>%k:%M:%S' },
	xAxis:
	{
		type: 'datetime',
		ordinal: false,
		min: Date.UTC(2019, 9, 1),
		dateTimeLabelFormats: { hour: '%k', minute: '%k:%M' },
		title: { text: 'test' }
	},
	yAxis:
	[
		{
			labels: { format: '{value} °C', style: { color: '#000000' } },
			title: { text: 'Temperatura °C' },
			opposite: false,
			id: 'T'
		},
		{
			labels: { format: '{value}', style: { color: '#000000' } },
			title: { text: 'Inne' },
			opposite: true,
			id: 'O'
		},
		{
			labels: { format: '{value} hPa', style: { color: '#000000' } },
			title: { text: 'Ciśnienie hPa' },
			opposite: true,
			id: 'C'
		}
	],
	tooltip: { shared: true },
	exporting:
	{
		enabled: true,
		csv: { dateFormat: '%d/%m/%Y %I:%M:%S %p' }
	},
	legend: { enabled: true },
	navigator: { baseSeries: 1, series: { includeInCSVEsport: true } },
	accessibility: { enabled: false },
	credits: { enabled: false },
	series: []
};

// can be written in a more elegant way
async function create_chart()
{
	chart_options.chart.events.load = function()
	{
		setInterval(async function()
		{
			if (!document.getElementById("update").checked) return;

			for (let channel_idx = 0; channel_idx < channel_keys.length; channel_idx++)
			{
				try
				{
					const response = await fetch(`https://api.thingspeak.com/channels/${channel_keys[channel_idx].channel_number}/feed/last.json?offset=0&location=false&key=${channel_keys[channel_idx].key}`);

					if (!response.ok)
					{
						throw new Error('Failed to fetch data from API');
					}

					const data = await response.json();

					for (let field_idx = 0; field_idx < channel_keys[channel_idx].field_list.length; field_idx++)
					{
						const field_string = `data.field${channel_keys[channel_idx].field_list[field_idx].field}`;
						const chart_series_idx = channel_keys[channel_idx].field_list[field_idx].series;

						if (!data || !eval(field_string)) return;

						let point = [];
						const value = eval(field_string); // what is v?
						point[0] = get_chart_date(data.created_at);
						point[1] = parseFloat(value);

						if (chart.series[chart_series_idx].data.length <= 0) return;

						last_date = chart.series[chart_series_idx].data[chart.series[chart_series_idx].data.length - 1].x;

						let shift = false;

						if (!isNaN(parseFloat(value)) && point[0] != last_date)
							chart.series[chart_series_idx].addPoint(point, true, shift);
					}
				}
				catch (error)
				{
					console.error(`Error: ${error}`);
				}
			}
		}, 15000);
	};

	for (let channel_idx = 0; channel_idx < channel_keys.length; channel_idx++)
	{
		for (let field_idx = 0; field_idx < channel_keys[channel_idx].field_list.length; field_idx++)
		{
			console.log(`Channel index: ${channel_idx}; field index: ${field_idx}`);
			chart_options.series.push({
				data: channel_keys[channel_idx].field_list[field_idx].data,
				index: channel_keys[channel_idx].field_list[field_idx].series,
				yAxis: channel_keys[channel_idx].field_list[field_idx].axis,
				name: channel_keys[channel_idx].field_list[field_idx].name,
				tooltip:
				{
					valueSuffix: ` ${channel_keys[channel_idx].field_list[field_idx].suffix}`,
					valueDecimals: 3
				},
				dataGrouping:
				{
					enabled: true,
					approximation: channel_keys[channel_idx].field_list[field_idx].type
				}
			});
		}
	}

	chart_options.xAxis.title.text = "Date";

	chart = new Highcharts.StockChart(chart_options);

	for (let channel_idx = 0; channel_idx < channel_keys.length; channel_idx++)
	{
		for (let field_idx = 0; field_idx < channel_keys[channel_idx].field_list.length; field_idx++)
		{
			for (let series_idx = 0; series_idx < chart.series.length; series_idx++)
			{
				if (chart.series[series_idx].name == channel_keys[channel_idx].field_list[field_idx].name)
					channel_keys[channel_idx].field_list[field_idx].series = series_idx;
			}
		}
	}

	console.log(`Channels: ${channel_keys.length}`);

	for (let channel_idx = 0; channel_idx < channel_keys.length; channel_idx++)
	{
		console.log(`channel index: ${channel_idx}`);
		load_channel_history(
			channel_idx,
			channel_keys[channel_idx].channel_number,
			channel_keys[channel_idx].key,
			channel_keys[channel_idx].field_list,
			0,
			1
		);
	}
}

let chart_type = 'line';

function change_chart_type()
{
	if (chart_type == 'line')
	{
		chart_type = 'column';
		console.log(`Changing chart type to ${chart_type}`);
		for (let i = 0; i < chart.series.length; i++)
		{
			chart.series[i].update({ type: chart_type });
		}
	}
	else if (chart_type == 'column')
	{
		chart_type = 'line';
		console.log(`Changing chart type to ${chart_type}`);
		for (let i = 0; i < chart.series.length; i++)
		{
			chart.series[i].update({ type: chart_type });
		}
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const channel_menu = document.getElementById('sel-channel');
	for (let channel_idx = 0; channel_idx < channel_keys.length; channel_idx++)
	{
		console.log(`[${channel_idx}] Adding channel '${channel_keys[channel_idx].name}' to dropdown menu`);
		const menu_option = new Option(channel_keys[channel_idx].name, channel_idx);
		channel_menu.options.add(menu_option, channel_idx);
	}

	let series_counter = 0;
	for (let channel_idx = 0; channel_idx < channel_keys.length; channel_idx++)
	{
		for (let field_idx = 0; field_idx < channel_keys[channel_idx].field_list.length; field_idx++)
		{
			channel_keys[channel_idx].field_list[field_idx].series = series_counter;
			series_counter++;
		}
	}

	for (let channel_idx = 0; channel_idx < channel_keys.length; channel_idx++)
	{
		channel_keys[channel_idx].loaded = false;
		load_thingspeak_channel(
			channel_idx,
			channel_keys[channel_idx].channel_number,
			channel_keys[channel_idx].key,
			channel_keys[channel_idx].field_list
		);
	}
});
