let myChart;

async function convertir() {
    const monto = document.getElementById('monto').value;
    const moneda = document.getElementById('moneda').value;

    if (isNaN(monto) || monto <= 0) {
        document.getElementById('resultado').innerText = 'Por favor, ingrese un monto válido.';
        return;
    }

    try {
        const response = await fetch('https://mindicador.cl/api/' + moneda);
        const data = await response.json();

        if (data.serie && data.serie.length > 0) {
            const tipoCambio = data.serie[0].valor;
            const conversion = monto / tipoCambio;
            document.getElementById('resultado').innerText = `El monto en ${moneda.toUpperCase()} es: ${conversion.toFixed(2)}`;
            mostrarHistorial(data.serie);
        } else {
            document.getElementById('resultado').innerText = 'No se encontraron datos de cambio para la moneda seleccionada.';
        }
    } catch (error) {
        document.getElementById('resultado').innerText = 'Error al obtener los datos.';
    }
}

function mostrarHistorial(serie) {
    const ctx = document.getElementById('historial').getContext('2d');
    const labels = serie.slice(0, 10).map(item => new Date(item.fecha).toLocaleDateString());
    const data = serie.slice(0, 10).map(item => item.valor);

    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Historial de los últimos 10 días',
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        }
    });
}