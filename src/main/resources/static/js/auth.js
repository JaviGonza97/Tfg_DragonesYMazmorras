document.addEventListener('DOMContentLoaded', () => {
  // Referencias a elementos del DOM
  const dadoSelect = document.getElementById('dado-select');
  const numDados = document.getElementById('num-dados');
  const modificador = document.getElementById('modificador');
  const lanzarBtn = document.getElementById('lanzar-btn');
  const resultadoContainer = document.getElementById('resultado-container');
  const resultadoDado = document.getElementById('resultado-dado');
  const detallesTirada = document.getElementById('detalles-tirada');
  const animacionDados = document.getElementById('animacion-dados');
  const historialContainer = document.getElementById('historial-container');
  const historialTiradas = document.getElementById('historial-tiradas');
  const clearHistoryBtn = document.getElementById('clear-history');
  const decreaseModBtn = document.getElementById('decrease-mod');
  const increaseModBtn = document.getElementById('increase-mod');
  
  // Historial de tiradas
  let historial = JSON.parse(localStorage.getItem('diceHistory')) || [];
  
  // Mostrar historial si existe
  if (historial.length > 0) {
    historialContainer.classList.remove('d-none');
    renderHistorial();
  }
  
  // Evento para lanzar dados
  lanzarBtn.addEventListener('click', () => {
    // Animación de lanzamiento
    resultadoContainer.classList.remove('d-none');
    animacionDados.innerHTML = '<i class="bi bi-dice-6-fill display-1 animate-roll" style="color: var(--primary);"></i>';
    resultadoDado.textContent = '...';
    detallesTirada.textContent = '';
    
    // Simular tiempo de lanzamiento
    setTimeout(() => {
      lanzarDado();
    }, 800);
  });
  
  // Eventos para modificador
  decreaseModBtn.addEventListener('click', () => {
    modificador.value = parseInt(modificador.value) - 1;
  });
  
  increaseModBtn.addEventListener('click', () => {
    modificador.value = parseInt(modificador.value) + 1;
  });
  
  // Evento para limpiar historial
  clearHistoryBtn.addEventListener('click', () => {
    historial = [];
    localStorage.setItem('diceHistory', JSON.stringify(historial));
    historialTiradas.innerHTML = '';
    historialContainer.classList.add('d-none');
  });
  
  // Función para lanzar dados
  function lanzarDado() {
    const caras = parseInt(dadoSelect.value);
    const cantidad = parseInt(numDados.value);
    const mod = parseInt(modificador.value);
    
    // Validar entradas
    if (cantidad < 1 || cantidad > 10) {
      alert('El número de dados debe estar entre 1 y 10.');
      return;
    }
    
    // Realizar tiradas
    const tiradas = [];
    let total = 0;
    
    for (let i = 0; i < cantidad; i++) {
      const resultado = Math.floor(Math.random() * caras) + 1;
      tiradas.push(resultado);
      total += resultado;
    }
    
    // Aplicar modificador
    const totalFinal = total + mod;
    
    // Mostrar resultado
    resultadoDado.textContent = totalFinal;
    
    // Mostrar detalles de la tirada
    let detalles = '';
    if (cantidad > 1 || mod !== 0) {
      detalles = `[${tiradas.join(' + ')}]`;
      if (mod !== 0) {
        detalles += ` ${mod >= 0 ? '+' : ''} ${mod}`;
      }
    }
    detallesTirada.textContent = detalles;
    
    // Cambiar icono según el tipo de dado
    const iconosDados = {
      '4': 'bi-diamond-fill',
      '6': 'bi-dice-6-fill',
      '8': 'bi-octagon-fill',
      '10': 'bi-pentagon-fill',
      '12': 'bi-dodecagon-fill',
      '20': 'bi-circle-fill',
      '100': 'bi-record-circle-fill'
    };
    
    animacionDados.innerHTML = `<i class="bi ${iconosDados[caras] || 'bi-dice-6-fill'} display-1" style="color: var(--primary);"></i>`;
    
    // Guardar en historial
    const tirada = {
      id: Date.now(),
      fecha: new Date().toLocaleString(),
      tipo: `${cantidad}d${caras}${mod !== 0 ? (mod > 0 ? '+' + mod : mod) : ''}`,
      resultado: totalFinal,
      detalles: tiradas,
      modificador: mod
    };
    
    historial.unshift(tirada);
    
    // Limitar historial a 10 entradas
    if (historial.length > 10) {
      historial = historial.slice(0, 10);
    }
    
    // Guardar historial en localStorage
    localStorage.setItem('diceHistory', JSON.stringify(historial));
    
    // Actualizar historial en la UI
    historialContainer.classList.remove('d-none');
    renderHistorial();
    
    // Actualizar estadísticas del usuario si está autenticado
    updateUserStats();
  }
  
  // Función para renderizar el historial
  function renderHistorial() {
    historialTiradas.innerHTML = '';
    
    historial.forEach(tirada => {
      const item = document.createElement('li');
      item.className = 'list-group-item d-flex justify-content-between align-items-center';
      
      const detalleHTML = tirada.detalles.length > 1 
        ? `[${tirada.detalles.join(' + ')}]${tirada.modificador !== 0 ? ` ${tirada.modificador > 0 ? '+' : ''} ${tirada.modificador}` : ''}`
        : '';
        
      item.innerHTML = `
        <div>
          <span class="badge rounded-pill" style="background-color: var(--primary);">${tirada.tipo}</span>
          <span class="ms-2">${tirada.resultado}</span>
          ${detalleHTML ? `<small class="text-muted ms-2">${detalleHTML}</small>` : ''}
        </div>
        <small class="text-muted">${formatTimeAgo(tirada.fecha)}</small>
      `;
      
      historialTiradas.appendChild(item);
    });
  }
  
  // Función para formatear tiempo relativo
  function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    
    if (diffSec < 60) {
      return 'hace unos segundos';
    } else if (diffMin < 60) {
      return `hace ${diffMin} ${diffMin === 1 ? 'minuto' : 'minutos'}`;
    } else if (diffHour < 24) {
      return `hace ${diffHour} ${diffHour === 1 ? 'hora' : 'horas'}`;
    } else {
      return date.toLocaleDateString();
    }
  }
  
  // Función para actualizar estadísticas del usuario
  function updateUserStats() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex === -1) return;
    
    // Incrementar contador de tiradas
    if (!users[userIndex].stats) {
      users[userIndex].stats = { rollCount: 0 };
    }
    
    users[userIndex].stats.rollCount = (users[userIndex].stats.rollCount || 0) + 1;
    
    // Guardar actividad reciente
    if (!users[userIndex].activities) {
      users[userIndex].activities = [];
    }
    
    const caras = parseInt(dadoSelect.value);
    const cantidad = parseInt(numDados.value);
    const mod = parseInt(modificador.value);
    
    users[userIndex].activities.unshift({
      type: 'dice_roll',
      date: new Date().toISOString(),
      details: {
        diceType: `${cantidad}d${caras}${mod !== 0 ? (mod > 0 ? '+' + mod : mod) : ''}`,
        result: parseInt(resultadoDado.textContent)
      }
    });
    
    // Limitar actividades a 10
    if (users[userIndex].activities.length > 10) {
      users[userIndex].activities = users[userIndex].activities.slice(0, 10);
    }
    
    // Guardar cambios
    localStorage.setItem('users', JSON.stringify(users));
  }
  
  // Agregar estilos CSS para animación
  const style = document.createElement('style');
  style.textContent = `
    .animate-roll {
      animation: roll 0.8s ease-in-out;
    }
    
    @keyframes roll {
      0% { transform: rotate(0deg) scale(1); }
      25% { transform: rotate(90deg) scale(1.2); }
      50% { transform: rotate(180deg) scale(1); }
      75% { transform: rotate(270deg) scale(1.2); }
      100% { transform: rotate(360deg) scale(1); }
    }
  `;
  document.head.appendChild(style);
});