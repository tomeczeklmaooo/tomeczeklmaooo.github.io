// utility functions
function bit_read(variable, bit)
{
	return (variable >> bit) & 0x01;
}

// data object
const data = {
	responses:
	{
		ts_normal: null,
		ts_media_a1: null,
		ts_media_a2: null,
		ts_media_b: null,
		ts_media_c: null
	},
	date:
	{
		split_a: null,
		split_b: null,
		split_c: null
	},
	values:
	{
		enea_import: null,
		temp_zew_bmp: null,
		temp_zew_vaillant: null,
		wilg_zew: null,
		opady_dzis: null,
		cisnienie: null,
		temp_salon_bmp: null,
		temp_salon_vaillant: null,
		temp_pietro: null,
		temp_garaz: null,
		temp_strych: null,
		temp_strych_garaz: null,
		temp_lazienka: null,
		wilg_wew: null,
		stan_pieca: null,
		status_pieca: null,
		cisnienie_wody: null,
		gaz_co: null,
		gaz_cwu: null,
		temp_cwu: null,
		t_set_podloga: null,
		t_zas_podloga: null,
		t_set_grzejniki: null,
		t_zas_grzejniki: null,
		woda_dom: null,
		woda_ogrod: null,
		pv_produkcja: null,
		pv_konsumpcja: null,
		pv_autokonsumpcja: null,
		pv_obciazenie: null,
		pv_power: null,
		pv_napiecie: null,
		pv_cena_sprzedaz: null,
		pv_cena_zakup: null,
		sunrise: null,
		sunset: null
	},
	bool:
	{
		drzwi_gosp: null,
		brama_wjazd: null,
		brama_garaz: null,
		okno_salon: null,
		smart_plug: null,
		zawor_wody: null,
		nawodnienie_aktywne: null,
		grzalka_aktywna: null,
		swiatlo_lazienka: null,
		swiatlo_garaz: null,
		swiatlo_gosp: null,
		swiatlo_strych: null,
		pralka: null,
		zmywarka: null,
		foxess_online: null,
		drzwi_wej: null,
		min_zbiornik: null,
		med_zbiornik: null,
		max_zbiornik: null,
		min_studnia: null,
		max_studnia: null,
		pompa_studnia_zbiornik: null,
		max_scieki: null,
		zmiekczacz: null,
		pompa_grzej: null,
		pompa_podloga: null,
		pompa_pieca: null,
		grzalka_cwu: null,
		pompa_cwu: null,
		pompa_scieki: null,
		pompa_studnia: null,
		pompa_zbiornik: null
	}
};

async function fetch_data(url)
{
	try
	{
		const response = await fetch(url);

		if (!response.ok)
		{
			throw new Error(`Failed to fetch data from: ${url}`);
		}

		const data = await response.json();

		return data;
	}
	catch (error)
	{
		console.error(`Error: ${error}`);
	}
}

