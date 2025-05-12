// ARDUINO BITREAD JS
// #define bitRead(value, bit) (((value) >> (bit)) & 0x01)
function bitRead(value, bit)
{
	return (value >> bit) & 0x01;
}

// THINGSPEAK FIELDS
var g_ts_response, g_ts_media_response_a, g_ts_media_response_b, g_ts_media_response_c; // global, co/cwu, water, electricity
var response_a1 = [], response_a2 = [], response_b = [], response_c = []; // field7, field8, ..., ...
var split_date_a = [], split_date_b = [], split_date_c = [];
var wartosci;
var enea_import;
var temp_zew_bmp, temp_zew_vilant, wilg_zew;
var opady_dzis, cisnienie;
var temp_salon_bmp, temp_salon_vilant, temp_pietro, temp_garaz, temp_strych_garaz, temp_strych, temp_lazienka, wilg_wew;
var stan_pieca, piec_status, cis_wody, gaz_co, gaz_cwu, temp_cwu, t_set_podloga, t_zas_podloga, t_set_grzejniki, t_zas_grzejniki;
var ilosc_woda_dom, ilosc_woda_ogrod;
var pv_produkcja_dzis, pv_konsumpcja_dzis, pv_autokonsumpcja_dzis, pv_akt_obciazenie, pv_power, pv_napiecie, pv_cena_sprzedazy, pv_cena_zakupu;
var zakodowany_boolean;
var sunrise, sunset;
// zmienne z zakodowanego booleana
var drzwi_gosp, brama_wjazd, brama_garaz, okno_salon;
var smart_plug;
var zawor_wod_dom;
var nawodnienie_aktywne;
var grzalka_aktywna;
var swiatlo_lazienka, swiatlo_garaz, swiatlo_pom_gosp, swiatlo_strych;
var pralka, zmywarka;
var fox_online;
var drzwi_wej;
var min_zbiornik, med_zbiornik, max_zbiornik, min_studnia, max_studnia;
var p_studnia_zbiornik;
var max_scieki;
var zmiekczacz;
var pompa_grzej, pompa_podloga, pompa_pieca, grzalka_cwu, pompa_cwu, pompa_scieki, pompa_studnia, pompa_zbiornik;

