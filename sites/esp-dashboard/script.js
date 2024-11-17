var width, height;

function checkViewport()
{
	width = window.innerWidth;
	height = window.innerHeight;
}

function generateSquares()
{
	var buf = "";
	var card_1x1 = `
		<div class="card-1x1">
			<div class="card-header">
				<span>
					[ICON] [CARD TITLE]
				</span>
			</div>
			<div class="card-content">
				<span>[CARD CONTENT]</span>
			</div>
		</div>
	`;

	if (width < 800)
	{
		for (var i; i < 4; i++)
		{
			buf += `<div class="row">`;
			buf += `<div class="outer-row-box">`;
			for (var k; k < 2; k++)
			{
				buf += card_1x1;
			}
			buf += `</div>`;
			buf += `</div>`;
		}
		document.getElementById('main').innerHTML += buf;
	}
	else
	{
		for (var i; i < 2; i++)
		{
			buf += `<div class="row">`;
			for (var j; j < 2; j++)
			{
				buf += `<div class="outer-row-box">`;
				for (var k; k < 2; k++)
				{
					buf += card_1x1;
				}
				buf += `</div>`;
			}
			buf += `</div>`;
		}
		document.getElementById('main').innerHTML += buf;
	}
}

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
var empty_1, empty_2, empty_3, empty_4;
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
		empty_1                = bitRead(zakodowany_boolean, 4);
		empty_2                = bitRead(zakodowany_boolean, 5);
		empty_3                = bitRead(zakodowany_boolean, 6);
		empty_4                = bitRead(zakodowany_boolean, 7);
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
		print_fields('fields');
	}).catch((e) => console.error(e));
}

