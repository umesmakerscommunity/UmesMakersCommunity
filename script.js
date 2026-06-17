import { projects } from "./src/data/projects.js";
import { events } from "./src/data/events.js";
import { makers } from "./src/data/makers.js";
import { resources } from "./src/data/resources.js";
import { tools } from "./src/data/tools.js";

const today = new Date();
today.setHours(0, 0, 0, 0);

const getProjectBySlug = (slug) => projects.find((project) => project.slug === slug);
const getStatusClass = (status) =>
  `status-${status
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")}`;

const renderTags = (items = []) => items.map((item) => `<span>${item}</span>`).join("");

const actionLink = (label, href, variant = "mini-link") => {
  const disabled = !href || href === "#";
  return `<a class="${variant}${disabled ? " is-disabled" : ""}" href="${href || "#"}"${
    disabled ? ' aria-disabled="true"' : ""
  }>${label}</a>`;
};

const projectCard = (project) => `
  <article class="project-card reveal">
    <a class="project-media" href="${project.links.documentation}" aria-label="Ver ${project.name}">
      <img src="${project.image}" alt="Imagen del proyecto ${project.name}" loading="lazy" />
      <span class="status-badge ${getStatusClass(project.status)}">${project.status}</span>
    </a>
    <div class="project-body">
      <div class="project-meta">
        <span>${project.updated}</span>
      </div>
      <div class="tag-list">${renderTags(project.technologies)}</div>
      <h3>${project.name}</h3>
      <p>${project.summary}</p>
      <div class="component-list">
        ${project.components.slice(0, 4).map((component) => `<span>${component}</span>`).join("")}
      </div>
      <div class="card-actions">
        ${actionLink("Ver documentacion", project.links.documentation)}
        ${actionLink("Repositorio", project.links.repository)}
        ${actionLink("Diseños 3D/PCB", project.links.designs)}
      </div>
    </div>
  </article>
`;

const eventCard = (event) => {
  const isFinished = event.status === "Finalizado";

  return `
    <article class="event-card reveal" data-event-type="${event.type}">
      <div class="event-media">
        <img src="${event.image}" alt="Flyer de ${event.title}" loading="lazy" />
        <span class="event-type">${event.type}</span>
      </div>
      <div class="event-content">
        <div class="event-meta">
          <span>${event.dateLabel}</span>
          <span>${event.time}</span>
          <span>${event.status}</span>
        </div>
        <h3>${event.title}</h3>
        <p>${event.summary}</p>
        <dl class="event-details">
          <div><dt>Lugar</dt><dd>${event.place}</dd></div>
        </dl>
        ${
          isFinished && event.resources?.length
            ? `<div class="event-resources">
                <strong>Recursos</strong>
                ${event.resources
                  .map(
                    (resource) =>
                      `<a href="${resource.url}"${
                        resource.url === "#" ? ' aria-disabled="true" class="is-disabled"' : ""
                      }><span>${resource.type}</span>${resource.label}</a>`
                  )
                  .join("")}
              </div>`
            : ""
        }
        <div class="card-actions">
          ${
            isFinished
              ? actionLink("Descargar recursos", event.resources?.[0]?.url || "#")
              : actionLink("Registrarme", event.registration || "#")
          }
        </div>
      </div>
    </article>
  `;
};

const renderProjectCollections = () => {
  document.querySelectorAll("[data-featured-projects]").forEach((container) => {
    const limit = Number(container.dataset.limit || 0);
    const list = projects.filter((project) => project.featured);
    container.innerHTML = (limit ? list.slice(0, limit) : list).map(projectCard).join("");
  });

  document.querySelectorAll("[data-development-projects]").forEach((container) => {
    const list = projects.filter((project) => project.status !== "Finalizado");
    container.innerHTML = list.map(projectCard).join("");
  });

  document.querySelectorAll("[data-projects-grid]").forEach((container) => {
    container.innerHTML = projects.map(projectCard).join("");
  });
};

