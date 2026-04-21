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
    button.addEventListener("click", () => applyTheme(button.dataset.themeChoice))
  })
})()
