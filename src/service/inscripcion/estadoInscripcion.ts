
function calcularEstadoInscripcion(fechaInicioIns: Date, fechaFinIns: Date): string{
    const ahora = new Date();
    if (ahora < fechaInicioIns) return 'Proximamente';
    if (ahora <= fechaFinIns) return 'Abierta';
    return 'Cerrada';
}

export {calcularEstadoInscripcion}