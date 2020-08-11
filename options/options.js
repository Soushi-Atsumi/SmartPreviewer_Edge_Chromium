/*
 * Smart Previewer - The smart previewer which previews everything.
 * Copyright (c) 2020 Soushi Atsumi. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 * 
 * This Source Code Form is "Incompatible With Secondary Licenses", as
 * defined by the Mozilla Public License, v. 2.0.
 */
'use strict';

var defaultValues;
var defaultValuesXmlHttpRequest = new XMLHttpRequest();
var storageKeys;
var storageKeysXmlHttpRequest = new XMLHttpRequest();

var refreshingEnabledInput = document.getElementById('refreshingEnabledInput');
var refreshingIntervalInput = document.getElementById('refreshingIntervalInput');
var refreshingOptions = document.getElementsByName('refreshing');

var audioAspectRatioInput = document.getElementById('audioAspectRatioInput');
var audioAutoplayInput = document.getElementById('audioAutoplayInput');
var audioDelayInput = document.getElementById('audioDelayInput');
var audioEnabledInput = document.getElementById('audioEnabledInput');
var audioLoopInput = document.getElementById('audioLoopInput');
var audioOptions = document.getElementsByName('audio');
var audioVolumeInput = document.getElementById('audioVolumeInput');

var imageAspectRatioInput = document.getElementById('imageAspectRatioInput');
var imageBorderWidthInput = document.getElementById('imageBorderWidthInput');
var imageDelayInput = document.getElementById('imageDelayInput');
var imageEnabledInput = document.getElementById('imageEnabledInput');
var imageOptions = document.getElementsByName('image');

var pdfAspectRatioInput = document.getElementById('pdfAspectRatioInput');
var pdfBorderWidthInput = document.getElementById('pdfBorderWidthInput');
var pdfDelayInput = document.getElementById('pdfDelayInput');
var pdfEnabledInput = document.getElementById('pdfEnabledInput');
var pdfOptions = document.getElementsByName('pdf');

var videoAspectRatioInput = document.getElementById('videoAspectRatioInput');
var videoAutoplayInput = document.getElementById('videoAutoplayInput');
var videoDelayInput = document.getElementById('videoDelayInput');
var videoEnabledInput = document.getElementById('videoEnabledInput');
var videoLoopInput = document.getElementById('videoLoopInput');
var videoOptions = document.getElementsByName('video');
var videoVolumeInput = document.getElementById('videoVolumeInput');

var initializeOptionsButton = document.getElementById('initializeOptionsButton');

main();

