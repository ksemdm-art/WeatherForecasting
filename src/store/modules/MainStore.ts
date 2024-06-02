import { defineStore } from "pinia";
import moment from "moment";
import { fetchWeatherApi } from "openmeteo";

interface WeatherData {
  current: {
    time: string;
    temperature2m: number | null;
    relativeHumidity2m: number | null;
    precipitation: number | null;
    cloudCover: number | null;
    pressureMsl: number | null;
    windSpeed10m: number | null;
    windDirection10m: number | null;
  };
  hourly: {
    time: string[];
    temperature2m: number[];
    relativeHumidity2m: number[];
    precipitationProbability: number[];
    precipitation: number[];
    pressureMsl: number[];
    cloudCover: number[];
    windSpeed10m: number[];
    windDirection10m: number[];
  };
}

interface GroupedData {
  [key: string]: {
    hourly: {
      time: string[];
      temperature2m: number[];
      relativeHumidity2m: number[];
      precipitationProbability: number[];
      precipitation: number[];
      pressureMsl: number[];
      cloudCover: number[];
      windSpeed10m: number[];
      windDirection10m: number[];
    };
  };
}

interface MainStoreState {
  latitude: number;
  longitude: number;
  url: string;
  params: {
    latitude: number;
    longitude: number;
    current: string[];
    hourly: string[];
  };
  weatherData: WeatherData;
  groupedData: GroupedData;
  savedLocations: SavedLocations;
  savedLat: number;
  savedLon: number;
}

interface SavedLocations {
  points: [
    {
      name: string;
      lat: number;
      lon: number;
    }
  ];
}

export const useMainStore = defineStore("main", {
  state: (): MainStoreState => ({
    latitude: 0,
    longitude: 0,
    url: "https://api.open-meteo.com/v1/gfs",
    params: {
      latitude: 52.52,
      longitude: 13.41,
      current: [
        "temperature_2m",
        "relative_humidity_2m",
        "precipitation",
        "cloud_cover",
        "pressure_msl",
        "wind_speed_10m",
        "wind_direction_10m",
      ],
      hourly: [
        "temperature_2m",
        "relative_humidity_2m",
        "precipitation_probability",
        "precipitation",
        "pressure_msl",
        "cloud_cover",
        "wind_speed_10m",
        "wind_direction_10m",
      ],
    },
    weatherData: {
      current: {
        time: "",
        temperature2m: null,
        relativeHumidity2m: null,
        precipitation: null,
        cloudCover: null,
        pressureMsl: null,
        windSpeed10m: null,
        windDirection10m: null,
      },
      hourly: {
        time: [],
        temperature2m: [],
        relativeHumidity2m: [],
        precipitationProbability: [],
        precipitation: [],
        pressureMsl: [],
        cloudCover: [],
        windSpeed10m: [],
        windDirection10m: [],
      },
    },
    groupedData: {},
    savedLocations: {
      points: [
        {
          name: "",
          lat: 0,
          lon: 0,
        },
      ],
    },
    savedLat: 0,
    savedLon: 0,
  }),
  actions: {
    setSavedLocations(name: string, lat: number, lon: number) {
      this.savedLocations.points.push({
        name: name,
        lat: lat,
        lon: lon,
      })
      
    },
    getWeatherData(latitude: number, longitude: number) {
      this.latitude = latitude;
      this.longitude = longitude;
      this.params.latitude = latitude;
      this.params.longitude = longitude;
      fetchWeatherApi(this.url, this.params).then((data) => {
        const response = data[0];

        const range = (start: number, stop: number, step: number) =>
          Array.from(
            { length: (stop - start) / step },
            (_, i) => start + i * step
          );

        const current = response.current()!;
        const hourly = response.hourly()!;
        moment.locale("ru");

        this.weatherData = {
          current: {
            time: moment(new Date(Number(current.time()) * 1000)).format(
              "DD/MM/YYYY HH:mm"
            ),
            temperature2m: current.variables(0)?.value().toFixed(2),
            relativeHumidity2m: current.variables(1)?.value().toFixed(2),
            precipitation: current.variables(2)?.value().toFixed(2),
            cloudCover: current.variables(3)?.value().toFixed(2),
            pressureMsl: current.variables(4)?.value().toFixed(2),
            windSpeed10m: current.variables(5)?.value().toFixed(2),
            windDirection10m: current.variables(6)?.value().toFixed(2),
          },
          hourly: {
            time: range(
              Number(hourly.time()),
              Number(hourly.timeEnd()),
              hourly.interval()
            ).map((t) =>
              moment(new Date(Number(t) * 1000)).format("DD/MM/YYYY HH:mm")
            ),
            temperature2m: hourly.variables(0)?.valuesArray(),
            relativeHumidity2m: hourly.variables(1)?.valuesArray(),
            precipitationProbability: hourly.variables(2)?.valuesArray(),
            precipitation: hourly.variables(3)?.valuesArray(),
            pressureMsl: hourly.variables(4)?.valuesArray(),
            cloudCover: hourly.variables(5)?.valuesArray(),
            windSpeed10m: hourly.variables(6)?.valuesArray(),
            windDirection10m: hourly.variables(7)?.valuesArray(),
          },
        };

        this.groupedData = this.weatherData.hourly.time.reduce((acc, time) => {
          const date = time.split(" ")[0];
          if (!acc[date]) {
            acc[date] = {
              hourly: {
                time: [],
                temperature2m: [],
                relativeHumidity2m: [],
                precipitationProbability: [],
                precipitation: [],
                pressureMsl: [],
                cloudCover: [],
                windSpeed10m: [],
                windDirection10m: [],
              },
            };
          }
          const index = this.weatherData.hourly.time.indexOf(time);
          acc[date].hourly.time.push(time);
          acc[date].hourly.temperature2m.push(
            this.weatherData.hourly.temperature2m[index].toFixed(2)
          );
          acc[date].hourly.relativeHumidity2m.push(
            this.weatherData.hourly.relativeHumidity2m[index].toFixed(2)
          );
          acc[date].hourly.precipitationProbability.push(
            this.weatherData.hourly.precipitationProbability[index].toFixed(2)
          );
          acc[date].hourly.precipitation.push(
            this.weatherData.hourly.precipitation[index].toFixed(2)
          );
          acc[date].hourly.pressureMsl.push(
            this.weatherData.hourly.pressureMsl[index].toFixed(2)
          );
          acc[date].hourly.cloudCover.push(
            this.weatherData.hourly.cloudCover[index].toFixed(2)
          );
          acc[date].hourly.windSpeed10m.push(
            this.weatherData.hourly.windSpeed10m[index].toFixed(2)
          );
          acc[date].hourly.windDirection10m.push(
            this.weatherData.hourly.windDirection10m[index].toFixed(2)
          );
          return acc;
        }, {} as GroupedData);
      });
    },
  },
});
