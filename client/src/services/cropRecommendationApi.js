// import axios from "axios";

// // Separate axios instance from services/api.js — this talks to the
// // standalone FastAPI crop recommendation service (port 8001 by
// // default), not the Node/Express backend. No cookies are needed here;
// // this service has no auth of its own.
// const cropApi = axios.create({
//   baseURL: import.meta.env.VITE_CROP_API_URL || "http://localhost:8001/api",
//   headers: { "Content-Type": "application/json" },
// });

// // FastAPI error bodies look like { detail: "..." } (or a list of
// // validation errors), not { message, code } like the Node backend.
// // Normalize both shapes so components only ever read err.message.
// cropApi.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const detail = error.response?.data?.detail;
//     let message = "Something went wrong talking to the recommendation service.";

//     if (typeof detail === "string") {
//       message = detail;
//     } else if (Array.isArray(detail) && detail.length > 0) {
//       // Pydantic validation error array: [{ loc, msg, type }, ...]
//       message = detail.map((d) => d.msg).join("; ");
//     } else if (error.code === "ECONNABORTED") {
//       message = "The request took too long. Please try again.";
//     } else if (!error.response) {
//       message =
//         "Could not reach the recommendation service. Is it running on port 8001?";
//     }

//     return Promise.reject({
//       message,
//       statusCode: error.response?.status,
//     });
//   }
// );

// /**
//  * Run the ML model: N, P, K, temperature, humidity, ph, rainfall -> ranked crops.
//  */
// export const predictCrops = (features) =>
//   cropApi.post("/predict", features).then((res) => res.data);

// /**
//  * Given browser geolocation coordinates, fetch temperature/humidity/
//  * rainfall for that spot.
//  */
// export const fetchWeather = (lat, lon) =>
//   cropApi.get("/weather", { params: { lat, lon } }).then((res) => res.data);

// /**
//  * Upload a soil report (image or PDF) and get back N, P, K, ph (and
//  * temperature/humidity/rainfall if the report happens to print them).
//  */
// export const extractSoilReport = (file) => {
//   const formData = new FormData();
//   formData.append("file", file);
//   return cropApi
//     .post("/soil-report/extract", formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//       timeout: 60000, // Gemini vision calls can take a little longer
//     })
//     .then((res) => res.data);
// };

// /**
//  * Get a full growing guide for one crop (season, steps, pesticides, etc).
//  */
// export const getCropInfo = (crop, language = "English") =>
//   cropApi
//     .post("/crop-info", { crop, language }, { timeout: 45000 })
//     .then((res) => res.data);

// export default cropApi;

import axios from "axios";

// Separate axios instance from services/api.js — this talks to the
// standalone FastAPI crop recommendation + disease detection service
// (port 8001 by default), not the Node/Express backend. No cookies
// are needed here; this service has no auth of its own.
const cropApi = axios.create({
  baseURL: import.meta.env.VITE_CROP_API_URL || "http://localhost:8001/api",
  headers: { "Content-Type": "application/json" },
});

// FastAPI error bodies look like { detail: "..." } (or a list of
// validation errors), not { message, code } like the Node backend.
// Normalize both shapes so components only ever read err.message.
cropApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const detail = error.response?.data?.detail;
    let message = "Something went wrong talking to the AI service.";

    if (typeof detail === "string") {
      message = detail;
    } else if (Array.isArray(detail) && detail.length > 0) {
      // Pydantic validation error array: [{ loc, msg, type }, ...]
      message = detail.map((d) => d.msg).join("; ");
    } else if (error.code === "ECONNABORTED") {
      message = "The request took too long. Please try again.";
    } else if (!error.response) {
      message =
        "Could not reach the AI service. Is it running on port 8001?";
    }

    return Promise.reject({
      message,
      statusCode: error.response?.status,
    });
  }
);

// ---------------- Crop recommendation ----------------

/**
 * Run the crop ML model: N, P, K, temperature, humidity, ph, rainfall -> ranked crops.
 */
export const predictCrops = (features) =>
  cropApi.post("/predict", features).then((res) => res.data);

/**
 * Given browser geolocation coordinates, fetch temperature/humidity/
 * rainfall for that spot.
 */
export const fetchWeather = (lat, lon) =>
  cropApi.get("/weather", { params: { lat, lon } }).then((res) => res.data);

/**
 * Upload a soil report (image or PDF) and get back N, P, K, ph (and
 * temperature/humidity/rainfall if the report happens to print them).
 */
export const extractSoilReport = (file) => {
  const formData = new FormData();
  formData.append("file", file);
  return cropApi
    .post("/soil-report/extract", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 60000, // Gemini vision calls can take a little longer
    })
    .then((res) => res.data);
};

/**
 * Get a full growing guide for one crop (season, steps, pesticides, etc).
 */
export const getCropInfo = (crop, language = "English") =>
  cropApi
    .post("/crop-info", { crop, language }, { timeout: 45000 })
    .then((res) => res.data);

// ---------------- Disease detection ----------------

/**
 * Upload a leaf photo (File or Blob, e.g. from a camera capture) and
 * get back the top disease matches with confidence + baseline remedy
 * info (appearance, cause, recommended solution, precautions).
 */
export const predictDisease = (imageFileOrBlob) => {
  const formData = new FormData();
  // Blobs from canvas.toBlob() have no filename — give them one so
  // the backend's content-type sniffing / multipart parsing behaves.
  formData.append("file", imageFileOrBlob, imageFileOrBlob.name || "leaf.jpg");
  return cropApi
    .post("/disease/predict", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 45000,
    })
    .then((res) => res.data);
};

/**
 * Get a deeper, Gemini-generated treatment plan for a diagnosed
 * disease: organic + chemical options, application tips, prevention
 * schedule. class_key comes from a predictDisease() result.
 */
export const getDiseaseTreatmentPlan = (classKey, language = "English") =>
  cropApi
    .post(
      "/disease/treatment-plan",
      { class_key: classKey, language },
      { timeout: 45000 }
    )
    .then((res) => res.data);

export default cropApi;

