const express = require("express");
const cors = require("cors")
require("./db/config");
const path = require("path")
const User = require("./db/User");
const City = require("./db/City");
const Flight = require("./db/Flight")
const app = express();

app.use(express.json());
const corsConfig = {
    origin: "",
    methods: ["POST", "GET", "DELETE", "PUT"],
    credentials: true
}
app.options("", cors(corsConfig))
app.use(cors(corsConfig));

app.post("/signup", async (req, resp) => {
    let user = new User(req.body);
    let result = await user.save();
    result = result.toObject();
    delete result.password
    resp.send(result)
})

app.post("/login", async (req, resp) => {
    if (req.body.password && req.body.email) {
        let user = await User.findOne(req.body).select("-password"); //-password bcz we dont need password to send it back
        if (user) {
            resp.send(user)
        }
        else {
            resp.send({ result: "No User Found" })
        }
    }
    else {
        resp.send({ result: "No User Found" })
    }
})


app.post("/add-city", async (req, resp) => {
    let city = new City(req.body);
    let result = await city.save();
    resp.send(result);
})

app.get("/cities", async (req, resp) => {
    const cities = await City.find();
    if (cities.length > 0) {
        resp.send(cities)
    }
    else {
        resp.send({ result: "No cities found" })
    }
})

app.delete("/city/:id", async (req, resp) => {
    let result = await City.deleteOne({ _id: req.params.id });
    resp.send(result);
})

app.get("/city/:id", async (req, resp) => {
    let result = await City.findOne({ _id: req.params.id })
    if (result) {
        resp.send(result)
    }
    else {
        resp.send({ result: "No City Found" })
    }
})

app.put("/city/:id", async (req, resp) => {
    let result = await City.updateOne(   /* it has two parameters */
        { _id: req.params.id },  /* on which behalf we update the data */
        { $set: req.body }      /* and what we want to update is in the second object */
    )
    resp.send(result)
})

app.get("/search/:key", async (req, resp) => {
    let result = await City.find({
        "$or": [
            {
                // name: { $regex: req.params.key } simple search
                name: { $regex: new RegExp(req.params.key, 'i') } //to remove case sensitivity
            },
            // {
            //     name: { $regex: req.params.key }  //for multiple fields search
            // },
        ]
    });
    resp.send(result)
})


app.post("/add-flight", async (req, resp) => {
    let flight = new Flight(req.body);
    let result = await flight.save();
    resp.send(result);
})

app.get("/flights", async (req, resp) => {
    const flights = await Flight.find();
    if (flights.length > 0) {
        resp.send(flights)
    }
    else {
        resp.send({ result: "No flights found" })
    }
})

app.delete("/flight/:id", async (req, resp) => {
    let result = await Flight.deleteOne({ _id: req.params.id });
    resp.send(result);
})

app.get("/search-flight/:key", async (req, resp) => {
    let result = await Flight.find({
        "$or": [
            {
                // name: { $regex: req.params.key } simple search
                origin: { $regex: new RegExp(req.params.key, 'i') } //to remove case sensitivity
            },
            {
                destination: { $regex: new RegExp(req.params.key, 'i') }
            }
        ]
    });
    resp.send(result)
})

app.put("/flight/:id", async (req, resp) => {
    let result = await Flight.updateOne(   /* it has two parameters */
        { _id: req.params.id },  /* on which behalf we update the data */
        { $set: req.body }      /* and what we want to update is in the second object */
    )
    resp.send(result)
})

app.get("/", (req, resp) => {
    app.use(express.static(path.resolve(__dirname, "frontend", "build")));
    resp.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
})

app.listen(5000);
