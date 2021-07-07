const fetch = require("node-fetch");

module.exports.covidData = async (country) => {
  const url = "https://covid19.mathdro.id/api/countries/" + country;
  try {
    let res = await fetch(url);
    let res_json = await res.json();

    let data = {
      country: country,
      confirmed: res_json.confirmed.value,
      recovered: res_json.recovered.value,
      deaths: res_json.deaths.value,
      lastUpdate: res_json.lastUpdate,
    };
    return data;
  } catch {
    return "country not found";
  }
};

module.exports.memeLink = async () => {
  const url = "https://meme-api.herokuapp.com/gimme";
  try {
    let res = await fetch(url);
    let res_json = await res.json();
    return res_json.url;
  } catch {
    return "something went wrong";
  }
};
