const e = require("express");
var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const matches_utils = require("./utils/matches_utils");
const referees_utils = require("./utils/referees_utils");
const users_utils = require("./utils/users_utils");
const axios = require("axios");


/**
 * This path return all the  past matchs
 */
 router.get("/getPastMatches", async (req, res, next) => {
  try {
    const matches = await matches_utils.getPastGames();
    res.send(matches);
  } catch (error) {
    next(error);
  }
});
/**
 * This path return all the  future matchs
 */
router.get("/getFutureMatches", async (req, res, next) => {
  try {
    const matches = await matches_utils.getFutureGames();
    res.send(matches);
  } catch (error) {
    next(error);
  }
});

/**
 * Authenticate all incoming requests by middleware
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.username) {
    DButils.execQuery("SELECT username FROM dbo.Users")
      .then((users) => {
        if (users.find((x) => x.username === req.session.username)) {
          req.username = req.session.username;
          next();
        }
      })
      .catch((err) => next(err));
  } else {
    res.sendStatus(401);
  }
});

/**
 * This path add a match to MATCHES table by body params
 */
router.post("/addMatch", async (req, res, next) => {
  try {
    if(req.session.username!=="admin")
    throw { status: 401, message: "not admin, action not allowed" };
    //check if matchID already exist
    const matches = await matches_utils.getMatches();
        if (matches && matches.find((x) => x.match_id === req.body.match_id))
            throw { status: 409, message: "match_id taken" };

    const referee_exist = await referees_utils.checkIfRefereeExist(req.body.referee_id);
    if (!referee_exist)
      throw { status: 409, message: "add a non existing referee to match its impossible" };
    
    if (req.body.home_team ===req.body.away_team)
      throw { status: 409, message: "team cannot play against herself" };
    const match_id = req.body.match_id;
    const match_date = req.body.match_date;
    const match_hour = req.body.match_hour;
    const home_team = req.body.home_team;
    const away_team = req.body.away_team;
    const referee_id = req.body.referee_id;
    const stadium = req.body.stadium;
    await matches_utils.addMatch(match_id,match_date,match_hour,home_team,away_team,referee_id,stadium);
    res.status(201).send("The Match successfully added");
  } catch (error) {
    next(error);
  }
});

/**
 * This path add a result to a match by body params
 */
router.post("/addResult", async (req, res, next) => {
  try {
    if(req.session.username!=="admin")
    throw { status: 401, message: "not admin, action not allowed" };
    const match_exist = await matches_utils.checkIfMatchExist(req.body.match_id);
    if (!match_exist)
      throw { status: 409, message: "add result to a non existing match its impossible" };
    const result = await matches_utils.getResultById(req.body.match_id);
        if (result[0].result==null){
          await matches_utils.addResult(req.body.match_id,req.body.match_result);
          res.status(201).send("result successfully updateded");
        }
        else{
          throw { status: 409, message: "match already has a result" };
        } 
  } catch (error) {
    next(error);
  }
});

/**
 * This path add an event calendar to a match by body params
 */
router.post("/addEventCalendar", async (req, res, next) => {
  try {
    if(req.session.username!=="admin")
    throw { status: 401, message: "not admin, action not allowed" };
    const event_exist = await matches_utils.checkIfEventExist(req.body.event_id);
    if (event_exist)
      throw { status: 409, message: "event_id is taken"};
    const match_exist = await matches_utils.checkIfMatchExist(req.body.match_id);
    if (!match_exist)
      throw { status: 409, message: "add event to a non existing match is impossible" };
    const match_id = req.body.match_id;
    const event_id = req.body.event_id;
    const event_date = req.body.event_date;
    const event_hour = req.body.event_hour;
    const event_minute = req.body.event_minute;
    const event_description = req.body.event_description;
    await matches_utils.addEventCalendar(event_id,event_date,event_hour,event_minute,event_description,match_id);
    res.status(201).send("event successfully updateded");
  } catch (error) {
    next(error);
  }
});

/**
 * This path return all the matchs in the system
 */
//WORKS GOOD
router.get("/getAllMatches", async (req, res, next) => {
  try {
    const matches = await matches_utils.getAllMatches();
    res.send(matches);
  } catch (error) {
    next(error);
  }
});

/**
 * This path return all the matchs in the system sort by date
 */
router.get("/getAllMatchesSortByDate", async (req, res, next) => {
  try {
    const matches = await matches_utils.getAllMatchesSortByDate();
    res.send(matches);
  } catch (error) {
    next(error);
  }
});

/**
 * This path return all the matchs in the system sort by team
 */
router.get("/getAllMatchesSortByTeam", async (req, res, next) => {
  try {
    const matches = await matches_utils.getAllMatchesSortByTeam();
    res.send(matches);
  } catch (error) {
    next(error);
  }
});



module.exports = router;