async function assign_responses()
{
	const temp_response_normal = await fetch_data('https://api.thingspeak.com/channels/432818/status.json?results=1');

	const temp_response_a = await fetch_data('https://api.thingspeak.com/channels/864444/feeds.json?results=480&timezone=Europe%2FWarsaw');
	const temp_response_media_a1 = [];
	const temp_response_media_a2 = [];
	for (let i = 0; i < temp_response_a.feeds.length; i++)
	{
		if (temp_response_a.feeds[i].field7 == null)
			continue;
		else
			temp_response_media_a1.push(parseFloat(temp_response_a.feeds[i].field7));

		if (temp_response_a.feeds[i].field8 == null)
			continue;
		else
			temp_response_media_a2.push(parseFloat(temp_response_a.feeds[i].field8));
	}
	console.log(temp_response_media_a1);
	console.log(temp_response_media_a2);

	const temp_response_b = await fetch_data('https://api.thingspeak.com/channels/432818/fields/4.json?results=240&timezone=Europe%2FWarsaw');
	const temp_response_media_b = [];
	for (let i = 0; i < temp_response_b.feeds.length; i++)
	{
		if (temp_response_b.feeds[i].field4 == null)
			continue;
		else
			temp_response_media_b.push(parseFloat(temp_response_b.feeds[i].field4));
	}
	console.log(temp_response_media_b);

	const temp_response_c = await fetch_data('https://api.thingspeak.com/channels/783677/fields/1.json?days=1&timezone=Europe%2FWarsaw');
	const temp_response_media_c = [];
	for (let i = 0; i < temp_response_c.feeds.length; i++)
	{
		if (temp_response_c.feeds[i].field1 == null)
			continue;
		else
			temp_response_media_c.push(parseFloat(temp_response_c.feeds[i].field1));
	}
	console.log(temp_response_media_c);

	return {
		ts_normal:
		{
			values: temp_response_normal.feeds[0].status,
			created_at: temp_response_normal.feeds[0].created_at
		},
		ts_media_a1:
		{
			values: temp_response_media_a1,
			created_at: temp_response_a.feeds[0].created_at
		},
		ts_media_a2:
		{
			values: temp_response_media_a2,
			created_at: temp_response_a.feeds[0].created_at
		},
		ts_media_b:
		{
			values: temp_response_media_b,
			created_at: temp_response_b.feeds[0].created_at
		},
		ts_media_c:
		{
			values: temp_response_media_c,
			created_at: temp_response_c.feeds[0].created_at
		}
	};
}

