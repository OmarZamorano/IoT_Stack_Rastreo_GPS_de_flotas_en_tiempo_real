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

## Mosquitto

## Telegraf

## InfluxDB

## Grafana

## Video final del IoT Stack funcionando correctamente
