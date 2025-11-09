const chart_container = document.getElementById('chart-container');
let channels_loaded = 0;
let channel_keys = [
	{
		channel_number: 432818, name: 'Stacja pogodowa', key: 'XXXXXXXXXXXXXXXX',
		field_list:
		[
			{ field: 1, name: 'Opady Online' },
			{ field: 2, name: 'Temp zewnątrz' },
			{ field: 3, name: 'Ciśnienie' },
			{ field: 4, name: 'H20 Dom' },
			{ field: 5, name: 'Temp wewnątrz' },
			{ field: 6, name: 'Wilg zewnątrz' },
			{ field: 7, name: 'Zbiornik Online' },
			{ field: 8, name: 'Studnia Online' },
		]
	},
	{
		channel_number: 864444, name: 'Vaillant EcoTec', key: 'XXXXXXXXXXXXXXXX',
		field_list:
		[
			{ field: 1, name: 'TempSetPodłoga' },
			{ field: 2, name: 'TempZasPodłoga' },
			{ field: 3, name: 'TempSetGrzejniki' },
			{ field: 4, name: 'TempZasGrze' },
			{ field: 5, name: 'Temp Zasil' },
			{ field: 6, name: 'Temp_CWU' },
			{ field: 7, name: 'CO - gaz' },
			{ field: 8, name: 'CWU - gaz' },
		]
	},
	{
		channel_number: 897438, name: 'Sum/Avg', key: 'XXXXXXXXXXXXXXXX',
		field_list:
		[
			{ field: 1, name: 'Temp średnia wczoraj' },
			{ field: 2, name: 'Suma opady-wczoraj' },
			{ field: 3, name: 'SumaStudnia-wczoraj' },
			{ field: 4, name: 'Woda Dom-wczoraj' },
			{ field: 5, name: 'SumaGazCO_wczoraj' },
			{ field: 7, name: 'Suma opadów-M-c' },
			{ field: 8, name: 'TempAvg-M-c' },
		]
	},
	{
		channel_number: 783677, name: 'Sum/Avg', key: 'XXXXXXXXXXXXXXXX',
		field_list:
		[
			{ field: 1, name: 'Prad online' },
			{ field: 2, name: 'H2O_DomDzis' },
			{ field: 3, name: 'P-podlogi' },
			{ field: 4, name: 'Suma Opady Dzis' },
			{ field: 5, name: 'SumaGazCO_dzis' },
			{ field: 6, name: 'SumaGazCWU_dzis' },
			{ field: 7, name: 'Studnia dzisiajTS' },
			{ field: 8, name: 'KuchniaGaz' },
		]
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
const get_chart_btn = document.getElementById('get_chart');

let encoded_url = null;

let iframe_width = `${window.innerWidth}px`;
let iframe_height = `${window.innerHeight - 150}px`;

document.addEventListener('DOMContentLoaded', () => {
	chart_container.style.width = iframe_width;
	chart_container.style.height = iframe_height;

	encoded_url = `${url.base}${channel_keys[0].channel_number}/charts/1?bgcolor=${encodeURIComponent(url.colors.bg)}&color=${encodeURIComponent(url.colors.fg)}&start=${encodeURIComponent(url.range.start)}&end=${encodeURIComponent(url.range.end)}&${url.operation.type}=${url.operation.value}&title=${encodeURIComponent(url.title)}&type=${url.type}&width=${iframe_width.substring(0, iframe_width.length - 2)}&height=${iframe_height.substring(0, iframe_height.length - 2)}`;

	chart_container.src = encoded_url;

	for (let channel_idx = 0; channel_idx < channel_keys.length; channel_idx++)
	{
		console.log(`Adding channel '${channel_keys[channel_idx].name}' to dropdown menu`);
		const channel_menu_opt = new Option(channel_keys[channel_idx].name, channel_idx);
		channel_menu.options.add(channel_menu_opt, channel_idx);

		for (let field_idx = 0; field_idx < channel_keys[channel_idx].field_list.length; field_idx++)
		{
			console.log(`\t| has field: ${channel_keys[channel_idx].field_list[field_idx].name}`);
		}
	}
});

// wacky stuff
const en_pl_translations = [];
en_pl_translations['sum'] = 'suma';
en_pl_translations['average'] = 'średnia';
en_pl_translations['median'] = 'mediana';
en_pl_translations['min'] = 'min';
en_pl_translations['max'] = 'max';

const allowed_minute_values = [10, 15, 20, 30, 60, 240, 720, 1440];

function clamp_minutes(val)
{
	return allowed_minute_values.reduce((a, b) => Math.abs(b - val) < Math.abs(a - val) ? b : a);
}

get_chart_btn.addEventListener('click', () => {
	let selected_channel = channel_keys[channel_menu.selectedIndex].channel_number;
	let selected_channel_name = channel_keys[channel_menu.selectedIndex].name;
	console.log(`Selected channel: ${selected_channel} -> ${selected_channel_name}`);

	let selected_field = field_menu.value;
	console.log(`Selected field: ${selected_field}`);

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

	if (selected_type == 'min' || selected_type == 'max')
	{
		operation_value = parseInt(document.getElementById('min_max_val').value);
	}

	encoded_url = `${url.base}${selected_channel}/charts/${selected_field}?bgcolor=${encodeURIComponent(url.colors.bg)}&color=${encodeURIComponent(url.colors.fg)}&start=${encodeURIComponent(selected_date_start)}&end=${encodeURIComponent(selected_date_end)}&${selected_type}=${operation_value}&title=${encodeURIComponent(`${en_pl_translations[selected_type]} z ${selected_channel_name} (${selected_date_start} - ${selected_date_end})`)}&type=${url.type}&width=${iframe_width.substring(0, iframe_width.length - 2)}&height=${iframe_height.substring(0, iframe_height.length - 2)}`;

	chart_container.src = encoded_url;
});
