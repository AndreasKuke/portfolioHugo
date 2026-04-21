(() => {
  'use strict'

  const themeLabels = {
    light: 'Light',
    dark: 'Dark',
    sand: 'Sand',
    auto: 'Auto'
  }

  const sandOptionMarkup = `
    <li class="theme-option-sand">
      <button type="button" class="dropdown-item d-flex align-items-center" data-bs-theme-value="sand" aria-pressed="false">
        Sand
      </button>
    </li>
  `

  const getStoredTheme = () => localStorage.getItem('theme')
  const setStoredTheme = theme => localStorage.setItem('theme', theme)

  const getPreferredTheme = () => {
    const storedTheme = getStoredTheme()
    if (storedTheme) {
      return storedTheme
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  const ensureSandOptions = () => {
    document.querySelectorAll('.dropdown-menu[id^="theme-dropdown-"]').forEach(menu => {
      if (!menu.querySelector('[data-bs-theme-value="sand"]')) {
        const autoOption = menu.querySelector('[data-bs-theme-value="auto"]')?.closest('li')
        if (autoOption) {
          autoOption.insertAdjacentHTML('beforebegin', sandOptionMarkup)
        } else {
          menu.insertAdjacentHTML('beforeend', sandOptionMarkup)
        }
      }
    })
  }

  const setTheme = theme => {
    document.documentElement.classList.add('theme-transition')

    if (theme === 'auto') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      document.documentElement.setAttribute('data-bs-theme', isDark ? 'dark' : 'light')
      document.documentElement.setAttribute('data-theme-auto', 'true')
    } else {
      document.documentElement.setAttribute('data-bs-theme', theme)
      document.documentElement.removeAttribute('data-theme-auto')
    }

    window.setTimeout(() => {
      document.documentElement.classList.remove('theme-transition')
    }, 300)
  }

  const showActiveTheme = theme => {
    const themeSwitcher = document.querySelectorAll('.bd-theme-selector')
    const themeSwitcherText = document.querySelectorAll('.bd-theme-text')
    const activeTheme = document.querySelectorAll('.current-theme')
    const activeButtons = document.querySelectorAll(`[data-bs-theme-value="${theme}"]`)
    const label = themeLabels[theme] || theme

    document.querySelectorAll('[data-bs-theme-value]').forEach(element => {
      element.classList.remove('active')
      element.setAttribute('aria-pressed', 'false')
    })

    activeButtons.forEach(element => {
      element.classList.add('active')
      element.setAttribute('aria-pressed', 'true')
    })

    activeTheme.forEach(element => {
      element.textContent = label
    })

    const srText = themeSwitcherText[0]?.textContent || 'Toggle theme'
    const themeSwitcherLabel = `${srText} (${theme})`
    themeSwitcher.forEach(element => {
      element.setAttribute('aria-label', themeSwitcherLabel)
    })
  }

  const bindThemeButtons = () => {
    document.querySelectorAll('[data-bs-theme-value]').forEach(toggle => {
      if (toggle.dataset.themeBound === 'true') {
        return
      }

      toggle.dataset.themeBound = 'true'
      toggle.addEventListener('click', () => {
        const theme = toggle.getAttribute('data-bs-theme-value')
        setStoredTheme(theme)
        setTheme(theme)
        showActiveTheme(theme)
      })
    })
  }

  setTheme(getPreferredTheme())

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const storedTheme = getStoredTheme()
    if (storedTheme === 'auto' || (!storedTheme && document.documentElement.getAttribute('data-theme-auto') === 'true')) {
      setTheme('auto')
      showActiveTheme('auto')
    }
  })

  window.addEventListener('DOMContentLoaded', () => {
    ensureSandOptions()
    bindThemeButtons()
    showActiveTheme(getPreferredTheme())
  })
})()
