<script setup>

const props = defineProps({
    weatherData: {
        type: Object,
        default: () => ({})
    }
})
</script>

<template>
    <div class="card border-0" style="width:100%; margin-top: 2rem; padding-bottom: 0; box-shadow: 8px 7px 20px 1px rgba(0, 0, 0, 0.28);">
        <div id="accordionExample" class="accordion">
            <div v-for="(data, date) in props.weatherData" :key="date" class="accordion-item">
                <h2 :id="'heading-' + date.replace(/\//g, '-')" class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse-' + date.replace(/\//g, '-')" aria-expanded="false" :aria-controls="'collapse-' + date.replace(/\//g, '-')">
                        Прогноз на {{ date }}
                    </button>
                </h2>
                <div :id="'collapse-' + date.replace(/\//g, '-')" class="accordion-collapse collapse" :aria-labelledby="'heading-' + date.replace(/\//g, '-')" data-bs-parent="#accordionExample">
                    <div class="accordion-body">
                        <div class="row">
                            <div v-for="(hourData, index) in data.hourly.time" :key="index" class="col-12 col-sm-6 col-md-4 mb-3">
                                <div class="card">
                                    <div class="card-body">
                                        <h5 class="card-title">{{ data.hourly.time[index] }}</h5>
                                        <p class="card-text">Температура: {{ +data.hourly.temperature2m[index].toFixed(2) }} °C</p>
                                        <p class="card-text">Влажность: {{ +data.hourly.relativeHumidity2m[index].toFixed(2) }} %</p>
                                        <p class="card-text">Вероятность осадков: {{ +data.hourly.precipitationProbability[index].toFixed(2) }} %</p>
                                        <p class="card-text">Осадки: {{ +data.hourly.precipitation[index].toFixed(2) }} мм</p>
                                        <p class="card-text">Облачность: {{ +data.hourly.cloudCover[index].toFixed(2) }} %</p>
                                        <p class="card-text">Давление: {{ +data.hourly.pressureMsl[index].toFixed(2) }} мм рт. ст.</p>
                                        <p class="card-text">Скорость ветра: {{ +data.hourly.windSpeed10m[index].toFixed(2) }} м/с</p>
                                        <p class="card-text">Направление ветра: {{ +data.hourly.windDirection10m[index].toFixed(2) }} °</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.row {
    display: flex;
    flex-wrap: wrap;
    margin: -0.75rem;
}

.row > * {
    flex: 0 0 auto;
    width: 100%;
    padding: 0.75rem;
}

@media (min-width: 576px) {
    .col-sm-6 {
        flex: 0 0 auto;
        width: 50%;
    }
}

@media (min-width: 768px) {
    .col-md-4 {
        flex: 0 0 auto;
        width: 33.33333333%;
    }
}

p {
    font-size: 1.25em;
}

button {
    font-size: 1em;
}
</style>