const renderProjectDetail = () => {
  const container = document.querySelector("[data-project-detail]");
  if (!container) return;

  const pathSegments = window.location.pathname.split("/").filter(Boolean);
  const slug = container.dataset.projectDetail || pathSegments[pathSegments.length - 1];
  const project = getProjectBySlug(slug);

  if (!project) {
    container.innerHTML = `
      <section class="section">
        <div class="container text-panel">
          <h1>Proyecto no encontrado</h1>
          <p>Revisa la ruta o vuelve a la pagina de proyectos.</p>
          <a class="btn btn-primary" href="/proyectos/">Ver proyectos</a>
        </div>
      </section>
    `;
    return;
  }

  document.title = `${project.name} | UMES Makers Community`;

  container.innerHTML = `
    <section class="detail-hero section-shell">
      <div class="container detail-hero-grid">
        <div class="hero-copy reveal">
          <span class="section-kicker">Documentacion de proyecto</span>
          <h1>${project.name}</h1>
          <p class="hero-text">${project.summary}</p>
          <div class="detail-meta">
            <span class="status-badge ${getStatusClass(project.status)}">${project.status}</span>
            <span>${project.updated}</span>
          </div>
          <div class="hero-actions">
            ${actionLink("Repositorio", project.links.repository, "btn btn-primary")}
            ${actionLink("Diseños 3D/PCB", project.links.designs, "btn btn-secondary")}
          </div>
        </div>
        <div class="detail-image reveal">
          <img src="${project.image}" alt="Imagen del proyecto ${project.name}" />
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container detail-layout">
        <aside class="detail-sidebar reveal">
          <h2>Ficha tecnica</h2>
          <div class="tag-list">${renderTags(project.technologies)}</div>
          <h3>Componentes</h3>
          <ul>${project.components.map((component) => `<li>${component}</li>`).join("")}</ul>
          <h3>Codigo fuente</h3>
          <p>${project.source}</p>
        </aside>

        <div class="detail-content">
          <article class="doc-block reveal">
            <span class="section-kicker">Objetivo</span>
            <h2>Que busca resolver</h2>
            <p>${project.objective}</p>
          </article>

          <article class="doc-block reveal">
            <span class="section-kicker">Materiales y armado</span>
            <h2>Pasos para reproducirlo</h2>
            <ol>${project.buildSteps.map((step) => `<li>${step}</li>`).join("")}</ol>
          </article>

          <article class="doc-block reveal">
            <span class="section-kicker">Diagrama o imagenes</span>
            <h2>Referencia visual</h2>
            <div class="diagram-placeholder">
              <img src="${project.image}" alt="Referencia visual de ${project.name}" />
              <p>Espacio preparado para agregar diagrama electrico, modelo 3D, PCB o fotografias del montaje.</p>
            </div>
          </article>

          <article class="doc-grid">
            <div class="doc-block reveal">
              <span class="section-kicker">Resultados</span>
              <h2>Pruebas registradas</h2>
              <ul>${project.results.map((result) => `<li>${result}</li>`).join("")}</ul>
            </div>
            <div class="doc-block reveal">
              <span class="section-kicker">Mejoras</span>
              <h2>Siguientes pasos</h2>
              <ul>${project.improvements.map((improvement) => `<li>${improvement}</li>`).join("")}</ul>
            </div>
          </article>
        </div>
      </div>
    </section>
  `;
};

const getUpcomingEvents = () =>
  events
    .filter((event) => new Date(`${event.date}T00:00:00`) >= today && event.status !== "Finalizado")
    .sort((a, b) => new Date(a.date) - new Date(b.date));

const getPastEvents = () =>
  events
    .filter((event) => new Date(`${event.date}T00:00:00`) < today || event.status === "Finalizado")
    .sort((a, b) => new Date(b.date) - new Date(a.date));

const renderEventCollections = () => {
  document.querySelectorAll("[data-upcoming-events]").forEach((container) => {
    const limit = Number(container.dataset.limit || 0);
    const list = getUpcomingEvents();
    container.innerHTML = (limit ? list.slice(0, limit) : list).map(eventCard).join("");
  });

  document.querySelectorAll("[data-past-events]").forEach((container) => {
    container.innerHTML = getPastEvents().map(eventCard).join("");
  });

  const agenda = document.querySelector("[data-event-agenda]");
  if (agenda) {
    const renderAgenda = (filter = "todos") => {
      const filtered = events
        .filter((event) => filter === "todos" || event.type.toLowerCase() === filter)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      agenda.innerHTML = filtered
        .map(
          (event) => `
            <article class="agenda-item reveal">
              <time datetime="${event.date}">
                <strong>${event.dateLabel}</strong>
                <span>${event.time}</span>
              </time>
              <div>
                <span class="status-badge ${getStatusClass(event.status)}">${event.status}</span>
                <h3>${event.title}</h3>
                <p>${event.place} · ${event.type}</p>
              </div>
            </article>
          `
        )
        .join("");
      initReveal();
    };

    document.querySelectorAll("[data-event-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        document
          .querySelectorAll("[data-event-filter]")
          .forEach((item) => item.classList.remove("is-active"));
        button.classList.add("is-active");
        renderAgenda(button.dataset.eventFilter);
      });
    });

    renderAgenda();
  }
};

