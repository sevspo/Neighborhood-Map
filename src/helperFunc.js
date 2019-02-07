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
  //https://foursquare.com/explore?mode=url&near=Bern%2C%20Switzerland&nearGeoId=72057594040589488&q=Top%20Picks
  const url = `https://api.foursquare.com/v2/venues/explore?client_id=${public_KEY}&client_secret=${secret_KEY}&v=20190207&limit=${limit}&near=${city}&query=${query}`;
  return fetch(url)
    .then(res => res.json())
    .then(res => res.response.groups[0].items)
}

