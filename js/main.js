/*! StudioF v1.0.0 | (c) 2022 Studio F | All Rights Reserved. */
(function () {
	'use strict';

	// var list = document.querySelector('.work'),
	// i;
	//
	// for (i = list.children.length; i >= 0; i--) {
	//   list.appendChild(list.children[Math.random() * i | 0]);
	// }

	//-----------------

	// /**
	//  * Randomly shuffle an array
	//  * https://stackoverflow.com/a/2450976/1293256
	//  * @param  {Array} array The array to shuffle
	//  * @return {Array}       The shuffled array
	//  */
	function shuffle (array) {

		let currentIndex = array.length;
		let temporaryValue, randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {
			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;

	}

	let toggle = document.querySelector('.nav_mobile');
	let menuMobile = document.querySelector('.menu_mobile');
	let cards = document.querySelectorAll('.work li');
	let cardsArr = Array.from(cards);

	shuffle(cardsArr);

	document.addEventListener('click', function (event) {
		if (!event.target.closest('.nav_mobile')) return;
	  toggle.classList.toggle('active');
		menuMobile.classList.toggle('open');
	}, false);

	function toggle_off () {
		let viewportW = window.innerWidth;
		if (viewportW >= 900) {
			toggle.classList.remove('active');
			menuMobile.classList.remove('open');
		}
	}

	for (var card of cards) {
		let link = card.querySelector('a').getAttribute('href');
		card.addEventListener('click', function(e){
			e.preventDefault();
			if (!e.target.closest('.info')) return;
			window.location = link;
			console.log(link);
		});
	}

	window.addEventListener('resize', toggle_off);

	/**
	 * Store current instance
	 */
	var instance;

	/**
	 * Defaults values
	 * @type object
	 */
	var defaults = {
	  'messageLocales': {
	    'it': '',
	    'en': 'We use cookies to track usage and preferences.',
	    'de': '',
	    'fr': ''
	  },

	  'cookieNoticePosition': 'bottom',

	  'learnMoreLinkEnabled': true,

	  'learnMoreLinkHref': '/cookies-policy',

	  'learnMoreLinkText': {
	    'it': '',
	    'en': 'Cookies Policy',
	    'de': '',
	    'fr': ''
	  },

	  'buttonLocales': {
	    'en': 'Ok'
	  },

	  'expiresIn': 30, // days
	  'buttonBgColor': '',
	  'buttonTextColor': 'black',
	  'noticeBgColor': 'transparent',
	  'noticeTextColor': 'black',
	  'linkColor': ''
	};

	/**
	 * Initialize cookie notice on DOMContentLoaded
	 * if not already initialized with alt params
	 */
	document.addEventListener('DOMContentLoaded', function() {
	  if (!instance) {
	    new cookieNoticeJS();
	  }
	});

	/**
	 * Constructor
	 * @constructor
	 */
	window.cookieNoticeJS = function() {

	  // If an instance is already set stop here
	  if (instance !== undefined) {
	    return;
	  }

	  // Set current instance
	  instance = this;

	  // If cookies are not supported or notice cookie is already set
	  if (!testCookie() || getNoticeCookie()) {
	    return;
	  }

	  // Extend default params
	  var params = extendDefaults(defaults, arguments[0] || {});

	  // Get current locale for notice text
	  var noticeText = getStringForCurrentLocale(params.messageLocales);

	  // Create notice
	  var notice = createNotice(noticeText, params.noticeBgColor, params.noticeTextColor, params.cookieNoticePosition);

	  var learnMoreLink;

	  if (params.learnMoreLinkEnabled) {
	    var learnMoreLinkText = getStringForCurrentLocale(params.learnMoreLinkText);

	    learnMoreLink = createLearnMoreLink(learnMoreLinkText, params.learnMoreLinkHref, params.linkColor);
	  }

	  // Get current locale for button text
	  var buttonText = getStringForCurrentLocale(params.buttonLocales);

	  // Create dismiss button
	  var dismissButton = createDismissButton(buttonText, params.buttonBgColor, params.buttonTextColor);

	  // Dismiss button click event
	  dismissButton.addEventListener('click', function(e) {
	    e.preventDefault();
	    setDismissNoticeCookie(parseInt(params.expiresIn + "", 10) * 60 * 1000 * 60 * 24);
	    fadeElementOut(notice);
	  });

	  // Append notice to the DOM
	  var noticeDomElement = document.body.appendChild(notice);

	  if (!!learnMoreLink) {
	    noticeDomElement.appendChild(learnMoreLink);
	  }

	  noticeDomElement.appendChild(dismissButton);

	};

	/**
	 * Get the string for the current locale
	 * and fallback to "en" if none provided
	 * @param locales
	 * @returns {*}
	 */
	function getStringForCurrentLocale(locales) {
	  var locale = (
	    document.documentElement.lang ||
	    navigator.userLanguage ||
	    navigator.language
	  ).substr(0, 2);

	  return (locales[locale]) ? locales[locale] : locales['en'];
	}

	/**
	 * Test if cookies are enabled
	 * @returns {boolean}
	 */
	function testCookie() {
	  document.cookie = 'testCookie=1';
	  return document.cookie.indexOf('testCookie') != -1;
	}

	/**
	 * Test if notice cookie is there
	 * @returns {boolean}
	 */
	function getNoticeCookie() {
	  return document.cookie.indexOf('cookie_notice') != -1;
	}

	/**
	 * Create notice
	 * @param message
	 * @param bgColor
	 * @param textColor
	 * @param position
	 * @returns {HTMLElement}
	 */
	function createNotice(message, bgColor, textColor, position) {

	  var notice = document.createElement('div'),
	    noticeStyle = notice.style;

	  let cookieIcon = '<svg style="width:40px;margin-bottom:.5em;fill:'+textColor+';" viewBox="0 0 357.31 357.11"><path d="M357.17 171.71a8.964 8.964 0 0 0-3.62-6.86c-2.19-1.61-5-2.15-7.62-1.44a41.67 41.67 0 0 1-10.76 1.42c-13.54 0-26.25-6.66-33.99-17.81a8.943 8.943 0 0 0-6.09-3.75c-2.47-.35-4.96.35-6.89 1.92-11.68 9.51-26.42 14.75-41.5 14.75-36.28 0-65.8-29.52-65.8-65.8 0-13.22 3.91-25.97 11.29-36.87a8.942 8.942 0 0 0-1.09-11.35c-7.87-7.82-12.2-18.23-12.2-29.31 0-2.12.16-4.25.48-6.33.41-2.65-.4-5.34-2.19-7.33C175.4.96 172.82-.1 170.13 0 74.73 4.49 0 82.87 0 178.46s80.14 178.66 178.66 178.66 178.66-80.14 178.66-178.66c0-2.04-.05-4.24-.14-6.75ZM178.65 339.25c-88.66 0-160.79-72.13-160.79-160.79C17.87 95.77 80 27.38 161.07 18.62c.42 12.71 4.83 24.72 12.64 34.6-7 12.46-10.67 26.47-10.67 40.92 0 46.13 37.53 83.67 83.67 83.67 16.19 0 32.07-4.75 45.57-13.51 11.1 11.65 26.57 18.4 42.89 18.4 1.41 0 2.82-.05 4.23-.15-2.18 86.78-73.45 156.7-160.74 156.7Zm63.96-286.79c10.93 0 19.79-8.86 19.79-19.79s-8.86-19.79-19.79-19.79-19.79 8.86-19.79 19.79 8.86 19.79 19.79 19.79Zm-19.79 181.6c-10.93 0-19.79 8.86-19.79 19.79s8.86 19.79 19.79 19.79 19.79-8.86 19.79-19.79-8.86-19.79-19.79-19.79ZM116.96 120.15c0-14.25-11.55-25.8-25.8-25.8s-25.8 11.55-25.8 25.8 11.55 25.8 25.8 25.8 25.8-11.55 25.8-25.8Zm189.1-14.14c5.46 0 9.89-4.43 9.89-9.89s-4.43-9.89-9.89-9.89-9.89 4.43-9.89 9.89 4.43 9.89 9.89 9.89Zm-189.1 137.95c-5.46 0-9.89 4.43-9.89 9.89s4.43 9.89 9.89 9.89 9.89-4.43 9.89-9.89-4.43-9.89-9.89-9.89Zm111.69-133.88c0 7.71 6.25 13.96 13.96 13.96s13.96-6.25 13.96-13.96-6.25-13.96-13.96-13.96-13.96 6.25-13.96 13.96ZM164.7 164.6c-7.71 0-13.96 6.25-13.96 13.96s6.25 13.96 13.96 13.96 13.96-6.25 13.96-13.96-6.25-13.96-13.96-13.96Z"/></svg>';

	  notice.innerHTML = cookieIcon + '<p style="margin:0 0 1em 0;">'+ message +'</p>';
	  notice.setAttribute('class', 'cookieNotice');

	  noticeStyle.position = 'fixed';

	  if (position === 'top') {
	    noticeStyle.top = '0';
	  } else {
	    noticeStyle.bottom = '2em';
	  }

	  noticeStyle.maxWidth = '50%';
	  noticeStyle.left = '';
	  noticeStyle.right = '1em';
	  noticeStyle.background = bgColor;
	  noticeStyle.color = textColor;
	  noticeStyle["z-index"] = '999';
	  noticeStyle.padding = '1em';
	  noticeStyle["text-align"] = 'right';
	  noticeStyle["font-size"] = ".85rem";
	  noticeStyle["line-height"] = "1rem";
	  noticeStyle.fontFamily = 'inherit, sans-serif';
	  noticeStyle.borderRadius = '11px';
	  noticeStyle.backdropFilter='blur(5px)';
	  noticeStyle.WebkitBackdropFilter='blur(5px)';


	  return notice;
	}

	/**
	 * Create dismiss button
	 * @param message
	 * @param buttonColor
	 * @param buttonTextColor
	 * @returns {HTMLElement}
	 */
	function createDismissButton(message, buttonColor,  buttonTextColor, textColor) {

	  var dismissButton = document.createElement('button'),
	    dismissButtonStyle = dismissButton.style;

	  // Dismiss button
	  // dismissButton.href = '#';
	  dismissButton.innerHTML = message;

	  dismissButton.className = 'confirm btn';

	  // Dismiss button style
	  dismissButtonStyle.lineHeight = 1;
	  dismissButtonStyle.cursor = 'pointer';
	  dismissButtonStyle.background = buttonColor;
	  dismissButtonStyle.color = buttonTextColor;
	  // dismissButtonStyle['text-decoration'] = 'none';
	  // dismissButtonStyle.display = 'inline-block';
	  // dismissButtonStyle.padding = '0 15px';
	  // dismissButtonStyle.margin = '0 0 0 10px';
	  dismissButtonStyle.border = 'none';

	  return dismissButton;

	}
	// function createDismissButton(message, buttonColor, buttonTextColor,buttonBgColor) {
	//
	//   var dismissButton = document.createElement('a'),
	//     dismissButtonStyle = dismissButton.style;
	//
	//   // Dismiss button
	//   dismissButton.href = '#';
	//   dismissButton.innerHTML = message;
	//
	//   dismissButton.className = 'confirm';
	//
	//   // Dismiss button style
	//   dismissButtonStyle.background = buttonColor;
	//   dismissButtonStyle.color = buttonTextColor;
	//   dismissButtonStyle.background = buttonBgColor;
	//   dismissButtonStyle['text-decoration'] = 'none';
	//   dismissButtonStyle.display = 'inline-block';
	//   dismissButtonStyle.padding = '0 15px';
	//   dismissButtonStyle.margin = '0 0 0 10px';
	//
	//   return dismissButton;
	//
	// }

	/**
	 * Create dismiss button
	 * @param learnMoreLinkText
	 * @param learnMoreLinkHref
	 * @param linkColor
	 * @returns {HTMLElement}
	 */
	function createLearnMoreLink(learnMoreLinkText, learnMoreLinkHref, linkColor) {

	  var learnMoreLink = document.createElement('a'),
	    learnMoreLinkStyle = learnMoreLink.style;

	  // Dismiss button
	  learnMoreLink.href = learnMoreLinkHref;
	  learnMoreLink.textContent = learnMoreLinkText;
	  learnMoreLink.target = '_self';
	  learnMoreLink.className = 'more btn';


	  // Dismiss button style
	  learnMoreLinkStyle.color = linkColor;
	  learnMoreLinkStyle['text-decoration'] = 'none';
	  learnMoreLinkStyle.display = 'inline';
	  learnMoreLinkStyle.whiteSpace = 'nowrap';
	  learnMoreLinkStyle.marginRight = '5px';


	  return learnMoreLink;

	}

	/**
	 * Set sismiss notice cookie
	 * @param expireIn
	 */
	function setDismissNoticeCookie(expireIn) {
	  var now = new Date(),
	    cookieExpire = new Date();

	  cookieExpire.setTime(now.getTime() + expireIn);
	  document.cookie = "cookie_notice=1; expires=" + cookieExpire.toUTCString() + "; path=/;";
	}

	/**
	 * Fade a given element out
	 * @param element
	 */
	function fadeElementOut(element) {
	  element.style.opacity = 1;
	  (function fade() {
	    (element.style.opacity -= .1) < 0.01 ? element.parentNode.removeChild(element) : setTimeout(fade, 40);
	  })();
	}

	/**
	 * Utility method to extend defaults with user options
	 * @param source
	 * @param properties
	 * @returns {*}
	 */
	function extendDefaults(source, properties) {
	  var property;
	  for (property in properties) {
	    if (properties.hasOwnProperty(property)) {
	      if (typeof source[property] === 'object') {
	        source[property] = extendDefaults(source[property], properties[property]);
	      } else {
	        source[property] = properties[property];
	      }
	    }
	  }
	  return source;
	}

}());
