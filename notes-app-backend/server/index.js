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
  console.log("checking");
  if (!req.query.demo) return checkJwt(req, res, next);
  next();
});

app
  .route("/api/notes/")
  .post(async (req, res) => {
    console.log(req.body);
    const result = await notes.create(req.query.userid, {
      title: req.body.title,
      subheader: req.body.subheader,
      body: req.body.body,
      lastSaved: new Date().toUTCString(),
    });
    res.send(result);
  })
  .put(async (req, res) => {
    console.log("putting", req.body);
    const result = await notes.update(req.body);
    res.send(result);
  })
  .delete(async (req, res) => {
    console.log("req", req.query.noteid);
    const result = await notes.delete(req.query.noteid);
    res.send(result);
  })
  .get(async (req, res) => {
    console.log("\x1b[44m", `OFFSET ${req.query.offset}`, "\x1b[0m");
    const result = await notes.fetch(
      req.query.userid,
      req.query.offset ?? 0,
      req.query.noteid ?? null
    );
    res.send(result);
  });

app.get("/api/userid", checkJwt, async (req, res) => {
  const userid = (await notes.getUser(req.query.email)).user.userid;
  console.log(userid);
  res.send(`${userid}`);
});

app.get("/api/demoID", async (req, res) => {
  const demoID = `DEMO${nanoid()}`;
  const userid = (await notes.getUser(demoID)).user.userid;
  console.log(userid);
  res.send(`${userid}`);
});

app.delete("/api/demoID", (req, res) => {
  notes.clearDemoUser(req.query.userid);
  console.log("DELETING USER", req.query.userid);
  res.send("complete");
});

app.listen(port, () => {
  console.log(`Notes App listening at http://localhost:${port}`);
});
