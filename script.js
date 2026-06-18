import { projects } from "./src/data/projects.js";
import { events as mockEvents } from "./src/data/events.js";
import { makers as mockMakers } from "./src/data/makers.js";
import { resources as mockResources } from "./src/data/resources.js";
import { tools as mockTools } from "./src/data/tools.js";

const today = new Date();
today.setHours(0, 0, 0, 0);

const getProjectBySlug = (slug) => projects.find((project) => project.slug === slug);
const getStatusClass = (status = "") =>
  `status-${String(status)
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

const fallbackEventImage = "/assets/eventos/evento-1.png";

const normalizeText = (value, fallback = "") => String(value || fallback).trim();

const normalizeKey = (value) =>
  normalizeText(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const isFinalizedStatus = (status) => normalizeKey(status) === "finalizado";

const getComparableDate = (dateValue) => {
  const date = new Date(`${dateValue || ""}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
};

const formatDateLabel = (dateValue) => {
  const date = getComparableDate(dateValue);

  if (!date) return "Fecha por confirmar";

  return new Intl.DateTimeFormat("es-GT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

const formatTimeValue = (timeValue) => {
  if (!timeValue) return "";

  const [hours, minutes = "00"] = String(timeValue).split(":");
  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);

  if (Number.isNaN(date.getTime())) return String(timeValue);

  return new Intl.DateTimeFormat("es-GT", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
};

const formatTimeRange = (startTime, endTime) => {
  const start = formatTimeValue(startTime);
  const end = formatTimeValue(endTime);

  if (start && end) return `${start} - ${end}`;
  return start || end || "Hora por confirmar";
};

const normalizeResources = (resourcesValue) => {
  if (!resourcesValue) return [];

  if (typeof resourcesValue === "string") {
    try {
      return normalizeResources(JSON.parse(resourcesValue));
    } catch {
      return [{ label: "Recurso", type: "Link", url: resourcesValue }];
    }
  }

  if (Array.isArray(resourcesValue)) {
    return resourcesValue.map((resource, index) => {
      if (typeof resource === "string") {
        return { label: `Recurso ${index + 1}`, type: "Link", url: resource };
      }

      return {
        label: normalizeText(resource?.label || resource?.title || resource?.name, `Recurso ${index + 1}`),
        type: normalizeText(resource?.type, "Link"),
        url: normalizeText(resource?.url || resource?.href, "#"),
      };
    });
  }

  if (typeof resourcesValue === "object") {
    return Object.entries(resourcesValue).map(([label, url]) => ({
      label,
      type: "Link",
      url: normalizeText(url, "#"),
    }));
  }

  return [];
};

const normalizeTextList = (value) => {
  if (!value) return [];

  if (typeof value === "string") {
    try {
      return normalizeTextList(JSON.parse(value));
    } catch {
      return value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeText(item)).filter(Boolean);
  }

  if (typeof value === "object") {
    return Object.values(value).map((item) => normalizeText(item)).filter(Boolean);
  }

  return [];
};

const mapSupabaseEvent = (event) => ({
  slug: normalizeText(event.id),
  title: normalizeText(event.title, "Evento sin titulo"),
  date: normalizeText(event.event_date),
  dateLabel: formatDateLabel(event.event_date),
  time: formatTimeRange(event.start_time, event.end_time),
  place: normalizeText(event.location, "Lugar por confirmar"),
  type: normalizeText(event.type, "Evento"),
  status: normalizeText(event.status, "Proximo"),
  image: normalizeText(event.image_url, fallbackEventImage),
  summary: normalizeText(event.description, "Descripcion pendiente."),
  resources: normalizeResources(event.resources),
  registration: normalizeText(event.registration_url, ""),
});

const fetchPublishedEventsFromSupabase = async () => {
  const { supabase, isSupabaseConfigured } = await import("./supabaseClient.js");

  if (!isSupabaseConfigured) {
    throw new Error("Supabase no esta configurado.");
  }

  const { data, error } = await supabase
    .from("events")
    .select(
      "id,created_at,title,description,event_date,start_time,end_time,location,type,status,image_url,registration_url,resources,is_published"
    )
    .eq("is_published", true)
    .order("event_date", { ascending: true });

  if (error) throw error;

  return (data || []).map(mapSupabaseEvent);
};

const mapSupabaseResource = (resource) => ({
  title: normalizeText(resource.title, "Recurso sin titulo"),
  category: normalizeText(resource.category, "General"),
  type: normalizeText(resource.type, "Recurso"),
  summary: normalizeText(resource.summary, "Descripcion pendiente."),
  url: normalizeText(resource.url, "#"),
});

const fetchPublishedResourcesFromSupabase = async () => {
  const { supabase, isSupabaseConfigured } = await import("./supabaseClient.js");

  if (!isSupabaseConfigured) {
    throw new Error("Supabase no esta configurado.");
  }

  const { data, error } = await supabase
    .from("resources")
    .select("id,created_at,updated_at,title,category,type,summary,url,sort_order,is_published")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;

  return (data || []).map(mapSupabaseResource);
};

const mapSupabaseTool = (tool) => ({
  name: normalizeText(tool.name, "Herramienta sin nombre"),
  category: normalizeText(tool.category, "General"),
  availability: normalizeText(tool.availability, "Disponible"),
  quantity: Number(tool.quantity || 0),
  recommendedUse: normalizeText(tool.recommended_use, "Uso recomendado pendiente."),
});

const fetchPublishedToolsFromSupabase = async () => {
  const { supabase, isSupabaseConfigured } = await import("./supabaseClient.js");

  if (!isSupabaseConfigured) {
    throw new Error("Supabase no esta configurado.");
  }

  const { data, error } = await supabase
    .from("tools")
    .select("id,created_at,updated_at,name,category,availability,quantity,recommended_use,sort_order,is_published")
    .eq("is_published", true)
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;

  return (data || []).map(mapSupabaseTool);
};

const normalizeBadges = (badgesValue) => {
  if (!badgesValue) return [];

  if (typeof badgesValue === "string") {
    try {
      return normalizeBadges(JSON.parse(badgesValue));
    } catch {
      return badgesValue
        .split("\n")
        .map((badge) => badge.trim())
        .filter(Boolean);
    }
  }

  if (Array.isArray(badgesValue)) {
    return badgesValue.map((badge) => normalizeText(badge)).filter(Boolean);
  }

  if (typeof badgesValue === "object") {
    return Object.values(badgesValue).map((badge) => normalizeText(badge)).filter(Boolean);
  }

  return [];
};

const mapSupabaseMaker = (maker) => ({
  name: normalizeText(maker.name, "Maker sin nombre"),
  initials: normalizeText(maker.initials, "MC"),
  area: normalizeText(maker.area, "Area por definir"),
  bio: normalizeText(maker.bio, "Biografia pendiente."),
  links: {
    github: normalizeText(maker.github_url, ""),
    linkedin: normalizeText(maker.linkedin_url, ""),
  },
  badges: normalizeBadges(maker.badges),
});

const fetchPublishedMakersFromSupabase = async () => {
  const { supabase, isSupabaseConfigured } = await import("./supabaseClient.js");

  if (!isSupabaseConfigured) {
    throw new Error("Supabase no esta configurado.");
  }

  const { data, error } = await supabase
    .from("makers")
    .select("id,created_at,updated_at,name,initials,area,bio,github_url,linkedin_url,badges,sort_order,is_published")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;

  return (data || []).map(mapSupabaseMaker);
};

const mapSupabaseProject = (project) => {
  const slug = normalizeText(project.slug);
  const documentationUrl = normalizeText(project.documentation_url) || `/proyectos/${slug}/`;

  return {
    slug,
    name: normalizeText(project.name, "Proyecto sin nombre"),
    status: normalizeText(project.status, "En desarrollo"),
    updated: normalizeText(project.updated_label, "Actualizacion pendiente"),
    featured: Boolean(project.featured),
    image: normalizeText(project.image_url, "/logo.png"),
    summary: normalizeText(project.summary, "Descripcion pendiente."),
    technologies: normalizeTextList(project.technologies),
    components: normalizeTextList(project.components),
    links: {
      documentation: documentationUrl,
      repository: normalizeText(project.repository_url, "#"),
      designs: normalizeText(project.designs_url, "#"),
    },
    objective: normalizeText(project.objective, "Objetivo pendiente."),
    source: normalizeText(project.source, "Codigo fuente pendiente."),
    buildSteps: normalizeTextList(project.build_steps),
    results: normalizeTextList(project.results),
    improvements: normalizeTextList(project.improvements),
  };
};

const fetchPublishedProjectsFromSupabase = async () => {
  const { supabase, isSupabaseConfigured } = await import("./supabaseClient.js");

  if (!isSupabaseConfigured) {
    throw new Error("Supabase no esta configurado.");
  }

  const { data, error } = await supabase
    .from("projects")
    .select(
      "id,created_at,updated_at,slug,name,status,updated_label,featured,image_url,summary,technologies,components,documentation_url,repository_url,designs_url,objective,source,build_steps,results,improvements,sort_order,is_published"
    )
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;

  return (data || []).map(mapSupabaseProject);
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
  const status = normalizeText(event.status, "Proximo");
  const type = normalizeText(event.type, "Evento");
  const isFinished = isFinalizedStatus(status);
  const hasResources = Boolean(event.resources?.length);
  const hasRegistration = Boolean(event.registration);
  const cardActions = [
    hasRegistration ? actionLink("Registrarme", event.registration) : "",
    hasResources ? actionLink(isFinished ? "Descargar recursos" : "Ver recursos", event.resources[0]?.url) : "",
  ]
    .filter(Boolean)
    .join("");

  return `
    <article class="event-card reveal" data-event-type="${type}">
      <div class="event-media">
        <img src="${event.image || fallbackEventImage}" alt="Flyer de ${event.title}" loading="lazy" />
        <span class="event-type">${type}</span>
      </div>
      <div class="event-content">
        <div class="event-meta">
          <span>${event.dateLabel}</span>
          <span>${event.time}</span>
          <span>${status}</span>
        </div>
        <h3>${event.title}</h3>
        <p>${event.summary}</p>
        <dl class="event-details">
          <div><dt>Lugar</dt><dd>${event.place}</dd></div>
        </dl>
        ${
          hasResources
            ? `<div class="event-resources">
                <strong>Recursos</strong>
                ${event.resources
                  .map(
                    (resource) => {
                      const disabled = !resource.url || resource.url === "#";

                      return `<a href="${resource.url || "#"}"${
                        disabled ? ' aria-disabled="true" class="is-disabled"' : ""
                      }><span>${resource.type}</span>${resource.label}</a>`
                    }
                  )
                  .join("")}
              </div>`
            : ""
        }
        ${cardActions ? `<div class="card-actions">${cardActions}</div>` : ""}
      </div>
    </article>
  `;
};

const projectsMessage = (message, variant = "empty") => `
  <div class="events-message events-message-${variant} reveal">
    <p>${message}</p>
  </div>
`;

const renderProjectCollections = (projectList = projects) => {
  document.querySelectorAll("[data-featured-projects]").forEach((container) => {
    const limit = Number(container.dataset.limit || 0);
    const list = projectList.filter((project) => project.featured);
    const limitedList = limit ? list.slice(0, limit) : list;

    container.innerHTML = limitedList.length
      ? limitedList.map(projectCard).join("")
      : projectsMessage("Pronto publicaremos proyectos destacados.");
  });

  document.querySelectorAll("[data-development-projects]").forEach((container) => {
    const list = projectList.filter((project) => !isFinalizedStatus(project.status));
    container.innerHTML = list.length
      ? list.map(projectCard).join("")
      : projectsMessage("No hay proyectos en desarrollo publicados por ahora.");
  });

  document.querySelectorAll("[data-projects-grid]").forEach((container) => {
    container.innerHTML = projectList.length
      ? projectList.map(projectCard).join("")
      : projectsMessage("No hay proyectos publicados por ahora.");
  });

  initReveal();
};

const initProjectCollections = async () => {
  const hasProjectContainers = document.querySelector(
    "[data-featured-projects], [data-development-projects], [data-projects-grid]"
  );

  if (!hasProjectContainers) return;

  const shouldLoadSupabase = window.location.pathname.replace(/\/$/, "") === "/proyectos";

  if (!shouldLoadSupabase) {
    renderProjectCollections(projects);
    return;
  }

  document
    .querySelectorAll("[data-featured-projects], [data-development-projects], [data-projects-grid]")
    .forEach((container) => {
      container.innerHTML = projectsMessage("Cargando proyectos...", "loading");
    });

  try {
    const supabaseProjects = await fetchPublishedProjectsFromSupabase();

    if (supabaseProjects.length) {
      renderProjectCollections(supabaseProjects);
      return;
    }

    renderProjectCollections(projects);
  } catch (error) {
    console.warn("No se pudieron cargar proyectos desde Supabase:", error);
    renderProjectCollections(projects);
  }
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

const getUpcomingEvents = (eventList) =>
  eventList
    .filter((event) => {
      const eventDate = getComparableDate(event.date);
      return eventDate && eventDate >= today && !isFinalizedStatus(event.status);
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

const getPastEvents = (eventList) =>
  eventList
    .filter((event) => {
      const eventDate = getComparableDate(event.date);
      return (eventDate && eventDate < today) || isFinalizedStatus(event.status);
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

const eventsMessage = (message, variant = "info") => `
  <div class="events-message events-message-${variant} reveal">
    <p>${message}</p>
  </div>
`;

const setEventContainersLoading = () => {
  document
    .querySelectorAll("[data-upcoming-events], [data-past-events], [data-event-agenda]")
    .forEach((container) => {
      container.innerHTML = eventsMessage("Cargando eventos...", "loading");
    });
};

const setEventsFeedback = (message, variant = "info") => {
  const agenda = document.querySelector("[data-event-agenda]");
  const upcomingEvents = document.querySelector("[data-upcoming-events]");
  if (!agenda || !upcomingEvents) return;

  const currentFeedback = document.querySelector("[data-events-feedback]");

  if (!message) {
    currentFeedback?.remove();
    return;
  }

  const feedback = currentFeedback || document.createElement("div");
  feedback.dataset.eventsFeedback = "";
  feedback.className = `events-feedback events-feedback-${variant} reveal is-visible`;
  feedback.textContent = message;

  if (!currentFeedback) {
    upcomingEvents.before(feedback);
  }
};

const renderEventCollections = (eventList = mockEvents) => {
  document.querySelectorAll("[data-upcoming-events]").forEach((container) => {
    const limit = Number(container.dataset.limit || 0);
    const list = getUpcomingEvents(eventList);
    const limitedList = limit ? list.slice(0, limit) : list;

    container.innerHTML = limitedList.length
      ? limitedList.map(eventCard).join("")
      : eventsMessage("Proximamente anunciaremos nuevos eventos.", "empty");
  });

  document.querySelectorAll("[data-past-events]").forEach((container) => {
    const list = getPastEvents(eventList);

    container.innerHTML = list.length
      ? list.map(eventCard).join("")
      : eventsMessage("Aun no hay eventos realizados para mostrar.", "empty");
  });

  const agenda = document.querySelector("[data-event-agenda]");
  if (agenda) {
    const renderAgenda = (filter = "todos") => {
      const filtered = eventList
        .filter((event) => filter === "todos" || normalizeText(event.type).toLowerCase() === filter)
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      agenda.innerHTML = filtered.length
        ? filtered
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
            .join("")
        : eventsMessage("No hay eventos en esta categoria por ahora.", "empty");
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

const initEventCollections = async () => {
  const hasEventContainers = document.querySelector(
    "[data-upcoming-events], [data-past-events], [data-event-agenda]"
  );

  if (!hasEventContainers) return;

  const shouldLoadSupabase = Boolean(document.querySelector("[data-event-agenda]"));

  if (!shouldLoadSupabase) {
    renderEventCollections(mockEvents);
    return;
  }

  setEventsFeedback("Cargando eventos...", "loading");
  setEventContainersLoading();

  try {
    const supabaseEvents = await fetchPublishedEventsFromSupabase();

    if (supabaseEvents.length) {
      setEventsFeedback("");
      renderEventCollections(supabaseEvents);
      return;
    }

    setEventsFeedback(
      "Proximamente anunciaremos nuevos eventos publicados. Mientras tanto, mostramos eventos de ejemplo.",
      "empty"
    );
    renderEventCollections(mockEvents);
  } catch (error) {
    console.warn("No se pudieron cargar eventos desde Supabase:", error);
    setEventsFeedback("No pudimos conectar con Supabase. Mostrando eventos de ejemplo por ahora.", "error");
    renderEventCollections(mockEvents);
  }
};

const makersMessage = (message, variant = "empty") => `
  <div class="events-message events-message-${variant} reveal">
    <p>${message}</p>
  </div>
`;

const renderMakers = (makerList = mockMakers) => {
  const container = document.querySelector("[data-makers-grid]");
  if (!container) return;

  if (!makerList.length) {
    container.innerHTML = makersMessage("No hay makers publicados por ahora.");
    initReveal();
    return;
  }

  container.innerHTML = makerList
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
  initReveal();
};

const initMakers = async () => {
  const container = document.querySelector("[data-makers-grid]");
  if (!container) return;

  container.innerHTML = makersMessage("Cargando makers...", "loading");

  try {
    const supabaseMakers = await fetchPublishedMakersFromSupabase();

    if (supabaseMakers.length) {
      renderMakers(supabaseMakers);
      return;
    }

    renderMakers(mockMakers);
  } catch (error) {
    console.warn("No se pudieron cargar makers desde Supabase:", error);
    renderMakers(mockMakers);
  }
};

const toolsMessage = (message, variant = "empty") => `
  <div class="events-message events-message-${variant} reveal">
    <p>${message}</p>
  </div>
`;

const renderTools = (toolList = mockTools) => {
  const container = document.querySelector("[data-tools-list]");
  if (!container) return;

  if (!toolList.length) {
    container.innerHTML = toolsMessage("No hay herramientas disponibles por ahora.");
    initReveal();
    return;
  }

  const categories = [...new Set(toolList.map((tool) => tool.category))];
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
            ${toolList
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
  initReveal();
};

const initTools = async () => {
  const container = document.querySelector("[data-tools-list]");
  if (!container) return;

  container.innerHTML = toolsMessage("Cargando herramientas...", "loading");

  try {
    const supabaseTools = await fetchPublishedToolsFromSupabase();

    if (supabaseTools.length) {
      renderTools(supabaseTools);
      return;
    }

    renderTools(mockTools);
  } catch (error) {
    console.warn("No se pudieron cargar herramientas desde Supabase:", error);
    renderTools(mockTools);
  }
};

const resourceMessage = (message, variant = "empty") => `
  <div class="events-message events-message-${variant} reveal">
    <p>${message}</p>
  </div>
`;

const renderResources = (resourceList = mockResources) => {
  const container = document.querySelector("[data-resources-grid]");
  if (!container) return;

  const render = (filter = "todos") => {
    const filtered =
      filter === "todos"
        ? resourceList
        : resourceList.filter((resource) => normalizeKey(resource.category) === normalizeKey(filter));

    container.innerHTML = filtered.length
      ? filtered
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
          .join("")
      : resourceMessage("No hay recursos disponibles en esta categoria por ahora.");
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

const initResources = async () => {
  const container = document.querySelector("[data-resources-grid]");
  if (!container) return;

  container.innerHTML = resourceMessage("Cargando recursos...", "loading");

  try {
    const supabaseResources = await fetchPublishedResourcesFromSupabase();

    if (supabaseResources.length) {
      renderResources(supabaseResources);
      return;
    }

    renderResources(mockResources);
  } catch (error) {
    console.warn("No se pudieron cargar recursos desde Supabase:", error);
    renderResources(mockResources);
  }
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

initProjectCollections();
renderProjectDetail();
initEventCollections();
initMakers();
initTools();
initResources();
initNavigation();
initRegisterForm();
initReveal();
