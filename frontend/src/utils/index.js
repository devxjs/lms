import { toast } from 'frappe-ui'
import { useTimeAgo } from '@vueuse/core'
import { Quiz } from '@/utils/quiz'
import { Upload } from '@/utils/upload'
import EditorJS from '@editorjs/editorjs'
//import Header from '@editorjs/header'
//const Header = require("editorjs-header-with-alignment");
import Header from 'editorjs-header-with-alignment'
//import Paragraph from '@editorjs/paragraph'
//const Paragraph = require('editorjs-paragraph-with-alignment');
import Paragraph from 'editorjs-paragraph-with-alignment'
import Table from '@editorjs/table';
//const ColorPlugin = require('editorjs-text-color-plugin');
import ColorPlugin from 'editorjs-text-color-plugin'
import Underline from '@editorjs/underline';
import Hyperlink from 'editorjs-hyperlink';
import Title from "title-editorjs";
import Alert from 'editorjs-alert';
import Delimiter from '@editorjs/delimiter';
import editorjsColumns from '@calumk/editorjs-columns';

import { CodeBox } from '@/utils/code'
import NestedList from '@editorjs/nested-list'
import InlineCode from '@editorjs/inline-code'
import { watch } from 'vue'
import dayjs from '@/utils/dayjs'
import Embed from '@editorjs/embed'
import SimpleImage from '@editorjs/simple-image'

export function createToast(options) {
	toast({
		position: 'bottom-right',
		...options,
	})
}

export function timeAgo(date) {
	return useTimeAgo(date).value
}

export function formatTime(timeString) {
	if (!timeString) return ''
	const [hour, minute] = timeString.split(':').map(Number)

	// Create a Date object with dummy values for day, month, and year
	const dummyDate = new Date(0, 0, 0, hour, minute)

	// Use Intl.DateTimeFormat to format the time in 12-hour format
	const formattedTime = new Intl.DateTimeFormat('en-US', {
		hour: 'numeric',
		minute: 'numeric',
		hour12: true,
	}).format(dummyDate)

	return formattedTime
}

export function formatNumber(number) {
	return number.toLocaleString('en-IN', {
		maximumFractionDigits: 0,
	})
}

export function formatNumberIntoCurrency(number, currency) {
	if (number) {
		return number.toLocaleString('en-IN', {
			maximumFractionDigits: 0,
			style: 'currency',
			currency: currency,
		})
	}
	return ''
}

export function convertToTitleCase(str) {
	if (!str) {
		return ''
	}

	return str
		.toLowerCase()
		.split(' ')
		.map(function (word) {
			return word.charAt(0).toUpperCase().concat(word.substr(1))
		})
		.join(' ')
}
export function getFileSize(file_size) {
	let value = parseInt(file_size)
	if (value > 1048576) {
		return (value / 1048576).toFixed(2) + 'M'
	} else if (value > 1024) {
		return (value / 1024).toFixed(2) + 'K'
	}
	return value
}

export function showToast(title, text, icon, iconClasses = null) {
	if (!iconClasses) {
		iconClasses =
			icon == 'check'
				? 'bg-green-600 text-white rounded-md p-px'
				: 'bg-red-600 text-white rounded-md p-px'
	}
	createToast({
		title: title,
		text: htmlToText(text),
		icon: icon,
		iconClasses: iconClasses,
		position: icon == 'check' ? 'bottom-right' : 'top-center',
		timeout: 5,
	})
}

export function getImgDimensions(imgSrc) {
	return new Promise((resolve) => {
		let img = new Image()
		img.onload = function () {
			let { width, height } = img
			resolve({ width, height, ratio: width / height })
		}
		img.src = imgSrc
	})
}

export function updateDocumentTitle(meta) {
	watch(
		() => meta,
		(meta) => {
			if (!meta.value.title) return
			if (meta.value.title && meta.value.subtitle) {
				document.title = `${meta.value.title} | ${meta.value.subtitle}`
				return
			}
			if (meta.value.title) {
				document.title = `${meta.value.title}`
				return
			}
		},
		{ immediate: true, deep: true }
	)
}

