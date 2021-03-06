const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const LEAGUE_ID = 271;
const STAGE_ID = 77453565;

/**
 * This function gets the league details
 */
async function getLeagueDetails() {
  try{
    const league = await axios.get(`${api_domain}/leagues/${LEAGUE_ID}`,
    {
      params: {
        include: "season",
        api_token: process.env.api_token,
      },
    }
  );
  let stage;
  if (league.data.data.current_stage_id != null){
    stage = await axios.get(`${api_domain}/stages/${league.data.data.current_stage_id}`,
      {
        params: {
          api_token: process.env.api_token,
        },
      }
    );
  }
  else{
  stage = await axios.get(`${api_domain}/stages/${STAGE_ID}`,
      {
        params: {
          api_token: process.env.api_token,
        },
      }
    );
  }
  let allTeamsInLeague = [];
  let season_id = league.data.data.season.data.id;
  let teamsFromAPI = await axios.get(`${api_domain}/teams/season/${season_id}`,
  {
    params: {
      api_token: process.env.api_token,
    },
  });
  if(teamsFromAPI){
    teamsFromAPI.data.data.map((team_info)=>{
        allTeamsInLeague.push(team_info.name);
      });
    }
  return {
    league_name: league.data.data.name,
    current_season_name: league.data.data.season.data.name,
    current_stage_name: stage.data.data.name,
    all_teams: allTeamsInLeague
    // next game details should come from DB
  };
  }
  catch{
    return "something went wrong with league details"
  }

}
exports.getLeagueDetails = getLeagueDetails;