async function assign_fields()
{
	Object.assign(data.responses, await assign_responses());
	
	let temp_split_date = data.responses.ts_media_a1.created_at
		.replace('T', ' ')
		.replace('Z', '')
		.replaceAll('-', ' ')
		.replaceAll(':', ' ')
		.split(' ');
	for (let i = 0; i < temp_split_date.length; i++)
		temp_split_date[i] = parseInt(temp_split_date[i]);
	data.date.split_a = temp_split_date;
	console.log(`data.date.split_a = ${data.date.split_a}`);

	temp_split_date = data.responses.ts_media_b.created_at
		.replace('T', ' ')
		.replace('Z', '')
		.replaceAll('-', ' ')
		.replaceAll(':', ' ')
		.split(' ');
	for (let i = 0; i < temp_split_date.length; i++)
		temp_split_date[i] = parseInt(temp_split_date[i]);
	data.date.split_b = temp_split_date;
	console.log(`data.date.split_b = ${data.date.split_b}`);

	temp_split_date = data.responses.ts_media_c.created_at
		.replace('T', ' ')
		.replace('Z', '')
		.replaceAll('-', ' ')
		.replaceAll(':', ' ')
		.split(' ');
	for (let i = 0; i < temp_split_date.length; i++)
		temp_split_date[i] = parseInt(temp_split_date[i]);
	data.date.split_c = temp_split_date;
	console.log(`data.date.split_c = ${data.date.split_c}`);

	const temp_value_buffer = data.responses.ts_normal.values.split('|');

	data.values.enea_import          = temp_value_buffer[0];
	data.values.temp_zew_bmp         = temp_value_buffer[1];
	data.values.temp_zew_vaillant    = temp_value_buffer[2];
	data.values.wilg_zew             = temp_value_buffer[3];
	data.values.opady_dzis           = temp_value_buffer[4];
	data.values.cisnienie            = temp_value_buffer[5];
	data.values.temp_salon_bmp       = temp_value_buffer[6];
	data.values.temp_salon_vaillant  = temp_value_buffer[7];
	data.values.temp_pietro          = temp_value_buffer[8];
	data.values.temp_garaz           = temp_value_buffer[9];
	data.values.temp_strych_garaz    = temp_value_buffer[10];
	data.values.temp_strych          = temp_value_buffer[11];
	data.values.temp_lazienka        = temp_value_buffer[12];
	data.values.wilg_wew             = temp_value_buffer[13];
	data.values.stan_pieca           = temp_value_buffer[14];
	data.values.cisnienie_wody       = temp_value_buffer[15];
	data.values.gaz_co               = temp_value_buffer[16];
	data.values.gaz_cwu              = temp_value_buffer[17];
	data.values.temp_cwu             = temp_value_buffer[18];
	data.values.t_set_podloga        = temp_value_buffer[19];
	data.values.t_zas_podloga        = temp_value_buffer[20];
	data.values.t_set_grzejniki      = temp_value_buffer[21];
	data.values.t_zas_grzejniki      = temp_value_buffer[22];
	data.values.woda_dom             = temp_value_buffer[23];
	data.values.woda_ogrod           = temp_value_buffer[24];
	data.values.pv_produkcja         = temp_value_buffer[25];
	data.values.pv_konsumpcja        = temp_value_buffer[26];
	data.values.pv_autokonsumpcja    = temp_value_buffer[27];
	data.values.pv_obciazenie        = temp_value_buffer[28];
	data.values.pv_power             = temp_value_buffer[29];
	data.values.pv_napiecie          = temp_value_buffer[30];
	data.values.pv_cena_sprzedaz     = temp_value_buffer[31];
	data.values.pv_cena_zakup        = temp_value_buffer[32];
	data.values.sunrise              = temp_value_buffer[34];
	data.values.sunset               = temp_value_buffer[35];

	const temp_encoded_boolean = temp_value_buffer[33];

	data.bool.drzwi_gosp             = bit_read(temp_encoded_boolean, 0);
	data.bool.brama_wjazd            = bit_read(temp_encoded_boolean, 1);
	data.bool.brama_garaz            = bit_read(temp_encoded_boolean, 2);
	data.bool.okno_salon             = bit_read(temp_encoded_boolean, 3);
	data.bool.smart_plug             = bit_read(temp_encoded_boolean, 4);
	data.bool.zawor_wody             = bit_read(temp_encoded_boolean, 5);
	data.bool.nawodnienie_aktywne    = bit_read(temp_encoded_boolean, 6);
	data.bool.grzalka_aktywna        = bit_read(temp_encoded_boolean, 7);
	data.bool.swiatlo_lazienka       = bit_read(temp_encoded_boolean, 8);
	data.bool.swiatlo_garaz          = bit_read(temp_encoded_boolean, 9);
	data.bool.swiatlo_gosp           = bit_read(temp_encoded_boolean, 10);
	data.bool.swiatlo_strych         = bit_read(temp_encoded_boolean, 11);
	data.bool.pralka                 = bit_read(temp_encoded_boolean, 12);
	data.bool.zmywarka               = bit_read(temp_encoded_boolean, 13);
	data.bool.foxess_online          = bit_read(temp_encoded_boolean, 14);
	data.bool.drzwi_wej              = bit_read(temp_encoded_boolean, 15);
	data.bool.min_zbiornik           = bit_read(temp_encoded_boolean, 16);
	data.bool.med_zbiornik           = bit_read(temp_encoded_boolean, 17);
	data.bool.max_zbiornik           = bit_read(temp_encoded_boolean, 18);
	data.bool.min_studnia            = bit_read(temp_encoded_boolean, 19);
	data.bool.max_studnia            = bit_read(temp_encoded_boolean, 20);
	data.bool.pompa_studnia_zbiornik = bit_read(temp_encoded_boolean, 21);
	data.bool.max_scieki             = bit_read(temp_encoded_boolean, 22);
	data.bool.zmiekczacz             = bit_read(temp_encoded_boolean, 23);
	data.bool.pompa_grzej            = bit_read(temp_encoded_boolean, 24);
	data.bool.pompa_podloga          = bit_read(temp_encoded_boolean, 25);
	data.bool.pompa_pieca            = bit_read(temp_encoded_boolean, 26);
	data.bool.grzalka_cwu            = bit_read(temp_encoded_boolean, 27);
	data.bool.pompa_cwu              = bit_read(temp_encoded_boolean, 28);
	data.bool.pompa_scieki           = bit_read(temp_encoded_boolean, 29);
	data.bool.pompa_studnia          = bit_read(temp_encoded_boolean, 30);
	data.bool.pompa_zbiornik         = bit_read(temp_encoded_boolean, 31);

	switch (parseInt(data.values.stan_pieca))
	{
		case 0:
			data.values.status_pieca = "Ogrzew.: Brak zapotrz.";
			break;
		case 1:
			data.values.status_pieca = "Ogrzew.: Rozruch went.";
			break;
		case 2:
			data.values.status_pieca = "Ogrzew.: Praca pompy";
			break;
		case 3:
			data.values.status_pieca = "Ogrzew.: Zapłon";
			break;
		case 4:
			data.values.status_pieca = "Ogrzew.: Palnik włączony";
			break;
		case 5:
			data.values.status_pieca = "Ogrzew.: Wybieg";
			break;
		case 6:
			data.values.status_pieca = "Ogrzew.: Wybieg went.";
			break;
		case 7:
			data.values.status_pieca = "Ogrzew.: Wybieg pompy";
			break;
		case 8:
			data.values.status_pieca = "Ogrzew.: Blokada palnika";
			break;
		case 20:
			data.values.status_pieca = "CWU: Zapotrzebowanie";
			break;
		case 21:
			data.values.status_pieca = "CWU: Rozruch went.";
			break;
		case 22:
			data.values.status_pieca = "CWU: Praca pompy";
			break;
		case 23:
			data.values.status_pieca = "CWU: Zapłon";
			break;
		case 24:
			data.values.status_pieca = "CWU: Palnik włączony";
			break;
		case 25:
			data.values.status_pieca = "CWU: Wybieg";
			break;
		case 26:
			data.values.status_pieca = "CWU: Wybieg went.";
			break;
		case 27:
			data.values.status_pieca = "CWU: Wybieg pompy";
			break;
		case 28:
			data.values.status_pieca = "CWU: Blokada palnika";
			break;
		case 31:
			data.values.status_pieca = "Tryb letni";
			break;
		default:
			data.values.status_pieca = "Nieznany status"
			break;
	}
}

