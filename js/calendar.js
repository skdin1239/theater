const monthNames = [
	'Январь',
	'Февраль',
	'Март',
	'Апрель',
	'Май',
	'Июнь',
	'Июль',
	'Август',
	'Сентябрь',
	'Октябрь',
	'Ноябрь',
	'Декабрь',
]

const today = new Date()
let currentYear = today.getFullYear()
let currentMonth = today.getMonth() + 1
let selectedDate = null
let eventsByDate = {}
let currentSlideIndex = 0
let lastDirection = null

// Форматирование сегодняшней даты в YYYY-MM-DD
const todayStr = `${today.getFullYear()}-${(today.getMonth() + 1)
	.toString()
	.padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`

// Загрузка событий из JSON
async function loadEvents() {
	try {
		const response = await fetch('./data/events.json')
		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status}`)
		}
		const data = await response.json()
		eventsByDate = {}
		if (!Array.isArray(data)) {
			throw new Error('Данные событий не являются массивом')
		}
		data.forEach(event => {
			if (!eventsByDate[event.date]) {
				eventsByDate[event.date] = []
			}
			eventsByDate[event.date].push(event)
		})
		return data
	} catch (error) {
		console.error('Ошибка загрузки событий:', error)
		return []
	}
}

function createCalendar(elem, year, mon) {
	elem = document.querySelector(elem)
	let dateMonth = mon - 1
	let d = new Date(year, dateMonth, 1)
	let table = `
			<table>
			<caption>
					<button class="afisha__arrow afisha__arrow_left" id="prev" aria-label="Предыдущий месяц">
							<svg width="42" height="42" viewBox="0 0 50 100" xmlns="http://www.w3.org/2000/svg">
									<path d="M 45.46644,98.758703 c 0.379518,-0.443927 1.308722,-1.818548 -0.0237,-3.478641 C 34.020448,80.626907 22.392465,66.174792 11.006561,51.488137 c -0.549627,-0.750106 -0.549612,-1.896596 0,-2.646714 C 22.470045,34.232022 33.961985,19.642514 45.443205,5.0479173 46.4656,3.7000743 46.18991,2.2987443 45.704828,1.5485503 45.154656,0.80928733 43.578236,0.21832333 42.541821,1.5070303 30.268782,17.466036 17.439538,32.893359 5.2667372,48.943056 c -0.463199,0.718135 -0.463395,1.725972 0,2.443973 12.3033598,15.746967 24.6892308,31.436443 37.0435938,47.140718 1.344021,1.779003 2.726055,0.672688 3.156109,0.230956 z" style="fill: #828282" />
							</svg>
					</button>
					<div class="text">${monthNames[dateMonth]} ${year}</div>
					<button class="afisha__arrow afisha__arrow_right" id="next" aria-label="Следующий месяц">
							<svg width="42" height="42" viewBox="0 0 50 100" xmlns="http://www.w3.org/2000/svg">
									<path d="M 5.5921574,1.4964206 C 5.2126391,1.9403477 4.2834354,3.3149685 5.6158546,4.9750616 17.038149,19.628216 28.666132,34.080331 40.052036,48.766986 c 0.549627,0.750106 0.549612,1.896596 0,2.646714 C 28.588552,66.023101 17.096612,80.612609 5.6153917,95.207206 4.5929976,96.555049 4.8686868,97.956379 5.3537687,98.706573 5.9039408,99.445836 7.4803608,100.0368 8.5167765,98.748093 20.789815,82.789087 33.619059,67.361764 45.79186,51.312067 c 0.463199,-0.718135 0.463395,-1.725972 0,-2.443973 C 33.4885,33.121127 21.102629,17.431651 8.7482659,1.7273764 7.4042447,-0.0516238 6.0222107,1.0546883 5.5921574,1.4964206 Z" style="fill: #828282"/>
							</svg>
					</button>
			</caption>
			<thead>
					<tr>
							<th>Пн</th><th>Вт</th><th>Ср</th><th>Чт</th><th>Пт</th><th>Сб</th><th>Вс</th>
					</tr>
			</thead>
			<tbody>
					<tr>
	`

	// Пустые ячейки перед началом месяца
	for (let i = 0; i < getDay(d); i++) {
		table += `<th></th>`
	}

	// Дни месяца
	while (d.getMonth() === dateMonth) {
		let day = d.getDate()
		let dateStr = `${year}-${mon.toString().padStart(2, '0')}-${day
			.toString()
			.padStart(2, '0')}`
		let isToday =
			d.getFullYear() === today.getFullYear() &&
			d.getMonth() === today.getMonth() &&
			d.getDate() === today.getDate()
		let hasEvents = eventsByDate[dateStr] && eventsByDate[dateStr].length > 0
		let isSelected = dateStr === selectedDate

		table += `<td class="day-cell${isToday ? ' istoday' : ''}${
			hasEvents ? ' has-events' : ''
		}${isSelected ? ' selected' : ''}" data-date="${dateStr}">${day}</td>`

		if (getDay(d) === 6) {
			table += `</tr><tr>`
		}
		d.setDate(d.getDate() + 1)
	}

	// Пустые ячейки после конца месяца
	if (getDay(d) % 7 !== 0) {
		for (let i = getDay(d); i < 7; i++) {
			table += `<th></th>`
		}
	}

	table += `</tr></tbody></table>`
	elem.innerHTML = table

	// Навешиваем обработчики на клики по датам
	elem.querySelectorAll('.day-cell').forEach(cell => {
		cell.addEventListener('click', function () {
			elem.querySelectorAll('.day-cell').forEach(c => {
				c.classList.remove('selected')
			})
			this.classList.add('selected')
			selectedDate = this.getAttribute('data-date')
			currentSlideIndex = 0
			lastDirection = null
			updateEventSlider()
		})
	})
}

