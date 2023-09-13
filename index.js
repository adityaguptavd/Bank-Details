import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const base_url = "https://bank-apis.justinclicks.com/API/V1/";
app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
    if(req.body.searchBy=="ifsc")
    {
        req.body.IFSC_Code = req.body.IFSC_Code.toUpperCase();
        try{
            req.result = await axios.get(base_url + "IFSC/" + req.body.IFSC_Code);
            console.log(req.result.data);
        }
        catch(error)
        {
            req.result = {data : 404};
            console.log(error);
        }
    }
    else if(req.body.searchBy == "location")
    {
        try{
            const url = base_url + `STATE/${req.body.state}/${req.body.district}/${req.body.city}/${req.body.center}/${req.body.branch}.json`;
            req.result = await axios.get(url);
        }
        catch(error)
        {
            req.result = {data : 404};
            console.log(error);
        }
    }
    next();
});

app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.post("/fetch", (req, res) => {
    res.render("index.ejs", {data : req.result.data});
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});