let width = 0;
let height = 0;

function check_viewport()
{
	width = window.innerWidth;
	height = window.innerHeight;
}

function generate_card({ title, cols = [], rows = [], size = '1x1', icon = 'default', clickevent = 'return false' })
{
	const card = document.createElement('div');
	card.className = `card card-${size}`;
	card.onclick = clickevent;

	const card_header = document.createElement('div');
	card_header.className = 'card-header';
	card_header.innerHTML = `<span><span class="material-symbols-rounded">${icon}</span> ${title}</span>`;
	card.appendChild(card_header);

	const card_content_wrapper = document.createElement('div');
	card_content_wrapper.className = 'card-content-wrapper';

	if (rows.length)
	{
		const card_content = document.createElement('div');
		card_content.className = 'card-content';
		const table = document.createElement('table');

		rows.forEach(row_items =>
		{
			const tr = document.createElement('tr');

			row_items.forEach(item =>
			{
				const td = document.createElement('td');

				const icon = item.icon ?? null;
				const icon_sub = item.icon_sub ?? null;
				const icon_color = item.icon_color ?? null;
				const colspan = item.colspan ?? 1;
				const icon_align = item.icon_align ?? null;
				const label_align = item.label_align ?? null;
				const label = item.label ?? '';

				if (icon_align) td.style.textAlign = icon_align;
				if (icon)
				{
					const icon_span = document.createElement('span');
					icon_span.className = `material-symbols-rounded ${icon_color}`;
					icon_span.textContent = icon;
					td.appendChild(icon_span);
				}
				if (icon_sub)
				{
					const sub = document.createElement('sub');
					sub.innerHTML = icon_sub;
					td.appendChild(sub);
				}

				const label_span = document.createElement('span');
				label_span.className = 'cell-label';
				label_span.innerHTML = label;
				td.appendChild(label_span);

				td.colSpan = colspan;
				if (label_align) td.style.textAlign = label_align;

				tr.appendChild(td);
			});

			table.appendChild(tr);
		});

		card_content.appendChild(table);
		card_content_wrapper.appendChild(card_content);
	}
	else
	{
		cols.forEach(column_items =>
		{
			const card_content = document.createElement('div');
			card_content.className = 'card-content';
			const table = document.createElement('table');

			column_items.forEach(item =>
			{
				const tr = document.createElement('tr');

				const td_icon = document.createElement('td');
				const td_label = document.createElement('td');

				const icon = item.icon ?? null;
				const icon_sub = item.icon_sub ?? null;
				const icon_color = item.icon_color ?? null;
				const colspan = item.colspan ?? 1;
				const icon_align = item.icon_align ?? null;
				const label_align = item.label_align ?? null;
				const label = item.label ?? '';

				if (icon_align) td_icon.style.textAlign = icon_align;
				if (icon)
				{
					const icon_span = document.createElement('span');
					icon_span.className = `material-symbols-rounded ${icon_color}`;
					icon_span.textContent = icon;
					td_icon.appendChild(icon_span);
				}
				if (icon_sub)
				{
					const sub = document.createElement('sub');
					sub.innerHTML = icon_sub;
					td_icon.appendChild(sub);
				}

				td_label.colSpan = colspan;
				if (label_align) td_label.style.textAlign = label_align;
				const label_span = document.createElement('span');
				label_span.className = 'cell-label';
				label_span.innerHTML = label;
				td_label.appendChild(label_span);

				if (icon) tr.appendChild(td_icon);
				tr.appendChild(td_label);

				table.appendChild(tr);
			});

			card_content.appendChild(table);
			card_content_wrapper.appendChild(card_content);
		});
	}

	card.appendChild(card_content_wrapper);
	return card;
}

