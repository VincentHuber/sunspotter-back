var express = require("express");
var router = express.Router();
const fetch = require("node-fetch");
const moment = require("moment");

const OWM_API_KEY = process.env.OWM_API_KEY;

router.get("/", async (req, res) => {
  const today = new Date();
  const dayOfWeek = today.getDay();

  if (
    dayOfWeek == 2 ||
    dayOfWeek == 3 ||
    dayOfWeek == 4 ||
    dayOfWeek == 5 ||
    dayOfWeek == 6
  ) {
    const cities = [
      {
        name: "Toulon",
        lat: 43.124228,
        lon: 5.928,
        img1: "/toulon1.png",
        img2: "/toulon2.png",
        img3: "/toulon3.png",
        text: `Découvre son port, flâne dans ses ruelles provençales, 
              savoure sa gastronomie ensoleillée. Laisse-toi séduire 
              par son ambiance chaleureuse et ses paysages.`,
      },
      {
        name: "Hyeres",
        lat: 43.120541,
        lon: 6.128639,
        img1: "/hyeres1.png",
        img2: "/hyeres2.png",
        img3: "/hyeres3.png",
        text: `Profite des plages de sable fin et des marais salants. 
              Découvre son patrimoine naturel, ses 7 000 palmiers. 
              Explore ses criques, sa vallée, son massif, ses îles.`,
      },
      {
        name: "Cassis",
        lat: 43.160701,
        lon: 5.618477,
        img1: "/cassis1.png",
        img2: "/cassis2.png",
        img3: "/cassis3.png",
        text: `Explore ce charmant port de pêche du sud de la France. 
              Réputé pour ses plages de galets et ses calanques escarpées, 
              Cassis séduit avec ses bâtiments colorés et ses vignobles.`,
      },
      {
        name: "Beziers",
        lat: 43.344233,
        lon: 3.215795,
        img1: "/beziers1.png",
        img2: "/beziers2.png",
        img3: "/beziers3.png",
        text: `Explore cette commune historique de l'Hérault, région Occitanie. Béziers, potentiellement la plus ancienne ville de France, fascine par son histoire, sa viticulture et sa feria estivale.`,
      },
      {
        name: "Perpignan",
        lat: 42.6886591,
        lon: 2.8948332,
        img1: "/perpi1.png",
        img2: "/perpi2.png",
        img3: "/perpi3.png",
        text: `Découvre ses ruelles envoûtantes, délecte-toi de sa cuisine catalane, vibre au rythme de ses festivals et laisse-toi séduire par son charme méditerranéen. Perpignan t'attend !`,
      },

      {
        name: "Marignane",
        lat: 43.4212739,
        lon: 5.218332,
        img1: "/mari1.png",
        img2: "/mari2.png",
        img3: "/mari3.png",
        text: `Nichée entre mer et collines, cette ville provençale offre un mélange de tradition et de modernité. Les ruelles étroites invitent à savourer des spécialités locales dans des cafés animés.`,
      },
      {
        name: "Istres",
        lat: 43.513006,
        lon: 4.987968,
        img1: "/istres1.png",
        img2: "/istres2.png",
        img3: "/istres3.png",
        text: `Découvre Istres, ville dynamique au cœur de la Provence. Entre les étangs et les Alpilles, profite de son patrimoine historique, de ses espaces verts et de sa vie culturelle animée.`,
      },
      {
        name: "Tarascon",
        lat: 43.806044,
        lon: 4.65752,
        img1: "/tara1.png",
        img2: "/tara2.png",
        img3: "/tara3.png",
        text: `Découvre cette ville des Bouches-du-Rhône, entre Avignon et Arles. Peuplée dès la Préhistoire, elle fascine par son histoire, sa légende de sainte Marthe et son patrimoine architectural exceptionnel.`,
      },
      {
        name: "Cannes",
        lat: 43.552847,
        lon: 7.017369,
        img1: "/cannes1.png",
        img2: "/cannes2.png",
        img3: "/cannes3.png",
        text: `Découvre cette destination réputée pour son festival du film. La Croisette, bordée de plages, boutiques et palaces, abrite le Palais des Festivals et l'Allée des Stars.`,
      },
      {
        name: "Frejus",
        lat: 43.433152,
        lon: 6.737034,
        img1: "/frejus1.png",
        img2: "/frejus2.png",
        img3: "/frejus3.png",
        text: `Explore cette commune dynamique du Var, région Provence-Alpes-Côte d’Azur. Ville d'histoire, station balnéaire, elle offre un riche patrimoine antique et un cadre festif.`,
      },
    ];

    //Boucle sur toutes les villes
  
      
      const weatherData = await Promise.all(
      cities.map(async (city) => {
        try {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${city.lat}&lon=${city.lon}&appid=${OWM_API_KEY}&units=metric`
          );
          const apiData = await response.json();
          console.log('apiData : ', apiData)
          const result = apiData.list;
    
          //Filtre pour n'afficher que les résultats du weekend
          const filterWeekend = result.filter((weekend) => {
            const day = moment(weekend.dt_txt).format("dddd");
            return day === "Saturday" || day === "Sunday";
          });
    
          //Filtre pour n'afficher que les résultats en journée du weekend
          const filterDaytime = filterWeekend.filter(
            (daytime) => daytime.sys.pod === "d"
          );
    
          //Filtre pour n'afficher que les températures en journée du weekend
          const filterTemp = filterDaytime.map((item) => item.main.temp);
    
          //Calcul de la moyenne des températures
          const total = filterTemp.reduce((item1, item2) => item1 + item2, 0);
          const averageTemp = Math.round(total / filterTemp.length);
    
          return {
            city: city.name,
            temperature: averageTemp,
            lat: city.lat,
            lon: city.lon,
            img1: city.img1,
            img2: city.img2,
            img3: city.img3,
            text: city.text,
          };
        } catch (error) {
          console.error(`Problème pour le fetch de ${city.name}`, error);
          throw error; 
        }
      })
    )
      .then((data) => {
        //Trouve la ville avec la plus haute température
        let bestCityName = data[0].city;
        let bestCityTemperature = data[0].temperature;
        let bestCityLat = data[0].lat;
        let bestCityLon = data[0].lon;
        let bestCityImg1 = data[0].img1;
        let bestCityImg2 = data[0].img2;
        let bestCityImg3 = data[0].img3;
        let bestCityText = data[0].text;
    
        for (let i = 1; i < data.length; i++) {
          if (data[i].temperature > bestCityTemperature) {
            bestCityName = data[i].city;
            bestCityTemperature = data[i].temperature;
            bestCityLat = data[i].lat;
            bestCityLon = data[i].lon;
            bestCityImg1 = data[i].img1;
            bestCityImg2 = data[i].img2;
            bestCityImg3 = data[i].img3;
            bestCityText = data[i].text;
          }
        }
    
        res.json({
          result: true,
          city: "Paris",
          temp: bestCityTemperature,
          lat: bestCityLat,
          lon: bestCityLon,
          img1: bestCityImg1,
          img2: bestCityImg2,
          img3: bestCityImg3,
          text: bestCityText,
          showWaiting: false,
        });
      })
      .catch((error) => {
        console.error("Problème lors de la récupération des données", error);
        res.status(500).json({
          result: false,
          error: "Problème lors de la récupération des données",
        });
      });

  } else {
    res.status(200).json({
      result: true,
      city: "Paris",
      temp: null,
      lat: null,
      lon: null,
      img1: null,
      img2: null,
      img3: null,
      text: null,
      showWaiting: true,
    });
  }
});

module.exports = router;
