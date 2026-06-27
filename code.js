import express from 'express'
import {google} from 'googleapis'


const app = express();

app.get("/", async (req, res) => {
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json", 
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    //Creat client instance for auth
    const client = await auth.getClient();

    //instance of Google Sheets API

    const googleSheets = google.sheets({version: "v4", auth: client});

    //get metadata about spreadsheet
    const spreadsheetId = "1MeaF0CxySSChXY47_jx_-hMdvOLgwOIDSsO9eMIXrys"
    const metaData = await googleSheets.spreadsheets.get({
        auth, 
        spreadsheetId,
    });


    //read rows from spreadsheet
    const getRows = await googleSheets.spreadsheets.values.get({
        auth, 
        spreadsheetId,
        range: "2025-2026 Volunteer Log with hours for each correct (3).xlsx - 2025-2026.csv!A:F",
    });

    const eventData = getRows.data["values"]

      let data = {}
      let namesList = []
      for(const event of eventData){
        let names = event[5].split(",").map((x) => x.trim().replace("\r", ""))
        for(const name of names){
          if(!namesList.includes(name)){
            data[name.toUpperCase()] = {"name" : name, "events": []}
            namesList.push(name)
        }
        let e = {"eventName": `${event[0]}`, "date": `${event[1]}`, "hours": `${event[4]}`, "location": `${event[2]}`, "description": `${event[3]}`}
            data[name.toUpperCase()]["events"].push(e)
        }
      }
      const ALLDATA = JSON.stringify(data)
      //console.log(ALLDATA)


    //res.send(formatTable(data["CHENYU JIN"]));
    res.json(data)
    //res.render(HTML FILE LINK)
})

function formatTable(info){
    let totalHours = 0;
    let table = `<h3>Volunteer ${info["name"]}: </h3> <table> <tr><th>Event</th><th>Date</th><th>Location</th><th>Hours Volunteered</th></tr>`
    
    for(const event of info["events"]){
      table += `<tr><td>${event["eventName"]}</td><td>${event["date"]}</td><td>${event["location"]}</td><td>${event["hours"]}</td></tr>`
      totalHours += parseInt(event["hours"]);
    }
    table = table += `</table><h3>Total Hours: ${totalHours}</h3>`
    return table
  }

app.listen(1337, (req, res) => {console.log("running on 1337")})

