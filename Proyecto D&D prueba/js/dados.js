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
  
  // Referencias al cuadro de resultado final
  const resultadoFinalBox = document.getElementById('resultado-final-box');
  const resultadoFinalValor = document.getElementById('resultado-final-valor');
  const resultadoFinalTipo = document.getElementById('resultado-final-tipo');
  
  // Historial de tiradas
  let historial = JSON.parse(localStorage.getItem('diceHistory')) || [];
  
  // Mostrar historial si existe
  if (historial.length > 0) {
    historialContainer.classList.remove('d-none');
    renderHistorial();
  }
  
  // Evento para lanzar dados
  lanzarBtn.addEventListener('click', () => {
    // Obtener valores actuales
    const caras = parseInt(dadoSelect.value);
    const cantidad = parseInt(numDados.value);
    const mod = parseInt(modificador.value);
    
    // Validar entradas
    if (cantidad < 1 || cantidad > 20) {
      alert('El número de dados debe estar entre 1 y 20.');
      return;
    }
    
    // Mostrar el contenedor de resultados
    resultadoContainer.classList.remove('d-none');
    
    // Limpiar resultados anteriores
    resultadoDado.textContent = '';
    detallesTirada.textContent = '';
    resultadoFinalValor.textContent = '-';
    resultadoFinalTipo.textContent = '-';
    resultadoFinalBox.classList.remove('show-result');
    
    // Mostrar animación de lanzamiento
    mostrarAnimacionLanzamiento(caras, cantidad, mod);
    
    // Hacer scroll al resultado
    setTimeout(() => {
      resultadoContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
    
    // Generar y mostrar el resultado después de la animación
    setTimeout(() => {
      const resultado = generarResultadoDados(caras, cantidad, mod);
      mostrarResultado(resultado, caras, cantidad, mod);
    }, 1500); // Tiempo suficiente para que se vea la animación
  });
  
  // Eventos para modificador
  decreaseModBtn.addEventListener('click', () => {
    modificador.value = parseInt(modificador.value) - 1;
    actualizarVistaPreviaDados();
  });
  
  increaseModBtn.addEventListener('click', () => {
    modificador.value = parseInt(modificador.value) + 1;
    actualizarVistaPreviaDados();
  });
  
  // Evento para limpiar historial
  clearHistoryBtn.addEventListener('click', () => {
    historial = [];
    localStorage.setItem('diceHistory', JSON.stringify(historial));
    historialTiradas.innerHTML = '';
    historialContainer.classList.add('d-none');
  });
  
  // Función para mostrar la animación de lanzamiento
  function mostrarAnimacionLanzamiento(caras, cantidad, mod) {
    animacionDados.innerHTML = '';
    
    // Seleccionar icono según el tipo de dado
    const iconosDados = {
      '4': 'bi-diamond-fill',
      '6': 'bi-dice-6-fill',
      '8': 'bi-octagon-fill',
      '10': 'bi-pentagon-fill',
      '12': 'bi-dodecagon-fill',
      '20': 'bi-circle-fill',
      '100': 'bi-record-circle-fill'
    };
    
    const iconClass = iconosDados[caras] || 'bi-dice-6-fill';
    
    // Crear animación para cada dado (máximo 5 visibles)
    const dadosVisibles = Math.min(cantidad, 5);
    
    for (let i = 0; i < dadosVisibles; i++) {
      const dadoElement = document.createElement('div');
      dadoElement.className = 'dice-rolling';
      dadoElement.innerHTML = `<i class="bi ${iconClass} animate-roll" style="color: var(--primary);"></i>`;
      animacionDados.appendChild(dadoElement);
    }
    
    // Si hay más dados de los que mostramos, indicarlo
    if (cantidad > 5) {
      const masElement = document.createElement('div');
      masElement.className = 'dice-more';
      masElement.textContent = `+${cantidad - 5} más`;
      animacionDados.appendChild(masElement);
    }
    
    // Mostrar texto de "lanzando dados..."
    resultadoDado.innerHTML = '<div class="rolling-text">Lanzando dados<span class="dot-1">.</span><span class="dot-2">.</span><span class="dot-3">.</span></div>';
    
    // Mostrar animación en el cuadro de resultado final
    resultadoFinalValor.innerHTML = '<div class="rolling-text">...</div>';
    resultadoFinalTipo.textContent = `${cantidad}D${caras}${mod !== 0 ? (mod > 0 ? '+' + mod : mod) : ''}`;
    
    // Actualizar iconos de dados en el cuadro de resultado
    const diceIcons = resultadoFinalBox.querySelectorAll('.dice-icon-mini');
    diceIcons.forEach(icon => {
      icon.className = `bi ${iconClass} dice-icon-mini animate-roll`;
    });
  }
  
  // Función para generar el resultado de los dados
  function generarResultadoDados(caras, cantidad, mod) {
    // Realizar tiradas individuales
    const tiradas = [];
    let total = 0;
    
    for (let i = 0; i < cantidad; i++) {
      const resultado = Math.floor(Math.random() * caras) + 1;
      tiradas.push(resultado);
      total += resultado;
    }
    
    // Aplicar modificador
    const totalFinal = total + mod;
    
    return {
      tiradas: tiradas,
      total: total,
      totalFinal: totalFinal
    };
  }
  
  // Función para mostrar el resultado
  function mostrarResultado(resultado, caras, cantidad, mod) {
    // Mostrar el resultado total en el cuadro de detalles
    resultadoDado.textContent = resultado.totalFinal;
    
    // Mostrar el resultado en el cuadro de resultado final
    resultadoFinalValor.textContent = resultado.totalFinal;
    resultadoFinalTipo.textContent = `${cantidad}D${caras}${mod !== 0 ? (mod > 0 ? '+' + mod : mod) : ''}`;
    resultadoFinalBox.classList.add('show-result');
    
    // Mostrar detalles de la tirada
    let detalles = '';
    if (cantidad > 1 || mod !== 0) {
      detalles = `[${resultado.tiradas.join(' + ')}]`;
      if (mod !== 0) {
        detalles += ` ${mod >= 0 ? '+' : ''} ${mod}`;
      }
      detalles += ` = ${resultado.totalFinal}`;
    }
    detallesTirada.textContent = detalles;
    
    // Mostrar los dados con sus valores
    animacionDados.innerHTML = '';
    
    // Seleccionar icono según el tipo de dado
    const iconosDados = {
      '4': 'bi-diamond-fill',
      '6': 'bi-dice-6-fill',
      '8': 'bi-octagon-fill',
      '10': 'bi-pentagon-fill',
      '12': 'bi-dodecagon-fill',
      '20': 'bi-circle-fill',
      '100': 'bi-record-circle-fill'
    };
    
    const iconClass = iconosDados[caras] || 'bi-dice-6-fill';
    
    // Crear visualización para cada dado (máximo 5 visibles)
    const dadosVisibles = Math.min(cantidad, 5);
    
    for (let i = 0; i < dadosVisibles; i++) {
      const dadoElement = document.createElement('div');
      dadoElement.className = 'dice-icon';
      
      // Añadir el valor del dado
      dadoElement.innerHTML = `
        <i class="bi ${iconClass}" style="color: var(--primary);"></i>
        <span class="dice-value">${resultado.tiradas[i]}</span>
      `;
      
      animacionDados.appendChild(dadoElement);
    }
    
    // Si hay más dados de los que mostramos, indicarlo
    if (cantidad > 5) {
      const masElement = document.createElement('div');
      masElement.className = 'dice-more';
      masElement.textContent = `+${cantidad - 5} más`;
      animacionDados.appendChild(masElement);
    }
    
    // Mostrar notificación con el resultado
    mostrarNotificacion(`¡${cantidad}D${caras}${mod !== 0 ? (mod > 0 ? '+' + mod : mod) : ''}! Resultado: ${resultado.totalFinal}`);
    
    // Guardar en historial
    const tirada = {
      id: Date.now(),
      fecha: new Date().toLocaleString(),
      tipo: `${cantidad}d${caras}${mod !== 0 ? (mod > 0 ? '+' + mod : mod) : ''}`,
      resultado: resultado.totalFinal,
      detalles: resultado.tiradas,
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
    updateUserStats(tirada);
  }
  
  // Función para mostrar una notificación temporal
  function mostrarNotificacion(mensaje) {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = 'dice-notification';
    notificacion.textContent = mensaje;
    
    // Añadir al body
    document.body.appendChild(notificacion);
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
      notificacion.classList.add('fade-out');
      setTimeout(() => {
        document.body.removeChild(notificacion);
      }, 500);
    }, 3000);
  }
  
  // Función para renderizar el historial
  function renderHistorial() {
    historialTiradas.innerHTML = '';
    
    historial.forEach(tirada => {
      const item = document.createElement('li');
      item.className = 'list-group-item d-flex justify-content-between align-items-center';
      
      const detalleHTML = tirada.detalles.length > 1 
        ? `[${tirada.detalles.join(' + ')}]${tirada.modificador !== 0 ? ` ${tirada.modificador > 0 ? '+' : ''} ${tirada.modificador}` : ''} = ${tirada.resultado}`
        : '';
        
      item.innerHTML = `
        <div>
          <span class="badge rounded-pill" style="background-color: var(--primary);">${tirada.tipo}</span>
          <span class="ms-2 fw-bold">${tirada.resultado}</span>
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
  function updateUserStats(tirada) {
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
    
    users[userIndex].activities.unshift({
      type: 'dice_roll',
      date: new Date().toISOString(),
      details: {
        diceType: tirada.tipo,
        result: tirada.resultado
      }
    });
    
    // Limitar actividades a 10
    if (users[userIndex].activities.length > 10) {
      users[userIndex].activities = users[userIndex].activities.slice(0, 10);
    }
    
    // Guardar cambios
    localStorage.setItem('users', JSON.stringify(users));
  }
  
  // Función para actualizar la vista previa de los dados
  function actualizarVistaPreviaDados() {
    const numDadosValue = document.getElementById('num-dados').value;
    const tipoDadoValue = document.getElementById('dado-select').value;
    const modValue = document.getElementById('modificador').value;
    const modStr = modValue > 0 ? '+' + modValue : (modValue < 0 ? modValue : '');
    
    const dicePreview = document.getElementById('dice-preview');
    if (dicePreview) {
      dicePreview.textContent = `${numDadosValue}D${tipoDadoValue}${modStr}`;
    }
  }
  
  // Inicializar la vista previa de los dados
  actualizarVistaPreviaDados();
  
  // Añadir eventos para actualizar la vista previa
  numDados.addEventListener('change', actualizarVistaPreviaDados);
  numDados.addEventListener('input', actualizarVistaPreviaDados);
  dadoSelect.addEventListener('change', actualizarVistaPreviaDados);
  modificador.addEventListener('change', actualizarVistaPreviaDados);
  modificador.addEventListener('input', actualizarVistaPreviaDados);
  
  // Agregar estilos CSS para animación y visualización de dados
  const style = document.createElement('style');
  style.textContent = `
    .animate-roll {
      animation: roll 1.5s ease-in-out;
    }
    
    @keyframes roll {
      0% { transform: rotate(0deg) scale(1); }
      20% { transform: rotate(90deg) scale(1.2); }
      40% { transform: rotate(180deg) scale(1); }
      60% { transform: rotate(270deg) scale(1.2); }
      80% { transform: rotate(360deg) scale(1); }
      100% { transform: rotate(720deg) scale(1); }
    }
    
    #animacion-dados {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 15px;
      margin-bottom: 20px;
      min-height: 80px;
    }
    
    .dice-rolling {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
    }
    
    .dice-icon {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      animation: appear 0.5s ease-in-out;
    }
    
    @keyframes appear {
      0% { opacity: 0; transform: scale(0.5); }
      100% { opacity: 1; transform: scale(1); }
    }
    
    .dice-value {
      position: absolute;
      font-size: 1rem;
      font-weight: bold;
      color: white;
    }
    
    .dice-more {
      align-self: center;
      font-size: 1rem;
      color: var(--primary);
      font-weight: bold;
    }
    
    .dice-notification {
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: var(--primary);
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      z-index: 1050;
      font-weight: bold;
      transition: opacity 0.5s ease;
    }
    
    .fade-out {
      opacity: 0;
    }
    
    #resultado-dado {
      font-size: 2rem;
      color: var(--primary);
      font-weight: bold;
    }
    
    .rolling-text {
      font-size: 1.5rem;
      color: var(--primary);
    }
    
    .dot-1, .dot-2, .dot-3 {
      animation: dot-appear 1.5s infinite;
      display: inline-block;
    }
    
    .dot-2 {
      animation-delay: 0.2s;
    }
    
    .dot-3 {
      animation-delay: 0.4s;
    }
    
    @keyframes dot-appear {
      0% { opacity: 0; }
      50% { opacity: 1; }
      100% { opacity: 0; }
    }
  `;
  document.head.appendChild(style);
});