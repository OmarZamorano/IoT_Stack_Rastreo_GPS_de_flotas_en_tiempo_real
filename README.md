### Autor: Omar Zamorano Garcia
### No.Control: 22211676

# IoT Stack Rastreo GPS de flotas en tiempo real

Este proyecto tiene como objetivo desarrollar un sistema de rastreo GPS de flotas de transporte terrestre en tiempo real, utilizando una arquitectura basada en sensores simulados, comunicación mediante MQTT y visualización de datos en Grafana.

El sistema emula el comportamiento de trailers de carga equipados con módulos GPS, donde cada dispositivo simulado transmite sus coordenadas geográficas y altitud hacia una infraestructura desplegada en la nube.

---

## Arquitectura del sistema

### ***1. Dispositivos Raspberry Pi simulados desde ARM:***
Cada emulador representa un tráiler de carga y ejecuta un script en JavaScript con Node.js que simula un sensor GPS.
Estos dispositivos generan datos de posición (latitud, longitud y altitud) y los publican en un broker MQTT bajo tópicos específicos.

### ***2. Broker MQTT con Mosquitto:***
Mosquitto se ejecuta en una instancia EC2 de AWS con Ubuntu.
Su función es recibir los mensajes publicados por los dispositivos y distribuirlos a los servicios suscritos, garantizando una comunicación eficiente entre los emisores y el sistema de almacenamiento.

### ***3. Almacenamiento de datos con InfluxDB:***
Dentro de la misma instancia EC2 se usará el servicio InfluxDB, una base de datos de series temporales donde almacenará los datos recibidos.

### ***4. Visualización de datos (Grafana):***
A partir de los datos almacenados en InfluxDB, Grafana genera un dashboard que muestra la información de cada tráiler en tiempo real.
Cada gráfico está asociado a un vehículo e incluye las variables latitud, longitud y altitud.

### ***5. Procesamiento de datos con Telegraf:***
Como Grafana no puede acceder directamente a los datos almacenados en InfluxDB, se usará el agente Telegraf, que actúa como agente de recolección, donde este se suscribe a los tópicos MQTT de Mosquitto y estrae las métricas en tiempo real para pasarlas a los buckets correspondientes en InfluxDB.

---

## Tecnologías usadas

| **Componente**               | **Tecnología**               | **Descripción**                                      |
|------------------------------|------------------------------|------------------------------------------------------|
| Simulación de dispositivos   | Node.js en emuladores Raspberry Pi ARM | Generación y envío de datos GPS simulados |
| Comunicación                 | MQTT (Mosquitto)             | Protocolo de mensajería ligero                       |
| Procesamiento                | Telegraf                     | Recolección y envío de métricas                      |
| Almacenamiento               | InfluxDB                     | Base de datos de series temporales                   |
| Visualización                | Grafana                      | Dashboard en tiempo real                             |
| Infraestructura              | AWS EC2 (Ubuntu)             | Entorno de ejecución en la nube                      |

---

## Raspberry Pi

### Instalación de Nodejs, npm y libreria mqtt

https://asciinema.org/a/749877

### Código que simula el GPS del Trailer 1

```
//usamos la libreria mqtt
const mqtt = require("mqtt");

//ip del broker (Mosquitto)
const broker = "mqtt://98.88.33.8:1883";

//topic a publicar
const topic = "iot/gps/trailer1";

//creamos el cliente
const client = mqtt.connect(broker, {
    clientId: "Raspberry_Trailer1",
});

//conectarse al broker
client.on("connect", () => {
    console.log("Conectado a mosquitto");

    //ciclo cada 3 segundos 
    setInterval(() => {
        const latitud = Math.round((32.52 + (Math.random() - 0.5) * 0.1) * 100) / 100;
        const longitud = Math.round((-117.03 + (Math.random() - 0.5) * 0.1) * 100) / 100;
        const altitud = Math.round((20 + Math.random() * 10) * 100) / 100;  

        const payload = JSON.stringify({
            id: "Raspberry_Trailer1",
            latitud: latitud,
            longitud: longitud,
            altitud: altitud
        });

        client.publish(topic, payload);
        console.log("Datos enviados", payload);
    }, 3000);
});

//por si hay un error
client.on("error", (err) => {
    console.log("Error de conexion", err.message);
});
```

### Código que simula el GPS del Trailer 2

```
//usamos la libreria mqtt
const mqtt = require("mqtt");

//ip del broker (Mosquitto)
const broker = "mqtt://98.88.33.8:1883";

//topic a publicar
const topic = "iot/gps/trailer2";

//creamos el cliente
const client = mqtt.connect(broker, {
    clientId: "Raspberry_Trailer2",
});

//conectarse al broker
client.on("connect", () => {
    console.log("Conectado a mosquitto");

    //ciclo cada 3 segundos 
    setInterval(() => {
        const latitud = Math.round((19.43 + (Math.random() - 0.5) * 0.1) * 100) / 100;
        const longitud = Math.round((-99.13 + (Math.random() - 0.5) * 0.1) * 100) / 100;
        const altitud = Math.round((2240 + Math.random() * 10) * 100) / 100; 

        const payload = JSON.stringify({
            id: "Raspberry_Trailer2",
            latitud: latitud,
            longitud: longitud,
            altitud: altitud
        });

        client.publish(topic, payload);
        console.log("Datos enviados", payload);
    }, 3000);
});

//por si hay un error
client.on("error", (err) => {
    console.log("Error de conexion", err.message);
});
```

## Codigo de configuración de Telegraf

```
#Proyecto de los GPS Trailer 1
[[inputs.mqtt_consumer]]
  ## Dirección de tu broker MQTT
  servers = ["tcp://172.31.22.14:1883"]
  topics = ["iot/gps/trailer1"]
  qos = 0
  client_id = "telegraf_mqtt_trailer1"
  data_format = "json"
  json_string_fields = ["id"]
  tag_keys = ["id"]
  name_override = "gps_trailer1"

[[outputs.influxdb_v2]]
  urls = ["http://172.31.22.14:8086"]
  token = "R4qQGjqFYpQwLDVTJzkWcvabcCetCRQWElO1t74tGFpbLxJDi3_BXlf2GX3xDbnK_MqOe_UjQwe-L3pppqL_jw=="
  organization = "iot-lab"
  bucket = "trailer1"

#Proyecto de los GPS Trailer 2
[[inputs.mqtt_consumer]]
  ## Dirección de tu broker MQTT
  servers = ["tcp://172.31.22.14:1883"]
  topics = ["iot/gps/trailer2"]
  qos = 0
  client_id = "telegraf_mqtt_trailer2"
  data_format = "json"
  json_string_fields = ["id"]
  tag_keys = ["id"]
  name_override = "gps_trailer2"

[[outputs.influxdb_v2]]
  urls = ["http://172.31.22.14:8086"]
  token = "R4qQGjqFYpQwLDVTJzkWcvabcCetCRQWElO1t74tGFpbLxJDi3_BXlf2GX3xDbnK_MqOe_UjQwe-L3pppqL_jw=="
  organization = "iot-lab"
  bucket = "trailer2"
```

## Video final del IoT Stack funcionando correctamente

https://www.loom.com/share/69c4d38268e3410886763f5c65a7459f?sid=c21538f8-1cfe-410f-9e71-94774972f56e
