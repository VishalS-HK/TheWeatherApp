const request = require('request');
const constants = require('../config');

const weatherData = (address, callback) => {

    const url = constants.openWeatherMap.BASE_URL + encodeURIComponent(address) + '&appid=' + constants.openWeatherMap.SECRET_KEY;
    console.log(url);
    request ({url, json:true}, (error, {body} ) =>{
        console.log(body);

        var mongoose = require("mongoose")
        mongoose.connect('mongodb://localhost:27017/mydb',
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        var db = mongoose.connection;
        db.on('error',()=>console.log("Error in Connecting to Database"));
        db.once('open',()=>console.log("Connected to Database"))

        db.collection('users').insertOne(body,(err,collection)=>{
            if(err){
                throw err;
            }
            console.log("Record Inserted Successfully");
        });

        if(error){
            callback("Can't fetch the data from the OpenWeatherMap API", undefined);
        }
        else if(!body.main || !body.main.temp || !body.name || !body.weather){
            callback("Unable to find the data, try another location!",undefined);
        }
        else {
            callback(undefined, {
                temperature : body.main.temp,
                description : body.weather[0].description,
                cityName : body.name
                
            })
        }
    })
}

module.exports = weatherData;