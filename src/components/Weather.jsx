import { useState } from 'react'
import axios from 'axios'
import './Weather.css'

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

function Weather() {
  const [city, setCity] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchWeather = async (e) => {
    e.preventDefault()
    const trimmed = city.trim()
    if (!trimmed) {
      setError('Please enter a city name.')
      setWeather(null)
      return
    }

    setLoading(true)
    setError('')
    setWeather(null)

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(trimmed)}&appid=${API_KEY}&units=metric`

    try {
      const { data } = await axios.get(url)
      setWeather(data)
    } catch (err) {
      if (err.response?.status === 404) {
        setError('City not found. Try another name.')
      } else if (err.response?.status === 401) {
        setError('Invalid API key. Check your .env file.')
      } else {
        setError('Could not fetch weather. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const iconUrl = weather?.weather?.[0]?.icon
    ? `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
    : null

  return (
    <section className="weather" aria-label="Weather search">
      <header className="weather__header">
        <h1>Weather Report</h1>
        <p>Search any city for live conditions</p>
      </header>

      <form className="weather__search" onSubmit={fetchWeather}>
        <label htmlFor="city-input" className="visually-hidden">
          City name
        </label>
        <input
          id="city-input"
          type="text"
          placeholder="Enter city name (e.g. London)"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      {error && (
        <p className="weather__error" role="alert">
          {error}
        </p>
      )}

      {weather && (
        <article className="weather__card">
          <h2>
            {weather.name}
            {weather.sys?.country ? `, ${weather.sys.country}` : ''}
          </h2>
          {iconUrl && (
            <img
              src={iconUrl}
              alt={weather.weather[0].description}
              className="weather__icon"
            />
          )}
          <p className="weather__temp">{Math.round(weather.main.temp)}°C</p>
          <p className="weather__desc">{weather.weather[0].description}</p>
          <ul className="weather__details">
            <li>
              <span>Feels like</span>
              <strong>{Math.round(weather.main.feels_like)}°C</strong>
            </li>
            <li>
              <span>Humidity</span>
              <strong>{weather.main.humidity}%</strong>
            </li>
            <li>
              <span>Wind</span>
              <strong>{weather.wind.speed} m/s</strong>
            </li>
            <li>
              <span>Pressure</span>
              <strong>{weather.main.pressure} hPa</strong>
            </li>
          </ul>
        </article>
      )}
    </section>
  )
}

export default Weather
