/**
 *
 * Map
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import _ from 'lodash';

import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import MapSelect from './mapSelect';
import { townArray } from './townConstants';
import CityInfo from './cityInfo';
import CityPin from './cityPin';

// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

/* eslint-disable react/prefer-stateless-function */
class Map extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      viewport: {
        width: 400,
        height: 400,
        latitude: 40.4406,
        longitude: -79.9659,
        zoom: 8,
      },
      selectedTown: 'Pittsburgh',
      popupInfo: null,
    };
  }

  handleSelection(event) {
    const oldView = _.clone(this.state.viewport);
    const place = event.target.value;
    const { latitude, longitude } = _.find(townArray, { place });
    const newView = _.assign({}, oldView, {
      zoom: 12,
      latitude,
      longitude,
    });

    this.setState({
      viewport: newView,
      selectedTown: place,
    });
  }

  renderCityMarker = (city, index) => (
    <Marker
      key={`marker-${index}`}
      longitude={city.longitude}
      latitude={city.latitude}
    >
      <CityPin
        size={20}
        onClick={() => this.setState({ popupInfo: city })}
        // onClick={() =>
        //   console.log(
        //     'I should link to a specific view page for this site!',
        //     `maybe use a slug of my latitude: ${city.latitude} and longitude: ${
        //       city.longitude
        //     }?`,
        //   )
        // }
      />
    </Marker>
  );

  renderPopup() {
    const { popupInfo } = this.state;

    return (
      popupInfo && (
        <Popup
          tipSize={5}
          anchor="top"
          longitude={popupInfo.longitude}
          latitude={popupInfo.latitude}
          closeOnClick={false}
          onClose={() => this.setState({ popupInfo: null })}
        >
          <CityInfo info={popupInfo} />
        </Popup>
      )
    );
  }

  render() {
    return (
      <div>
        <ReactMapGL
          {...this.state.viewport}
          onViewportChange={viewport => this.setState({ viewport })}
          mapboxApiAccessToken="pk.eyJ1IjoiaHlwZXJmbHVpZCIsImEiOiJjaWpra3Q0MnIwMzRhdGZtNXAwMzRmNXhvIn0.tZzUmF9nGk2h28zx6PM13w"
        >
          {townArray.map(this.renderCityMarker)}

          {this.renderPopup()}
        </ReactMapGL>
        <MapSelect
          townArray={townArray}
          selectedTown={this.state.selectedTown}
          handleChange={e => this.handleSelection(e)}
        />
      </div>
    );
  }
}

Map.propTypes = {};

export default memo(Map);
