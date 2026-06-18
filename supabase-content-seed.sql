-- Seed inicial basado en los mocks actuales.
-- Ejecutar manualmente despues de supabase-content-schema.sql.
-- Evita duplicar registros usando slug, name o title como referencia.

insert into public.projects (
  slug,
  name,
  status,
  updated_label,
  featured,
  image_url,
  summary,
  technologies,
  components,
  documentation_url,
  repository_url,
  designs_url,
  objective,
  source,
  build_steps,
  results,
  improvements,
  sort_order,
  is_published
) values
(
  'sistema-parqueo-inteligente',
  'Sistema de parqueo inteligente',
  'En desarrollo',
  'Actualizado hace 3 dias',
  true,
  '/assets/proyectos/proyecto-parqueo.png',
  'Prototipo academico para simular espacios disponibles, entrada y salida de vehiculos con sensores y senalizacion.',
  '["Arduino","Sensores IR","Servo","LCD"]'::jsonb,
  '["Arduino UNO","2 sensores infrarrojos","Servomotor SG90","Pantalla LCD 16x2","Jumpers y protoboard"]'::jsonb,
  '/proyectos/sistema-parqueo-inteligente/',
  '#',
  '#',
  'Documentar un sistema basico de control de parqueo para que otros estudiantes puedan replicar la logica de deteccion, conteo y apertura de barrera.',
  'Repositorio pendiente de publicar por el equipo responsable.',
  '["Definir la cantidad de espacios simulados y ubicar los sensores en entrada y salida.","Conectar sensores, pantalla LCD y servomotor al Arduino usando una protoboard.","Cargar el codigo de prueba y validar lecturas individuales de cada sensor.","Integrar la logica de conteo y mostrar disponibilidad en la pantalla.","Registrar fotos, diagrama de conexiones y observaciones de calibracion."]'::jsonb,
  '["Conteo funcional de entradas y salidas en pruebas de mesa.","Indicador visual de disponibilidad listo para mejorar con carcasa o maqueta."]'::jsonb,
  '["Agregar registro historico de ocupacion.","Crear una maqueta impresa en 3D para pruebas publicas.","Migrar el monitoreo a ESP32 para consultar datos desde una web."]'::jsonb,
  10,
  true
),
(
  'semaforo-inteligente',
  'Semaforo inteligente',
  'En documentacion',
  'Actualizado hace 1 semana',
  true,
  '/assets/proyectos/proyecto-semaforo.png',
  'Prototipo de control de trafico con secuencias programadas, sensores y espacio para probar reglas de prioridad.',
  '["Electronica","Arduino","Logica de control"]'::jsonb,
  '["Arduino UNO","LEDs rojo, amarillo y verde","Resistencias 220 ohm","Pulsador peatonal","Protoboard"]'::jsonb,
  '/proyectos/semaforo-inteligente/',
  '#',
  '#',
  'Construir una base reproducible para practicar temporizadores, entradas digitales y documentacion tecnica de circuitos sencillos.',
  'Codigo de ejemplo preparado para publicarse en GitHub.',
  '["Armar el circuito de LEDs usando resistencias de proteccion.","Programar una secuencia inicial de semaforo vehicular.","Agregar un pulsador para simular solicitud peatonal.","Probar tiempos y documentar cambios en una tabla de comportamiento.","Preparar fotografias del montaje y diagrama de pines."]'::jsonb,
  '["Secuencia estable con cambio de estados controlado por software.","Base lista para agregar sensores de presencia o comunicacion entre cruces."]'::jsonb,
  '["Incluir sensores para ajustar tiempos por demanda.","Crear una placa PCB educativa.","Conectar dos semaforos para simular una interseccion."]'::jsonb,
  20,
  true
),
(
  'estacion-sismica',
  'Estacion sismica',
  'Buscando colaboradores',
  'Actualizado hace 2 semanas',
  true,
  '/assets/proyectos/proyecto-estacion-sismica.png',
  'Proyecto de lectura de vibraciones con sensores para visualizar senales y discutir posibles aplicaciones educativas.',
  '["Sensores","Datos","Python","Arduino"]'::jsonb,
  '["Sensor de vibracion","Arduino o ESP32","Modulo microSD opcional","Cable USB","Base de montaje"]'::jsonb,
  '/proyectos/estacion-sismica/',
  '#',
  '#',
  'Crear una guia de experimentacion con sensores de vibracion para que estudiantes puedan capturar, graficar y analizar senales basicas.',
  'Scripts de lectura y graficacion pendientes de organizacion.',
  '["Seleccionar el sensor disponible y revisar su rango de lectura.","Montar el sensor sobre una base estable para reducir ruido mecanico.","Leer datos por puerto serial y guardar muestras de prueba.","Graficar lecturas en tiempo real o por lotes.","Documentar limitaciones y criterios de seguridad del prototipo."]'::jsonb,
  '["Primeras lecturas de vibracion registradas en laboratorio.","Se identifico la necesidad de calibracion y filtrado de ruido."]'::jsonb,
  '["Comparar varios sensores de vibracion.","Agregar almacenamiento local y visualizacion web.","Validar el prototipo con apoyo docente."]'::jsonb,
  30,
  true
),
(
  'carrito-espia',
  'Carrito espia',
  'Finalizado',
  'Actualizado hace 1 mes',
  false,
  '/assets/proyectos/proyecto-carrito-espia.png',
  'Vehiculo pequeno para pruebas de movilidad, control remoto y exploracion basica con componentes electronicos.',
  '["Robotica","IoT","Electronica"]'::jsonb,
  '["Chasis 2WD","Motores DC","Driver L298N","ESP32 o Arduino con modulo Bluetooth","Bateria recargable"]'::jsonb,
  '/proyectos/carrito-espia/',
  '#',
  '#',
  'Registrar el proceso de armado de un robot movil sencillo y dejar una base para practicas de control y teleoperacion.',
  'Repositorio pendiente de limpieza antes de publicarse.',
  '["Ensamblar chasis, motores y ruedas.","Conectar el driver de motores al microcontrolador.","Validar movimiento adelante, atras y giro.","Integrar control remoto por Bluetooth o WiFi.","Documentar consumo de energia y autonomia aproximada."]'::jsonb,
  '["Movimiento basico validado en pruebas de interior.","Estructura preparada para agregar camara o sensores de distancia."]'::jsonb,
  '["Agregar control desde una interfaz web.","Montar sensor ultrasonico para evitar obstaculos.","Mejorar gestion de bateria y seguridad electrica."]'::jsonb,
  40,
  true
)
on conflict (slug) do update set
  name = excluded.name,
  status = excluded.status,
  updated_label = excluded.updated_label,
  featured = excluded.featured,
  image_url = excluded.image_url,
  summary = excluded.summary,
  technologies = excluded.technologies,
  components = excluded.components,
  documentation_url = excluded.documentation_url,
  repository_url = excluded.repository_url,
  designs_url = excluded.designs_url,
  objective = excluded.objective,
  source = excluded.source,
  build_steps = excluded.build_steps,
  results = excluded.results,
  improvements = excluded.improvements,
  sort_order = excluded.sort_order,
  is_published = excluded.is_published,
  updated_at = now();

