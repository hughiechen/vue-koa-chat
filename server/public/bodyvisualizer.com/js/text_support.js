// ***************************************************************** LICENSE AND COPYRIGHT *****************************************************************
// 
// Copyright Max Planck Gesellshaft, 2011
// 
// All software, data, text, and design used in this web application is the sole property of the Max Plank Gesellshaft and/or Brown University. 
// This application is provided solely for research and personal use.  Commercial use and reverse engineering of this application is explicitly prohibited.
// No warranty or suitability for any purpose is implied. 
// 
// Commercial licensing requests should be directed to Michael Black <black@is.mpg.de> .
// 
// Patents pending.
//
// *********************************************************************************************************************************************************

var measurement_descriptions = {}

var english_measurement_descriptions = {
'Height' :
"Stand with the back of your head against the stadiometer&#39;s measuring stick. Keep your chin level, and do not tilt your head up or down. Move the measurement instrument to the top of your head, and note the measurement.",

'Weight' :
"Your weight, as measured by a standard bathroom scale.",

'Age' :
"Your current age in years.",

'Chest' :
"Measure the circumference of your chest at your nipple level. Hold the end of the measuring tape in the middle of your chest at your nipple level.\n\nEvenly wrap the measuring tape around your chest. Note the measurement at the point where the tape measure meets at the 0 mark.",

'Waist' :
"Measure the circumference of your waist at your preferred waistline. Your preferred waistline is where you typically wear the waist of your pants.\n\nAfter exhaling, hold the beginning of the measuring tape in front of your body in the middle of your waistline. Evenly wrap the measuring tape around your waist. Note the measurement at the point where the tape measure meets at the 0 mark.",

'Hips' :
"Measure the circumference of your hips at the level where your hips are widest.\n\nHold the beginning of the measuring tape in front of your body in the middle of your hip line. Evenly wrap the measuring tape around your hips. Note the measurement at the point where the tape measure meets at the 0 mark.",

'Inseam' :
"Measure your inseam from your crotch to the floor. Your crotch is the inner, uppermost point of leg.\n\nHold the beginning of the tape measure at your crotch. Make sure you are holding it at the 0 mark. Pull the tape measure down to the floor where your foot is situated. Note the measurement at the point where the tape measure meets at the 0 mark.",

'Activity' :
"Indicate your fitness level by specifying the hours per week you engage in structured physical activites",

'general_advice' :
"Note: When taking your measurements, relax your muscles and stand with weight equally distributed on both feet. Make sure that the measuring tape is kept at an even horizontal level around your body."
}

measurement_descriptions['english'] = english_measurement_descriptions;
measurement_descriptions['german'] = english_measurement_descriptions;

translations = {
	'#main-title' : { 'english' : ['Body Visualizer', 'Female', 'Male'], 'german' : ['K\366rper Visualizer', 'Weibliche', 'M\344nnliche'] },
	'#switch_gender_link' : { 'english' : ['switch to female', 'switch to male'], 'german' : ['Umschalten auf Weiblich', 'Umschalten auf M\344nnlich'] },
	'#height-slider-label' : { 'english' : ['Height'], 'german' : ['Gr\366\337e'] },
	'#age-slider-label' : { 'english' : ['Age'], 'german' : ['Alter'] },
	'#weight-slider-label' : { 'english' : ['Weight'], 'german' : ['Gewicht'] },
	'#chest-slider-label' : { 'english' : ['Chest'], 'german' : ['Brust'] },
	'#waist-slider-label' : { 'english' : ['Waist'], 'german' : ['Taille'] },
	'#hips-slider-label' : { 'english' : ['Hips'], 'german' : ['H\374fte'] },
	'#inseam-slider-label' : { 'english' : ['Inseam'], 'german' : ['Schrittl\344nge'] },
	'.slider-units' : { 'english' : ['inches', 'pounds', 'years', 'centimeters', 'kilograms', 'hours/week'],
	                     'german' : ['Zoll', 'Pfund', 'Jahre', 'Zentimetern', 'Kilogramme', 'Stunden/Woche'] },
	'.slider-status' : { 'english' : ['PREDICTED', 'SET', 'click to reset'],
	                     'german' : ['ERWARTET', 'SETZEN', 'zur\374cksetzen'] }
}

function isRegExp(obj) {  
   return Object.prototype.toString.call(obj) === '[object RegExp]';  
};

function replaceTextStrings(text, strings, replacements) {
	for (var i = 0; i < strings.length; i++) {
		if (isRegExp( strings[i] )) {
			text =  text.replace( strings[i], replacements[i]);
		} else {
			text =  text.replace(RegExp(strings[i], 'g'), replacements[i]);
		}
	}
	return text;
}
function applyTranslations(selector, source_langauge, target_language) {
	translations_to_apply = translations[selector];
	if (! translations_to_apply) { return false; }
	
	source_strings = translations_to_apply[source_langauge];
	target_strings = translations_to_apply[target_language];
	objects_to_translate = $J(selector);
	if (! objects_to_translate) { return false; }
	
	function translateObjectFunction(source_strings, target_strings) {
		return function(object) { object.html(replaceTextStrings(object.html(), source_strings, target_strings)) }
	}
	
	for (var i = 0; i < objects_to_translate.length; i++) {
		var translation = replaceTextStrings($J(objects_to_translate[i]).html(), source_strings, target_strings);
		if (translation) { $J(objects_to_translate[i]).html(translation); }
	}
	return true;
}

function setLanguage(language) {
	var source_langauge = (language == 'german') ? 'english' : 'german';
	function applyTranslationsFunction(source_langauge, target_language) {
		return function(selector) { applyTranslations(selector, source_langauge, target_language) }
	}
	$J('#toggle_units_button').show()
	if (language == 'german') { set_units('metric'); $J('#toggle_units_button').hide() }
	$J.each(translations, applyTranslationsFunction(source_langauge, language) );
	$J('#' + language + '_button').hide();
	$J('#' + source_langauge + '_button').show();
	return language;
}
