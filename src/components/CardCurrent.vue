<script setup>
import { ref } from 'vue';
import { useMainStore } from '../store/modules/MainStore.ts';

const store = useMainStore();

const props = defineProps({
    time: {
        type: String,
        default: new Date().toLocaleTimeString()
    },
    temperature2m: {
        type: String,
        default: ''
    },
    relativeHumidity2m: {
        type: String,
        default: ''
    },
    precipitation: {
        type: String,
        default: ''
    },
    cloudCover: {
        type: String,
        default: ''
    },
    pressureMsl: {
        type: String,
        default: ''
    },
    windSpeed10m: {
        type: String,
        default: ''
    },
    windDirection10m: {
        type: String,
        default: ''
    },
    latitude: {
        type: Number,
        default: 0
    },
    longitude: {
        type: Number,
        default: 0
    }
})

let show = ref(false)
let pointName = ref('')

const saveChanges = (pointName) => {
    store.setSavedLocations(pointName, props.latitude, props.longitude)
}

</script>

<template>
    <div
class="card border-0"
        style="width:25rem; margin-top: 2rem; margin-right: 2rem; box-shadow: 8px 7px 20px 1px rgba(0, 0, 0, 0.28);">
        <div class="card-body">
            <h5 class="card-title">Текущие данные</h5>
            <h6 class="card-subtitle mb-2 text-muted">{{ props.time }}</h6>
            <div class="wrapper__data">
                <div class="wrapper__labels">
                    <p>Температура: </p>
                    <p>Влажность: </p>
                    <p>Осадки: </p>
                    <p>Облачность: </p>
                    <p>Давление: </p>
                    <p>Скорость ветра: </p>
                    <p>Направление ветра: </p>
                </div>
                <div class="wrapper__values">
                    <p> {{ props.temperature2m }} °C </p>
                    <p> {{ props.relativeHumidity2m }} % </p>
                    <p> {{ props.precipitation }} мм </p>
                    <p> {{ props.cloudCover }} % </p>
                    <p> {{ props.pressureMsl }} мм рт. ст. </p>
                    <p> {{ props.windSpeed10m }} м/с </p>
                    <p> {{ props.windDirection10m }} ° </p>
                </div>

            </div>
            <div class="button__wrapper">
                <button type="button" class="btn btn-secondary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    Добавить точку в избранное
                </button>

                <div
id="exampleModal" class="modal fade" tabindex="-1" aria-labelledby="exampleModalLabel"
                    aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 id="exampleModalLabel" class="modal-title">Добавить точку в избранное</h5>
                                <button
type="button" class="btn-close" data-bs-dismiss="modal"
                                    aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <label for="defaultTextInput" class="form-label">Назовите точку</label>
                                <input
v-model="pointName" class="form-control" type="text" placeholder="Название точки"
                                    aria-label="default input example">
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                                <button type="button" class="btn btn-primary" @click="saveChanges(pointName)">Сохранить
                                    изменения</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<style scoped>
.wrapper__data {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

p {
    font-size: 1.25em;
}

.button__wrapper {
    margin-top: 2em;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

@media (max-width: 767.98px) {
    .card {
        width: auto;
        margin-right: 0;
        margin-left: 1rem;
    }

    .wrapper__data {
        flex-direction: row;
        align-items: flex-start;
    }

    .wrapper__labels,
    .wrapper__values {
        width: 100%;
    }

    .button__wrapper {
        flex-direction: column;
    }

    .button__wrapper button {
        width: 100%;
        margin-bottom: 1rem;
    }
}

@media (min-width: 768px) and (max-width: 991.98px) {
    .card {
        margin-left: 1rem;
        width: 20rem;
    }
}

@media (min-width: 992px) {
    .card {
        width: 25rem;
    }
}
</style>