insert into public.makers (
  name,
  initials,
  area,
  bio,
  github_url,
  linkedin_url,
  badges,
  sort_order,
  is_published
) select
  seed.name,
  seed.initials,
  seed.area,
  seed.bio,
  seed.github_url,
  seed.linkedin_url,
  seed.badges,
  seed.sort_order,
  seed.is_published
from (
  values
    ('Andrea M.', 'AM', 'Programacion e IoT', 'Apoya pruebas de sensores, dashboards y documentacion de prototipos.', '#', '#', '["2 proyectos colaborados","1 taller apoyado","Documentacion"]'::jsonb, 10, true),
    ('Carlos R.', 'CR', 'Electronica', 'Interesado en circuitos, medicion y armado de prototipos educativos.', '#', null, '["Mentoria tecnica","Prototipado","Exposiciones"]'::jsonb, 20, true),
    ('Mariana S.', 'MS', 'Diseno 3D y robotica', 'Colabora en modelos, piezas de soporte y pruebas de movimiento.', null, '#', '["Diseno 3D","Robotica","Talleres apoyados"]'::jsonb, 30, true),
    ('Luis P.', 'LP', 'Arduino y automatizacion', 'Participa en integracion de sensores, actuadores y bitacoras de avance.', '#', null, '["Arduino","Proyecto colaborativo","Demo tecnica"]'::jsonb, 40, true)
) as seed(name, initials, area, bio, github_url, linkedin_url, badges, sort_order, is_published)
where not exists (
  select 1 from public.makers existing where existing.name = seed.name
);