function getDay(date) {
	let day = date.getDay()
	if (day === 0) day = 7
	return day - 1
}

// Обновление слайдера событий
function updateEventSlider() {
	const slidesContainer = document.querySelector('.afisha__event_slides')
	if (!slidesContainer) {
		console.error('Контейнер слайдов не найден')
		return
	}

	const events =
		selectedDate && eventsByDate[selectedDate] ? eventsByDate[selectedDate] : []
	currentSlideIndex = 0
	lastDirection = null

	if (events.length === 0) {
		slidesContainer.innerHTML =
			'<p class="afisha__event_noevents">Нет <br> событий на эту <br> дату</p>'
		updateSliderButtons()
		return
	}

	slidesContainer.innerHTML = events
		.map(
			(event, index) => `
					<div class="afisha__event_slide${
						index === 0 ? ' active' : ''
					}" aria-label="Событие ${index + 1} из ${events.length}">
							<img src="${event.image}" alt="${
				event.title
			}" class="afisha__event_image" data-event-id="${index}"/>
							<div class="afisha__event_content">
									<h3 class="afisha__event_title">${event.title}</h3>
									<p class="afisha__event_time">Время: ${event.time}</p>
							</div>
					</div>
			`
		)
		.join('')

	// Добавляем обработчик кликов на изображения
	slidesContainer
		.querySelectorAll('.afisha__event_image')
		.forEach((img, index) => {
			img.addEventListener('click', () => {
				const event = events[index]
				window.location.href = `events-page.html?title=${encodeURIComponent(
					event.title
				)}`
			})
		})

	updateSliderButtons()
}

// Обновление состояния кнопок слайдера
function updateSliderButtons() {
	const prevButton = document.querySelector('.afisha__event_arrow_prev')
	const nextButton = document.querySelector('.afisha__event_arrow_next')
	const events =
		selectedDate && eventsByDate[selectedDate] ? eventsByDate[selectedDate] : []

	if (!prevButton || !nextButton) {
		console.error('Кнопки навигации не найдены')
		return
	}

	prevButton.disabled = currentSlideIndex === 0
	nextButton.disabled = currentSlideIndex >= events.length - 1
}

// Навигация по слайдеру
function setupSliderNavigation() {
	const prevButton = document.querySelector('.afisha__event_arrow_prev')
	const nextButton = document.querySelector('.afisha__event_arrow_next')

	if (!prevButton || !nextButton) {
		console.error('Кнопки навигации не найдены')
		return
	}

	prevButton.addEventListener('click', () => {
		if (currentSlideIndex > 0) {
			lastDirection = 'prev'
			currentSlideIndex--
			updateSlides()
		}
	})

	nextButton.addEventListener('click', () => {
		const events =
			selectedDate && eventsByDate[selectedDate]
				? eventsByDate[selectedDate]
				: []
		if (currentSlideIndex < events.length - 1) {
			lastDirection = 'next'
			currentSlideIndex++
			updateSlides()
		}
	})
}

function updateSlides() {
	const slides = document.querySelectorAll('.afisha__event_slide')
	if (!slides.length) {
		console.error('Слайды не найдены')
		return
	}

	slides.forEach((slide, index) => {
		slide.classList.remove('active', 'slide-in-left', 'slide-in-right')
		slide.style.transform = 'translateX(0)'

		if (index === currentSlideIndex) {
			slide.classList.add('active')
			if (lastDirection === 'prev') {
				slide.classList.add('slide-in-right')
			} else if (lastDirection === 'next') {
				slide.classList.add('slide-in-left')
			}

			slide.addEventListener(
				'transitionend',
				() => {
					slide.classList.remove('slide-in-left', 'slide-in-right')
					slide.style.transform = 'translateX(0)'
				},
				{ once: true }
			)
		}
	})

	updateSliderButtons()
}

// Функция для обновления календаря
function updateCalendar(direction) {
	if (direction === 'prev') {
		currentMonth--
		if (currentMonth < 1) {
			currentMonth = 12
			currentYear--
		}
	} else if (direction === 'next') {
		currentMonth++
		if (currentMonth > 12) {
			currentMonth = 1
			currentYear++
		}
	}
	createCalendar('#calendar', currentYear, currentMonth)
	selectedDate = null
	updateEventSlider()
}

// Инициализация
async function init() {
	await loadEvents()
	selectedDate = todayStr
	createCalendar('#calendar', currentYear, currentMonth)
	setupSliderNavigation()
	updateEventSlider()

	document.addEventListener('click', function (e) {
		if (e.target.closest('#prev')) {
			updateCalendar('prev')
		}
		if (e.target.closest('#next')) {
			updateCalendar('next')
		}
	})
}

init()
