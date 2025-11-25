const chart_container = document.getElementById('chart-container');
let channels_loaded = 0;
let channel_keys = [
	{
		channel_number: 432818, name: null, field_list: null
	},
	{
		channel_number: 864444, name: null, field_list: null
	},
	{
		channel_number: 897438, name: null, field_list: null
	},
	{
		channel_number: 783677, name: null, field_list: null
	}
];

const url = {
	base: 'https://thingspeak.mathworks.com/channels/',
	colors: { bg: '#ffffff', fg: '#d62020' },
	type: 'column',
	title: 'pusty wykres',
	dim: { width: 0, height: 0 },
	range: { start: '2025-10-31 00:00:00', end: '2025-10-31 00:00:00' },
	operation: { type: 'sum', value: 60 }
};

async function get_channel_info(channel_number, selected_idx)
{
	try
	{
		const response = await fetch(`https://api.thingspeak.com/channels/${channel_number}/feed.json?results=0`);

		if (!response.ok)
		{
			throw new Error('Failed to fetch channel information');
		}

		const data = await response.json();

		if (data == '-1')
		{
			console.error('Failed to load data from ThingSpeak, returned -1');
		}

		let channel_object = { channel_number: channel_number, name: data.channel.name, field_list: [] };
		let fields = [];

		for (let i = 1; i <= 8; i++)
		{
			const field_key = `field${i}`;
			if (data.channel[field_key])
			{
				console.log(`field number: ${i} // field name: ${data.channel[field_key]}`);
				fields.push({ field: i, name: data.channel[field_key]});
			}
		}

		channel_object.field_list = fields;

		return channel_object;
	}
	catch (error)
	{
		console.error(`Error: ${error}`);
	}
}

function format_date(type, date)
{
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');

	if (type == 's') return `${year}-${month}-${day} 00:00:00`;
	if (type == 'e') return `${year}-${month}-${day} 23:59:59`;
}

const channel_menu = document.getElementById('channel');
const field_menu = document.getElementById('field');
const type_menu = document.getElementById('type');
const date_sel_start = document.getElementById('date_start');
const date_sel_end = document.getElementById('date_end');
const chart_type_menu = document.getElementById('chart_type');
const get_chart_btn = document.getElementById('get_chart');

let encoded_url = null;

let iframe_width = `${window.innerWidth}px`;
let iframe_height = `${window.innerHeight - 150}px`;

let selected_idx = 0;

function load_field_names()
{
	for (let i = 0; i < channel_keys[selected_idx].field_list.length; i++)
	{
		const field_menu_opt = new Option(channel_keys[selected_idx].field_list[i].name, channel_keys[selected_idx].field_list[i].field, (i == 0) ? true : false);
		field_menu.options.add(field_menu_opt, i);
	}
}

document.addEventListener('DOMContentLoaded', async () => {
	chart_container.style.width = iframe_width;
	chart_container.style.height = iframe_height;

	encoded_url = `${url.base}${channel_keys[0].channel_number}/charts/1?bgcolor=${encodeURIComponent(url.colors.bg)}&color=${encodeURIComponent(url.colors.fg)}&start=${encodeURIComponent(url.range.start)}&end=${encodeURIComponent(url.range.end)}&${url.operation.type}=${url.operation.value}&title=${encodeURIComponent(url.title)}&type=${url.type}&width=${iframe_width.substring(0, iframe_width.length - 2)}&height=${iframe_height.substring(0, iframe_height.length - 2)}`;

	chart_container.src = encoded_url;

	for (let channel_idx = 0; channel_idx < channel_keys.length; channel_idx++)
	{
		channel_keys[channel_idx] = await get_channel_info(channel_keys[channel_idx].channel_number, channel_idx);
		console.log(`Adding channel '${channel_keys[channel_idx].name}' to dropdown menu`);
		const channel_menu_opt = new Option(channel_keys[channel_idx].name, channel_idx, (channel_idx == 0) ? true : false);
		channel_menu.options.add(channel_menu_opt, channel_idx);
	}

	load_field_names();
});

