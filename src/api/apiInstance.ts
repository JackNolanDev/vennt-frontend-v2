import axios from "axios";
import { BASE_HTTP_URL } from "./utils";

const instance = axios.create({
  baseURL: BASE_HTTP_URL,
});

instance.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

export default instance;
