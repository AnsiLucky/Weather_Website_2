# Weather App

This Weather App provides current weather, 3-hour forecast, 14-day extended forecast and city-related information for cities around the world.
The app defaults to displaying weather information for 'Almaty' on the first visit. Users can then input their preferred city.

### Prerequisites

Before you begin, ensure you have the following installed:

- Node.js
- npm (Node Package Manager)

### Run Website

```bash
git clone https://github.com/AnsiLucky/Weather_Website_2
cd Weather_Website_2
npm install
node server.js
```

by default server will start at `http://localhost:3000`

## For Admin Status
`localhost:3000/admin` - by default
- login : `admin@gmail.com`
- password : `admin_123`

## APIs Used

1.  **OpenWeatherMap API**
    - Endpoint: `http://api.openweathermap.org/data/2.5/forecast`
    - Usage: Weahter Info
2.  **Visual Crossing**
    - Endpoint: `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/`
    - Usage: Weahter Info
3.  **City Info API Dev Me**
    - Endpoint: `https://dev.me/api/module-app/v1-get-city-details?name=${city}`
    - Usage: City Info
4.  **Source Unsplash API**
    - Endpoint: `https://source.unsplash.com/1600x900`
    - Usage: Random Photos from city

## File Structure

The project has the following folder structure:

- `config` : Stores configuration.
- `utils` : Utilits which help retrive the information.
- `models` : Models of MongoDB.
- `public` : Contains static files (CSS, images, js).
- `routers` : Routes for sertain endpoints.
- `views` : HTML templates for rendering pages.

## Dependencies

- `bcrypt` : encryption the password
- `cors` : zhai na vsyaki
- `ejs` : rendering the templates
- `express` : server
- `express-flash` : flash the messages
- `express-session` : session-cookies
- `mongoose` : mongoDB
- `pdfkit` : PDF creater
- `dotenv` : environment variables
