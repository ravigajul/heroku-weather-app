import request from 'request'
const geoCode = (place, callback) => {
    const geoCodeUrl = "https://api.mapbox.com/geocoding/v5/mapbox.places/" + encodeURIComponent(place) + ".json?access_token=pk.eyJ1IjoicmF2aWdhanVsIiwiYSI6ImNsMmo0YXBiczB1MTQzZm9qYmxobTFrM2cifQ.u2dvtrT8mDrIazg9Fup17Q&limit=1"
    debugger

    //Either error or response will have a value based on the response.
    request(geoCodeUrl, function (error, response) {
        //explicit json parsing
        debugger
        const resp = JSON.parse(response.body)

        if (error) {
            callback("500 Internal Server error - Geocoding", undefined)
        } else if (resp.error) {
            callback("400-bad request - geocoding", undefined)
        } else if (resp.features.length === 0) {
            callback("Place Doesnot exit", undefined)
        } else {

            const place_name = resp.features[0].place_name

            debugger

            callback(undefined, {
                center: resp.features[0].center,
                place_name: resp.features[0].place_name
            })
        }
    });

}
const getWeather = (center, callback) => {
    const latitude = center.center[1]
    const longitude = center.center[0]
    const url = 'http://api.weatherstack.com/current?access_key=e84a396be35e4b7babdec9031b34365e&query=' + latitude + ',' + longitude
    //implicit json parsing
 
    //error - when error, response actual response, body is html body
    request({ url: url, json: true }, function (error, response) {
        debugger
        if (error) {
            callback('500 internal server error unable to connect to service ', undefined)
        } /* else if (response.body.error.code === 104){
            callback(response.body.error.info,undefined)
        }else if (response.body.error) {
            callback('400 - Bad Request', undefined)
        }  */else {
            debugger
            callback(undefined, response)
        }
    });
}

export { geoCode, getWeather }