// wacky stuff
const en_pl_translations = [];
en_pl_translations['none'] = 'Brak operacji';
en_pl_translations['sum'] = 'Suma';
en_pl_translations['average'] = 'Średnia';
en_pl_translations['median'] = 'Mediana';
en_pl_translations['min'] = 'Min';
en_pl_translations['max'] = 'Max';

const allowed_minute_values = [10, 15, 20, 30, 60, 240, 720, 1440];

function clamp_minutes(val)
{
	return allowed_minute_values.reduce((a, b) => Math.abs(b - val) < Math.abs(a - val) ? b : a);
}

channel_menu.addEventListener('change', async () => {
	selected_idx = document.getElementById('channel').selectedIndex;
	field_menu.innerHTML = '';
	load_field_names();
});

type_menu.addEventListener('change', () => {
	if (type_menu.value == 'sum' || type_menu.value == 'average' || type_menu.value == 'median')
	{
		document.getElementById('timeframe').style.display = 'inline';
		document.getElementById('minmax').style.display = 'none';
	}
	else if (type_menu.value == 'min' || type_menu.value == 'max')
	{
		document.getElementById('timeframe').style.display = 'none';
		document.getElementById('minmax').style.display = 'inline';
	}
	else
	{
		document.getElementById('timeframe').style.display = 'none';
		document.getElementById('minmax').style.display = 'none';
	}
});

get_chart_btn.addEventListener('click', () => {
	let selected_channel = channel_keys[channel_menu.selectedIndex].channel_number;
	let selected_channel_name = channel_keys[channel_menu.selectedIndex].name;
	console.log(`Selected channel: ${selected_channel} -> ${selected_channel_name}`);

	let selected_field = field_menu.value;
	let selected_field_name = channel_keys[channel_menu.selectedIndex].field_list[field_menu.selectedIndex].name;
	console.log(`Selected field: ${selected_field} -> ${selected_field_name}`);

	let selected_type = type_menu.value;
	console.log(`Selected type: ${selected_type}`);

	let selected_date_start = (date_sel_start.value) ? `${date_sel_start.value}:00` : format_date('s', new Date());
	selected_date_start = selected_date_start.replace('T', ' ');
	console.log(`Selected start date: ${selected_date_start}`);

	let selected_date_end = (date_sel_end.value) ? `${date_sel_end.value}:59` : format_date('e', new Date());
	selected_date_end = selected_date_end.replace('T', ' ');
	console.log(`Selected end date: ${selected_date_end}`);
	
	let operation_value = Math.round((new Date(selected_date_end) - new Date(selected_date_start)) / 60000);
	operation_value = clamp_minutes(operation_value);
	console.log(`Minutes between selected dates: ${operation_value}`);

	if (type_menu.value == 'sum' || type_menu.value == 'average' || type_menu.value == 'median')
	{
		operation_value = parseInt(document.getElementById('timeframe_val').value);
	}
	else if (selected_type == 'min' || selected_type == 'max')
	{
		operation_value = parseInt(document.getElementById('min_max_val').value);
	}

	let selected_chart_type = chart_type_menu.value;

	encoded_url = `${url.base}${selected_channel}/charts/${selected_field}?bgcolor=${encodeURIComponent(url.colors.bg)}&color=${encodeURIComponent(url.colors.fg)}&start=${encodeURIComponent(selected_date_start)}&end=${encodeURIComponent(selected_date_end)}&title=${encodeURIComponent(`${en_pl_translations[selected_type]} z ${selected_field_name} (${selected_date_start} - ${selected_date_end})`)}&type=${selected_chart_type}&width=${iframe_width.substring(0, iframe_width.length - 2)}&height=${iframe_height.substring(0, iframe_height.length - 2)}`;

	if (selected_type != 'none')
	{
		encoded_url += `&${selected_type}=${operation_value}`;
	}

	chart_container.src = encoded_url;
});
