import axios from "axios";

// This generally works as a work around for cors and is therefore insecure.
// DO NOT PASS ANY USER INFORMATION THROUGH THIS PROXY
// See https://allorigins.win/ for more info

const instance = axios.create({
  baseURL: "https://api.allorigins.win",
});

instance.defaults.headers.common["Content-Type"] =
  "application/x-www-form-urlencoded";
instance.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

export default instance;
