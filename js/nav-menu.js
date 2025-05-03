document.addEventListener('DOMContentLoaded', () => {
	const hamburger = document.querySelector('.nav__hamburger')
	const toggle = document.querySelector('.nav__toggle')

	toggle.addEventListener('change', () => {
		hamburger.setAttribute(
			'aria-label',
			toggle.checked ? 'Закрыть меню' : 'Открыть меню'
		)
		hamburger.dataset.state = toggle.checked ? 'open' : 'closed'
	})
})