function thingspeak_fields()
{
	fetch('https://api.thingspeak.com/channels/432818/status.json?results=1').then((res) => res.text()).then((main_response) => {
		fetch('https://api.thingspeak.com/channels/864444/feeds.json?results=480').then((res) => res.text()).then((media_response_a) => {
			fetch('https://api.thingspeak.com/channels/432818/fields/4.json?results=240').then((res) => res.text()).then((media_response_b) => {
				fetch('https://api.thingspeak.com/channels/783677/fields/1.json?days=1').then((res) => res.text()).then((media_response_c) => {
					g_ts_response = JSON.parse(main_response);
					g_ts_media_response_a = JSON.parse(media_response_a);
					g_ts_media_response_b = JSON.parse(media_response_b);
					g_ts_media_response_c = JSON.parse(media_response_c);

					for (var i = 0; i < g_ts_media_response_a['feeds'].length; i++)
					{
						if (g_ts_media_response_a['feeds'][i]['field7'] == null) continue;
						else response_a1.push(parseFloat(g_ts_media_response_a['feeds'][i]['field7']));

						if (g_ts_media_response_a['feeds'][i]['field8'] == null) continue;
						else response_a2.push(parseFloat(g_ts_media_response_a['feeds'][i]['field8']));
					}
					console.log(response_a1);
					console.log(response_a2);

					for (var i = 0; i < g_ts_media_response_b['feeds'].length; i++)
					{
						if (g_ts_media_response_b['feeds'][i]['field4'] == null) continue;
						else response_b.push(parseFloat(g_ts_media_response_b['feeds'][i]['field4']));
					}
					console.log(response_b);

					for (var i = 0; i < g_ts_media_response_c['feeds'].length; i++)
					{
						if (g_ts_media_response_c['feeds'][i]['field1'] == null) continue;
						else response_c.push(parseFloat(g_ts_media_response_c['feeds'][i]['field1']));
					}
					console.log(response_c);

					split_date_a = g_ts_media_response_a['feeds'][0]['created_at'].replace('T', ' ').replace('Z', '').replaceAll('-', ' ').replaceAll(':', ' ').split(" ");
					for (var i = 0; i < split_date_a.length; i++) split_date_a[i] = parseInt(split_date_a[i]);
					console.log(split_date_a);
					split_date_b = g_ts_media_response_b['feeds'][0]['created_at'].replace('T', ' ').replace('Z', '').replaceAll('-', ' ').replaceAll(':', ' ').split(" ");
					for (var i = 0; i < split_date_b.length; i++) split_date_b[i] = parseInt(split_date_b[i]);
					console.log(split_date_b);
					split_date_c = g_ts_media_response_c['feeds'][0]['created_at'].replace('T', ' ').replace('Z', '').replaceAll('-', ' ').replaceAll(':', ' ').split(" ");
					for (var i = 0; i < split_date_c.length; i++) split_date_c[i] = parseInt(split_date_c[i]);
					console.log(split_date_c);

					wartosci = g_ts_response['feeds'][0]['status'].split('|');

					enea_import            = wartosci[0];
					temp_zew_bmp           = wartosci[1];
					temp_zew_vilant        = wartosci[2];
					wilg_zew               = wartosci[3];
					opady_dzis             = wartosci[4];
					cisnienie              = wartosci[5];
					temp_salon_bmp         = wartosci[6];
					temp_salon_vilant      = wartosci[7];
					temp_pietro            = wartosci[8];
					temp_garaz             = wartosci[9];
					temp_strych_garaz      = wartosci[10];
					temp_strych            = wartosci[11];
					temp_lazienka          = wartosci[12];
					wilg_wew               = wartosci[13];
					stan_pieca             = wartosci[14];
					cis_wody               = wartosci[15];
					gaz_co                 = wartosci[16];
					gaz_cwu                = wartosci[17];
					temp_cwu               = wartosci[18];
					t_set_podloga          = wartosci[19];
					t_zas_podloga          = wartosci[20];
					t_set_grzejniki        = wartosci[21];
					t_zas_grzejniki        = wartosci[22];
					ilosc_woda_dom         = wartosci[23];
					ilosc_woda_ogrod       = wartosci[24];
					pv_produkcja_dzis      = wartosci[25];
					pv_konsumpcja_dzis     = wartosci[26];
					pv_autokonsumpcja_dzis = wartosci[27];
					pv_akt_obciazenie      = wartosci[28];
					pv_power               = wartosci[29];
					pv_napiecie            = wartosci[30];
					pv_cena_sprzedazy      = wartosci[31];
					pv_cena_zakupu         = wartosci[32];
					zakodowany_boolean     = wartosci[33];
					sunrise                = wartosci[34];
					sunset                 = wartosci[35];

					drzwi_gosp             = bitRead(zakodowany_boolean, 0);
					brama_wjazd            = bitRead(zakodowany_boolean, 1);
					brama_garaz            = bitRead(zakodowany_boolean, 2);
					okno_salon             = bitRead(zakodowany_boolean, 3);
					smart_plug             = bitRead(zakodowany_boolean, 4);
					zawor_wod_dom          = bitRead(zakodowany_boolean, 5);
					nawodnienie_aktywne    = bitRead(zakodowany_boolean, 6);
					grzalka_aktywna        = bitRead(zakodowany_boolean, 7);
					swiatlo_lazienka       = bitRead(zakodowany_boolean, 8);
					swiatlo_garaz          = bitRead(zakodowany_boolean, 9);
					swiatlo_pom_gosp       = bitRead(zakodowany_boolean, 10);
					swiatlo_strych         = bitRead(zakodowany_boolean, 11);
					pralka                 = bitRead(zakodowany_boolean, 12);
					zmywarka               = bitRead(zakodowany_boolean, 13);
					fox_online             = bitRead(zakodowany_boolean, 14);
					drzwi_wej              = bitRead(zakodowany_boolean, 15);
					min_zbiornik           = bitRead(zakodowany_boolean, 16);
					med_zbiornik           = bitRead(zakodowany_boolean, 17);
					max_zbiornik           = bitRead(zakodowany_boolean, 18);
					min_studnia            = bitRead(zakodowany_boolean, 19);
					max_studnia            = bitRead(zakodowany_boolean, 20);
					p_studnia_zbiornik     = bitRead(zakodowany_boolean, 21);
					max_scieki             = bitRead(zakodowany_boolean, 22);
					zmiekczacz             = bitRead(zakodowany_boolean, 23);
					pompa_grzej            = bitRead(zakodowany_boolean, 24);
					pompa_podloga          = bitRead(zakodowany_boolean, 25);
					pompa_pieca            = bitRead(zakodowany_boolean, 26);
					grzalka_cwu            = bitRead(zakodowany_boolean, 27);
					pompa_cwu              = bitRead(zakodowany_boolean, 28);
					pompa_scieki           = bitRead(zakodowany_boolean, 29);
					pompa_studnia          = bitRead(zakodowany_boolean, 30);
					pompa_zbiornik         = bitRead(zakodowany_boolean, 31);

					// switch do stanu pieca
					switch (parseInt(stan_pieca))
					{
						case 0:
							piec_status = "Ogrzewanie: Brak zapotrzebowania";
							break;
						case 1:
							piec_status = "Ogrzewanie: Rozruch wentylator";
							break;
						case 2:
							piec_status = "Ogrzewanie: Praca pompy";
							break;
						case 3:
							piec_status = "Ogrzewanie: Zapłon";
							break;
						case 4:
							piec_status = "Ogrzewanie: Palnik włączony";
							break;
						case 5:
							piec_status = "Ogrzewanie: Wybieg";
							break;
						case 6:
							piec_status = "Ogrzewanie: Wybieg wentylatora";
							break;
						case 7:
							piec_status = "Ogrzewanie: Wybieg pompy";
							break;
						case 8:
							piec_status = "Ogrzewanie: Blokada palnika";
							break;
						case 20:
							piec_status = "CWU: Zapotrzebowanie";
							break;
						case 21:
							piec_status = "CWU: Rozruch wentylator";
							break;
						case 22:
							piec_status = "CWU: Praca pompy";
							break;
						case 23:
							piec_status = "CWU: Zapłon";
							break;
						case 24:
							piec_status = "CWU: Palnik włączony";
							break;
						case 25:
							piec_status = "CWU: Wybieg";
							break;
						case 26:
							piec_status = "CWU: Wybieg wentylatora";
							break;
						case 27:
							piec_status = "CWU: Wybieg pompy";
							break;
						case 28:
							piec_status = "CWU: Blokada palnika";
							break;
						case 31:
							piec_status = "Tryb letni";
							break;
						default:
							piec_status = "Nieznany status"
							break;
					}

					// odwloania funkcji ktore potrzebuja tych zmiennych ponizej
					generate_squares();
				}).catch((e) => console.error(e));
			}).catch((e) => console.error(e));
		}).catch((e) => console.error(e));
	}).catch((e) => console.error(e));
}

