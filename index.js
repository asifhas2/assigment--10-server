const express = require("express");
const cors = require("cors");
// require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://Assignments-10:7ZokLZl8EGljv7Dt@cluster0.etvdx8p.mongodb.net/?appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send(" server is running");
});

async function run() {
  try {
    await client.connect();

    const db = client.db("Assignments-10");
    const carCollection = db.collection("cars");
    const newestCarCollection = db.collection("newestCars");
    const addCarCollection = db.collection("addCar");
    const bookingCollection=db.collection("bookings");

    app.get("/cars", async (req, res) => {
      const result = await carCollection
        .find()
        .limit(6)
        .toArray();
      console.log(result);
      res.send(result);
    });

    app.post("/cars", async (req, res) => {
      const newCar = req.body;
      const result = await carCollection.insertOne(newCar);
      res.send(result);
    });

    app.get("/cars/:id", async (req, res) => {
  try {
    const id = req.params.id;


    const car = await carCollection.findOne({
      _id: id,
    });
    res.send(car);

  } catch (error) {
    res.status(500).send({
      message: "Server error",
      error: error.message,
    });
  }
});

    //  newest cars serverApi
    app.get("/topCars", async (req, res) => {
      const result = await carCollection
        .find()
        .sort({ _id: -1 })
        .limit(3)
        .toArray();
      console.log(result);
      res.send(result);
    });

    // add car serverApi

    app.post("/addCar", async (req, res) => {
      try {
        const newCar = req.body;
        console.log(newCar);
        const result = await addCarCollection.insertOne(newCar);

        res.send({
          success: true,
          insertedId: result.insertedId,
        });
      } catch (error) {
        res.status(500).send({
          success: false,
          message: error.message,
        });
      }
    });

    app.get("/addCar", async (req, res) => {
      const email = req.query.email;

      const query = { providerEmail: email };

      const result = await addCarCollection.find(query).toArray();

      res.send(result);
      console.log(result);
    });

  

app.post("/bookings", async (req, res) => {
  const booking = req.body;
 console.log(booking);
  const carId = booking.carId;
  console.log(carId);

const filter = { _id: carId };
  console.log(filter);
  const updateDoc = {
    $set: { status: booking.status },
  };

  const updateResult = await carCollection.updateOne(filter, updateDoc);


  const bookingResult = await bookingCollection.insertOne(booking);

  res.send({
    success: true,
    updateResult,
    bookingResult,
  });
});

app.get("/bookings", async (req, res) => {
  const email = req.query.email;

  const query = { userEmail: email };

  const result = await bookingCollection.find(query).toArray();

  res.send(result);
});










  } finally {
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
