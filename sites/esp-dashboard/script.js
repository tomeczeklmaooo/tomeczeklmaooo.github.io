// ARDUINO BITREAD JS
// #define bitRead(value, bit) (((value) >> (bit)) & 0x01)
function bitRead(value, bit)
{
	return (value >> bit) & 0x01;
}

// THINGSPEAK FIELDS
var g_ts_response;
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
var empty_1, empty_2;
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
	fetch('https://corsproxy.io/?https://thingspeak.mathworks.com/channels/432818/status/last.json').then((res) => res.text()).then((response) => {
		g_ts_response = JSON.parse(response);

		wartosci = g_ts_response['status'].split('|');

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
		empty_1                = bitRead(zakodowany_boolean, 6);
		empty_2                = bitRead(zakodowany_boolean, 7);
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
		}

		// odwloania funkcji ktore potrzebuja tych zmiennych ponizej
		generate_squares();
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
	var buf = "";
	// === KARTY ===
	var card_pogoda = `
			<div class="card card-2x1">
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
								<td>${pv_power} W</td>
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
							<tr>
								<td><i class="fa-solid fa-fire-flame-curved"></i><sub>CWU</sub></td>
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
	var card_nawo = `
		<div class="card card-1x2">
			<div class="card-header">
				<span><i class="fa-solid fa-plant-wilt"></i> Nawodnienie</span>
			</div>
			<div class="card-content-wrapper">
				<div class="card-content">
					<img src="nawo.png" width="100%">
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
							<td colspan="4" style="text-align: center;">${piec_status}</td>
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
		<div class="card card-1x1">
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
	var last_updated = new Date(g_ts_response['created_at']);
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
	document.getElementById('main').innerHTML += buf;
}

window.onload = function()
{
	check_viewport();
	thingspeak_fields();
}