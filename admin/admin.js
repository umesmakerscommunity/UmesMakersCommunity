import { supabase } from "../supabaseClient.js";

const page = document.body.dataset.adminPage;
const loginUrl = "/admin/login.html";
const dashboardUrl = "/admin/dashboard.html";

let currentEditingId = null;
let currentEvents = [];

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const setMessage = (message, type = "info", scope = document) => {
  const element = scope.querySelector("[data-admin-message]");
  if (!element) return;

  const isFull = element.classList.contains("admin-full");
  element.textContent = message;
  element.className = `admin-message admin-message-${type}${isFull ? " admin-full" : ""}`;
  element.hidden = !message;
};

const setLoading = (isLoading) => {
  const loading = document.querySelector("[data-events-loading]");
  if (loading) loading.hidden = !isLoading;
};

const getCurrentSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
};

const requireSession = async () => {
  const session = await getCurrentSession();

  if (!session) {
    window.location.href = loginUrl;
    return null;
  }

  document.querySelectorAll("[data-admin-user]").forEach((element) => {
    element.textContent = session.user?.email ? `Sesion iniciada como ${session.user.email}` : "";
  });

  return session;
};

const initLogin = async () => {
  const session = await getCurrentSession();
  if (session) {
    window.location.href = dashboardUrl;
    return;
  }

  const form = document.querySelector("[data-login-form]");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setMessage("");

    const submitButton = form.querySelector("button[type='submit']");
    const formData = new FormData(form);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "");

    submitButton.disabled = true;
    submitButton.textContent = "Entrando...";

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    submitButton.disabled = false;
    submitButton.textContent = "Entrar al panel";

    if (error) {
      setMessage("No se pudo iniciar sesion. Revisa el correo y la contraseña.", "error");
      return;
    }

    window.location.href = dashboardUrl;
  });
};

const initLogout = () => {
  document.querySelectorAll("[data-logout]").forEach((button) => {
    button.addEventListener("click", async () => {
      button.disabled = true;
      await supabase.auth.signOut();
      window.location.href = loginUrl;
    });
  });
};

const parseResources = (value) => {
  const text = String(value || "").trim();
  if (!text) return null;

  if (text.startsWith("{") || text.startsWith("[") || text.startsWith('"')) {
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }

  return text;
};

const formatResourcesForInput = (resources) => {
  if (!resources) return "";
  if (typeof resources === "string") return resources;
  return JSON.stringify(resources, null, 2);
};

const getEventPayload = (form) => {
  const formData = new FormData(form);

  return {
    title: String(formData.get("title") || "").trim(),
    description: String(formData.get("description") || "").trim() || null,
    event_date: String(formData.get("event_date") || "").trim() || null,
    start_time: String(formData.get("start_time") || "").trim() || null,
    end_time: String(formData.get("end_time") || "").trim() || null,
    location: String(formData.get("location") || "").trim() || null,
    type: String(formData.get("type") || "").trim() || null,
    status: String(formData.get("status") || "").trim() || null,
    image_url: String(formData.get("image_url") || "").trim() || null,
    registration_url: String(formData.get("registration_url") || "").trim() || null,
    resources: parseResources(formData.get("resources")),
    is_published: formData.get("is_published") === "on",
  };
};

const resetEventForm = () => {
  const form = document.querySelector("[data-event-form]");
  if (!form) return;

  currentEditingId = null;
  form.reset();
  form.elements.id.value = "";
  document.querySelector("[data-event-form-title]").textContent = "Nuevo evento";
  document.querySelector("[data-event-cancel]").hidden = true;
};

const fillEventForm = (eventData) => {
  const form = document.querySelector("[data-event-form]");
  if (!form) return;

  currentEditingId = eventData.id;
  form.elements.id.value = eventData.id || "";
  form.elements.title.value = eventData.title || "";
  form.elements.description.value = eventData.description || "";
  form.elements.event_date.value = eventData.event_date || "";
  form.elements.start_time.value = eventData.start_time || "";
  form.elements.end_time.value = eventData.end_time || "";
  form.elements.location.value = eventData.location || "";
  form.elements.type.value = eventData.type || "";
  form.elements.status.value = eventData.status || "";
  form.elements.image_url.value = eventData.image_url || "";
  form.elements.registration_url.value = eventData.registration_url || "";
  form.elements.resources.value = formatResourcesForInput(eventData.resources);
  form.elements.is_published.checked = Boolean(eventData.is_published);

  document.querySelector("[data-event-form-title]").textContent = "Editar evento";
  document.querySelector("[data-event-cancel]").hidden = false;
  form.scrollIntoView({ behavior: "smooth", block: "start" });
};

