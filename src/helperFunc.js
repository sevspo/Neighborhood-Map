export function getGoogleMaps() {
  return new Promise((resolve) => {
    //define the callback that will rund when google maps is loaded
    window.resolveGoogleMapsPromise = () => {
      //resolve (assign the API to the global property) with the value from the call
      resolve(window.google);
      //delete the callback to reduce clutter
      delete window.resolveGoogleMapsPromise;
    };
    //this creates the tag to load the script and that then executes the callback
    const script = document.createElement("script");
    const API_Key = 'AIzaSyDfACHz7WdXnHXZpb_GVORIz4s0gfpChOo';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${API_Key}&callback=resolveGoogleMapsPromise`;
    script.async = true;
    document.body.appendChild(script);
  });
}

export function getFourSquarePlaces() {
  const public_KEY = 'QWDB20KPEBGPCD0HXD1BFQ3FNSENVJF0DUFXAL2AJ2YIJBFB'
  const secret_KEY = 'GR0R3K52XY0AVDGF3PVL3TCQ1ERH4WGU02L01SRARNVCT33H'
  const query = 'Top Picks'
  const city = 'Bern'
  const limit = 10
  const url = `https://api.foursquare.com/v2/venues/explore?client_id=${public_KEY}&client_secret=${secret_KEY}&v=20190207&limit=${limit}&near=${city}&query=${query}`;
  return fetch(url)
    .then(res => res.json())
    .then(res => res.response.groups[0].items)
    .then(res => {
      let places = []
      res.forEach((elem, index) => {
        let obj = { 
          name: elem.venue.name,
          lat: elem.venue.location.lat,
          lng: elem.venue.location.lng,
          index: index,
          fsID: elem.venue.id
        }
        places.push(obj)
      })
      
      return places
    }).catch(err => console.error('FS Fetch Error: ' + err))
    
    /* .then(places => {
      places.map(place => {
        let url = `https://api.foursquare.com/v2/venues/${place.fsID}/photos?client_id=${public_KEY}&client_secret=${secret_KEY}&v=20190207&limit=1`
        fetch(url)
        .then(res => res.json())
        .then(res => console.log(res))
      })
    }) */
}

