/**
 * Calcula las cuotas de un préstamo usando el sistema francés (cuota fija)
 * @param {number} monto - Monto del préstamo
 * @param {number} plazoMeses - Plazo en meses
 * @param {number} tasaAnual - Tasa de interés anual en porcentaje
 * @param {Date} fechaInicio - Fecha de inicio del préstamo
 * @returns {Array} Array de cuotas con capital, interés, total y saldo
 */
export const calcularCuotas = (monto, plazoMeses, tasaAnual, fechaInicio = new Date()) => {
  const tasaMensual = tasaAnual / 12 / 100;
  
  // Fórmula del sistema francés: C = P * [i * (1 + i)^n] / [(1 + i)^n - 1]
  const cuotaFija = (monto * (tasaMensual * Math.pow(1 + tasaMensual, plazoMeses))) / 
                    (Math.pow(1 + tasaMensual, plazoMeses) - 1);
  
  const cuotas = [];
  let saldoPendiente = monto;
  
  for (let i = 0; i < plazoMeses; i++) {
    const interes = saldoPendiente * tasaMensual;
    const capital = cuotaFija - interes;
    saldoPendiente -= capital;
    
    // Calcular fecha de vencimiento
    const fechaVencimiento = new Date(fechaInicio);
    fechaVencimiento.setMonth(fechaVencimiento.getMonth() + i + 1);
    
    cuotas.push({
      numero: i + 1,
      fecha_vencimiento: fechaVencimiento.toISOString().split('T')[0],
      capital: Math.round(capital * 100) / 100,
      interes: Math.round(interes * 100) / 100,
      total: Math.round(cuotaFija * 100) / 100,
      saldo: Math.round(Math.max(0, saldoPendiente) * 100) / 100,
      pagado: false
    });
  }
  
  return cuotas;
};

/**
 * Calcula el total a pagar (capital + intereses)
 * @param {number} monto - Monto del préstamo
 * @param {number} plazoMeses - Plazo en meses
 * @param {number} tasaAnual - Tasa de interés anual
 * @returns {number} Total a pagar
 */
export const calcularTotalAPagar = (monto, plazoMeses, tasaAnual) => {
  const cuotas = calcularCuotas(monto, plazoMeses, tasaAnual);
  return cuotas.reduce((total, cuota) => total + cuota.total, 0);
};

export default { calcularCuotas, calcularTotalAPagar };
