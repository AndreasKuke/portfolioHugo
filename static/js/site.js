(() => {
  const root = document.documentElement
  const buttons = Array.from(document.querySelectorAll("[data-theme-choice]"))
  const themes = new Set(["light", "dark", "sand"])

  const applyTheme = (theme) => {
    const nextTheme = themes.has(theme) ? theme : "light"
    root.setAttribute("data-theme", nextTheme)
    localStorage.setItem("theme", nextTheme)
    buttons.forEach((button) => {
      button.classList.toggle("is-active", button.dataset.themeChoice === nextTheme)
    })
  }

  const initial = localStorage.getItem("theme") || root.getAttribute("data-theme") || "light"
  applyTheme(initial)

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      applyTheme(button.dataset.themeChoice)
      button.classList.remove("theme-picker__button--bounce")
      void button.offsetWidth
      button.classList.add("theme-picker__button--bounce")
      button.addEventListener("animationend", () => button.classList.remove("theme-picker__button--bounce"), { once: true })
    })
  })

  document.querySelectorAll(".site-nav__link").forEach((link) => {
    link.addEventListener("click", () => {
      link.classList.remove("site-nav__link--pop")
      void link.offsetWidth
      link.classList.add("site-nav__link--pop")
      link.addEventListener("animationend", () => link.classList.remove("site-nav__link--pop"), { once: true })
    })
  })

  // Hamburger menu
  const hamburger = document.querySelector(".site-hamburger")
  const mobileMenu = document.getElementById("site-mobile-menu")

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      const isOpen = hamburger.getAttribute("aria-expanded") === "true"
      hamburger.setAttribute("aria-expanded", !isOpen)
      mobileMenu.hidden = isOpen
    })

    // Close on mobile nav link click
    mobileMenu.querySelectorAll(".site-mobile-nav__link").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.setAttribute("aria-expanded", "false")
        mobileMenu.hidden = true
      })
    })

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!hamburger.closest(".site-header").contains(e.target)) {
        hamburger.setAttribute("aria-expanded", "false")
        mobileMenu.hidden = true
      }
    })
  }
})()
