console.log(data);
const labels = data.map(day => new Date(day.Epoch * 1000).toLocaleDateString());
const temperatureData = data.map(day => day.Temperature);
const windSpeedData = data.map(day => day.WindSpeed);
const humidityData = data.map(day => day.Humidity);

new Chart(document.getElementById('temperatureChart'), {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: 'Avg Temperature (°C)',
            data: temperatureData,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
        }]
    }
});

new Chart(document.getElementById('windSpeedChart'), {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: 'Max Wind Speed (mps)',
            data: windSpeedData,
            fill: false,
            borderColor: 'rgb(255, 159, 64)',
            tension: 0.1
        }]
    }
});

new Chart(document.getElementById('humidityChart'), {
    type: 'line',
    data: {
        labels: labels,
        datasets: [{
            label: 'Avg Humidity (%)',
            data: humidityData,
            fill: false,
            borderColor: 'rgb(54, 162, 235)',
            tension: 0.1
        }]
    }
});