function main() {
	defaultValuesXmlHttpRequest.open('GET', chrome.runtime.getURL('/values/defaultValues.json'), false);
	defaultValuesXmlHttpRequest.send();
	defaultValues = JSON.parse(defaultValuesXmlHttpRequest.responseText);
	storageKeysXmlHttpRequest.open('GET', chrome.runtime.getURL('/values/storageKeys.json'), false);
	storageKeysXmlHttpRequest.send();
	storageKeys = JSON.parse(storageKeysXmlHttpRequest.responseText);

	document.getElementsByTagName('html')[0].lang = chrome.i18n.getUILanguage();
	document.title = chrome.i18n.getMessage('optionsHTMLTitle');
	document.getElementById('refreshingLegend').innerText = chrome.i18n.getMessage('refreshing');
	document.getElementById('refreshingEnabledLabel').innerText = chrome.i18n.getMessage('enabled');
	document.getElementById('refreshingNewAnchorsExplanationLabel').innerText = chrome.i18n.getMessage('checkingNewAnchorsExplanation');
	document.getElementById('refreshingIntervalLabel').innerText = `${chrome.i18n.getMessage('interval')}[${chrome.i18n.getMessage('second')}]`;
	document.getElementById('audioLegend').innerText = chrome.i18n.getMessage('audio');
	document.getElementById('audioAspectRatioLabel').innerText = chrome.i18n.getMessage('aspectRatio');
	document.getElementById('audioAutoplayLabel').innerText = chrome.i18n.getMessage('autoplay');
	document.getElementById('audioEnabledLabel').innerText = chrome.i18n.getMessage('enabled');
	document.getElementById('audioLoopLabel').innerText = chrome.i18n.getMessage('loop');
	document.getElementById('audioVolumeLabel').innerText = chrome.i18n.getMessage('volume');
	document.getElementById('audioDelayLabel').innerText = `${chrome.i18n.getMessage('delay')}[${chrome.i18n.getMessage('second')}]`;
	document.getElementById('imageLegend').innerText = chrome.i18n.getMessage('image');
	document.getElementById('imageAspectRatioLabel').innerText = chrome.i18n.getMessage('aspectRatio');
	document.getElementById('imageBorderWidthLabel').innerText = chrome.i18n.getMessage('borderWidth');
	document.getElementById('imageEnabledLabel').innerText = chrome.i18n.getMessage('enabled');
	document.getElementById('imageDelayLabel').innerText = `${chrome.i18n.getMessage('delay')}[${chrome.i18n.getMessage('second')}]`;
	document.getElementById('pdfLegend').innerText = chrome.i18n.getMessage('pdf');
	document.getElementById('pdfAspectRatioLabel').innerText = chrome.i18n.getMessage('aspectRatio');
	document.getElementById('pdfBorderWidthLabel').innerText = chrome.i18n.getMessage('borderWidth');
	document.getElementById('pdfEnabledLabel').innerText = chrome.i18n.getMessage('enabled');
	document.getElementById('pdfDelayLabel').innerText = `${chrome.i18n.getMessage('delay')}[${chrome.i18n.getMessage('second')}]`;
	document.getElementById('videoLegend').innerText = chrome.i18n.getMessage('video');
	document.getElementById('videoAspectRatioLabel').innerText = chrome.i18n.getMessage('aspectRatio');
	document.getElementById('videoAutoplayLabel').innerText = chrome.i18n.getMessage('autoplay');
	document.getElementById('videoEnabledLabel').innerText = chrome.i18n.getMessage('enabled');
	document.getElementById('videoLoopLabel').innerText = chrome.i18n.getMessage('loop');
	document.getElementById('videoVolumeLabel').innerText = chrome.i18n.getMessage('volume');
	document.getElementById('videoDelayLabel').innerText = `${chrome.i18n.getMessage('delay')}[${chrome.i18n.getMessage('second')}]`;
	initializeOptionsButton.innerText = chrome.i18n.getMessage('initializeOptions');
	initializeOptionsButton.addEventListener('click', initializeOptions);
	document.getElementById('informationDivision').innerText = chrome.i18n.getMessage('optionsHTMLInformation');

	initializeValueLabels();

	for (let i = 0; i < refreshingOptions.length; i++) {
		document.options.refreshing[i].addEventListener('change', refreshingInputOnClick);
	}

	checkRefreshing();

	for (let i = 0; i < audioOptions.length; i++) {
		document.options.audio[i].addEventListener('change', audioInputOnClick);
	}

	checkAudio();

	for (let i = 0; i < imageOptions.length; i++) {
		document.options.image[i].addEventListener('change', imageInputOnClick);
	}

	checkImage();

	for (let i = 0; i < pdfOptions.length; i++) {
		document.options.pdf[i].addEventListener('change', pdfInputOnClick);
	}

	checkPDF();

	for (let i = 0; i < videoOptions.length; i++) {
		document.options.video[i].addEventListener('change', videoInputOnClick);
	}

	checkVideo();
}

