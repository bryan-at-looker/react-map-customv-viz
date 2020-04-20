import React, {useState, useEffect} from 'react'
import ReactMapGL, {Source, Layer} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { find } from 'lodash'

const MAPBOX_TOKEN = 'pk.eyJ1IjoiYnJ5YW4tYXQtbG9va2VyIiwiYSI6ImNqczZ0N2k2czBwdXM0NG1zejVpN3VpczgifQ.VCz4Heo3BVl1QvVxPUy10g'; // Set your mapbox token here
const COLORS = [
  {red: 255, green: 255, blue: 255},
  {red: 0, green: 0, blue: 255}
]
const FIELD_TARGET = 'ZCTA5CE10'

// Create (or import) our react component
export default function Map ({data, height, width, query_response, ...props}) {
  const [viewport, setViewport] = useState({
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8
  })

  useEffect(()=>{
    setViewport({...viewport, height, width})
  },[height, width])

  let first_turtle_data;
  let map_data;
  let data_bounds;
  let expression = ['match', ['get', FIELD_TARGET]];
  const first_turtle = firstZipTurtle(query_response)
  
  if (first_turtle) {
    first_turtle_data = data[0][first_turtle.name]
  }
  // if (first_turtle_data) {
  //   // console.log({do: data[0], first_turtle_data})
  //   data_bounds = bounds(first_turtle_data._parsed.values);
  //   map_data = first_turtle_data._parsed.keys.map((key, i)=>{
  //     const value = first_turtle_data._parsed.values[i]
  //     return {[FIELD_TARGET]: key, value, color: colorGradient(rangeFraction(data_bounds, value), COLOR1, COLOR2, COLOR3 )}
  //   })
  // }
  // console.log(map_data.length)

  if (first_turtle_data) {
    data_bounds = bounds(first_turtle_data._parsed.values);
    first_turtle_data._parsed.keys.forEach((key, i)=>{
      const value = first_turtle_data._parsed.values[i]
      expression.push(key, colorGradient(rangeFraction(data_bounds, value), COLORS[0], COLORS[1], COLORS[2]  ))
    })
  }
  expression.push(colorGradient(0, COLORS[0], COLORS[1], COLORS[2] ));


  const dataLayer = {
    id: 'zips',
    'source-layer': 'tl_2019_us_zcta510_no_keys',
    type: 'fill',
    paint: {
      'fill-color': expression,
      'fill-opacity': 0.8
    }
  }
  

  return  <ReactMapGL
    mapboxApiAccessToken={MAPBOX_TOKEN}
    {...viewport}
    onViewportChange={setViewport}
  >
    <Source id="zips" type="vector" url="mapbox://bryan-at-looker.46oczy87">
    <Layer {...dataLayer}
    />
    </Source>
  </ReactMapGL>
}



function firstZipTurtle(queryResponse) {
  if (queryResponse && queryResponse.fields && queryResponse.fields.measure_like) {
    return find(queryResponse.fields.measure_like, function(o) { return o.is_turtle && o.turtle_dimension.type === 'zipcode' })
  } else {
    return undefined
  }

}

function bounds(data) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min
  return {min, max, range}
}

function rangeFraction(bounds, value) {
  // console.log({bounds, value})
  return (value - bounds.min) / bounds.range;
}

function colorGradient(fadeFraction, rgbColor1, rgbColor2, rgbColor3) {
  var color1 = rgbColor1;
  var color2 = rgbColor2;
  var fade = fadeFraction;

  // Do we have 3 colors for the gradient? Need to adjust the params.
  if (rgbColor3) {
    fade = fade * 2;

    // Find which interval to use and adjust the fade percentage
    if (fade >= 1) {
      fade -= 1;
      color1 = rgbColor2;
      color2 = rgbColor3;
    }
  }

  var diffRed = color2.red - color1.red;
  var diffGreen = color2.green - color1.green;
  var diffBlue = color2.blue - color1.blue;

  var gradient = {
    red: parseInt(Math.floor(color1.red + (diffRed * fade)), 10),
    green: parseInt(Math.floor(color1.green + (diffGreen * fade)), 10),
    blue: parseInt(Math.floor(color1.blue + (diffBlue * fade)), 10),
  };

  return 'rgb(' + gradient.red + ',' + gradient.green + ',' + gradient.blue + ')';
}