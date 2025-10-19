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