function refreshingInputOnClick(event) {
	switch (event.target.id) {
		case refreshingEnabledInput.id:
			chrome.storage.sync.set({ [storageKeys.refreshing.enabled]: refreshingEnabledInput.checked });
			break;
		case refreshingIntervalInput.id:
			chrome.storage.sync.set({ [storageKeys.refreshing.interval]: parseFloat(refreshingIntervalInput.value) });
			document.getElementById('refreshingIntervalValueLabel').innerText = refreshingIntervalInput.value;
			break;
	}
}

function checkRefreshing(event) {
	chrome.storage.sync.get(Object.values(storageKeys.refreshing), (options) => {
		let keys = Object.keys(options);
		for (let i = 0; i < keys.length; i++) {
			switch (keys[i]) {
				case storageKeys.refreshing.enabled:
					refreshingEnabledInput.checked = options[storageKeys.refreshing.enabled];
					break;
				case storageKeys.refreshing.interval:
					refreshingIntervalInput.value = options[storageKeys.refreshing.interval];
					document.getElementById('refreshingIntervalValueLabel').innerText = refreshingIntervalInput.value;
					break;
			}
		}
	});
}

function audioInputOnClick(event) {
	switch (event.target.id) {
		case audioAspectRatioInput.id:
			chrome.storage.sync.set({ [storageKeys.audio.aspectRatio]: parseFloat(audioAspectRatioInput.value) });
			document.getElementById('audioAspectRatioValueLabel').innerText = audioAspectRatioInput.value;
			break;
		case audioAutoplayInput.id:
			chrome.storage.sync.set({ [storageKeys.audio.autoplay]: audioAutoplayInput.checked });
			break;
		case audioDelayInput.id:
			chrome.storage.sync.set({ [storageKeys.audio.delay]: parseFloat(audioDelayInput.value) });
			document.getElementById('audioDelayValueLabel').innerText = audioDelayInput.value;
			break;
		case audioEnabledInput.id:
			chrome.storage.sync.set({ [storageKeys.audio.enabled]: audioEnabledInput.checked });
			break;
		case audioLoopInput.id:
			chrome.storage.sync.set({ [storageKeys.audio.loop]: audioLoopInput.checked });
			break;
		case audioVolumeInput.id:
			chrome.storage.sync.set({ [storageKeys.audio.volume]: parseFloat(audioVolumeInput.value) });
			document.getElementById('audioVolumeValueLabel').innerText = audioVolumeInput.value;
			break;
	}
}

function checkAudio() {
	chrome.storage.sync.get(Object.values(storageKeys.audio), (options) => {
		let keys = Object.keys(options);
		for (let i = 0; i < keys.length; i++) {
			switch (keys[i]) {
				case storageKeys.audio.aspectRatio:
					audioAspectRatioInput.value = options[storageKeys.audio.aspectRatio];
					document.getElementById('audioAspectRatioValueLabel').innerText = audioAspectRatioInput.value;
					break;
				case storageKeys.audio.autoplay:
					audioAutoplayInput.checked = options[storageKeys.audio.autoplay];
					break;
				case storageKeys.audio.delay:
					audioDelayInput.value = options[storageKeys.audio.delay];
					document.getElementById('audioDelayValueLabel').innerText = audioDelayInput.value;
					break;
				case storageKeys.audio.enabled:
					audioEnabledInput.checked = options[storageKeys.audio.enabled];
					break;
				case storageKeys.audio.loop:
					audioLoopInput.checked = options[storageKeys.audio.loop];
					break;
				case storageKeys.audio.volume:
					audioVolumeInput.value = options[storageKeys.audio.volume];
					document.getElementById('audioVolumeValueLabel').innerText = audioVolumeInput.value;
					break;
			}
		}
	});
}

