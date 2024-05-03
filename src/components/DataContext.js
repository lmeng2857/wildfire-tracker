import wildfireURL from "../api/locations";
import { useState, useEffect, createContext } from "react";

const DataContext = createContext({});
export const DataProvider = ({ children }) => {
  const [fireLocations, setFireLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  let locations = [];

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await wildfireURL.get();
        const locationsInf = await response.data.events;

        locationsInf.map((item) => {
          let addedLocation = {};
          // console.log(item.title);
          addedLocation["coordinates"] = item.geometry[0].coordinates;
          addedLocation["id"] = item.id;
          addedLocation["date"] = item.geometry[0].date;
          addedLocation["title"] = item.title;

          locations = [...locations, addedLocation];
        });
        setFireLocations(locations);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLocations();
  }, []);
  return (
    <DataContext.Provider value={{ fireLocations, isLoading, setIsLoading }}>
      {children}
    </DataContext.Provider>
  );
};
export default DataContext;
