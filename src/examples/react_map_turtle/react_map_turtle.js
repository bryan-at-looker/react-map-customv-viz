import Map from './Map'
import React from 'react'
import ReactDOM from 'react-dom'

looker.plugins.visualizations.add({
  options: {

  },
  // Set up the initial state of the visualization
  create: function(element, config) {

    // Insert a <style> tag with some styles we'll use later.
    element.innerHTML = `
      <style>
        .hello-world-vis {
          /* Vertical centering */
          height: 100%;
          width: 100%;
          margin: 0 !important;
          display: flex;
          flex-direction: column;
          justify-content: center;
          text-align: center;
        }
      </style>
    `;

    // Create a container element to let us center the text.
    this._vis_element = document.getElementById('vis')
    // let container = element.appendChild(document.createElement("div"));
    this._vis_element.className = "hello-world-vis";

    // // Render to the target element
    // this.chart = ReactDOM.render(
    //   <></>,
    //   this._textElement
    // );

  },
  // Render in response to the data or settings changing
  updateAsync: function(data, element, config, queryResponse, details, done) {
    // console.log({data, element, config, queryResponse, details, done})
    // Clear any errors from previous updates
    this.clearErrors();

    // Throw some errors and exit if the shape of the data isn't what this chart needs
    if (queryResponse.fields.measure_like.length == 0) {
      this.addError({title: "No Dimensions", message: "This chart requires a measure."});
      return;
    }

    const offset_props = {
      height: this._vis_element.offsetHeight, 
      width: this._vis_element.offsetWidth
    }

    // Finally update the state with our new data
    this.chart = ReactDOM.render(
      <Map 
        data={data}
        query_response={queryResponse}
        {...offset_props}
      />,
      this._vis_element
    );

    // We are done rendering! Let Looker know.
    done()
  }
});