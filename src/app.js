import * as utils from './utils/utils.js'
import path from 'path'
//const path = require('path')
import express from 'express'
import hbs from 'hbs'
const app = express()
//to get the port number from heroku. Or condition to default to 3000 if it exists
const PORT = process.env.PORT || 3000
//to fix the __dirname issue with ES6 module
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//serving static html as the main page localhost:3000
app.use(express.static(path.join(__dirname, '../public')))
const viewsPath = path.join(__dirname, "../templates/views")
const partialsPath = path.join(__dirname, "../templates/partials")

//setting up handle bars and views location to render dynamic pages
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.get('', (req, res) => {
    res.render('index', {
        title: "Weather",
        name: "Created by Ravi Gajul"
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: "About Me",
        name: "Created by Ravi Gajul"
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: "Help",
        name: "Created by Ravi Gajul"
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.search) {
        return res.send({error:"Please provide a search term"})
    }
    console.log(req.query)
    debugger
    utils.geoCode(req.query.search, (error, center) => {
        if (error) {
            debugger
            res.send({error})
        } else {
            utils.getWeather(center, (error, resp) => {
                if (error) {
                    res.send({error})
                } else {
                    res.send(
                        {
                            "location": center.place_name,
                            "forcast": "The temperature is " + resp.body.current.temperature + "  degrees and it feels like " + resp.body.current.feelslike + " degrees. And there is a  " + resp.body.current.precip + " % probability of rain",
                            "address": req.query.search
                        }
                    )
                }

            })
        }
    })
})

app.get('/*', (req, res) => {
    res.render('404', {
        code: '404',
        message: 'Page not found',
        name: "Created by Ravi Gajul"
    })
})

//opening  port on the server to listen
app.listen(PORT, () => {
    console.log('The server is up and running in 3 seconds')
    console.log('open a browser and invoke localhost:' + PORT + '/help')
})