const renderEventsList = () => {
  const list = document.querySelector("[data-events-list]");
  if (!list) return;

  if (!currentEvents.length) {
    list.innerHTML = '<div class="admin-empty">Aun no hay eventos registrados.</div>';
    return;
  }

  list.innerHTML = currentEvents
    .map((eventData) => {
      const time = [eventData.start_time, eventData.end_time].filter(Boolean).join(" - ") || "Sin hora";
      const publishedLabel = eventData.is_published ? "Publicado" : "Oculto";
      const toggleLabel = eventData.is_published ? "Ocultar" : "Publicar";

      return `
        <article class="admin-event-item">
          <div>
            <span class="status-badge">${escapeHtml(publishedLabel)}</span>
            <h3>${escapeHtml(eventData.title || "Evento sin titulo")}</h3>
            <p>${escapeHtml(eventData.event_date || "Sin fecha")} · ${escapeHtml(time)}</p>
            <p>${escapeHtml(eventData.status || "Sin estado")}</p>
          </div>
          <div class="admin-event-actions">
            <button type="button" data-edit-event="${escapeHtml(eventData.id)}">Editar</button>
            <button type="button" data-toggle-event="${escapeHtml(eventData.id)}">${toggleLabel}</button>
            <button class="danger" type="button" data-delete-event="${escapeHtml(eventData.id)}">Eliminar</button>
          </div>
        </article>
      `;
    })
    .join("");
};

const loadEvents = async () => {
  setLoading(true);

  const { data, error } = await supabase
    .from("events")
    .select(
      "id,created_at,title,description,event_date,start_time,end_time,location,type,status,image_url,registration_url,resources,is_published"
    )
    .order("event_date", { ascending: true });

  setLoading(false);

  if (error) {
    setMessage("No se pudieron cargar los eventos. Revisa las politicas RLS en Supabase.", "error");
    currentEvents = [];
    renderEventsList();
    return;
  }

  currentEvents = data || [];
  renderEventsList();
};

const initEventForm = () => {
  const form = document.querySelector("[data-event-form]");
  if (!form) return;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setMessage("");

    const payload = getEventPayload(form);
    const submitButton = form.querySelector("button[type='submit']");

    if (!payload.title) {
      setMessage("El titulo del evento es obligatorio.", "error");
      return;
    }

    submitButton.disabled = true;
    submitButton.textContent = "Guardando...";

    const request = currentEditingId
      ? supabase.from("events").update(payload).eq("id", currentEditingId)
      : supabase.from("events").insert(payload);

    const { error } = await request;

    submitButton.disabled = false;
    submitButton.textContent = "Guardar evento";

    if (error) {
      setMessage("No se pudo guardar el evento. Verifica permisos RLS y los datos ingresados.", "error");
      return;
    }

    setMessage(currentEditingId ? "Evento actualizado correctamente." : "Evento creado correctamente.", "success");
    resetEventForm();
    await loadEvents();
  });

  document.querySelector("[data-event-cancel]").addEventListener("click", () => {
    resetEventForm();
    setMessage("");
  });

  document.querySelector("[data-refresh-events]").addEventListener("click", loadEvents);
};

const initEventsActions = () => {
  const list = document.querySelector("[data-events-list]");
  if (!list) return;

  list.addEventListener("click", async (event) => {
    const editButton = event.target.closest("[data-edit-event]");
    const toggleButton = event.target.closest("[data-toggle-event]");
    const deleteButton = event.target.closest("[data-delete-event]");

    if (editButton) {
      const eventData = currentEvents.find((item) => item.id === editButton.dataset.editEvent);
      if (eventData) fillEventForm(eventData);
      return;
    }

    if (toggleButton) {
      const eventData = currentEvents.find((item) => item.id === toggleButton.dataset.toggleEvent);
      if (!eventData) return;

      toggleButton.disabled = true;
      const { error } = await supabase
        .from("events")
        .update({ is_published: !eventData.is_published })
        .eq("id", eventData.id);
      toggleButton.disabled = false;

      if (error) {
        setMessage("No se pudo cambiar el estado de publicacion.", "error");
        return;
      }

      setMessage(eventData.is_published ? "Evento ocultado correctamente." : "Evento publicado correctamente.", "success");
      await loadEvents();
      return;
    }

    if (deleteButton) {
      const eventData = currentEvents.find((item) => item.id === deleteButton.dataset.deleteEvent);
      if (!eventData) return;

      const confirmed = window.confirm(
        `Esta accion eliminara el evento "${eventData.title || "sin titulo"}". ¿Deseas continuar?`
      );
      if (!confirmed) return;

      deleteButton.disabled = true;
      const { error } = await supabase.from("events").delete().eq("id", eventData.id);
      deleteButton.disabled = false;

      if (error) {
        setMessage("No se pudo eliminar el evento. Revisa permisos RLS.", "error");
        return;
      }

      setMessage("Evento eliminado correctamente.", "success");
      resetEventForm();
      await loadEvents();
    }
  });
};

const initEventsPage = async () => {
  const session = await requireSession();
  if (!session) return;

  initLogout();
  initEventForm();
  initEventsActions();
  await loadEvents();
};

if (page === "login") {
  initLogin();
} else if (page === "dashboard") {
  const session = await requireSession();
  if (session) initLogout();
} else if (page === "events") {
  await initEventsPage();
}
