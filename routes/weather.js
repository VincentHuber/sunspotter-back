var express = require("express")
var router = express.Router()
const fetch = require("node-fetch")
const moment = require("moment")

const OWM_API_KEY = process.env.OWM_API_KEY

router.get("/", (req, res) => {

  const today = new Date()
  const dayOfWeek = today.getDay()

  if ( dayOfWeek == 3 || dayOfWeek == 4 || dayOfWeek == 5) {

    const cities = [
      { name: "Toulon", lat: 43.124228, lon: 5.928 },
      { name: "Hyères", lat: 43.120541, lon: 6.128639 },
      { name: "Nîmes", lat: 43.836699, lon: 4.360054 },
      { name: "Nice", lat: 43.7101728, lon: 7.2619532 },
      { name: "Perpignan", lat: 42.6886591, lon: 2.8948332 },
      { name: "Marignane", lat: 43.4212739, lon: 5.218332 },
      { name: "Istres", lat: 43.513006, lon: 4.987968 },
      { name: "Sète", lat: 43.4078758, lon: 3.7008219 },
      { name: "Cuers", lat: 43.2333, lon: 6.0667 },
      { name: "Fréjus", lat: 43.433152, lon: 6.737034},
    ];

    //Boucle sur toutes les villes
    Promise.all(
      cities.map((city) => {
        return fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&appid=${OWM_API_KEY}&units=metric`
        )
          .then((response) => response.json())
          .then((apiData) => {
            const result = apiData.list

            //Filtre pour n'afficher que les résultats du weekend
            const filterWeekend = result.filter((weekend) => {
              const day = moment(weekend.dt_txt).format("dddd")
              return day === "Saturday" || day === "Sunday"
            })

            //Filtre pour n'afficher que les résultats en journée du weekend
            const filterDaytime = filterWeekend.filter(
              (daytime) => daytime.sys.pod === "d"
            )

            //Filtre pour n'afficher que les températures en journée du weekend
            const filterTemp = filterDaytime.map((item) => item.main.temp)

            //Calcul de la moyenne des températures
            const total = filterTemp.reduce((item1, item2) => item1 + item2, 0)
            const averageTemp = Math.round(total / filterTemp.length)

            return { 
              city: city.name, 
              temperature: averageTemp, 
              lat:city.lat,
              lon:city.lon
            }
          })

          .catch((error) => {
            console.error(`Problème pour le fetch de ${city.name}`, error)
          })
      })
    )
      .then((data) => {
       //Trouve la ville avec la plus haute température
       let bestCityName = data[0].city
       let bestCityTemperature = data[0].temperature
       let bestCityLat = data[0].lat
       let bestCityLon = data[0].lon
       
        for (let i = 1 ; i < data.length ; i++){
          if (data[i].temperature > bestCityTemperature){
            bestCityName = data[i].city
            bestCityTemperature = data[i].temperature
            bestCityLat = data[i].lat
            bestCityLon = data[i].lon
          }
        }

        res.json({ 
          result: true, 
          city: bestCityName, 
          temp: bestCityTemperature,
          lat: bestCityLat,
          lon: bestCityLon,
        })
      })

      .catch((error) => {
        console.error("Problème lors de la récupération des données", error)
        res
          .status(500)
          .json({
            result: false,
            error: "Problème lors de la récupération des données",
          })
      })
  } else {
    res
      .status(200)
      .json({
        result: false,
        message: "La requête ne peut être effectuée que du mercredi au vendredi.",
      })
  }
})

module.exports = router
