const axios = require("axios");
const api_domain = "https://soccer.sportmonks.com/api/v2.0";
const teams_utils = require("./teams_utils");

async function getCoachDetailsById(coachId){
    const coach = await axios.get(
      `${api_domain}/coaches/${coachId}`,
      {
        params: {
          api_token: process.env.api_token
        },
      }
    );
    const team_name= await teams_utils.getTeamNameByID(coach.data.data.team_id);
    return {
      coach_full_name: coach.data.data.fullname,
      coach_team:team_name,
      coach_image: coach.data.data.image_path,
      coach_common_name:coach.data.data.common_name,
      coach_nationality:coach.data.data.nationality,
      coach_birthdate:coach.data.data.birthdate,
    };
  }

async function getCoachIdByTeam(team_id) {
    const team = await axios.get(`${api_domain}/teams/${team_id}`,{
        params: {
            include: "coach",
            api_token: process.env.api_token,
        },
    });
    let coach = await getCoachDetailsById(team.data.data.coach.data.coach_id)
    return coach;
}

exports.getCoachIdByTeam = getCoachIdByTeam;    
exports.getCoachDetailsById = getCoachDetailsById;