console.log("Goku : Hola Golem");
console.log("How are you doing today?");

window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  
  // 1. Guardamos el tiempo exacto en que la página terminó de cargar
  const tiempoCarga = performance.now(); 
  const tiempoMinimo = 2000; // 2000 milisegundos = 2 segundos

  // 2. Calculamos cuánto tiempo falta para llegar a los 2 segundos
  const tiempoRestante = Math.max(0, tiempoMinimo - tiempoCarga);

  // 3. Esperamos ese tiempo restante antes de ocultar el loader
  setTimeout(() => {
    loader.style.opacity = '0';
    
    // Lo elimina del diseño después de que termine la animación CSS
    setTimeout(() => {
      loader.style.display = 'none';
    }, 500); 
  }, tiempoRestante);
});
