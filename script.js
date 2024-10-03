const ctx = document.getElementById('pieChart').getContext('2d');

// Dados do gráfico
const originalData = {
    labels: ['Facebook', 'Instagram', 'WhatsApp', 'TikTok', 'Twitter'],
    percentages: [30, 25, 20, 15, 10], // porcentagens iniciais
    colors: ['#3b5998', '#E1306C', '#25D366', '#69C9D0', '#1DA1F2']
};

// Tornando os Dados visiveis
let visibleData = {
    labels: [...originalData.labels],
    datasets: [{
        data: [...originalData.percentages],
        backgroundColor: [...originalData.colors],
    }]
};

// Função para recalcular a porcentagem
function recalculatePercentages() {
    const totalVisible = visibleData.datasets[0].data.reduce((a, b) => a + b, 0);
    visibleData.datasets[0].data = visibleData.datasets[0].data.map(value => {
        return (value / totalVisible) * 100; // Calcula a porcentagem relativa
    });
}

// Criando grafico
let pieChart = new Chart(ctx, {
    type: 'pie',
    data: visibleData,
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            datalabels: {
                color: '#fff', // Cor do texto
                formatter: (value, context) => {
                    // nome da rede + porcentagem
                    const label = context.chart.data.labels[context.dataIndex];
                    const percentage = value.toFixed(0); // tirando casas decimais da porcentagem
                    return `${label}: ${percentage}%`;
                },
                font: {
                    weight: 'bold',
                    size: 14,
                }
            }
        }
    },
    plugins: [ChartDataLabels] // Ativando o plugin
});

// Função para atualizar o gráfico com base nos checkboxes
document.querySelectorAll('.checkboxes input').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        const social = this.getAttribute('data-social');
        const index = originalData.labels.indexOf(social);

        if (this.checked) {
            // Adicionar a rede social de volta ao gráfico
            if (!visibleData.labels.includes(social)) {
                visibleData.labels.push(social);
                visibleData.datasets[0].data.push(originalData.percentages[index]);
                visibleData.datasets[0].backgroundColor.push(originalData.colors[index]);
            }
        } else {
            // Remover a rede social do gráfico
            const visibleIndex = visibleData.labels.indexOf(social);
            if (visibleIndex > -1) {
                visibleData.labels.splice(visibleIndex, 1);
                visibleData.datasets[0].data.splice(visibleIndex, 1);
                visibleData.datasets[0].backgroundColor.splice(visibleIndex, 1);
            }
        }

        // Recalcular as porcentagens com base nas redes visíveis
        recalculatePercentages();
        pieChart.update();
    });
});
