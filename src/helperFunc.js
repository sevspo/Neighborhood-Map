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