function remove_all_children(element)
{
	while (element.hasChildNodes())
		element.removeChild(element.firstChild);
}

function create_row(outer_box_left_content, outer_box_right_content)
{
	const row = document.createElement('div');
	row.className = 'row';

	const outer_box_left = document.createElement('div');
	outer_box_left.className = 'outer-row-box';

	const outer_box_right = document.createElement('div');
	outer_box_right.className = 'outer-row-box';

	outer_box_left_content.forEach(element => outer_box_left.appendChild(element));
	outer_box_right_content.forEach(element => outer_box_right.appendChild(element));

	row.appendChild(outer_box_left);
	row.appendChild(outer_box_right);

	return row;
}

function create_inner_column(cards)
{
	const column = document.createElement('div');
	column.className = 'inner-column';
	cards.forEach(card => column.appendChild(card));
	return column;
}

function create_active_dot(bool)
{
	return `<div class="dot ${bool ? `` : `in`}active-dot"></div>`;
}

async function build_site()
{
	await assign_fields();

	const cards = {
		pogoda:
		{
			title: 'Pogoda', icon: 'partly_cloudy_day', size: '2x1',
			cols:
			[
				[
					{ icon: 'device_thermostat', label: `${data.values.temp_zew_vaillant}&deg;C` },
					{ icon: 'humidity_high', icon_color: 'blue', label: `${data.values.wilg_zew}%` },
					{ icon: 'swap_driving_apps_wheel', label: `${data.values.cisnienie} hPa` }
				],
				[
					{ icon: 'rainy', icon_color: 'blue', label: `${data.values.opady_dzis} l/m<sup>2</sup>` },
					{ icon: 'sunny', icon_color: 'yellow', icon_sub: '&uarr;', label: `${data.values.sunrise}` },
					{ icon: 'sunny', icon_color: 'yellow', icon_sub: '&darr;', label: `${data.values.sunset}` }
				]
			]
		},

		lazienka:
		{
			title: 'Łazienka', icon: 'shower', size: '1x1',
			cols:
			[
				[
					{ icon: 'device_thermostat', label: `${data.values.temp_lazienka}&deg;C` },
					{ icon: 'lightbulb', icon_color: data.bool.swiatlo_lazienka ? 'yellow' : null, label: `${create_active_dot(data.bool.swiatlo_lazienka)}` },
					{ icon: 'laundry', icon_sub: 'pralka', label: `${create_active_dot(data.bool.pralka)}` },
					{ icon: 'power', icon_sub: 'grzejnik', label: `${create_active_dot(data.bool.smart_plug)}` }
				]
			]
		},

		salon:
		{
			title: 'Salon', icon: 'chair', size: '1x1',
			cols:
			[
				[
					{ icon: 'device_thermostat', label: `${data.values.temp_salon_vaillant}&deg;C` },
					{ icon: 'humidity_high', icon_color: 'blue', label: `${data.values.wilg_wew}%` },
					{ icon: 'window', label: `${create_active_dot(data.bool.okno_salon)}` }
				]
			]
		},

		fotowoltaika:
		{
			title: 'Fotowoltaika', icon: 'solar_power', size: '1x2',
			cols:
			[
				[
					{ icon: 'bolt', icon_sub: 'DC', label: `${data.values.pv_power} kW` },
					{ icon: 'bolt', icon_sub: 'prod.', label: `${data.values.pv_produkcja} kWh` },
					{ icon: 'bolt', icon_sub: 'zużycie', label: `${data.values.pv_konsumpcja} kWh` },
					{ icon: 'bolt', icon_sub: 'auto.', label: `${data.values.pv_autokonsumpcja} kWh` },
					{ icon: 'bolt', icon_sub: 'obciąż.', label: `${data.values.pv_obciazenie} W` },
					{ icon: 'bolt', icon_sub: 'napięcie', label: `${data.values.pv_napiecie} V` },
					{ icon: 'money_bag', icon_color: 'green', label: `${data.values.pv_cena_sprzedaz} PLN` },
					{ icon: 'money_bag', icon_color: 'red', label: `${data.values.pv_cena_zakup} PLN` }
				]
			]
		},

		nawo:
		{
			title: 'Nawodnienie', icon: 'potted_plant', size: '1x2',
			cols:
			[
				[
					{ icon: 'rainy', label: `${create_active_dot(data.bool.nawodnienie_aktywne)}` },
					{ label: 'tutaj będzie canvas' }
				]
			]
		},

		vaillant:
		{
			title: 'Vaillant', icon: 'water_heater', size: '2x1',
			rows:
			[
				[
					{ label: `Status pieca: ${data.values.status_pieca}`, colspan: 4, label_align: 'center' }
				],
				[
					{ icon: 'swap_driving_apps_wheel', label: `${parseFloat(data.values.cisnienie_wody).toFixed(2)} &nbsp;bar` },
					{ icon: 'valve', icon_sub: 'CWU', icon_color: 'red', label: `${data.values.temp_cwu}&deg;C ${create_active_dot(data.bool.pompa_cwu)}` }
				],
				[
					{ label: 'Podłoga:' },
					{ label: `SP:${data.values.t_set_podloga}&deg;C` },
					{ label: `PV:${data.values.t_zas_podloga}&deg;C` },
					{ label: create_active_dot(data.bool.pompa_podloga) }
				],
				[
					{ label: 'Grzejniki:' },
					{ label: `SP:${data.values.t_set_grzejniki}&deg;C` },
					{ label: `PV:${data.values.t_zas_grzejniki}&deg;C` },
					{ label: create_active_dot(data.bool.pompa_grzej) }
				],
				[
					{ label: `Grzał. akt.: ${create_active_dot(data.bool.grzalka_aktywna)}`, colspan: 2 },
					{ label: `Załączona: ${create_active_dot(data.bool.grzalka_cwu)}`, colspan: 2 }
				]
			]
		},

		garaz:
		{
			title: 'Garaż', icon: 'directions_car', size: '1x1',
			cols:
			[
				[
					{ icon: 'device_thermostat', label: `${data.values.temp_garaz}&deg;C` },
					{ icon: 'lightbulb', icon_color: data.bool.swiatlo_garaz ? 'yellow' : null, label: `${create_active_dot(data.bool.swiatlo_garaz)}` },
					{ icon: 'water', icon_sub: 'zmięk.', label: `${create_active_dot(data.bool.zmiekczacz)}` },
					{ icon: 'garage_home', label: `${create_active_dot(data.bool.brama_garaz)}` }
				]
			]
		},

		drzwi:
		{
			title: 'Drzwi', icon: 'door_front', size: '1x1',
			cols:
			[
				[
					{ icon: data.bool.drzwi_wej ? 'door_open' : 'door_front', icon_sub: 'wej.', label: `${create_active_dot(data.bool.drzwi_wej)}` },
					{ icon: data.bool.drzwi_gosp ? 'door_open' : 'door_front', icon_sub: 'gosp.', label: `${create_active_dot(data.bool.drzwi_gosp)}` },
					{ icon: 'gate', icon_sub: 'wjazd', label: `${create_active_dot(data.bool.brama_wjazd)}` }
				]
			]
		},

		media:
		{
			title: 'Media', icon: 'plumbing', size: '1x1',
			cols:
			[
				[
					{ icon: 'valve', icon_color: 'blue', label: `${data.values.woda_dom} l ${create_active_dot(data.bool.zawor_wody)}` },
					{ icon: 'local_fire_department', icon_sub: 'CO', icon_color: 'yellow', label: `${data.values.gaz_co} m<sup>3</sup>` },
					{ icon: 'local_fire_department', icon_sub: 'CWU', icon_color: 'yellow', label: `${data.values.gaz_cwu} m<sup>3</sup>` },
					{ icon: 'bolt', icon_color: 'red', label: `${data.values.enea_import} kWh` }
				]
			],
			clickevent: 'alert("media")'
		},

		temperatury:
		{
			title: 'Temperatury', icon: 'device_thermostat', size: '1x1',
			cols:
			[
				[
					{ icon: 'device_thermostat', icon_sub: 'piętro', label: `${data.values.temp_pietro}&deg;C` },
					{ icon: 'device_thermostat', icon_sub: 'strych', label: `${data.values.temp_strych}&deg;C` },
					{ icon: 'device_thermostat', icon_sub: 'strych gar.', label: `${data.values.temp_strych_garaz}&deg;C` }
				]
			]
		},

		inne:
		{
			title: 'Inne', icon: 'category', size: '1x1',
			cols:
			[
				[
					{ icon: 'water', icon_sub: 'ścieki', label: `${create_active_dot(data.bool.pompa_scieki)}` },
					{ icon: 'dishwasher', icon_sub: 'zmyw.', label: `${create_active_dot(data.bool.zmywarka)}` },
					{ icon: 'lightbulb', icon_sub: 'pom. gosp.', icon_color: data.bool.swiatlo_gosp ? 'yellow' : null, label: `${create_active_dot(data.bool.swiatlo_gosp)}` },
					{ icon: 'lightbulb', icon_sub: 'strych', icon_color: data.bool.swiatlo_strych ? 'yellow' : null, label: `${create_active_dot(data.bool.swiatlo_strych)}` }
				]
			]
		},

		invisible:
		{ title: null, icon: null, size: '1x1 invisible', cols: [] }
	};

	const last_updated = new Date(data.responses.ts_normal.created_at)
				.toLocaleString('en-GB', { timeZone: 'Europe/Warsaw' })
				.replace(',', '')
				.replaceAll('/', '.');
	document.getElementById('lastupdated').innerHTML = `${last_updated}`;

	const main = document.getElementById('main');

	// row 1
	main.appendChild(
		create_row(
			[generate_card(cards.pogoda)],
			[generate_card(cards.lazienka), generate_card(cards.salon)]
		)
	);

	// row 2
	const left_inner_a = create_inner_column([generate_card(cards.fotowoltaika)]);
	const left_inner_b = create_inner_column([generate_card(cards.media), generate_card(cards.temperatury)]);
	const right_inner_a = create_inner_column([generate_card(cards.garaz), generate_card(cards.drzwi)]);
	const right_inner_b = create_inner_column([generate_card(cards.nawo)]);
	main.appendChild(create_row([left_inner_a, left_inner_b], [right_inner_a, right_inner_b]));

	// row 3
	main.appendChild(
		create_row(
			[generate_card(cards.vaillant)],
			[generate_card(cards.inne), generate_card(cards.invisible)]
		)
	);
}

window.onload = async function()
{
	await build_site();

	check_viewport();
}