var width, height;

function check_viewport()
{
	width = window.innerWidth;
	height = window.innerHeight;
}

function generate_squares()
{
	document.getElementById('main').innerHTML = '';
	document.getElementById('main').style.height = '100%';
	var buf = "";
	// === KARTY ===
	var card_pogoda = `
			<div class="card card-2x1" onclick="show_chart(0)">
				<div class="card-header">
					<span><i class="fa-solid fa-cloud-sun-rain"></i> Pogoda</span>
				</div>
				<div class="card-content-wrapper">
					<div class="card-content">
						<table>
							<tr>
								<td><i class="fa-solid fa-temperature-half"></i></td>
								<td>${temp_zew_vilant}&deg;C</td>
							</tr>
							<tr>
								<td><i class="fa-solid fa-droplet blue"></i></td>
								<td>${wilg_zew}%</td>
							</tr>
							<tr>
								<td><i class="fa-solid fa-gauge"></i></td>
								<td>${cisnienie} hPa</td>
							</tr>
						</table>
					</div>
					<div class="card-content">
						<table>
							<tr>
								<td class="l-align"><i class="fa-solid fa-cloud-rain blue"></i></td>
								<td>${opady_dzis} l/m<sup>2</sup></td>
							</tr>
							<tr>
								<td><i class="fa-regular fa-sun yellow"></i>&uarr;</td>
								<td>${sunrise}</td>
							</tr>
							<tr>
								<td><i class="fa-solid fa-sun yellow"></i>&darr;</td>
								<td>${sunset}</td>
							</tr>
						</table>
					</div>
				</div>
			</div>
		`;
	var card_lazienka = `
			<div class="card card-1x1">
				<div class="card-header">
					<span><i class="fa-solid fa-shower"></i> Łazienka</span>
				</div>
				<div class="card-content-wrapper">
					<div class="card-content">
						<table>
							<tr>
								<td><i class="fa-solid fa-temperature-half"></i></td>
								<td>${temp_lazienka}&deg;C</td>
							</tr>
							<tr>
								<td><i class="${(swiatlo_lazienka == 1) ? `fa-solid yellow` : `fa-regular`} fa-lightbulb"></i></td>
								<td>
									<label class="switch">
										<input type="checkbox" ${(swiatlo_lazienka == 1) ? `checked` : ``} disabled>
										<span class="slider round"></span>
									</label>
								</td>
							</tr>
							<tr>
								<td><i class="fa-solid fa-shirt"></i><sub>pralka</sub></td>
								<td>
									<label class="switch">
										<input type="checkbox" ${(pralka == 1) ? `checked` : ``} disabled>
										<span class="slider round"></span>
									</label>
								</td>
							</tr>
							<tr>
								<td><i class="${(smart_plug == 1) ? `fa-solid fa-plug-circle-check` : `fa-solid fa-plug`}"></i><sub>grzejnik</sub></td>
								<td>
									<label class="switch">
										<input type="checkbox" ${(smart_plug == 1) ? `checked` : ``} disabled>
										<span class="slider round"></span>
									</label>
								</td>
							</tr>
						</table>
					</div>
				</div>
			</div>
		`;
	var card_salon = `
			<div class="card card-1x1">
				<div class="card-header">
					<span><i class="fa-solid fa-couch"></i> Salon</span>
				</div>
				<div class="card-content-wrapper">
					<div class="card-content">
						<table>
							<tr>
								<td><i class="fa-solid fa-temperature-half"></i></td>
								<td>${temp_salon_vilant}&deg;C</td>
							</tr>
							<tr>
								<td><i class="fa-solid fa-droplet blue"></i></td>
								<td>${wilg_wew}%</td>
							</tr>
							<tr>
								<td><i class="fa-brands fa-windows"></i></td>
								<td>
									<label class="switch">
										<input type="checkbox" ${(okno_salon == 1) ? `checked` : ``} disabled>
										<span class="slider round"></span>
									</label>
								</td>
							</tr>
						</table>
					</div>
				</div>
			</div>
		`;
	var card_fotowoltaika = `
			<div class="card card-1x2">
				<div class="card-header">
					<span><i class="fa-solid fa-solar-panel"></i> Fotowoltaika</span>
				</div>
				<div class="card-content-wrapper">
					<div class="card-content">
						<table>
							<tr>
								<td><i class="fa-solid fa-bolt"></i><sub>DC power</sub></td>
								<td>${pv_power} kW</td>
							</tr>
							<tr>
								<td><i class="fa-solid fa-bolt"></i><sub>prod.</sub></td>
								<td>${pv_produkcja_dzis} kWh</td>
							</tr>
							<tr>
								<td><i class="fa-solid fa-bolt"></i><sub>zużycie</sub></td>
								<td>${pv_konsumpcja_dzis} kWh</td>
							</tr>
							<tr>
								<td><i class="fa-solid fa-bolt"></i><sub>auto.</sub></td>
								<td>${pv_autokonsumpcja_dzis} kWh</td>
							</tr>
							<tr>
								<td><i class="fa-solid fa-bolt"></i><sub>obciąż.</sub></td>
								<td>${pv_akt_obciazenie} W</td>
							</tr>
							<tr>
								<td><i class="fa-solid fa-bolt"></i><sub>napięcie</sub></td>
								<td>${pv_napiecie} V</td>
							</tr>
							<tr>
								<td><i class="fa-solid fa-sack-dollar green"></i></td>
								<td>${pv_cena_sprzedazy} PLN</td>
							</tr>
							<tr>
								<td><i class="fa-solid fa-sack-dollar red"></i></td>
								<td>${pv_cena_zakupu} PLN</td>
							</tr>
						</table>
					</div>
				</div>
			</div>
		`;
	var card_nawo = `
		<div class="card card-1x2">
			<div class="card-header">
				<span><i class="fa-solid fa-plant-wilt"></i> Nawodnienie</span>
			</div>
			<div class="card-content-wrapper">
				<div class="card-content">
					<table>
						<tr>
							<td><i class="fa-solid fa-cloud-showers-heavy"></i></td>
							<td>
								<label class="switch">
									<input type="checkbox" ${(nawodnienie_aktywne == 1) ? `checked` : ``} disabled>
									<span class="slider round"></span>
								</label>
							</td>
						</tr>
					</table>
					<canvas id="canvas"></canvas>
				</div>
			</div>
		</div>
	`;
	var card_vilant = `
		<div class="card card-2x1">
			<div class="card-header">
				<span><i class="fa-solid fa-fire"></i> Vilant</span>
			</div>
			<div class="card-content-wrapper">
				<div class="card-content">
					<table>
						<tr>
							<td colspan="2" style="text-align: right;">Status pieca:</td>
							<td colspan="2" style="text-align: left;">${piec_status}</td>
						</tr>
						<tr>
							<td><i class="fa-solid fa-gauge-high"></i> ${parseFloat(cis_wody).toFixed(2)}&nbsp;bar</td>
							<td style="text-align: right"><i class="fa-solid fa-faucet-drip red"></i><sub>CWU</sub></td>
							<td>${temp_cwu}&deg;C</td>
							<td>
								<label class="switch">
									<input type="checkbox" ${(pompa_cwu == 1) ? `checked` : ``} disabled>
									<span class="slider round"></span>
								</label>
							</td>
						</tr>
						<tr>
							<td>Podłoga</td>
							<td>SP:${t_set_podloga}&deg;C</td>
							<td>PV:${t_zas_podloga}&deg;C</td>
							<td>
								<label class="switch">
									<input type="checkbox" ${(pompa_podloga == 1) ? `checked` : ``} disabled>
									<span class="slider round"></span>
								</label>
							</td>
						</tr>
						<tr>
							<td>Grzejniki</td>
							<td>SP:${t_set_grzejniki}&deg;C</td>
							<td>PV:${t_zas_grzejniki}&deg;C</td>
							<td>
								<label class="switch">
									<input type="checkbox" ${(pompa_grzej == 1) ? `checked` : ``} disabled>
									<span class="slider round"></span>
								</label>
							</td>
						</tr>
						<tr>
							<td>Grzałka: Akt.</td>
							<td>
								<label class="switch">
									<input type="checkbox" ${(grzalka_aktywna == 1) ? `checked` : ``} disabled>
									<span class="slider round"></span>
								</label>
							</td>
							<td>Załączona</td>
							<td>
								<label class="switch">
									<input type="checkbox" ${(grzalka_cwu == 1) ? `checked` : ``} disabled>
									<span class="slider round"></span>
								</label>
							</td>
						</tr>
					</table>
				</div>
			</div>
		</div>
	`;
	var card_garaz = `
		<div class="card card-1x1">
			<div class="card-header">
				<span><i class="fa-solid fa-car"></i> Garaż</span>
			</div>
			<div class="card-content-wrapper">
				<div class="card-content">
					<table>
						<tr>
							<td><i class="fa-solid fa-temperature-half"></i></td>
							<td>${temp_garaz}&deg;C</td>
						</tr>
						<tr>
							<td><i class="${(swiatlo_garaz == 1) ? `fa-solid yellow` : `fa-regular`} fa-lightbulb"></i></td>
							<td>
								<label class="switch">
									<input type="checkbox" ${(swiatlo_garaz == 1) ? `checked` : ``} disabled>
									<span class="slider round"></span>
								</label>
							</td>
						</tr>
						<tr>
							<td><i class="fa-solid fa-water"></i><sub>zmięk.</sub></td>
							<td>
								<label class="switch">
									<input type="checkbox" ${(zmiekczacz == 1) ? `checked` : ``} disabled>
									<span class="slider round"></span>
								</label>
							</td>
						</tr>
						<tr>
							<td><i class="fa-solid fa-warehouse"></i></td>
							<td>
								<label class="switch">
									<input type="checkbox" ${(brama_garaz == 1) ? `checked` : ``} disabled>
									<span class="slider round"></span>
								</label>
							</td>
						</tr>
					</table>
				</div>
			</div>
		</div>
	`;
	var card_drzwi = `
		<div class="card card-1x1">
			<div class="card-header">
				<span><i class="fa-solid fa-door-closed"></i> Drzwi</span>
			</div>
			<div class="card-content-wrapper">
				<div class="card-content">
					<table>
						<tr>
							<td><i class="fa-solid ${drzwi_wej == 1 ? `fa-door-open` : `fa-door-closed`}"></i><sub>&nbsp;wej.</sub></td>
							<td>
								<label class="switch">
									<input type="checkbox" ${(drzwi_wej == 1) ? `checked` : ``} disabled>
									<span class="slider round"></span>
								</label>
							</td>
						</tr>
						<tr>
							<td><i class="fa-solid ${drzwi_gosp == 1 ? `fa-door-open` : `fa-door-closed`}"></i><sub>&nbsp;gosp.</sub></td>
							<td>
								<label class="switch">
									<input type="checkbox" ${(drzwi_gosp == 1) ? `checked` : ``} disabled>
									<span class="slider round"></span>
								</label>
							</td>
						</tr>
						<tr>
							<td><i class="fa-solid fa-road-barrier"></i><sub>&nbsp;wjazd</sub></td>
							<td>
								<label class="switch">
									<input type="checkbox" ${(brama_wjazd == 1) ? `checked` : ``} disabled>
									<span class="slider round"></span>
								</label>
							</td>
						</tr>
					</table>
				</div>
			</div>
		</div>
	`;
	var card_media = `
		<div class="card card-1x1" onclick="show_chart(1)">
			<div class="card-header">
				<span><i class="fa-solid fa-industry"></i> Media</span>
			</div>
			<div class="card-content-wrapper">
				<div class="card-content">
					<table>
						<tr>
							<td><i class="fa-solid fa-faucet-drip blue"></i></td>
							<td>
								<span>${ilosc_woda_dom} l</span>
								<label class="switch">
									<input type="checkbox" ${(zawor_wod_dom == 1) ? `checked` : ``} disabled>
									<span class="slider round"></span>
								</label>
							</td>
						</tr>
						<tr>
							<td><i class="fa-solid fa-fire-flame-simple yellow"></i><sub>CO</sub></td>
							<td>${gaz_co} m<sup>3</sup></td>
						</tr>
						<tr>
							<td><i class="fa-solid fa-fire-flame-simple yellow"></i><sub>CWU</sub></td>
							<td>${gaz_cwu} m<sup>3</sup></td>
						</tr>
						<tr>
							<td><i class="fa-solid fa-bolt red"></i></td>
							<td>${enea_import} kWh</td>
						</tr>
					</table>
				</div>
			</div>
		</div>
	`;
	var card_temperatury = `
		<div class="card card-1x1">
			<div class="card-header">
				<span><i class="fa-solid fa-temperature-full"></i> Temperatury</span>
			</div>
			<div class="card-content-wrapper">
				<div class="card-content">
					<table>
						<tr>
							<td><i class="fa-solid fa-temperature-half"></i><sub>piętro</sub></td>
							<td>${temp_pietro}&deg;C</td>
						</tr>
						<tr>
							<td><i class="fa-solid fa-temperature-half"></i><sub>strych</sub></td>
							<td>${temp_strych}&deg;C</td>
						</tr>
						<tr>
							<td><i class="fa-solid fa-temperature-half"></i><sub>strych gar.</sub></td>
							<td>${temp_strych_garaz}&deg;C</td>
						</tr>
					</table>
				</div>
			</div>
		</div>
	`;
	var card_inne = `
		<div class="card card-1x1">
			<div class="card-header">
				<span><i class="fa-solid fa-otter"></i> Inne</span>
			</div>
			<div class="card-content-wrapper">
				<div class="card-content">
					<table>
						<tr>
							<td><i class="fa-solid fa-biohazard"></i><sub>ścieki</sub></td>
							<td>
								<label class="switch">
									<input type="checkbox" ${(pompa_scieki == 1) ? `checked` : ``} disabled>
									<span class="slider round"></span>
								</label>
							</td>
						</tr>
						<tr>
							<td><i class="fa-solid fa-utensils"></i><sub>&nbsp;&nbsp;zmyw.</sub></td>
							<td>
								<label class="switch">
									<input type="checkbox" ${(zmywarka == 1) ? `checked` : ``} disabled>
									<span class="slider round"></span>
								</label>
							</td>
						</tr>
						<tr>
							<td><i class="${(swiatlo_pom_gosp == 1) ? `fa-solid yellow` : `fa-regular`} fa-lightbulb"></i><sub>pom. gosp.</sub></td>
							<td>
								<label class="switch">
									<input type="checkbox" ${(swiatlo_pom_gosp == 1) ? `checked` : ``} disabled>
									<span class="slider round"></span>
								</label>
							</td>
						</tr>
						<tr>
							<td><i class="${(swiatlo_strych == 1) ? `fa-solid yellow` : `fa-regular`} fa-lightbulb"></i><sub>strych</sub></td>
							<td>
								<label class="switch">
									<input type="checkbox" ${(swiatlo_strych == 1) ? `checked` : ``} disabled>
									<span class="slider round"></span>
								</label>
							</td>
						</tr>
					</table>
				</div>
			</div>
		</div>
	`;
	var card_undefined = `
		<div class="card card-1x1">
			<div class="card-header">
				<span><i class="fa-solid fa-question"></i> ???</span>
			</div>
			<div class="card-content-wrapper">
				<div class="card-content">
					<span>???</span>
					<span>???</span>
				</div>
			</div>
		</div>
	`;
	var card_invisible = `
		<div class="card card-1x1" style="opacity: 0;">
			<div class="card-header">
				<span><i class="fa-solid fa-question"></i> ???</span>
			</div>
			<div class="card-content-wrapper">
				<div class="card-content">
					<span>???</span>
					<span>???</span>
				</div>
			</div>
		</div>
	`;

	// === TWORZENIE TYCH NO ===
	var last_updated = new Date(g_ts_response['feeds'][0]['created_at']);
	last_updated = last_updated.toLocaleString('en-GB', { timeZone: 'Europe/Warsaw' }).replace(',', '').replaceAll('/', '.');
	document.getElementById('lastupdated').innerHTML = `${last_updated}`;
	buf += `<div class="row">`;
	buf += `<div class="outer-row-box">`;
	buf += card_pogoda;
	buf += `</div>`;
	buf += `<div class="outer-row-box">`;
	buf += card_lazienka;
	buf += card_salon;
	buf += `</div>`;
	buf += `</div>`;

	buf += `<div class="row">`;
	buf += `<div class="outer-row-box">`;
	buf += `<div class="inner-column">`;
	buf += card_fotowoltaika;
	buf += `</div>`;
	buf += `<div class="inner-column">`;
	buf += card_media;
	buf += card_temperatury;
	buf += `</div>`;
	buf += `</div>`;
	buf += `<div class="outer-row-box">`;
	buf += `<div class="inner-column">`;
	buf += card_garaz;
	buf += card_drzwi;
	buf += `</div>`;
	buf += `<div class="inner-column">`;
	buf += card_nawo;
	buf += `</div>`;
	buf += `</div>`;
	buf += `</div>`;

	buf += `<div class="row">`;
	buf += `<div class="outer-row-box">`;
	buf += card_vilant;
	buf += `</div>`;
	buf += `<div class="outer-row-box">`;
	buf += card_inne;
	buf += card_invisible;
	buf += `</div>`;
	buf += `</div>`;
	
	buf += `<div id="modal-weather" class="chart-modal">`;
	buf += `<div class="chart-modal-content">`;
	buf += `<span>Wykres temperatury</span>`;
	buf += `<span class="close">&times;</span>`;
	buf += `<iframe width="100%" height="400" style="border: 0;" src="https://thingspeak.mathworks.com/channels/432818/charts/2?dynamic=true&results=240&export=true&width=auto&height=auto"></iframe>`;
	buf += `</div>`;
	buf += `</div>`;

	buf += `<div id="modal-media" class="chart-modal">`;
	buf += `<div class="chart-modal-content">`;
	buf += `<span>Wykresy mediów</span>`;
	buf += `<span class="close">&times;</span>`;
	buf += `<div id="media_chart_container"></div>`;
	buf += `</div>`;
	buf += `</div>`;
	document.getElementById('main').innerHTML += buf;

	// HIGHCHARTS SETUP
	const chart = Highcharts.chart("media_chart_container", {
		chart: { type: "line" },
		title: { text: undefined },
		xAxis: {
			categories: [],
			type: 'datetime',
			labels: {
				formatter: function() {
					return Highcharts.dateFormat('%H:%M', this.value)
				}
			}
		},
		yAxis: [
			{
				title: { text: undefined },
				labels: { enabled: false }
			},
			{
				title: { text: undefined },
				labels: { enabled: false }
			}
		],
		plotOptions: {
			line: { dataLabels: { enabled: true }, enableMouseTracking: true },
			series: { animation: { duration: 1200 } },
		},
		tooltip: { shared: true, crosshairs: true },
		series: [
			{
				name: "CO",
				data: [],
				animation: { defer: 1200 },
				pointStart: Date.UTC(split_date_a[0], split_date_a[1] - 1, split_date_a[2], split_date_a[3], split_date_a[4], split_date_a[5]),
				pointInterval: 180 * 1000 // 3 min
			},
			{
				name: "CWU",
				data: [],
				animation: { defer: 2500 },
				pointStart: Date.UTC(split_date_a[0], split_date_a[1] - 1, split_date_a[2], split_date_a[3], split_date_a[4], split_date_a[5]),
				pointInterval: 180 * 1000 // 3 min
			},
			{
				name: "Woda",
				data: [],
				animation: { defer: 3800 },
				pointStart: Date.UTC(split_date_b[0], split_date_b[1] - 1, split_date_b[2], split_date_b[3], split_date_b[4], split_date_b[5]),
				pointInterval: 360 * 1000, // 6 min
				yAxis: 1
			},
			{
				name: "Prąd",
				data: [],
				animation: { defer: 5100 },
				pointStart: Date.UTC(split_date_c[0], split_date_c[1] - 1, split_date_c[2], split_date_c[3], split_date_c[4], split_date_c[5]),
				pointInterval: 360 * 1000 // 6 min
			}
		],
		accessibility: { enabled: false },
		credits: { enabled: false },
	});

	chart.series[0].setData(response_a1, false);
	chart.series[1].setData(response_a2, false);
	chart.series[2].setData(response_b, false);
	chart.series[3].setData(response_c, false);

	chart.redraw();

	// rysowanie canvas
	var canvas = document.getElementById('canvas');

	var additional_offset = 0;
	if (width > 1080) additional_offset = 0;
	else additional_offset = 200;
	// var additional_offset = (width > 1080) ? 150 : 0;

	canvas.height = canvas.offsetHeight + additional_offset;
	canvas.width = canvas.offsetWidth + additional_offset;

	draw_canvas();
}

