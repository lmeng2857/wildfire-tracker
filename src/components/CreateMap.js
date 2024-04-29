import React, { useContext, useEffect } from "react";
import DataContext from "./DataContext";

import { Map, View, Feature } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM, Vector as VectorSource } from "ol/source";
import VectorLayer from "ol/layer/Vector";
import Style from "ol/style/Style";
import sign from "../asserts/location-sign-svgrepo-com.svg";
import Icon from "ol/style/Icon";
import { Point } from "ol/geom";
import { fromLonLat } from "ol/proj";

const CreateMap = () => {
  const { fireLocations, isLoading, setIsLoading } = useContext(DataContext);
  const locations = fireLocations;

  ////////// to get the feature array: markfeatures
  let featuresToAdd = [];
  locations &&
    locations.map((location) => {
      const singleFeature = new Feature({
        geometry: new Point(
          fromLonLat(Object.values(location)[0], "EPSG:3857")
        ),
      });
      featuresToAdd = [...featuresToAdd, singleFeature];
    });

  useEffect(() => {
    const addMarker = () => {
      /// initial original map //////////
      const mapView = new View({
        center: [0, 0],
        zoom: 2,
      });
      const mapTarget = "map";
      const mapIniLayers = [new TileLayer({ source: new OSM() })];
      const map = new Map({
        target: mapTarget,
        view: mapView,
        layers: mapIniLayers,
      });

      /// setup to-be-added layers
      const marker = new VectorLayer({
        source: new VectorSource({
          features: featuresToAdd,
        }),
        style: new Style({
          image: new Icon({
            src: sign,
            scale: 0.03,
          }),
        }),
      });

      /// to add layers
      map.addLayer(marker);
      setIsLoading(false);
    };

    locations[0] && addMarker();
  }, [fireLocations]);

  return (
    <div id="map" style={{ width: "100vw", height: "100vh" }}>
      {isLoading && <h1>Is Loading</h1>}
    </div>
  );
};

export default CreateMap;