export function htmlToText(html) {
	const div = document.createElement('div')
	div.innerHTML = html
	return div.textContent || div.innerText || ''
}

export function getEditorTools() {

	let column_tools = {
		header: {
			class: Header,
			//inlineToolbar: ["link", "marker", "header", "color","left", "center", "right"],
			config: {
			  placeholder: 'Enter a header',
			  levels: [1,2, 3, 4,5,6],
			  defaultLevel: 4,
			  defaultAlignment: 'left'
			}
		  },
		  Color: {
			class: ColorPlugin, // if load from CDN, please try: window.ColorPlugin
			config: {
			   colorCollections: ['#EC7878','#9C27B0','#673AB7','#3F51B5','#0070FF','#03A9F4','#00BCD4','#4CAF50','#8BC34A','#CDDC39', '#FFF'],
			   defaultColor: '#FF1300',
			   type: 'text', 
			   customPicker: true // add a button to allow selecting any colour  
			}     
		  },
		  Marker: {
			class: ColorPlugin, // if load from CDN, please try: window.ColorPlugin
			config: {
			   defaultColor: '#FFBF00',
			   type: 'marker',
			   icon: `<svg fill="#000000" height="200px" width="200px" version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M17.6,6L6.9,16.7c-0.2,0.2-0.3,0.4-0.3,0.6L6,23.9c0,0.3,0.1,0.6,0.3,0.8C6.5,24.9,6.7,25,7,25c0,0,0.1,0,0.1,0l6.6-0.6 c0.2,0,0.5-0.1,0.6-0.3L25,13.4L17.6,6z"></path> <path d="M26.4,12l1.4-1.4c1.2-1.2,1.1-3.1-0.1-4.3l-3-3c-0.6-0.6-1.3-0.9-2.2-0.9c-0.8,0-1.6,0.3-2.2,0.9L19,4.6L26.4,12z"></path> </g> <g> <path d="M28,29H4c-0.6,0-1-0.4-1-1s0.4-1,1-1h24c0.6,0,1,0.4,1,1S28.6,29,28,29z"></path> </g> </g></svg>`
			  }       
		  },
		alert : Alert,
		paragraph: {
			class: Paragraph,
			inlineToolbar: true,
			config: {
				preserveBlank: true,
			},
		},
		delimiter : Delimiter,
		underline : Underline,
		hyperlink : Hyperlink,
		title : Title,
		image: SimpleImage,
	};


	return {
		header: {
			class: Header,
			//inlineToolbar: ["link", "marker", "header", "color","left", "center", "right"],
			config: {
			  placeholder: 'Enter a header',
			  levels: [1,2, 3, 4,5,6],
			  defaultLevel: 4,
			  defaultAlignment: 'left'
			}
		  },	
		  alert : Alert,
		  delimiter : Delimiter,
		  underline : Underline,
		  hyperlink : Hyperlink,
		  title : Title,
		 // columns : {
		//	class : editorjsColumns,
		//	config : {
		//	  EditorJsLibrary : EditorJs, // Pass the library instance to the columns instance.
		//	  tools : column_tools // IMPORTANT! ref the column_tools
		//	}
		  //},
		  Color: {
			class: ColorPlugin, // if load from CDN, please try: window.ColorPlugin
			config: {
			   colorCollections: ['#EC7878','#9C27B0','#673AB7','#3F51B5','#0070FF','#03A9F4','#00BCD4','#4CAF50','#8BC34A','#CDDC39', '#FFF'],
			   defaultColor: '#FF1300',
			   type: 'text', 
			   customPicker: true // add a button to allow selecting any colour  
			}     
		  },
		  Marker: {
			class: ColorPlugin, // if load from CDN, please try: window.ColorPlugin
			config: {
			   defaultColor: '#FFBF00',
			   type: 'marker',
			   icon: `<svg fill="#000000" height="200px" width="200px" version="1.1" id="Icons" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32" xml:space="preserve"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M17.6,6L6.9,16.7c-0.2,0.2-0.3,0.4-0.3,0.6L6,23.9c0,0.3,0.1,0.6,0.3,0.8C6.5,24.9,6.7,25,7,25c0,0,0.1,0,0.1,0l6.6-0.6 c0.2,0,0.5-0.1,0.6-0.3L25,13.4L17.6,6z"></path> <path d="M26.4,12l1.4-1.4c1.2-1.2,1.1-3.1-0.1-4.3l-3-3c-0.6-0.6-1.3-0.9-2.2-0.9c-0.8,0-1.6,0.3-2.2,0.9L19,4.6L26.4,12z"></path> </g> <g> <path d="M28,29H4c-0.6,0-1-0.4-1-1s0.4-1,1-1h24c0.6,0,1,0.4,1,1S28.6,29,28,29z"></path> </g> </g></svg>`
			  }       
		  },
		  table: {
			class: Table,
			inlineToolbar: true,
			config: {
			  rows: 2,
			  cols: 3,
			},
		  },			
		quiz: Quiz,
		upload: Upload,
		image: SimpleImage,
		paragraph: {
			class: Paragraph,
			inlineToolbar: true,
			config: {
				preserveBlank: true,
			},
		},
		codeBox: {
			class: CodeBox,
			config: {
				themeURL:
					'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@9.18.1/build/styles/dracula.min.css', // Optional
				themeName: 'atom-one-dark', // Optional
				useDefaultTheme: 'dark', // Optional. This also determines the background color of the language select drop-down
			},
		},
		list: {
			class: NestedList,
			config: {
				defaultStyle: 'ordered',
			},
		},
		inlineCode: {
			class: InlineCode,
			shortcut: 'CMD+SHIFT+M',
		},
		embed: {
			class: Embed,
			inlineToolbar: false,
			config: {
				services: {
					youtube: {
						regex: /(?:https?:\/\/)?(?:www\.)?(?:(?:youtu\.be\/)|(?:youtube\.com)\/(?:v\/|u\/\w\/|embed\/|watch))(?:(?:\?v=)?([^#&?=]*))?((?:[?&]\w*=\w*)*)/,
						embedUrl:
							'https://www.youtube.com/embed/<%= remote_id %>',
						html: '<iframe style="width:100%; height: 30rem;" frameborder="0" allowfullscreen></iframe>',
						height: 320,
						width: 580,
						id: ([id, params]) => {
							if (!params && id) {
								return id
							}

							const paramsMap = {
								start: 'start',
								end: 'end',
								t: 'start',
								// eslint-disable-next-line camelcase
								time_continue: 'start',
								list: 'list',
							}

							let newParams = params
								.slice(1)
								.split('&')
								.map((param) => {
									const [name, value] = param.split('=')

									if (!id && name === 'v') {
										id = value

										return null
									}

									if (!paramsMap[name]) {
										return null
									}

									if (
										value === 'LL' ||
										value.startsWith('RDMM') ||
										value.startsWith('FL')
									) {
										return null
									}

									return `${paramsMap[name]}=${value}`
								})
								.filter((param) => !!param)

							return id + '?' + newParams.join('&')
						},
					},
					vimeo: true,
					codepen: true,
					aparat: {
						regex: /(?:http[s]?:\/\/)?(?:www.)?aparat\.com\/v\/([^\/\?\&]+)\/?/,
						embedUrl:
							'https://www.aparat.com/video/video/embed/videohash/<%= remote_id %>/vt/frame',
						html: '<iframe style="margin: 0 auto; width: 100%; height: 25rem;" frameborder="0" scrolling="no" allowtransparency="true"></iframe>',
						height: 300,
						width: 600,
					},
					github: true,
					slides: {
						regex: /https:\/\/docs\.google\.com\/presentation\/d\/e\/([A-Za-z0-9_-]+)\/pub/,
						embedUrl:
							'https://docs.google.com/presentation/d/e/<%= remote_id %>/embed',
						html: "<iframe style='width: 100%; height: 30rem; border: 1px solid #D3D3D3; border-radius: 12px; margin: 1rem 0' frameborder='0' allowfullscreen='true'></iframe>",
					},
					drive: {
						regex: /https:\/\/drive\.google\.com\/file\/d\/([A-Za-z0-9_-]+)\/view(\?.+)?/,
						embedUrl:
							'https://drive.google.com/file/d/<%= remote_id %>/preview',
						html: "<iframe style='width: 100%; height: 25rem; border: 1px solid #D3D3D3; border-radius: 12px;' frameborder='0' allowfullscreen='true'></iframe>",
					},
					docsPublic: {
						regex: /https:\/\/docs\.google\.com\/document\/d\/([A-Za-z0-9_-]+)\/edit(\?.+)?/,
						embedUrl:
							'https://docs.google.com/document/d/<%= remote_id %>/preview',
						html: "<iframe style='width: 100%; height: 40rem; border: 1px solid #D3D3D3; border-radius: 12px;' frameborder='0' allowfullscreen='true'></iframe>",
					},
					sheetsPublic: {
						regex: /https:\/\/docs\.google\.com\/spreadsheets\/d\/([A-Za-z0-9_-]+)\/edit(\?.+)?/,
						embedUrl:
							'https://docs.google.com/spreadsheets/d/<%= remote_id %>/preview',
						html: "<iframe style='width: 100%; height: 40rem; border: 1px solid #D3D3D3; border-radius: 12px;' frameborder='0' allowfullscreen='true'></iframe>",
					},
					slidesPublic: {
						regex: /https:\/\/docs\.google\.com\/presentation\/d\/([A-Za-z0-9_-]+)\/edit(\?.+)?/,
						embedUrl:
							'https://docs.google.com/presentation/d/<%= remote_id %>/embed',
						html: "<iframe style='width: 100%; height: 30rem; border: 1px solid #D3D3D3; border-radius: 12px; margin: 1rem 0;' frameborder='0' allowfullscreen='true'></iframe>",
					},
					codesandbox: {
						regex: /^https:\/\/codesandbox\.io\/(?:embed\/)?([A-Za-z0-9_-]+)(?:\?[^\/]*)?$/,
						embedUrl:
							'https://codesandbox.io/embed/<%= remote_id %>?view=editor+%2B+preview&module=%2Findex.html',
						html: "<iframe style='width: 100%; height: 500px; border: 0; border-radius: 4px; overflow: hidden;' sandbox='allow-mods allow-forms allow-popups allow-scripts allow-same-origin' frameborder='0' allowfullscreen='true'></iframe>",
					},
				},
			},
		},
	}
}

export function getTimezones() {
	return [
		'Pacific/Midway',
		'Pacific/Pago_Pago',
		'Pacific/Honolulu',
		'America/Anchorage',
		'America/Vancouver',
		'America/Los_Angeles',
		'America/Tijuana',
		'America/Edmonton',
		'America/Denver',
		'America/Phoenix',
		'America/Mazatlan',
		'America/Winnipeg',
		'America/Regina',
		'America/Chicago',
		'America/Mexico_City',
		'America/Guatemala',
		'America/El_Salvador',
		'America/Managua',
		'America/Costa_Rica',
		'America/Montreal',
		'America/New_York',
		'America/Indianapolis',
		'America/Panama',
		'America/Bogota',
		'America/Lima',
		'America/Halifax',
		'America/Puerto_Rico',
		'America/Caracas',
		'America/Santiago',
		'America/St_Johns',
		'America/Montevideo',
		'America/Araguaina',
		'America/Argentina/Buenos_Aires',
		'America/Godthab',
		'America/Sao_Paulo',
		'Atlantic/Azores',
		'Canada/Atlantic',
		'Atlantic/Cape_Verde',
		'UTC',
		'Etc/Greenwich',
		'Europe/Belgrade',
		'CET',
		'Atlantic/Reykjavik',
		'Europe/Dublin',
		'Europe/London',
		'Europe/Lisbon',
		'Africa/Casablanca',
		'Africa/Nouakchott',
		'Europe/Oslo',
		'Europe/Copenhagen',
		'Europe/Brussels',
		'Europe/Berlin',
		'Europe/Helsinki',
		'Europe/Amsterdam',
		'Europe/Rome',
		'Europe/Stockholm',
		'Europe/Vienna',
		'Europe/Luxembourg',
		'Europe/Paris',
		'Europe/Zurich',
		'Europe/Madrid',
		'Africa/Bangui',
		'Africa/Algiers',
		'Africa/Tunis',
		'Africa/Harare',
		'Africa/Nairobi',
		'Europe/Warsaw',
		'Europe/Prague',
		'Europe/Budapest',
		'Europe/Sofia',
		'Europe/Istanbul',
		'Europe/Athens',
		'Europe/Bucharest',
		'Asia/Nicosia',
		'Asia/Beirut',
		'Asia/Damascus',
		'Asia/Jerusalem',
		'Asia/Amman',
		'Africa/Tripoli',
		'Africa/Cairo',
		'Africa/Johannesburg',
		'Europe/Moscow',
		'Asia/Baghdad',
		'Asia/Kuwait',
		'Asia/Riyadh',
		'Asia/Bahrain',
		'Asia/Qatar',
		'Asia/Aden',
		'Asia/Tehran',
		'Africa/Khartoum',
		'Africa/Djibouti',
		'Africa/Mogadishu',
		'Asia/Dubai',
		'Asia/Muscat',
		'Asia/Baku',
		'Asia/Kabul',
		'Asia/Yekaterinburg',
		'Asia/Tashkent',
		'Asia/Calcutta',
		'Asia/Kathmandu',
		'Asia/Novosibirsk',
		'Asia/Almaty',
		'Asia/Dacca',
		'Asia/Krasnoyarsk',
		'Asia/Dhaka',
		'Asia/Bangkok',
		'Asia/Saigon',
		'Asia/Jakarta',
		'Asia/Irkutsk',
		'Asia/Shanghai',
		'Asia/Hong_Kong',
		'Asia/Taipei',
		'Asia/Kuala_Lumpur',
		'Asia/Singapore',
		'Australia/Perth',
		'Asia/Yakutsk',
		'Asia/Seoul',
		'Asia/Tokyo',
		'Australia/Darwin',
		'Australia/Adelaide',
		'Asia/Vladivostok',
		'Pacific/Port_Moresby',
		'Australia/Brisbane',
		'Australia/Sydney',
		'Australia/Hobart',
		'Asia/Magadan',
		'SST',
		'Pacific/Noumea',
		'Asia/Kamchatka',
		'Pacific/Fiji',
		'Pacific/Auckland',
		'Asia/Kolkata',
		'Europe/Kiev',
		'America/Tegucigalpa',
		'Pacific/Apia',
	]
}

export function getSidebarLinks() {
	return [
		{
			label: 'Courses',
			icon: 'BookOpen',
			to: 'Courses',
			activeFor: [
				'Courses',
				'CourseDetail',
				'Lesson',
				'CourseForm',
				'LessonForm',
			],
		},
		{
			label: 'Batches',
			icon: 'Users',
			to: 'Batches',
			activeFor: ['Batches', 'BatchDetail', 'Batch', 'BatchForm'],
		},
		{
			label: 'Certified Participants',
			icon: 'GraduationCap',
			to: 'CertifiedParticipants',
			activeFor: ['CertifiedParticipants'],
		},
		{
			label: 'Jobs',
			icon: 'Briefcase',
			to: 'Jobs',
			activeFor: ['Jobs', 'JobDetail'],
		},
		{
			label: 'Statistics',
			icon: 'TrendingUp',
			to: 'Statistics',
			activeFor: ['Statistics'],
		},
	]
}

export function getFormattedDateRange(
	startDate,
	endDate,
	format = 'DD MMM YYYY'
) {
	if (startDate === endDate) {
		return dayjs(startDate).format(format)
	}
	return `${dayjs(startDate).format(format)} - ${dayjs(endDate).format(
		format
	)}`
}

export function getLineStartPosition(string, position) {
	const charLength = 1
	let char = ''

	while (char !== '\n' && position > 0) {
		position = position - charLength
		char = string.substr(position, charLength)
	}

	if (char === '\n') {
		position += 1
	}

	return position
}

export function singularize(word) {
	const endings = {
		ves: 'fe',
		ies: 'y',
		i: 'us',
		zes: 'ze',
		ses: 's',
		es: 'e',
		s: '',
	}
	return word.replace(
		new RegExp(`(${Object.keys(endings).join('|')})$`),
		(r) => endings[r]
	)
}
