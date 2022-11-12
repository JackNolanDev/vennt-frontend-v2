import axios from "axios";

const url =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000" // local server
    : "https://quiet-eyrie-60149.herokuapp.com"; // heroku deployment of backend

const instance = axios.create({
  baseURL: url,
});

instance.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";
instance.defaults.withCredentials = true; // send session cookie

export default instance;
