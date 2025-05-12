document.addEventListener('DOMContentLoaded', () => {
	// Получить параметр title из URL
	const urlParams = new URLSearchParams(window.location.search)
	const eventTitle = urlParams.get('title')

	if (!eventTitle) {
		console.error('Параметр title отсутствует в URL')
		return
	}

	// Загрузить events.json
	fetch('./data/events.json')
		.then(response => {
			if (!response.ok) {
				throw new Error(`Ошибка загрузки events.json: ${response.status}`)
			}
			return response.json()
		})
		.then(data => {
			console.log('Загруженные данные:', data) // Для отладки
			// Проверяем, что data является массивом
			if (!Array.isArray(data)) {
				throw new Error('Данные событий не являются массивом')
			}
			// Найти событие по title
			const event = data.find(e => e.title === decodeURIComponent(eventTitle))
			if (!event) {
				console.error('Событие не найдено:', decodeURIComponent(eventTitle))
				return
			}

			// Заполнить элементы страницы
			const eventImage = document.querySelector('.event__image')
			const eventTitleElement = document.querySelector('.event__title')
			const eventType = document.querySelector('.event__type')
			const eventAge = document.querySelector('.event__age')
			const eventDate = document.querySelector('.event__date')
			const eventTime = document.querySelector('.event__time')
			const eventDirector = document.querySelector('.event__director')
			const eventPrice = document.querySelector('.event__price')
			const eventDescription = document.querySelector('.event__description')
			const eventCast = document.querySelector('.event__cast')

			if (
				!eventImage ||
				!eventTitleElement ||
				!eventType ||
				!eventAge ||
				!eventDate ||
				!eventTime ||
				!eventDirector ||
				!eventPrice ||
				!eventDescription ||
				!eventCast
			) {
				console.error('Элементы страницы не найдены:', {
					eventImage,
					eventTitleElement,
					eventType,
					eventAge,
					eventDate,
					eventTime,
					eventDirector,
					eventPrice,
					eventDescription,
					eventCast,
				})
				return
			}

			eventImage.src = event.image || ''
			eventImage.alt = event.title || 'Изображение спектакля'
			eventTitleElement.textContent = event.title || ''
			eventType.textContent = event.type ? `${event.type}` : ''
			eventAge.textContent = event.age ? `${event.age}` : ''
			eventDate.textContent = event.date ? `${event.date}` : ''
			eventTime.textContent = event.time ? `Время: ${event.time}` : ''
			eventDirector.textContent = event.director
				? `Режиссёр: ${event.director}`
				: ''
			eventPrice.textContent = event.price ? `Цена: ${event.price}` : ''
			eventDescription.textContent = event.description || ''
			eventCast.innerHTML = event.cast
				? `<h3>Действующие лица и исполнители:</h3><p>${event.cast}</p>`
				: ''
		})
		.catch(error => {
			console.error('Ошибка при загрузке данных:', error)
			// Отобразить сообщение об ошибке на странице
			const eventContainer = document.querySelector('.event')
			if (eventContainer) {
				eventContainer.innerHTML =
					'<p>Не удалось загрузить событие. Попробуйте позже.</p>'
			}
		})
})

