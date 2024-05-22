import axios from "axios";

const axiosImgBB = axios.create({
  baseURL: "https://api.imgbb.com/1",
  timeout: 5000,
});

export default axiosImgBB;