const renderMakers = () => {
  const container = document.querySelector("[data-makers-grid]");
  if (!container) return;

  container.innerHTML = makers
    .map(
      (maker) => `
        <article class="maker-card reveal">
          <div class="maker-avatar" aria-hidden="true">${maker.initials}</div>
          <div class="maker-info">
            <span>${maker.area}</span>
            <h3>${maker.name}</h3>
            <p>${maker.bio}</p>
            <div class="badge-list">${maker.badges.map((badge) => `<span>${badge}</span>`).join("")}</div>
            <div class="card-actions">
              ${actionLink("GitHub", maker.links.github)}
              ${actionLink("LinkedIn", maker.links.linkedin)}
            </div>
          </div>
        </article>
      `
    )
    .join("");
};

const renderTools = () => {
  const container = document.querySelector("[data-tools-list]");
  if (!container) return;

  const categories = [...new Set(tools.map((tool) => tool.category))];
  container.innerHTML = categories
    .map(
      (category) => `
        <section class="tool-category reveal">
          <div class="section-row compact-row">
            <div>
              <span class="section-kicker">${category}</span>
              <h2>${category}</h2>
            </div>
          </div>
          <div class="tool-grid">
            ${tools
              .filter((tool) => tool.category === category)
              .map(
                (tool) => `
                  <article class="tool-card">
                    <div>
                      <span class="status-badge ${getStatusClass(tool.availability)}">${tool.availability}</span>
                      <h3>${tool.name}</h3>
                      <p>${tool.recommendedUse}</p>
                    </div>
                    <strong>${tool.quantity}</strong>
                  </article>
                `
              )
              .join("")}
          </div>
        </section>
      `
    )
    .join("");
};

const renderResources = () => {
  const container = document.querySelector("[data-resources-grid]");
  if (!container) return;

  const render = (filter = "todos") => {
    const filtered =
      filter === "todos"
        ? resources
        : resources.filter((resource) => resource.category.toLowerCase() === filter);

    container.innerHTML = filtered
      .map(
        (resource) => `
          <article class="resource-card reveal">
            <span class="resource-type">${resource.type}</span>
            <h3>${resource.title}</h3>
            <p>${resource.summary}</p>
            <div class="tag-list"><span>${resource.category}</span></div>
            ${actionLink("Abrir recurso", resource.url)}
          </article>
        `
      )
      .join("");
    initReveal();
  };

  document.querySelectorAll("[data-resource-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      document
        .querySelectorAll("[data-resource-filter]")
        .forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      render(button.dataset.resourceFilter);
    });
  });

  render();
};

const initNavigation = () => {
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

  const currentPath = window.location.pathname.replace(/\/$/, "") || "/";
  document.querySelectorAll("[data-nav-link]").forEach((link) => {
    const linkPath = new URL(link.href).pathname.replace(/\/$/, "") || "/";
    const isActive =
      linkPath === "/"
        ? currentPath === "/"
        : currentPath === linkPath || currentPath.startsWith(`${linkPath}/`);

    link.classList.toggle("is-active", isActive);
    if (isActive) link.setAttribute("aria-current", "page");
  });
};

const initRegisterForm = () => {
  const form = document.querySelector("[data-register-form]");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = form.querySelector("[data-form-message]");
    form.reset();
    if (message) {
      message.textContent =
        "Registro preparado. Cuando se conecte el backend, estos datos se enviaran automaticamente.";
      message.removeAttribute("hidden");
    }
  });
};

function initReveal() {
  const revealElements = document.querySelectorAll(".reveal:not(.is-visible)");

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
      { threshold: 0.14 }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }
}

renderProjectCollections();
renderProjectDetail();
renderEventCollections();
renderMakers();
renderTools();
renderResources();
initNavigation();
initRegisterForm();
initReveal();
