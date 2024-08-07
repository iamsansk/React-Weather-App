import { useEffect, useState } from 'react'
import './App.css'

//import icons

import clear from './icons/clear.png'
import clouds from './icons/clouds.png'
import drizzle from './icons/drizzle.png'
import humidityIco from './icons/humidity.png'
import mist from './icons/mist.png'
import rain from './icons/rain.png'
import searchIco from './icons/search.png'
import snow from './icons/snow.png'
import windIco from './icons/wind.png'

const WeatherApp = ({city,country,temp,icon,lat,long,humidity,wind,loading})=>{
  return (<div className='weather-container'>
    {loading && <p>Loading...</p>}
    <h3 className='city-name'>{city}</h3>
    <p>{country}</p>
    <p className='temp'>{temp}</p>
    <img src={icon} alt="image" className='weather-icon'/>
    <div className='coord-container'>
      <div className='lat-long'>
        <p>Latitude</p>
        <span>{lat}</span>
      </div>
      <div className='lat-long'>
        <p>Longitude</p>
        <span>{long}</span>
      </div>
    </div>
      <div className="atmo">
        <div className='atmo-child'>
          <p>Humidity</p>
          <img src={humidityIco}/>
          <span>{humidity}</span>
        </div>
        <div className='atmo-child'>
          <p>Wind speed</p>
          <img src={windIco}/>
          <span>{wind}</span>
        </div>
      </div>
  </div>);
}

function App() {
  let apiKey = import.meta.env.VITE_API_KEY;
  const [text, setText] = useState("Erode");
  const [loading,setLoading] = useState(false);
  const [cityNotFound,setCityNotFound] = useState(false)

  const [city,setCity] = useState("Erode");
  const [country,setCountry] = useState("IN");
  const [temp,setTemp] = useState("0°C");
  const [icon,setIcon] = useState(rain);
  const [lat,setLat] = useState("12.2")
  const [long,setLong] = useState("12.2");
  const [humidity,setHumidity] = useState("80%");
  const [wind,setWind] = useState("12.2");

  const search = async()=>{
    setLoading(true);
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${apiKey}&units=Metric`;
    let climateIco = {
        "01d": clear,
        "81n": clear,
        "82d": clouds,
        "82n": clouds,
        "03d": drizzle,
        "03n": drizzle,
        "04d": drizzle,
        "84n": drizzle,
        "89d": rain,
        "89n": rain,
        "10d": rain,
        "18n": rain,
        "13d": snow,
        "13n": snow,
    }
    try{
        let res = await fetch(url);
        let data = await res.json();
        if(data.cod == "404"){
          setCityNotFound(true);
          setLoading(false)
          return;
        }
        setCity(data.name);
        setCountry(data.sys.country);
        setTemp(data.main.temp);
        setLat(data.coord.lat);
        setLong(data.coord.lon);
        setHumidity(data.main.humidity)
        setWind(data.wind.speed);
        const weatherIco = data.weather[0].icon
        setIcon(climateIco[weatherIco] || clear)
        setCityNotFound(false)
    }catch(error){
      console.error("Error occured while fetching",error);
    }finally{
      setLoading(false)
    }
  }
  function handleInput(e){
    setText(e.target.value)
  }
  function handleKey(e){
    if(e.key === "Enter"){
      search();
    }
  }
  useEffect(()=>{
    search();
  },[]);
  return (
    <>
      <div className="main-container">
        <h2>Weather App</h2>
        <div className='search-box'>
          <input type="text" placeholder='Enter City' value={text} onChange={handleInput} onKeyDown={handleKey}/>
          <img className='serach-icon' src={searchIco} onClick={search}/>
        </div>
        {!cityNotFound && <WeatherApp city={city} country={country} temp={temp} icon={icon} lat={lat} long={long} humidity={humidity} wind={wind} loading={loading}/>}
        {cityNotFound && <h3>City Not Found</h3>}
        <p className='copy-rights'>Designed by <span>SanSK</span></p>
      </div>
      
    </>
  )
}

export default App
