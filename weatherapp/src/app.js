const express = require('express'); 
const hbs = require('hbs');// logic less templating engine that dynamically generates HTML page.
const path = require("path");// 'path' module give a way to interact with directories and file paths.

const app = express();

const weatherData = require('../utils/weatherData');


const port = process.env.PORT || 3000

/* `path.join()` method joins all given path segments together using the platform specific separator as
a delimiter, then normalizes the resulting path. */
const publicStaticDirPath = path.join(__dirname, '../public')

const viewsPath = path.join(__dirname, '../templates/views');

const partialsPath = path.join(__dirname, '../templates/partials');

app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);
app.use(express.static(publicStaticDirPath));

/* This is a route handler. It is a function that is called when a request is made to the specified
route. */
app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App'
    })
})


app.get('/weather', (req, res) => {
    const address = req.query.address
    if(!address) {
        return res.send({
            error: "You must enter address in search text box"
        })
    }

    weatherData(address, (error, {temperature, description, cityName} = {}) => {
        if(error) {
            return res.send({
                error
            })
        }
        console.log(temperature, description, cityName);
        res.send({
            temperature,
            description,
            cityName
        })
    })
});


app.get("*", (req, res) => {
    res.render('404', {
        title: "page not found"
    })
})


app.listen(port, () => {
    console.log("Server is up and running on port: ", port);
})