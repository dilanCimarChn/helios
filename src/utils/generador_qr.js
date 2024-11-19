import React, { useState, useEffect, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const RealTimeQR = () => {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [error, setError] = useState(null);
  const qrRef = useRef();

  useEffect(() => {
    if ('geolocation' in navigator) {
      const geoWatchId = navigator.geolocation.watchPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude.toFixed(8), // Mayor precisión
            lng: position.coords.longitude.toFixed(8),
          });
          setError(null); // Limpiar errores si la ubicación es válida
        },
        (err) => {
          console.error("Error obteniendo ubicación: ", err);
          setError(
            err.code === 1
              ? "Permiso denegado para acceder a la ubicación."
              : err.code === 2
              ? "No se pudo determinar la ubicación."
              : "La solicitud de ubicación expiró."
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 15000, // Esperar hasta 15 segundos para mayor precisión
          maximumAge: 0
        }
      );

      // Limpiar al desmontar el componente
      return () => navigator.geolocation.clearWatch(geoWatchId);
    } else {
      setError("La geolocalización no está disponible en este navegador.");
    }
  }, []);

  const locationUrl = location.lat && location.lng
    ? `https://maps.google.com/?q=${location.lat},${location.lng}`
    : "";

  const downloadQRCode = () => {
    const canvas = qrRef.current.querySelector("canvas");
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `QR_Location_${location.lat}_${location.lng}.png`;
    link.click();
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Generador de QR con Latitud y Longitud en Tiempo Real</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {location.lat && location.lng ? (
        <>
          <p><strong>Latitud:</strong> {location.lat}</p>
          <p><strong>Longitud:</strong> {location.lng}</p>
          <div ref={qrRef}>
            <QRCodeCanvas value={locationUrl} size={256} />
          </div>
          <button onClick={downloadQRCode} style={{ marginTop: '20px', padding: '10px 20px' }}>
            Descargar QR como PNG
          </button>
        </>
      ) : (
        <p>Obteniendo ubicación...</p>
      )}
    </div>
  );
};

export default RealTimeQR;
