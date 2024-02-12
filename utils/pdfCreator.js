const PDFDocument = require('pdfkit');

module.exports = async (res, data) => {
  // Create a new PDF document
  const doc = new PDFDocument();

  // Pipe the PDF document to the response stream
  doc.pipe(res);

  // Add data to the PDF
  doc.font('./fonts/Roboto-Bold.ttf').fontSize(24).text('Weather Report', { align: 'center' });
  doc.moveDown();

// Add current weather information
doc.font('./fonts/Roboto-Bold.ttf').fontSize(16).text('Current Weather:', { align: 'left' });
doc.font('./fonts/Roboto-Regular.ttf').fontSize(14).text(`\u0020  \u0020  Location: ${data.info.cityInfo.name}, ${data.info.cityInfo.country}`, { align: 'left' });
doc.font('./fonts/Roboto-Regular.ttf').fontSize(14).text(`\u0020  \u0020  Temperature: ${data.info.current.Temperature} °C`, { align: 'left' });
doc.font('./fonts/Roboto-Regular.ttf').fontSize(14).text(`\u0020  \u0020  Feels Like: ${data.info.current.Feels} °C`, { align: 'left' });
doc.font('./fonts/Roboto-Regular.ttf').fontSize(14).text(`\u0020  \u0020  Weather: ${data.info.current.Weather}`, { align: 'left' });
doc.font('./fonts/Roboto-Regular.ttf').fontSize(14).text(`\u0020  \u0020  Wind Speed: ${data.info.current.WindSpeed} m/s`, { align: 'left' });
doc.font('./fonts/Roboto-Regular.ttf').fontSize(14).text(`\u0020  \u0020  Humidity: ${data.info.current.Humidity}%`, { align: 'left' });
doc.font('./fonts/Roboto-Regular.ttf').fontSize(14).text(`\u0020  \u0020  Pressure: ${data.info.current.Pressure} hPa`, { align: 'left' });

// Add 3-Hour Forecast information
doc.moveDown();
doc.font('./fonts/Roboto-Bold.ttf').fontSize(16).text('3-Hour Forecast:', { align: 'left' });
data.info.forecast3Hours.forEach((forecast, index) => {
  doc.moveDown();
  doc.font('./fonts/Roboto-Regular.ttf').fontSize(14).text(`\u0020  \u0020  Forecast ${index + 1}:`, { align: 'left' });
  doc.font('./fonts/Roboto-Regular.ttf').fontSize(14).text(`\u0020  \u0020  Temperature: ${forecast.Temperature} °C`, { align: 'left' });
  doc.font('./fonts/Roboto-Regular.ttf').fontSize(14).text(`\u0020  \u0020  Wind Speed: ${forecast.WindSpeed} m/s`, { align: 'left' });
  doc.font('./fonts/Roboto-Regular.ttf').fontSize(14).text(`\u0020  \u0020  Humidity: ${forecast.Humidity}%`, { align: 'left' });
  doc.font('./fonts/Roboto-Regular.ttf').fontSize(14).text(`\u0020  \u0020  Weather: ${forecast.Weather}`, { align: 'left' });
});


// Add 14-Day Forecast section
doc.moveDown();
doc.font('./fonts/Roboto-Bold.ttf').fontSize(16).text('14-Day Forecast:', { align: 'left' });
data.info.forecast14Days.forEach((forecast, index) => {
  doc.moveDown();
  doc.font('./fonts/Roboto-Regular.ttf').fontSize(14).text(`\u0020  \u0020  Forecast Day ${index + 1}:`, { align: 'left' });
  doc.font('./fonts/Roboto-Regular.ttf').fontSize(14).text(`\u0020  \u0020  Temperature: ${forecast.Temperature} °C`, { align: 'left' });
  doc.font('./fonts/Roboto-Regular.ttf').fontSize(14).text(`\u0020  \u0020  Wind Speed: ${forecast.WindSpeed} m/s`, { align: 'left' });
  doc.font('./fonts/Roboto-Regular.ttf').fontSize(14).text(`\u0020  \u0020  Humidity: ${forecast.Humidity}%`, { align: 'left' });
  doc.font('./fonts/Roboto-Regular.ttf').fontSize(14).text(`\u0020  \u0020  Weather: ${forecast.Weather}`, { align: 'left' });
});

// Add City Information section
doc.moveDown();
doc.font('./fonts/Roboto-Bold.ttf').fontSize(16).text('City Information:', { align: 'left' });
const cityInfo = data.info.cityInfo;
doc.font('./fonts/Roboto-Regular.ttf').fontSize(14).text(`\u0020  \u0020  Name: ${cityInfo.name}`, { align: 'left' });
doc.font('./fonts/Roboto-Regular.ttf').fontSize(14).text(`\u0020  \u0020  Latitude: ${cityInfo.latitude}`, { align: 'left' });
doc.font('./fonts/Roboto-Regular.ttf').fontSize(14).text(`\u0020  \u0020  Longitude: ${cityInfo.longitude}`, { align: 'left' });
doc.font('./fonts/Roboto-Regular.ttf').fontSize(14).text(`\u0020  \u0020  Country: ${cityInfo.country}`, { align: 'left' });
doc.font('./fonts/Roboto-Regular.ttf').fontSize(14).text(`\u0020  \u0020  Population: ${cityInfo.population}`, { align: 'left' });
doc.font('./fonts/Roboto-Regular.ttf').fontSize(14).text(`\u0020  \u0020  Is Capital: ${cityInfo.is_capital ? 'Yes' : 'No'}`, { align: 'left' });

  // Finalize the PDF document
  doc.end();

  console.log('PDF file created successfully.');
};