function print_fields(_elem)
{
	var elem = document.getElementById(_elem);

	elem.innerHTML += `unix_time: ${unix_time}<br>`;
	elem.innerHTML += `temp_zew_bmp: ${temp_zew_bmp}<br>`;
	elem.innerHTML += `temp_zew_vilant: ${temp_zew_vilant}<br>`;
	elem.innerHTML += `wilg_zew: ${wilg_zew}<br>`;
	elem.innerHTML += `opady_dzis: ${opady_dzis}<br>`;
	elem.innerHTML += `cisnienie: ${cisnienie}<br>`;
	elem.innerHTML += `temp_salon_bmp: ${temp_salon_bmp}<br>`;
	elem.innerHTML += `temp_salon_vilant: ${temp_salon_vilant}<br>`;
	elem.innerHTML += `temp_pietro: ${temp_pietro}<br>`;
	elem.innerHTML += `temp_garaz: ${temp_garaz}<br>`;
	elem.innerHTML += `temp_strych_garaz: ${temp_strych_garaz}<br>`;
	elem.innerHTML += `temp_strych: ${temp_strych}<br>`;
	elem.innerHTML += `temp_lazienka: ${temp_lazienka}<br>`;
	elem.innerHTML += `wilg_zew: ${wilg_wew}<br>`;
	elem.innerHTML += `stan_pieca: ${stan_pieca}<br>`;
	elem.innerHTML += `cis_wody: ${cis_wody}<br>`;
	elem.innerHTML += `gaz_co: ${gaz_co}<br>`;
	elem.innerHTML += `gaz_cwu: ${gaz_cwu}<br>`;
	elem.innerHTML += `temp_cwu: ${temp_cwu}<br>`;
	elem.innerHTML += `t_set_podloga: ${t_set_podloga}<br>`;
	elem.innerHTML += `t_zas_podloga: ${t_zas_podloga}<br>`;
	elem.innerHTML += `t_set_grzejniki: ${t_set_grzejniki}<br>`;
	elem.innerHTML += `t_zas_grzejniki: ${t_zas_grzejniki}<br>`;
	elem.innerHTML += `ilosc_woda_dom: ${ilosc_woda_dom}<br>`;
	elem.innerHTML += `ilosc_woda_ogrod: ${ilosc_woda_ogrod}<br>`;
	elem.innerHTML += `pv_produkcja_dzis: ${pv_produkcja_dzis}<br>`;
	elem.innerHTML += `pc_konsumpcja_dzis: ${pv_konsumpcja_dzis}<br>`;
	elem.innerHTML += `pv_autokonsumpcja_dzis: ${pv_autokonsumpcja_dzis}<br>`;
	elem.innerHTML += `pv_akt_obciazenie: ${pv_akt_obciazenie}<br>`;
	elem.innerHTML += `pv_power: ${pv_power}<br>`;
	elem.innerHTML += `pv_napiecie: ${pv_napiecie}<br>`;
	elem.innerHTML += `pv_cena_sprzedazy: ${pv_cena_sprzedazy}<br>`;
	elem.innerHTML += `pv_cena_zakupu: ${pv_cena_zakupu}<br>`;
	elem.innerHTML += `zakodowany_boolean: ${zakodowany_boolean}<br>`;
	elem.innerHTML += `<br>`;

	elem.innerHTML += `drzwi_gosp: ${drzwi_gosp}<br>`;
	elem.innerHTML += `brama_wjazd: ${brama_wjazd}<br>`;
	elem.innerHTML += `brama_garaz: ${brama_garaz}<br>`;
	elem.innerHTML += `okno_salon: ${okno_salon}<br>`;
	elem.innerHTML += `empty_1: ${empty_1}<br>`;
	elem.innerHTML += `empty_2: ${empty_2}<br>`;
	elem.innerHTML += `empty_3: ${empty_3}<br>`;
	elem.innerHTML += `empty_4: ${empty_4}<br>`;
	elem.innerHTML += `swiatlo_lazienka: ${swiatlo_lazienka}<br>`;
	elem.innerHTML += `swiatlo_garaz: ${swiatlo_garaz}<br>`;
	elem.innerHTML += `swiatlo_pom_gosp: ${swiatlo_pom_gosp}<br>`;
	elem.innerHTML += `swiatlo_strych: ${swiatlo_strych}<br>`;
	elem.innerHTML += `pralka: ${pralka}<br>`;
	elem.innerHTML += `zmywarka: ${zmywarka}<br>`;
	elem.innerHTML += `fox_online: ${fox_online}<br>`;
	elem.innerHTML += `drzwi_wej: ${drzwi_wej}<br>`;
	elem.innerHTML += `min_zbiornik: ${min_zbiornik}<br>`;
	elem.innerHTML += `med_zbiornik: ${med_zbiornik}<br>`;
	elem.innerHTML += `max_zbiornik: ${max_zbiornik}<br>`;
	elem.innerHTML += `min_studnia: ${min_studnia}<br>`;
	elem.innerHTML += `max_studnia: ${max_studnia}<br>`;
	elem.innerHTML += `p_studnia_zbiornik: ${p_studnia_zbiornik}<br>`;
	elem.innerHTML += `max_scieki: ${max_scieki}<br>`;
	elem.innerHTML += `zmiekczacz: ${zmiekczacz}<br>`;
	elem.innerHTML += `pompa_grzej: ${pompa_grzej}<br>`;
	elem.innerHTML += `pompa_podloga: ${pompa_podloga}<br>`;
	elem.innerHTML += `pompa_pieca: ${pompa_pieca}<br>`;
	elem.innerHTML += `grzalka_cwu: ${grzalka_cwu}<br>`;
	elem.innerHTML += `pompa_cwu: ${pompa_cwu}<br>`;
	elem.innerHTML += `pompa_scieki: ${pompa_scieki}<br>`;
	elem.innerHTML += `pompa_studnia: ${pompa_studnia}<br>`;
	elem.innerHTML += `pompa_zbiornik: ${pompa_zbiornik}<br>`;
}

window.onload = function()
{
	// checkViewport();
	// generateSquares();
	thingspeakFields();
}