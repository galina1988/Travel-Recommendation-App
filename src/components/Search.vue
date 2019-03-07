<template>
  <div class="search">
    <div id="googleMap"/>
    <h1>Travel Guide</h1>
    <h2>(Paris to US)</h2>
    <p class="condition">
      State:
      <Dropdown :options="states" :selected="state" :onUpdateOption="onStateChanged" :placeholder="'Select a state'" style="height: 50px"></Dropdown>
    </p>
    <p style="width:100px; display: inline-block;"/>
    <p class="condition">
      City:
      <Dropdown :options="cities" :selected="city" :onUpdateOption="onCitySelected" :placeholder="'Select a city'" style="height: 50px"></Dropdown>
    </p>    
    <button @click="onSearch" value="Search">Guide</button>

    <div class="flight">
      <h3>Flights</h3>
      <table>
        <thead>
          <tr>
            <th style="width:200px;">Org Airport</th>
            <th style="width:200px;">Dest Airport</th>
            <th style="width:200px;">Departure Time</th>
            <th style="width:200px;">Carrier</th>
            <th style="width:150px;">Price</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(flight, idx) in flights" :key="idx">
            <td>{{flight.origin}}</td>
            <td>{{flight.destination}}</td>
            <td>{{flight.departure}}</td>
            <td>{{flight.carrier}}</td>
            <td>${{flight.price}}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="weather">
      <h3>Weather Forecast</h3>
      <table>
        <thead>
          <tr>
            <th style="width:200px;">Date</th>
            <th style="width:250px;">Headline</th>
            <th style="width:150px;">Condition</th>
            <th style="width:90px;">Low Temp</th>
            <th style="width:90px;">High Temp</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(weather, idx) in weathers" :key="idx">
            <td>{{getWeaterDates(weather)}}</td>
            <td>{{weather.headline}}</td>
            <td style="text-align:center;"><img :alt="getWeatherAlt(weather)" :src="getWeatherIcon(weather)" style="height: 50px"></td>
            <td>{{weather.temperatureLowCelcius}}° C</td>
            <td>{{weather.temperatureHighCelcius}}° C</td>
            <td>{{weather.forecastDesc}}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="place">
      <h3>Places Recommended</h3>
      <table>
        <thead>
          <tr>
            <th style="width:200px;">Photo</th>
            <th style="width:200px;">Place</th>
            <th style="width:300px;">Address</th>
            <th style="width:80px;">Rating</th>
            <th style="width:100px;"># Ratings</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(place, idx) in places" :key="idx">
            <td style="text-align:center;"><img alt="Photo" :src="getPlacePhotoUrl(place)" style="height: 200px"></td>
            <td>{{place.name}}</td>
            <td>{{place.formatted_address}}</td>
            <td>{{place.rating}}</td>
            <td>{{place.user_ratings_total}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  import axios from "axios"
  import Dropdown from "./Dropdown.vue"
  import googleMaps from "@google/maps"

  export default {
    name: 'Search',

    components: {
      Dropdown
    },

    data() {
      return {
        apiKey: 'YOUR RAKUTEN RAPIDAPI KEY HERE',
        googleKey: 'YOUR GOOGLE PLACES API KEY HERE',

        googleMapsClient: googleMaps.createClient({key: this.googleKey}),

        maxPhotoSize: 200,

        states: [
          {
            id: 1,
            name:'New York',
            abb: 'NY'
          },
        ],

        citiesInUS: [
          [
            {
              name:'New York City',
              airport: 'NYCA-sky',
              country: 'US',
              currency: 'USD',
              locale : 'en-US'
            },
            {
              name:'Rochester',
              airport: 'ROCA-sky',
              country: 'US',
              currency: 'USD',
              locale : 'en-US'
            },
            {
              name:'Buffalo',
              airport: 'BUFA-sky',
              country: 'US',
              currency: 'USD',
              locale : 'en-US'
            },
          ]
        ],

        citiesInState: [],

        state: {},
        city: {},

        flyOrg: 'PARI-sky',

        flightList: [],
        weatherList: [],
        placeList: [],

        weatherIcons: {
          'blowing-dust': 'tornado',
          'blowing-snow': 'snowing (1)',
          'clear': 'sun',
          'drifting-snow': 'snowing (3)',
          'drizzle': 'drizzle',
          'dust-storm': 'tornado',
          'fog': 'fog',
          'freezing-drizzle': 'freezingdrizzle',
          'freezing-fog': 'freezingfog',
          'freezing-rain': 'freezingrain',
          'hail': 'hail',
          'haze': 'haze',
          'heavy-drizzle': 'heavydrizzle',
          'heavy-rain': 'heavyrain',
          'heavy-snow': 'heavysnow',
          'heavy-thunderstorm': 'heavythunderstorm',
          'light-drizzle': 'lightdrizzle',
          'light-fog': 'lightfog',
          'light-freezing-drizzle': 'lightfreezingdrizzle',
          'light-freezing-rain': 'lightfreezingrain',
          'light-hail': 'lighthail',
          'light-rain': 'lightrain',
          'light-rain-and-snow': 'lightrainandsnow',
          'light-rain-and-snow-shower': 'lightrainandsnowshower',
          'light-rain-shower': 'lightrainshower',
          'light-snow': 'lightsnow',
          'light-snow-shower': 'lightsnowshower',
          'mostly-clear': 'mostlyclear',
          'mostly-cloudy': 'mostlycloudy',
          'overcast': 'overcast',
          'partly-cloudy': 'partlycloudy',
          'patchy-fog': 'patchyfog',
          'rain': 'rain',
          'rain-and-snow': 'rainandsnow',
          'rain-and-snow-shower': 'rainandsnowshower',
          'rain-shower': 'rainshower',
          'severe-dust-storm': 'severeduststorm',
          'sleet': 'sleet',
          'smoke': 'smoke',
          'snow': 'Snow',
          'snow-shower': 'snowshower',
          'squall': 'squall',
          'thunderstorm': 'thunderstorm'
        }
     
      }
    },

    computed: {
        cities() {
          let cities = this.citiesInState
          return cities
        },

        flights() {
          let flights = this.flightList.slice(0,5);
          return flights;
        },

        weathers() {
          let weathers = this.weatherList.slice(0,5);
          return weathers;
        },

        places() {
          let places = this.placeList.slice(0,10);
          return places;
        },
    },

    methods: {
      onStateChanged(state) {
        this.state = state;

        this.citiesInState = this.citiesInUS[state.id - 1];
        this.city = this.citiesInUS[state.id - 1][0];
      },
      
      onCitySelected(city) {
        this.city = city;
      },

      onSearch() {
        this.getFlights();
        this.getWeathers();
        this.getGooglePlaces();
      },

      getFlights() {
        var now = new Date();
        var outboundDate = (now.getYear() + 1900) + "-" + (now.getMonth() >= 9 ? (now.getMonth() + 1) : "0" + (now.getMonth() + 1));        
        var inboundDate = (now.getYear() + 1900) + "-" + (now.getMonth() >= 8 ? (now.getMonth() + 2) : "0" + (now.getMonth() + 2));
        var request = encodeURI("https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsedates/v1.0/"
                        + this.city.country +"/" + this.city.currency + "/" + this.city.locale + "/" + this.flyOrg + "/" + this.city.airport + "/" + outboundDate) + "?inboundpartialdate=" + inboundDate;

        axios
          .get(request, {
            headers: {
              'X-RapidAPI-Key': this.apiKey
            }})
          .then(response => {
            this.onFlightFetched(response.data);
          });
      },

      onFlightFetched(data) {
        this.flightList = [];

        var quotes = data.Quotes;
        var places = data.Places;
        var carriers = data.Carriers;

        quotes.forEach((quote) => {  
          var flight = {};

          places.forEach((place) => {
            if(place.PlaceId == quote.OutboundLeg.OriginId) flight.origin = place.Name;
            if(place.PlaceId == quote.OutboundLeg.DestinationId) flight.destination = place.Name;
          })
          
          carriers.forEach((carrier) => {
            if(carrier.CarrierId == quote.OutboundLeg.CarrierIds[0]) flight.carrier = carrier.Name;
          })

          flight.departure = quote.OutboundLeg.DepartureDate;
          flight.price = quote.MinPrice;

          this.flightList.push({...flight});
        });
      },

      getWeathers() {
        var request = encodeURI("https://weather2020-weather-v1.p.rapidapi.com/city/e8ecee8ff60c478f8a36280fea0524fe/" + this.city.name +"," + this.state.abb);

        axios
          .get(request, {
            headers: {
              'X-RapidAPI-Key': this.apiKey
            }})
          .then(response => {
            this.onWeatherFetched(response.data);
          });
      },

      onWeatherFetched(weathers) {
        this.weatherList = [];

        weathers.forEach((weather) => {
          this.weatherList.push({...weather});
        });
      },

      getWeaterDates(weather) {
        var sd = new Date(0);
        sd.setUTCSeconds(weather.startDate);

        var ed = new Date();
        ed.setDate(sd.getDate() + 6);

        return sd.toDateString() + " ~ " + ed.toDateString();
      },

      getWeatherAlt(weather) {
        return weather.conditions[0].display;
      },

      getWeatherIcon(weather) {
        var images = require.context('../assets/', false, /\.svg$/)
        return images('./' + this.weatherIcons[weather.conditions[0].tag] + '.svg');
      },

      getGooglePlaces() {
        var service = new google.maps.places.PlacesService(document.createElement('div'));

        var request = {
          query: 'places+in+' + this.city.name,
        };
        service.textSearch(request, this.onGooglePlaceFetched);        
      },

      getPlacePhotoUrl(place) {
        return place.photos[0].getUrl({'maxWidth': this.maxPhotoSize, 'maxHeight': this.maxPhotoSize});
      },

      onGooglePlaceFetched(results, status) {        
        this.placeList = [];

        results.forEach((place) => {
          if(place.photos) this.placeList.push({...place});
        });

        this.getWeathers();
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1 {
    margin: 10px 0 0;
    font-size: 4em;
  }
  h2 {
    margin: 10px 0 0;
    font-size: 2em;
  }
  h3 {
    font-size: 1.5em;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
  button {
    height: 40px;
    width: 50px;
    background:#1E90FF;
    color: white;
    border-radius: 0px;
    cursor: pointer;
  }
  table, th, td {
    border: 1px solid;
    border-collapse: collapse;
  }
  .condition {
    display: inline-block;
  }
  .place {
    margin: 20px 20px 0;
    text-align: left;
  }
  .weather {
    margin: 20px 20px 0;
    text-align: left;
  }
  .flight {
    margin: -30px 20px 0;
    text-align: left;
  }
</style>