function remote_control()
{
	document.getElementById('main').innerHTML = '';
	document.getElementById('main').style.height = '100vh';
	var buf = "";
	buf += `<div class="buttons">`;
	buf += `<table>`;
	buf += `<tr>`;
	buf += `<td><button type="button" onclick="loadXMLDoc(1001)">CWU ON</button></td>`;
	buf += `<td><button type="button" onclick="loadXMLDoc(1002)">CWU OFF</button></td>`;
	buf += `</tr>`;
	buf += `<tr>`;
	buf += `<td><button type="button" onclick="loadXMLDoc(1003)">NAWO ON</button></td>`;
	buf += `<td><button type="button" onclick="loadXMLDoc(1004)">NAWO OFF</button></td>`;
	buf += `</tr>`;
	buf += `<tr>`;
	buf += `<td><button type="button" onclick="loadXMLDoc(1005)">COS ON</button></td>`;
	buf += `<td><button type="button" onclick="loadXMLDoc(1006)">COS OFF</button></td>`;
	buf += `</tr>`;
	buf += `</table>`;
	buf += `<div id="result"></div>`;
	buf += `</div>`;
	buf += `<button onclick="thingspeak_fields()">Powrót</button>`;

	document.getElementById('main').innerHTML += buf;
}

function show_chart(_type)
{
	var modal_weather = document.getElementById('modal-weather');
	var modal_media = document.getElementById('modal-media');
	var close_1 = document.getElementsByClassName('close')[0];
	var close_2 = document.getElementsByClassName('close')[1];
	switch (_type)
	{
		case 0:
		{
			modal_weather.style.visibility = 'visible';
			close_1.onclick = function()
			{
				modal_weather.style.visibility = 'hidden';
			}
			window.onclick = function(event)
			{
				if (event.target == modal_weather) modal_weather.style.visibility = 'hidden';
			}
			break;
		}
		case 1:
		{
			modal_media.style.visibility = 'visible';
			close_2.onclick = function()
			{
				modal_media.style.visibility = 'hidden';
			}
			window.onclick = function(event)
			{
				if (event.target == modal_media) modal_media.style.visibility = 'hidden';
			}
			break;
		}
	}
}