insert into public.tools (
  name,
  category,
  availability,
  quantity,
  recommended_use,
  sort_order,
  is_published
) select
  seed.name,
  seed.category,
  seed.availability,
  seed.quantity,
  seed.recommended_use,
  seed.sort_order,
  seed.is_published
from (
  values
    ('Arduino UNO', 'Microcontroladores', 'Disponible', 4, 'Practicas introductorias, sensores y automatizacion sencilla.', 10, true),
    ('ESP32', 'Microcontroladores', 'En uso', 2, 'Proyectos IoT, WiFi, Bluetooth y lectura de datos.', 20, true),
    ('Kit de sensores basicos', 'Sensores', 'Disponible', 3, 'Pruebas de temperatura, luz, distancia y movimiento.', 30, true),
    ('Multimetro digital', 'Medicion', 'Disponible', 2, 'Verificacion de voltaje, continuidad y consumo aproximado.', 40, true),
    ('Protoboards y jumpers', 'Electronica', 'Disponible', 8, 'Armado rapido de circuitos sin soldadura.', 50, true),
    ('Cautin y estaño', 'Herramientas generales', 'No disponible', 1, 'Soldadura de componentes bajo supervision.', 60, true),
    ('Filamento PLA', 'Prototipado', 'En uso', 2, 'Piezas de prueba, soportes y carcasas sencillas.', 70, true)
) as seed(name, category, availability, quantity, recommended_use, sort_order, is_published)
where not exists (
  select 1 from public.tools existing where existing.name = seed.name
);

insert into public.resources (
  title,
  category,
  type,
  summary,
  url,
  sort_order,
  is_published
) select
  seed.title,
  seed.category,
  seed.type,
  seed.summary,
  seed.url,
  seed.sort_order,
  seed.is_published
from (
  values
    ('Guia inicial de Arduino', 'Arduino', 'PDF', 'Conceptos base, pines, primer circuito y recomendaciones de seguridad.', '#', 10, true),
    ('Plantilla de bitacora de proyecto', 'Programacion', 'Descargable', 'Formato editable para registrar objetivo, materiales, avances y resultados.', '#', 20, true),
    ('ESP32: conexion WiFi basica', 'ESP32', 'Codigo', 'Ejemplo preparado para conectar el microcontrolador a una red local.', '#', 30, true),
    ('Electronica basica para makers', 'Electronica basica', 'Presentacion', 'Resistencias, LEDs, protoboard, medicion y errores comunes.', '#', 40, true),
    ('Robotica movil: estructura 2WD', 'Robotica', 'Tutorial', 'Notas para armar chasis, driver de motores y pruebas iniciales.', '#', 50, true),
    ('Video: sensores para IoT', 'IoT', 'YouTube', 'Tarjeta preparada para insertar un video tutorial oficial de la comunidad.', 'https://www.youtube.com/', 60, true)
) as seed(title, category, type, summary, url, sort_order, is_published)
where not exists (
  select 1 from public.resources existing where existing.title = seed.title
);