function imageInputOnClick(event) {
	switch (event.target.id) {
		case imageAspectRatioInput.id:
			chrome.storage.sync.set({ [storageKeys.image.aspectRatio]: imageAspectRatioInput.value });
			document.getElementById('imageAspectRatioValueLabel').innerText = imageAspectRatioInput.value;
			break;
		case imageBorderWidthInput.id:
			chrome.storage.sync.set({ [storageKeys.image.borderWidth]: imageBorderWidthInput.value });
			document.getElementById('imageBorderWidthValueLabel').innerText = imageBorderWidthInput.value;
			break;
		case imageDelayInput.id:
			chrome.storage.sync.set({ [storageKeys.image.delay]: parseFloat(imageDelayInput.value) });
			document.getElementById('imageDelayValueLabel').innerText = imageDelayInput.value;
			break;
		case imageEnabledInput.id:
			chrome.storage.sync.set({ [storageKeys.image.enabled]: imageEnabledInput.checked });
			break;
	}
}

function checkImage() {
	chrome.storage.sync.get(Object.values(storageKeys.image), (options) => {
		let keys = Object.keys(options);
		for (let i = 0; i < keys.length; i++) {
			switch (keys[i]) {
				case storageKeys.image.aspectRatio:
					imageAspectRatioInput.value = options[storageKeys.image.aspectRatio];
					document.getElementById('imageAspectRatioValueLabel').innerText = imageAspectRatioInput.value;
					break;
				case storageKeys.image.borderWidth:
					imageBorderWidthInput.value = options[storageKeys.image.borderWidth];
					document.getElementById('imageBorderWidthValueLabel').innerText = imageBorderWidthInput.value;
					break;
				case storageKeys.image.delay:
					imageDelayInput.value = options[storageKeys.image.delay];
					document.getElementById('imageDelayValueLabel').innerText = imageDelayInput.value;
					break;
				case storageKeys.image.enabled:
					imageEnabledInput.checked = options[storageKeys.image.enabled];
					break;
			}
		}
	});
}

function pdfInputOnClick(event) {
	switch (event.target.id) {
		case pdfAspectRatioInput.id:
			chrome.storage.sync.set({ [storageKeys.pdf.aspectRatio]: pdfAspectRatioInput.value });
			document.getElementById('pdfAspectRatioValueLabel').innerText = pdfAspectRatioInput.value;
			break;
		case pdfBorderWidthInput.id:
			chrome.storage.sync.set({ [storageKeys.pdf.borderWidth]: pdfBorderWidthInput.value });
			document.getElementById('pdfBorderWidthValueLabel').innerText = pdfBorderWidthInput.value;
			break;
		case pdfDelayInput.id:
			chrome.storage.sync.set({ [storageKeys.pdf.delay]: parseFloat(pdfDelayInput.value) });
			document.getElementById('pdfDelayValueLabel').innerText = pdfDelayInput.value;
			break;
		case pdfEnabledInput.id:
			chrome.storage.sync.set({ [storageKeys.pdf.enabled]: pdfEnabledInput.checked });
			break;
	}
}

function checkPDF() {
	chrome.storage.sync.get(Object.values(storageKeys.pdf), (options) => {
		let keys = Object.keys(options);
		for (let i = 0; i < keys.length; i++) {
			switch (keys[i]) {
				case storageKeys.pdf.aspectRatio:
					pdfAspectRatioInput.value = options[storageKeys.pdf.aspectRatio];
					document.getElementById('pdfAspectRatioValueLabel').innerText = pdfAspectRatioInput.value;
					break;
				case storageKeys.pdf.borderWidth:
					pdfBorderWidthInput.value = options[storageKeys.pdf.borderWidth];
					document.getElementById('pdfBorderWidthValueLabel').innerText = pdfBorderWidthInput.value;
					break;
				case storageKeys.pdf.delay:
					pdfDelayInput.value = options[storageKeys.pdf.delay];
					document.getElementById('pdfDelayValueLabel').innerText = pdfDelayInput.value;
					break;
				case storageKeys.pdf.enabled:
					pdfEnabledInput.checked = options[storageKeys.pdf.enabled];
					break;
			}
		}
	});
}

