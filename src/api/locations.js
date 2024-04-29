import axios from "axios";

export default axios.create({
  baseURL: "https://eonet.gsfc.nasa.gov/api/v3/events?category=wildfires",
});
