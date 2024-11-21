// ARDUINO BITREAD JS
// #define bitRead(value, bit) (((value) >> (bit)) & 0x01)
function bitRead(value, bit)
{
	return (value >> bit) & 0x01;
}

// THINGSPEAK FIELDS
var g_ts_response;
var wartosci;
var unix_time;
var temp_zew_bmp, temp_zew_vilant, wilg_zew;
var opady_dzis, cisnienie;
var temp_salon_bmp, temp_salon_vilant, temp_pietro, temp_garaz, temp_strych_garaz, temp_strych, temp_lazienka, wilg_wew;
var stan_pieca, cis_wody, gaz_co, gaz_cwu, temp_cwu, t_set_podloga, t_zas_podloga, t_set_grzejniki, t_zas_grzejniki;
var ilosc_woda_dom, ilosc_woda_ogrod;
var pv_produkcja_dzis, pv_konsumpcja_dzis, pv_autokonsumpcja_dzis, pv_akt_obciazenie, pv_power, pv_napiecie, pv_cena_sprzedazy, pv_cena_zakupu;
var zakodowany_boolean;
// zmienne z zakodowanego booleana
var drzwi_gosp, brama_wjazd, brama_garaz, okno_salon;
var smart_plug;
var empty_1, empty_2, empty_3;
var swiatlo_lazienka, swiatlo_garaz, swiatlo_pom_gosp, swiatlo_strych;
var pralka, zmywarka;
var fox_online;
var drzwi_wej;
var min_zbiornik, med_zbiornik, max_zbiornik, min_studnia, max_studnia;
var p_studnia_zbiornik;
var max_scieki;
var zmiekczacz;
var pompa_grzej, pompa_podloga, pompa_pieca, grzalka_cwu, pompa_cwu, pompa_scieki, pompa_studnia, pompa_zbiornik;

function thingspeakFields()
{
	fetch('https://corsproxy.io/?https://thingspeak.mathworks.com/channels/432818/status/last.json').then((res) => res.text()).then((response) => {
		g_ts_response = JSON.parse(response);

		wartosci = g_ts_response['status'].split('|');

		unix_time              = wartosci[0];
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

		drzwi_gosp             = bitRead(zakodowany_boolean, 0);
		brama_wjazd            = bitRead(zakodowany_boolean, 1);
		brama_garaz            = bitRead(zakodowany_boolean, 2);
		okno_salon             = bitRead(zakodowany_boolean, 3);
		smart_plug             = bitRead(zakodowany_boolean, 4);
		empty_1                = bitRead(zakodowany_boolean, 5);
		empty_2                = bitRead(zakodowany_boolean, 6);
		empty_3                = bitRead(zakodowany_boolean, 7);
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

		// odwloania funkcji ktore potrzebuja tych zmiennych ponizej
		generateSquares();
	}).catch((e) => console.error(e));
}

var width, height;

function checkViewport()
{
	width = window.innerWidth;
	height = window.innerHeight;
}

function generateSquares()
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
						<span><i class="fa-solid fa-temperature-half"></i> ${temp_zew_vilant} &deg;C</span>
						<span><i class="fa-solid fa-droplet blue"></i> ${wilg_zew}%</span>
						<span><i class="fa-solid fa-gauge"></i> ${cisnienie} hPa</span>
					</div>
					<div class="card-content">
						<span><i class="fa-solid fa-cloud-rain blue"></i> ${opady_dzis} l/m<sup>2</sup></span>
						<span><i class="fa-regular fa-sun yellow"></i>&uarr; 07:15</span>
						<span><i class="fa-solid fa-sun yellow"></i>&darr; 15:54</span>
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
						<span><i class="fa-solid fa-temperature-half"></i> ${temp_lazienka} &deg;C</span>
						<span>
							<i class="${(swiatlo_lazienka == 1) ? `fa-solid yellow` : `fa-regular`} fa-lightbulb"></i>
							<label class="switch">
								<input type="checkbox" ${(swiatlo_lazienka == 1) ? `checked` : ``} disabled>
								<span class="slider round"></span>
							</label>
						</span>
						<span>
							<i class="${(smart_plug == 1) ? `fa-solid fa-plug-circle-check` : `fa-solid fa-plug`}"></i>
							<label class="switch">
								<input type="checkbox" ${(smart_plug == 1) ? `checked` : ``} disabled>
								<span class="slider round"></span>
							</label>
						</span>
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
						<span><i class="fa-solid fa-temperature-half"></i> ${temp_salon_vilant} &deg;C</span>
						<span><i class="fa-solid fa-droplet blue"></i> ${wilg_wew}%</span>
					</div>
				</div>
			</div>
		`;
	var card_tall = `
			<div class="card card-1x2">
				<div class="card-header">
					<span><i class="fa-solid fa-couch"></i> Salon</span>
				</div>
				<div class="card-content-wrapper">
					<div class="card-content">
						<span><i class="fa-solid fa-temperature-half"></i> ${temp_salon_vilant} &deg;C</span>
						<span><i class="fa-solid fa-droplet blue"></i> ${wilg_wew}%</span>
					</div>
				</div>
			</div>
		`;

	// === TWORZENIE TYCH NO ===
	document.getElementById('lastupdated').innerHTML = `Ost. akt.: ${g_ts_response['created_at']}`;
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
	buf += card_tall;
	buf += card_salon;
	buf += `</div>`;
	buf += `<div class="outer-row-box">`;
	buf += card_salon;
	buf += card_salon;
	buf += `</div>`;
	buf += `</div>`;
	document.getElementById('main').innerHTML += buf;
}

window.onload = function()
{
	checkViewport();
	thingspeakFields();
}