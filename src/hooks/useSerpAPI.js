

const { getJson } = require("serpapi");

export const fetchTeamByName = async (name) => {
  const url = process.env.REACT_APP_SERP_URL;
  const params = new URLSearchParams({
    q: name,
    location: 'austin, texas, united states',
    api_key: process.env.REACT_APP_SERP_KEY
  });

  try {
    console.log('fetching: ', `${url}?${params}`);
    const response = await fetch(`${url}?${params}`);
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.log('error: ', error);
    return {
      statusCode: 500,
      body: 'Error fetching data',
    };
  }
};