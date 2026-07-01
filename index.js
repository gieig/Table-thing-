import express from 'express'
import {google} from 'googleapis'
import cors from 'cors'

const app = express();
app.use(cors())

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
    const spreadsheetId = "Insert Spreadsheet Id Here"
    const metaData = await googleSheets.spreadsheets.get({
        auth, 
        spreadsheetId,
    });


    //read rows from spreadsheet
    const getRows = await googleSheets.spreadsheets.values.get({
        auth, 
        spreadsheetId,
        range: "Events!A:F",
    });

    const eventData = getRows.data["values"]
      let nothingburger = "I exist for no purpose"
      let data = {} 
      let namesList = []
      for(const event of eventData){
        if(!event[5]){
          continue
        }
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
    res.json(data);

})

const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", (req, res) => {console.log(`running on ${port}`)})