function videoInputOnClick(event) {
	switch (event.target.id) {
		case videoAspectRatioInput.id:
			chrome.storage.sync.set({ [storageKeys.video.aspectRatio]: parseFloat(videoAspectRatioInput.value) });
			document.getElementById('videoAspectRatioValueLabel').innerText = videoAspectRatioInput.value;
			break;
		case videoAutoplayInput.id:
			chrome.storage.sync.set({ [storageKeys.video.autoplay]: videoAutoplayInput.checked });
			break;
		case videoDelayInput.id:
			chrome.storage.sync.set({ [storageKeys.video.delay]: parseFloat(videoDelayInput.value) });
			document.getElementById('videoDelayValueLabel').innerText = videoDelayInput.value;
			break;
		case videoEnabledInput.id:
			chrome.storage.sync.set({ [storageKeys.video.enabled]: videoEnabledInput.checked });
			break;
		case videoLoopInput.id:
			chrome.storage.sync.set({ [storageKeys.video.loop]: videoLoopInput.checked });
			break;
		case videoVolumeInput.id:
			chrome.storage.sync.set({ [storageKeys.video.volume]: parseFloat(videoVolumeInput.value) });
			document.getElementById('videoVolumeValueLabel').innerText = videoVolumeInput.value;
			break;
	}
}

function checkVideo() {
	chrome.storage.sync.get(Object.values(storageKeys.video), (options) => {
		let keys = Object.keys(options);
		for (let i = 0; i < keys.length; i++) {
			switch (keys[i]) {
				case storageKeys.video.aspectRatio:
					videoAspectRatioInput.value = options[storageKeys.video.aspectRatio];
					document.getElementById('videoAspectRatioValueLabel').innerText = videoAspectRatioInput.value;
					break;
				case storageKeys.video.autoplay:
					videoAutoplayInput.checked = options[storageKeys.video.autoplay];
					break;
				case storageKeys.video.delay:
					videoDelayInput.value = options[storageKeys.video.delay];
					document.getElementById('videoDelayValueLabel').innerText = videoDelayInput.value;
					break;
				case storageKeys.video.enabled:
					videoEnabledInput.checked = options[storageKeys.video.enabled];
					break;
				case storageKeys.video.loop:
					videoLoopInput.checked = options[storageKeys.video.loop];
					break;
				case storageKeys.video.volume:
					videoVolumeInput.value = options[storageKeys.video.volume];
					document.getElementById('videoVolumeValueLabel').innerText = videoVolumeInput.value;
					break;
			}
		}
	});
}

function initializeOptions() {
	chrome.storage.sync.clear();
	initializeValueLabels();
}

function initializeValueLabels() {
	document.getElementById('refreshingIntervalValueLabel').innerText = defaultValues.refreshing.interval;
	document.getElementById('audioAspectRatioValueLabel').innerText = defaultValues.audio.aspectRatio;
	document.getElementById('audioDelayValueLabel').innerText = defaultValues.audio.delay;
	document.getElementById('audioVolumeValueLabel').innerText = defaultValues.audio.volume;
	document.getElementById('imageAspectRatioValueLabel').innerText = defaultValues.image.aspectRatio;
	document.getElementById('imageBorderWidthValueLabel').innerText = defaultValues.image.borderWidth;
	document.getElementById('imageDelayValueLabel').innerText = defaultValues.image.delay;
	document.getElementById('pdfAspectRatioValueLabel').innerText = defaultValues.pdf.aspectRatio;
	document.getElementById('pdfBorderWidthValueLabel').innerText = defaultValues.pdf.borderWidth;
	document.getElementById('pdfDelayValueLabel').innerText = defaultValues.pdf.delay;
	document.getElementById('videoAspectRatioValueLabel').innerText = defaultValues.video.aspectRatio;
	document.getElementById('videoDelayValueLabel').innerText = defaultValues.video.delay;
	document.getElementById('videoVolumeValueLabel').innerText = defaultValues.video.volume;
}
