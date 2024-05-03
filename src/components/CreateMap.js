import React, { useContext, useEffect, useState } from "react";
import DataContext from "./DataContext";

import { Map, View, Feature, Overlay } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM, Vector as VectorSource } from "ol/source";
import VectorLayer from "ol/layer/Vector";
import Style from "ol/style/Style";
import sign from "../asserts/location-sign-svgrepo-com.svg";
import Icon from "ol/style/Icon";
import { Point } from "ol/geom";
import { fromLonLat, toLonLat } from "ol/proj";
import { toStringHDMS } from "ol/coordinate";
import "./CreateMap.css";

const CreateMap = () => {
  const { fireLocations, isLoading, setIsLoading } = useContext(DataContext);
  const locations = fireLocations;
  const [locationInfo, setLocalInfo] = useState([]);

  ////////// to get the feature array: markfeatures
  let featuresToAdd = [];
  // locations && console.log(locations[0]);
  locations &&
    locations.map((location) => {
      // console.log(Object.values(location)[0]);
      const singleFeature = new Feature({
        geometry: new Point(
          fromLonLat(Object.values(location)[0], "EPSG:3857")
        ),
        date: location.date,
        title: location.title,
      });

      featuresToAdd = [...featuresToAdd, singleFeature];
    });

  useEffect(() => {
    // console.log("to build map");
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

      console.log("to build markers");
      /// setup to-be-added layers
      const marker = new VectorLayer({
        source: new VectorSource({
          features: featuresToAdd,
        }),
        style: new Style({
          image: new Icon({
            color: "red",
            crossOrigin: "anonymous",
            src: sign,
            scale: 0.08,
          }),
        }),
      });

      /// to add layers
      map.addLayer(marker);
      // console.log("added");
      setIsLoading(false);

      map.on("click", (e) => {
        const feas = map.forEachFeatureAtPixel(e.pixel, (feature) => feature);
        let infor = {};
        infor["coordinate"] = toStringHDMS(toLonLat(e.coordinate));
        if (feas) {
          infor["title"] = feas.get("title");
          infor["date"] = feas.get("date");
        }
        setLocalInfo(infor);
      });
    };
    locations[0] && addMarker();
  }, [fireLocations]);

  return (
    <>
      <div className="map" id="map" style={{ width: "100vw", height: "100vh" }}>
        {isLoading && <h1>Fetching Data...</h1>}
      </div>
      {locationInfo.coordinate && (
        <div className="location_info">
          <h3>{locationInfo.coordinate}</h3>
          <h3>{locationInfo.title}</h3>
          <h3>{locationInfo.date}</h3>
        </div>
      )}
    </>
  );
};

export default CreateMap;
