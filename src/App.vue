<script setup>
import InteractiveMap from './components/InteractiveMap.vue';
import CardCurrent from './components/CardCurrent.vue';
import CardForecast from './components/CardForecast.vue';
import { watchEffect } from 'vue';
import { useMainStore } from './store/modules/MainStore.ts';

const store = useMainStore();

watchEffect(() => {
  console.log(store.weatherData)
  console.log('Данные в data изменились:', store.weatherData)
})

const saveLocation = (name, lat, lon) => {
  store.getWeatherData(lat, lon);
  store.savedLat = lat;
  store.savedLon = lon;
}
</script>

<template>
  <header>
    <nav class="navbar navbar-dark bg-dark">
      <div class="logo__img">
        <img src="./assets/images/web__logo.svg" alt="logo">
      </div>
    </nav>
  </header>
  <div class="container">
    <div class="heading__container">
      <h1>Выберите точку для прогноза</h1>
    </div>

    <div class="content__wrapper">
      <div class="map__wrapper">
        <InteractiveMap />
      </div>
      <div class="cards__wrapper">
        <CardCurrent
          v-if="store.weatherData.current.time !== ''" :time="store.weatherData.current.time"
          :temperature2m="store.weatherData.current.temperature2m"
          :relative-humidity2m="store.weatherData.current.relativeHumidity2m"
          :precipitation="store.weatherData.current.precipitation" :cloud-cover="store.weatherData.current.cloudCover"
          :pressure-msl="store.weatherData.current.pressureMsl" :wind-speed10m="store.weatherData.current.windSpeed10m"
          :wind-direction10m="store.weatherData.current.windDirection10m" :latitude="store.latitude"
          :longitude="store.longitude" />
        <CardForecast v-if="store.groupedData !== undefined" :weather-data="store.groupedData" />
      </div>
    </div>


    <div class="heading__container">
      <h1>Избранные точки</h1>
      <div v-for="(point, index) in store.savedLocations.points" :key="index" class="saved__point">
        <p style="font-size: 1.25em;" @click="saveLocation(point.name, point.lat, point.lon)">{{ point.name }}</p>
      </div>
    </div>
    
  </div>
</template>

<style lang="scss">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.logo__img {
  margin-left: 3em;
}

.container {
  height: 100vh;
  margin-left: 2em;
  margin-right: 2em;
}

.heading__container {
  margin-top: 3em;
  margin-bottom: 3em;
}

.content__wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.map__wrapper {
  height: 630px;
  width: 100%;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 8px 7px 20px 1px rgba(0, 0, 0, 0.28);
}

.cards__wrapper {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}


@media (max-width: 767.98px) {
  .container {
    margin-left: 2em;
    margin-right: 1em;
  }

  .heading__container {
    margin-top: 2em;
    margin-bottom: 2em;
  }

  .content__wrapper {
    flex-direction: column;
  }

  .map__wrapper {
    height: 400px;
  }

  .cards__wrapper {
    flex-direction: column;
    align-items: center;
  }
}

@media (min-width: 768px) and (max-width: 991.98px) {
  .container {
    margin-left: 1.5em;
    margin-right: 1.5em;
  }

  .map__wrapper {
    height: 500px;
  }
}

@media (min-width: 992px) {
  .container {
    margin-left: 3em;
    margin-right: 3em;
  }

  .heading__container {
    margin-top: 4em;
    margin-bottom: 4em;
  }

  .map__wrapper {
    height: 630px;
  }
}
</style>
