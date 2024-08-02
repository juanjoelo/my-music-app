const express = require("express");
const querystring = require("querystring");
const cors = require("cors");
const axios = require("axios");
const spotifyWebApi = require("spotify-web-api-node");

const app = express();
const port = 8888;

app.use(cors());

const clientId = "1ae7dd304a204190b77add1d712829f7";
const clientSecret = "e03863af9f4d4a95842f65b2ebf8c4b6";
const redirectUri = "http://localhost:3000/callback";

const spotifyApi = new spotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret,
  redirectUri: redirectUri,
});

app.get("/login", (req, res) => {
  const scopes = [
    "user-read-private",
    "user-read-email",
    "playlist-read-private",
    "playlist-read-collaborative",
  ];
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: clientId,
        scope: scopes.join(" "),
        redirect_uri: redirectUri,
      })
  );
});

app.get("/callback", async (req, res) => {
  const code = req.query.code || null;

  try {
    const response = await axios({
      method: "post",
      url: "https://accounts.spotify.com/api/token",
      data: querystring.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirectUri,
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(clientId + ":" + clientSecret).toString("base64"),
      },
    });

    const { access_token, refresh_token } = response.data;
    res.redirect(
      `http://localhost:3000?access_token=${access_token}&refresh_token=${refresh_token}`
    );
  } catch (error) {
    res.redirect("/#/error/invalid token");
  }
});

app.get("/refresh_token", async (req, res) => {
  const { refresh_token } = req.query;

  try {
    const response = await axios({
      method: "post",
      url: "https://accounts.spotify.com/api/token",
      data: querystring.stringify({
        grant_type: "refresh_token",
        refresh_token: refresh_token,
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(clientId + ":" + clientSecret).toString("base64"),
      },
    });

    res.send({
      access_token: response.data.access_token,
    });
  } catch (error) {
    res.status(400).send({
      error: "Could not refresh token",
    });
  }
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