function loadXMLDoc(_cmdstr)
{
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function()
	{
		if (this.readyState == 4 && this.status == 200)
		{
			fetch('https://api.thingspeak.com/talkbacks/32600/commands.json?api_key=XBAUGXOD6LHDGDE0').then((res) => res.text()).then((command_list) => {
				command_list = JSON.parse(command_list);
				document.getElementById("result").innerHTML = command_list;
			}).catch((e) => console.error(e));
		}
	};
	xhttp.open('POST', `https://api.thingspeak.com/talkbacks/32600/commands?api_key=XBAUGXOD6LHDGDE0&command_string=${_cmdstr}`, true);
	xhttp.send();
}

// canvas nawo
function draw_canvas()
{
	var ctx = canvas.getContext('2d');
	var zbiorniki_odstep = 35, linia_gora_odstep = 35;
	var zbiornik2_width = 90;
	var zbiornik2_height = 360;
	var zbiornik1_width = 150;
	var zbiornik1_height = 180;
	var total_width = zbiornik2_width + zbiornik1_width + zbiorniki_odstep;
	var start_x = (canvas.width - total_width) / 2
	var zbiornik2 = { x: start_x, y: 100, width: zbiornik2_width, height: zbiornik2_height }; // zbiornik cienki
	var zbiornik1 = { x: zbiornik2.x + zbiornik2.width + zbiorniki_odstep, y: 100, width: zbiornik1_width, height: zbiornik1_height };

	// poziom wypelnienia
	var zbiornik1_wypelnienie, zbiornik2_wypelnienie;

	if (min_zbiornik == 0 && med_zbiornik == 0 && max_zbiornik == 0)
	{
		zbiornik1_wypelnienie = 0.0;
	}
	else if (min_zbiornik == 1 && med_zbiornik == 0 && max_zbiornik == 0)
	{
		zbiornik1_wypelnienie = 0.3;
	}
	else if (min_zbiornik == 1 && med_zbiornik == 1 && max_zbiornik == 0)
	{
		zbiornik1_wypelnienie = 0.6;
	}
	else if (min_zbiornik == 1 && med_zbiornik == 1 && max_zbiornik == 1)
	{
		zbiornik1_wypelnienie = 1.0;
	}

	if (min_studnia == 0 && max_studnia == 0)
	{
		zbiornik2_wypelnienie = 0.0;
	}
	else if (min_studnia == 1 && max_studnia == 0)
	{
		zbiornik2_wypelnienie = 0.5;
	}
	else if (min_studnia == 1 && max_studnia == 1)
	{
		zbiornik2_wypelnienie = 1.0;
	}

	// wybrana pompa i czy dziala
	var zbiornik1_pompa_color, zbiornik2_pompa_color;
	if (p_studnia_zbiornik == 0)
	{
		zbiornik1_pompa_color = 'yellow';
		zbiornik2_pompa_color = 'gray';
		if (pompa_zbiornik == 1)
		{
			zbiornik1_pompa_color = 'lime';
		}
	}
	else
	{
		zbiornik1_pompa_color = 'gray';
		zbiornik2_pompa_color = 'yellow';
		if (pompa_studnia == 1)
		{
			zbiornik2_pompa_color = 'lime';
		}
	}

	function draw_container(container)
	{
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(container.x, container.y + container.height);
		ctx.lineTo(container.x, container.y);
		ctx.moveTo(container.x + container.width, container.y);
		ctx.lineTo(container.x + container.width, container.y + container.height);
		ctx.moveTo(container.x, container.y + container.height);
		ctx.lineTo(container.x + container.width, container.y + container.height);
		ctx.stroke();
	}

	function fill_container(container, fillLevel, color)
	{
		const fillHeight = container.height * fillLevel;
		ctx.fillStyle = color;
		ctx.fillRect(container.x, container.y + (container.height - fillHeight), container.width, fillHeight);
	}

	function draw_top_line()
	{
		const topLineY = zbiornik1.y - linia_gora_odstep;
		const startX = zbiornik2.x + zbiornik2.width / 2;
		const endX = zbiornik1.x + zbiornik1.width / 2;
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(startX, topLineY);
		ctx.lineTo(endX, topLineY);
		ctx.stroke();
	}

	function draw_dropping_lines()
	{
		draw_dropping_line(zbiornik1, zbiornik1_pompa_color, 'P2');
		draw_dropping_line(zbiornik2, zbiornik2_pompa_color, 'P1');
	}

	function draw_dropping_line(container, color, text)
	{
		ctx.strokeStyle = 'black';
		ctx.beginPath();
		const mid_x = container.x + container.width / 2;
		const top_line_y = zbiornik1.y - linia_gora_odstep;
		const circle_y = container.y + container.height - 20;
		ctx.moveTo(mid_x, top_line_y);
		ctx.lineTo(mid_x, circle_y);
		ctx.stroke();
		
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.arc(mid_x, circle_y, 15, 0, Math.PI * 2);
		ctx.fill();

		ctx.fillStyle = 'black';
		ctx.font = '14px Arial';
		ctx.fillText(text, mid_x - 8, circle_y + 4);
	}

	function draw_labels(container, label_count)
	{
		ctx.fillStyle = 'black';
		ctx.font = '14px Arial';
		
		switch (label_count)
		{
			case 2:
				ctx.fillText('min', container.x + 5, container.y + container.height - 5);
				ctx.fillText('max', container.x + 5, container.y + 15);
				break;
			case 3:
				ctx.fillText('min', container.x + 5, container.y + container.height - 5);
				ctx.fillText('med', container.x + 5, container.y + container.height / 2 + 5);
				ctx.fillText('max', container.x + 5, container.y + 15);
				break;
		}
				
		ctx.font = '18px Arial';
		ctx.fillText(`Wydano ${ilosc_woda_ogrod} l`, 200, 350);
	}

	draw_top_line();
	draw_container(zbiornik1);
	draw_container(zbiornik2);
	fill_container(zbiornik1, zbiornik1_wypelnienie, '#a2bffe');
	fill_container(zbiornik2, zbiornik2_wypelnienie, '#a2bffe');
	draw_dropping_lines();
	draw_labels(zbiornik1, 3);
	draw_labels(zbiornik2, 2);
}

window.onload = function()
{
	check_viewport()
	thingspeak_fields();
}