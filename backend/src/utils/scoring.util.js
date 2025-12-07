/**
 * Calcula el score automático de una solicitud
 * @param {Object} solicitud - Objeto de solicitud con datos_negocio y datos_solicitud
 * @returns {number} Score de 0 a 100
 */
export const calcularScore = (solicitud) => {
  let score = 0;
  
  const { datos_negocio, datos_solicitud } = solicitud;
  
  if (!datos_negocio || !datos_solicitud) {
    return 0;
  }
  
  const { ingresoMensual } = datos_negocio;
  const { monto, plazoMeses } = datos_solicitud;
  
  // 1. Capacidad de pago (40 puntos)
  const cuotaMensualEstimada = monto / plazoMeses;
  const ratioCapacidad = cuotaMensualEstimada / ingresoMensual;
  
  if (ratioCapacidad <= 0.3) {
    score += 40; // Excelente capacidad
  } else if (ratioCapacidad <= 0.4) {
    score += 30; // Buena capacidad
  } else if (ratioCapacidad <= 0.5) {
    score += 20; // Capacidad aceptable
  } else if (ratioCapacidad <= 0.6) {
    score += 10; // Capacidad limitada
  }
  // Si es mayor a 0.6, no suma puntos
  
  // 2. Monto solicitado vs ingresos (30 puntos)
  const ratioMonto = monto / (ingresoMensual * 12);
  
  if (ratioMonto <= 0.5) {
    score += 30; // Monto muy conservador
  } else if (ratioMonto <= 1) {
    score += 25; // Monto conservador
  } else if (ratioMonto <= 1.5) {
    score += 20; // Monto moderado
  } else if (ratioMonto <= 2) {
    score += 10; // Monto alto
  }
  
  // 3. Plazo solicitado (20 puntos)
  if (plazoMeses >= 6 && plazoMeses <= 12) {
    score += 20; // Plazo óptimo
  } else if (plazoMeses >= 3 && plazoMeses <= 18) {
    score += 15; // Plazo bueno
  } else if (plazoMeses >= 1 && plazoMeses <= 24) {
    score += 10; // Plazo aceptable
  }
  
  // 4. Tipo de negocio (10 puntos) - Bonus por sectores prioritarios
  const tiposPreferentes = ['agricultura', 'ganadería', 'artesanía', 'comercio'];
  if (tiposPreferentes.some(tipo => 
    datos_negocio.tipo?.toLowerCase().includes(tipo)
  )) {
    score += 10;
  } else {
    score += 5;
  }
  
  return Math.min(Math.round(score), 100);
};

/**
 * Determina si una solicitud debe ser aprobada automáticamente
 * @param {number} score - Score de la solicitud
 * @returns {boolean} True si debe aprobarse automáticamente
 */
export const debeAprobarAutomaticamente = (score) => {
  return score >= 80;
};

/**
 * Obtiene la recomendación basada en el score
 * @param {number} score - Score de la solicitud
 * @returns {string} Recomendación
 */
export const obtenerRecomendacion = (score) => {
  if (score >= 80) {
    return 'Aprobación recomendada - Excelente perfil';
  } else if (score >= 60) {
    return 'Evaluación manual recomendada - Buen perfil';
  } else if (score >= 40) {
    return 'Evaluación detallada requerida - Perfil moderado';
  } else {
    return 'Rechazo recomendado - Perfil de alto riesgo';
  }
};

export default { calcularScore, debeAprobarAutomaticamente, obtenerRecomendacion };
