var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const players_utils = require("./utils/players_utils");
const teams_utils = require("./utils/teams_utils");
const coach_utils = require("./utils/coach_utils");
const matches_utils = require("./utils/matches_utils");


//should be continued
router.get("/teamFullDetails/:teamId", async (req, res, next) => {
  let results = [];
  try {
    const teamsInfo = await teams_utils.getInfoOfTeam(req.params.teamId);
    const teamName = teamsInfo.team_name;
    console.log(teamName);
    const teamLogo = teamsInfo.team_logo;
    const team_details = await players_utils.getPlayersByTeam(req.params.teamId);
    console.log(team_details);
    const coach_id = await teams_utils.getCoachByTeam(req.params.teamId);
    const coach_details = await coach_utils.getCoachDetailsById(coach_id.data.coach_id);
    const past_matches = await matches_utils.getPastMatchesByTeam(req.params.teamId);
    console.log(past_matches);
    const future_matches = await matches_utils.getFutureMatchesByTeam(req.params.teamId);
    console.log(future_matches);
    //insert to results
    results.push(teamName);
    results.push(teamLogo);
    results.push(team_details);
    results.push(coach_details);
    results.push(past_matches);
    results.push(future_matches);
    res.send(results);
  } catch (error){
    next(error);
  }
});

module.exports = router;
