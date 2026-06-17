export const projects = [
  {
    slug: "sistema-parqueo-inteligente",
    name: "Sistema de parqueo inteligente",
    status: "En desarrollo",
    updated: "Actualizado hace 3 dias",
    featured: true,
    image: "/assets/proyectos/proyecto-parqueo.png",
    summary:
      "Prototipo academico para simular espacios disponibles, entrada y salida de vehiculos con sensores y senalizacion.",
    technologies: ["Arduino", "Sensores IR", "Servo", "LCD"],
    components: [
      "Arduino UNO",
      "2 sensores infrarrojos",
      "Servomotor SG90",
      "Pantalla LCD 16x2",
      "Jumpers y protoboard",
    ],
    links: {
      documentation: "/proyectos/sistema-parqueo-inteligente/",
      repository: "#",
      designs: "#",
    },
    objective:
      "Documentar un sistema basico de control de parqueo para que otros estudiantes puedan replicar la logica de deteccion, conteo y apertura de barrera.",
    source: "Repositorio pendiente de publicar por el equipo responsable.",
    buildSteps: [
      "Definir la cantidad de espacios simulados y ubicar los sensores en entrada y salida.",
      "Conectar sensores, pantalla LCD y servomotor al Arduino usando una protoboard.",
      "Cargar el codigo de prueba y validar lecturas individuales de cada sensor.",
      "Integrar la logica de conteo y mostrar disponibilidad en la pantalla.",
      "Registrar fotos, diagrama de conexiones y observaciones de calibracion.",
    ],
    results: [
      "Conteo funcional de entradas y salidas en pruebas de mesa.",
      "Indicador visual de disponibilidad listo para mejorar con carcasa o maqueta.",
    ],
    improvements: [
      "Agregar registro historico de ocupacion.",
      "Crear una maqueta impresa en 3D para pruebas publicas.",
      "Migrar el monitoreo a ESP32 para consultar datos desde una web.",
    ],
  },
  {
    slug: "semaforo-inteligente",
    name: "Semaforo inteligente",
    status: "En documentacion",
    updated: "Actualizado hace 1 semana",
    featured: true,
    image: "/assets/proyectos/proyecto-semaforo.png",
    summary:
      "Prototipo de control de trafico con secuencias programadas, sensores y espacio para probar reglas de prioridad.",
    technologies: ["Electronica", "Arduino", "Logica de control"],
    components: [
      "Arduino UNO",
      "LEDs rojo, amarillo y verde",
      "Resistencias 220 ohm",
      "Pulsador peatonal",
      "Protoboard",
    ],
    links: {
      documentation: "/proyectos/semaforo-inteligente/",
      repository: "#",
      designs: "#",
    },
    objective:
      "Construir una base reproducible para practicar temporizadores, entradas digitales y documentacion tecnica de circuitos sencillos.",
    source: "Codigo de ejemplo preparado para publicarse en GitHub.",
    buildSteps: [
      "Armar el circuito de LEDs usando resistencias de proteccion.",
      "Programar una secuencia inicial de semaforo vehicular.",
      "Agregar un pulsador para simular solicitud peatonal.",
      "Probar tiempos y documentar cambios en una tabla de comportamiento.",
      "Preparar fotografias del montaje y diagrama de pines.",
    ],
    results: [
      "Secuencia estable con cambio de estados controlado por software.",
      "Base lista para agregar sensores de presencia o comunicacion entre cruces.",
    ],
    improvements: [
      "Incluir sensores para ajustar tiempos por demanda.",
      "Crear una placa PCB educativa.",
      "Conectar dos semaforos para simular una interseccion.",
    ],
  },
  {
    slug: "estacion-sismica",
    name: "Estacion sismica",
    status: "Buscando colaboradores",
    updated: "Actualizado hace 2 semanas",
    featured: true,
    image: "/assets/proyectos/proyecto-estacion-sismica.png",
    summary:
      "Proyecto de lectura de vibraciones con sensores para visualizar senales y discutir posibles aplicaciones educativas.",
    technologies: ["Sensores", "Datos", "Python", "Arduino"],
    components: [
      "Sensor de vibracion",
      "Arduino o ESP32",
      "Modulo microSD opcional",
      "Cable USB",
      "Base de montaje",
    ],
    links: {
      documentation: "/proyectos/estacion-sismica/",
      repository: "#",
      designs: "#",
    },
    objective:
      "Crear una guia de experimentacion con sensores de vibracion para que estudiantes puedan capturar, graficar y analizar senales basicas.",
    source: "Scripts de lectura y graficacion pendientes de organizacion.",
    buildSteps: [
      "Seleccionar el sensor disponible y revisar su rango de lectura.",
      "Montar el sensor sobre una base estable para reducir ruido mecanico.",
      "Leer datos por puerto serial y guardar muestras de prueba.",
      "Graficar lecturas en tiempo real o por lotes.",
      "Documentar limitaciones y criterios de seguridad del prototipo.",
    ],
    results: [
      "Primeras lecturas de vibracion registradas en laboratorio.",
      "Se identifico la necesidad de calibracion y filtrado de ruido.",
    ],
    improvements: [
      "Comparar varios sensores de vibracion.",
      "Agregar almacenamiento local y visualizacion web.",
      "Validar el prototipo con apoyo docente.",
    ],
  },
  {
    slug: "carrito-espia",
    name: "Carrito espia",
    status: "Finalizado",
    updated: "Actualizado hace 1 mes",
    featured: false,
    image: "/assets/proyectos/proyecto-carrito-espia.png",
    summary:
      "Vehiculo pequeno para pruebas de movilidad, control remoto y exploracion basica con componentes electronicos.",
    technologies: ["Robotica", "IoT", "Electronica"],
    components: [
      "Chasis 2WD",
      "Motores DC",
      "Driver L298N",
      "ESP32 o Arduino con modulo Bluetooth",
      "Bateria recargable",
    ],
    links: {
      documentation: "/proyectos/carrito-espia/",
      repository: "#",
      designs: "#",
    },
    objective:
      "Registrar el proceso de armado de un robot movil sencillo y dejar una base para practicas de control y teleoperacion.",
    source: "Repositorio pendiente de limpieza antes de publicarse.",
    buildSteps: [
      "Ensamblar chasis, motores y ruedas.",
      "Conectar el driver de motores al microcontrolador.",
      "Validar movimiento adelante, atras y giro.",
      "Integrar control remoto por Bluetooth o WiFi.",
      "Documentar consumo de energia y autonomia aproximada.",
    ],
    results: [
      "Movimiento basico validado en pruebas de interior.",
      "Estructura preparada para agregar camara o sensores de distancia.",
    ],
    improvements: [
      "Agregar control desde una interfaz web.",
      "Montar sensor ultrasonico para evitar obstaculos.",
      "Mejorar gestion de bateria y seguridad electrica.",
    ],
  },
];
