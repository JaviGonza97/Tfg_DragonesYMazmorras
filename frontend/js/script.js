$(document).ready(() => {
  const games = $(".game")
  const modal = new bootstrap.Modal($("#gameModal")[0])
  const modalTitle = $("#modalTitle")
  const modalImage = $("#modalImage")
  const modalDescription = $("#modalDescription")
  const modalDetails = $("#modalDetails")

  modalTitle.attr("aria-live", "polite")
  modalDescription.attr("aria-live", "polite")

  const gameDetails = {
    lol: {
      title: "Humano Guerrero",
      description:
        "Un combatiente disciplinado que confía en su espada. Entrenado en tácticas de batalla y siempre listo para liderar.",
      image: "img/lol.jpg",
      details: [
        "Arma: Espada larga",
        "Objetos: Poción de salud, brújula",
        "Equipamiento: Armadura de placas",
        "Habilidad: Ataque doble",
        "Poderes: Grito de guerra",
      ],
    },
    tft: {
      title: "Enano Paladin",
      description:
        "Un defensor sagrado con armadura pesada y maza bendita. Lucha por la justicia y protege a los débiles con fe inquebrantable.",
      image: "img/lor.jpg",
      details: [
        "Arma: Maza de justicia",
        "Objetos: Libro sagrado, amuleto",
        "Equipamiento: Armadura dorada de paladín",
        "Habilidad: Curación",
        "Poderes: Aura protectora",
      ],
    },
    lor: {
      title: "Orco Hechicero",
      description:
        "Una fusión de fuerza bruta y poder arcano. Canaliza energía mágica salvaje para dominar el campo de batalla.",
      image: "img/2xko.png",
      details: [
        "Arma: Bastón rúnico",
        "Objetos: Cristal arcano, grimorio",
        "Equipamiento: Túnica encantada",
        "Habilidad: Explosión mágica",
        "Poderes: Llama oscura",
      ],
    },
    "2xko": {
      title: "Draconico",
      description:
        "Descendiente de dragones, este guerrero blande un hacha con fuerza ancestral y escupe fuego cuando la batalla lo exige.",
      image: "img/tft.jpg",
      details: [
        "Arma: Hacha de escamas rojas",
        "Objetos: Talismán dracónico, piedra de fuego",
        "Equipamiento: Cota escamada",
        "Habilidad: Aliento de fuego",
        "Poderes: Garras ardientes",
      ],
    },
  }

  games.on("click", function () {
    const gameId = $(this).data("game")
    const gameInfo = gameDetails[gameId]

    modalTitle.text(gameInfo.title)
    modalImage.attr({
      src: gameInfo.image,
      alt: `Captura de pantalla del juego ${gameInfo.title}`,
    })
    modalDescription.text(gameInfo.description)

    modalDetails.empty()
    gameInfo.details.forEach((detail) => {
      modalDetails.append(`
        <li class="list-group-item d-flex align-items-center">
          <i class="bi bi-check-circle-fill text-success me-2" aria-hidden="true"></i>
          ${detail}
        </li>
      `)
    })

    modal.show()
  })

  $(".game").on("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      $(this).click()
    }
  })

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          $(entry.target).addClass("show")
        }
      })
    },
    { threshold: 0.1 },
  )

  $(".animated").each(function () {
    observer.observe(this)
  })

  $('a[href^="#"]').on("click", function (e) {
    e.preventDefault()
    const target = $(this.hash)
    if (target.length) {
      $("html, body").animate(
        {
          scrollTop: target.offset().top - 70,
        },
        800,
      )
    }
  })

  $('[data-bs-toggle="tooltip"]').tooltip()

  $('[data-bs-toggle="tooltip"]').on("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      $(this).tooltip("toggle")
    }
  })

  $("#gameModal").on("shown.bs.modal", function () {
    $(this).find("[data-bs-dismiss='modal']").focus()
  })

  $(window).on("scroll", () => {
    if ($(window).scrollTop() > 50) {
      $(".navbar").addClass("shadow-sm")
    } else {
      $(".navbar").removeClass("shadow-sm")
    }
  })

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)")

  function setTheme(dark) {
    if (dark) {
      document.body.classList.add("dark")
    } else {
      document.body.classList.remove("dark")
    }
  }

  setTheme(prefersDark.matches)

  prefersDark.addEventListener("change", (e) => setTheme(e.matches))

  const navbar = $(".navbar-nav")
  navbar.append(`
    <li class="nav-item">
      <button class="nav-link" id="theme-toggle" aria-label="Alternar tema claro/oscuro">
        <i class="bi bi-sun-fill" id="theme-icon"></i>
      </button>
    </li>
  `)

  $("#theme-toggle").on("click", () => {
    const isDark = document.body.classList.toggle("dark")
    $("#theme-icon").toggleClass("bi-sun-fill bi-moon-fill")

    localStorage.setItem("theme", isDark ? "dark" : "light")
  })

  const savedTheme = localStorage.getItem("theme")
  if (savedTheme) {
    setTheme(savedTheme === "dark")
    if (savedTheme === "dark") {
      $("#theme-icon").removeClass("bi-sun-fill").addClass("bi-moon-fill")
    }
  }
})

