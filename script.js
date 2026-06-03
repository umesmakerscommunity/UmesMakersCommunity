// Edita estos arrays para actualizar tarjetas sin cambiar la estructura del HTML.
const eventosRealizados = [
  {
    image: "assets/eventos/evento-1.png",
    title: "Arduino Essentials: de cero a maker",
    date: "2025",
    type: "Taller introductorio",
    description:
      "Taller introductorio para estudiantes interesados en aprender Arduino desde lo b&aacute;sico.",
  },
  {
    image: "assets/eventos/evento-2.png",
    title: "Arduino Intermedio: IoT y monitoreo remoto",
    date: "2025",
    type: "Taller pr&aacute;ctico",
    description:
      "Taller enfocado en comunicaci&oacute;n, sensores avanzados, WiFi y control remoto.",
  },
  {
    image: "assets/eventos/evento-3.png",
    title: "Ingenier&iacute;a + IA",
    date: "2025",
    type: "Charla",
    description:
      "Charla sobre c&oacute;mo la inteligencia artificial est&aacute; cambiando el trabajo de estudiantes y profesionales de ingenier&iacute;a.",
  },
  {
    image: "assets/eventos/evento-4.png",
    title: "CITEIN Makers 2025",
    date: "2025",
    type: "Convenci&oacute;n",
    description:
      "Convenci&oacute;n de ciencia, tecnolog&iacute;a e innovaci&oacute;n enfocada en aprendizaje pr&aacute;ctico y proyectos maker.",
  },
];

const proyectosDestacados = [
  {
    image: "assets/proyectos/proyecto-parqueo.png",
    title: "Sistema de parqueo inteligente",
    tags: ["Arduino", "Sensores", "Automatizaci&oacute;n"],
    description:
      "Proyecto desarrollado en el curso de Arduino Intermedio, usando sensores y l&oacute;gica de control para simular un sistema de parqueo.",
  },
  {
    image: "assets/proyectos/proyecto-semaforo.png",
    title: "Sem&aacute;foro inteligente",
    tags: ["Electr&oacute;nica", "Programaci&oacute;n", "Automatizaci&oacute;n"],
    description:
      "Prototipo de control de tr&aacute;fico usando electr&oacute;nica, programaci&oacute;n y l&oacute;gica de automatizaci&oacute;n.",
  },
  {
    image: "assets/proyectos/proyecto-estacion-sismica.png",
    title: "Estaci&oacute;n s&iacute;smica",
    tags: ["Sensores", "Datos", "Electr&oacute;nica"],
    description:
      "Proyecto orientado a la detecci&oacute;n de vibraciones o movimientos, usando sensores y procesamiento de datos.",
  },
  {
    image: "assets/proyectos/proyecto-carrito-espia.png",
    title: "Carrito esp&iacute;a",
    tags: ["Rob&oacute;tica", "IoT", "Electr&oacute;nica"],
    description:
      "Veh&iacute;culo controlado para exploraci&oacute;n, vigilancia o pruebas de movilidad con componentes electr&oacute;nicos.",
  },
];

const eventsGrid = document.querySelector("#events-grid");
const projectsGrid = document.querySelector("#projects-grid");

const renderEvents = () => {
  if (!eventsGrid) return;

  eventsGrid.innerHTML = eventosRealizados
    .map(
      (event) => `
        <article class="event-card reveal">
          <div class="event-media">
            <img src="${event.image}" alt="Flyer de ${event.title}" loading="lazy" />
            <span class="event-type">${event.type}</span>
          </div>
          <div class="event-content">
            <div class="event-meta">
              <span>${event.date}</span>
              <span>${event.type}</span>
            </div>
            <h3>${event.title}</h3>
            <p>${event.description}</p>
          </div>
        </article>
      `
    )
    .join("");
};

const renderProjects = () => {
  if (!projectsGrid) return;

  projectsGrid.innerHTML = proyectosDestacados
    .map(
      (project) => `
        <article class="project-card reveal">
          <div class="project-media">
            <img src="${project.image}" alt="Imagen del proyecto ${project.title}" loading="lazy" />
          </div>
          <div class="project-body">
            <div class="tag-list">
              ${project.tags.map((tag) => `<span>${tag}</span>`).join("")}
            </div>
            <h3>${project.title}</h3>
            <p>${project.description}</p>
          </div>
        </article>
      `
    )
    .join("");
};

renderEvents();
renderProjects();

const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector("[data-nav-links]");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";

    navToggle.setAttribute("aria-expanded", String(!isOpen));
    navLinks.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("nav-open", !isOpen);
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded", "false");
      navLinks.classList.remove("is-open");
      document.body.classList.remove("nav-open");
    });
  });
}

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}
