<template>
    <div id="map" ref="mapContainer"></div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue';
import L from 'leaflet';
import { useMainStore } from '../store/modules/MainStore.ts';

const mapContainer = ref(null);
const map = ref(null);
const userLocation = ref(null);
const marker = ref(null);
const store = useMainStore();


onMounted(() => {
    initMap();
    watch(() => {
        if (store.savedLat !== 0 && store.savedLon !== 0) {
            if (map.value) {
                map.value.flyTo([store.savedLat, store.savedLon]);
                if (marker.value) {
                    map.value.removeLayer(marker.value);
                }
                marker.value = L.marker([store.savedLat, store.savedLon]).addTo(map.value);
                store.savedLat = 0;
                store.savedLon = 0;
            }
        }
    })
});


const initMap = async () => {
    if (navigator.geolocation) {
        try {
            const position = await new Promise((resolve, reject) =>
                navigator.geolocation.getCurrentPosition(resolve, reject)
            );
            const { latitude, longitude } = position.coords;
            userLocation.value = [latitude, longitude];
        } catch (error) {
            console.error('Error getting user location:', error);
            userLocation.value = [0, 0];
        }
    } else {
        console.error('Geolocation is not supported by this browser.');
        userLocation.value = [0, 0];
    }

    await initMapWithLocation();
};

const initMapWithLocation = async () => {
    await nextTick();
    if (mapContainer.value) {
        map.value = L.map(mapContainer.value, {
            center: userLocation.value,
            zoom: 13,
            layers: [
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '',
                }),
            ],
        });

        map.value.on('click', (e) => {
            if (marker.value) {
                map.value.removeLayer(marker.value);
            }
            marker.value = L.marker(e.latlng).addTo(map.value);
            console.log(e.latlng)
            store.getWeatherData(e.latlng.lat, e.latlng.lng);
            console.log(`Clicked at: ${e.latlng.lat}, ${e.latlng.lng}`);
        });
    }
};

watch(userLocation, (newLocation, oldLocation) => {
    if (map.value && newLocation !== oldLocation) {
        map.value.setView(newLocation, 13);
        if (marker.value) {
            map.value.removeLayer(marker.value);
        }
        marker.value = L.marker(newLocation).addTo(map.value);
    }
});
</script>

<style>
#map {
    height: 650px;
    width: 100vw;
    border-radius: 10px;
}
</style>