const { nanoid } = require("nanoid");

const express = require("express");

const notes = require("./queries");

const jwt = require("express-jwt");
// const jwtAuthz = require("express-jwt-authz");
const jwksRsa = require("jwks-rsa");

const cors = require("cors");

require("dotenv").config();
// const dotenv = require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

const checkJwt = jwt({
  // Dynamically provide a signing key
  // based on the kid in the header and
  // the signing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://dev-lx7faooj.us.auth0.com/.well-known/jwks.json`,
  }),

  // Validate the audience and the issuer.
  audience: "https://notesapp/api",
  issuer: `https://dev-lx7faooj.us.auth0.com/`,
  algorithms: ["RS256"],
});

app.use(cors());
app.use(express.json());
app.use("/api/notes", (req, res, next) => {
  if (isNaN(req.query.userid))
    return res.status(400).send({ message: "Invalid userid field" });
  if (!req.query.demo) return checkJwt(req, res, next);
  next();
});

app
  .route("/api/notes/")
  .post(async (req, res) => {
    const result = await notes.create(req.query.userid, {
      title: req.body.title,
      subheader: req.body.subheader,
      body: req.body.body,
      lastSaved: new Date().toUTCString(),
    });
    res.status(result.success ? 201 : 500);
    res.send(result);
  })
  .put(async (req, res) => {
    const result = await notes.update(req.body);
    let status;
    if (!result.success && result.message === "resource does not exist")
      status = 404;
    else if (!result.success) status = 500;
    else status = 200;
    res.status(status);
    res.send(result);
  })
  .delete(async (req, res) => {
    if (isNaN(req.query.noteid))
      return res.status(400).send({ message: "Invalid noteid field" });
    const result = await notes.delete(req.query.noteid);
    res.status(result.success ? 204 : 500).send();
  })
  .get(async (req, res) => {
    const result = await notes.fetch(
      req.query.userid,
      req.query.offset ?? 0,
      req.query.limit ?? 20,
      req.query.noteid ?? null
    );
    let status;
    if (!result.success && result.message === "resource not found")
      status = 404;
    else if (!result.success) status = 500;
    else status = 200;
    res.status(status).send(result);
  });

app.get("/api/userid", checkJwt, async (req, res) => {
  const result = await notes.getUserid(req.query.email);
  res.status(result.success ? 200 : 500);
  res.send(`${result.userid}`);
});

app
  .route("/api/demoID")
  .get(async (req, res) => {
    const demoID = `DEMO${nanoid()}`;
    const result = await notes.getUserid(demoID);
    res.status(result.success ? 200 : 500);
    res.send(`${result.userid}`);
  })
  .delete(async (req, res) => {
    const result = await notes.clearDemoUser(req.query.userid);
    let status;
    if (!result.success && result.message === "resource not found")
      status = 404;
    else if (!result.success) status = 500;
    else status = 204;
    res.status(status).send();
  });

app.listen(port, () => {
  console.log(`Notes App listening at http://localhost:${port} 🚀!`);
});
