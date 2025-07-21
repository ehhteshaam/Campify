const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');
const User = require('../models/user'); // Make sure you have this model
require('dotenv').config();

// Mapbox
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

// Connect to DB
const dburl = process.env.DB_URL;
mongoose.connect(dburl, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database Connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  // Clear existing data
  await Campground.deleteMany({});
  await User.deleteMany({});

  // Step 1: Create a new user
  const user = new User({
    email: 'khanehtesham02345@gmail.com',
    username: 'Ehteshaam'
  });
  await user.setPassword('ehteshaam'); // if you're using passport-local-mongoose
  await user.save();

  // Step 2: Seed 300 campgrounds using this user's _id
  for (let i = 0; i < 300; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const location = `${cities[random1000].city}, ${cities[random1000].state}`;

    const geoData = await geocoder.forwardGeocode({
      query: location,
      limit: 1
    }).send();

    const camp = new Campground({
      author: user._id, // ✅ Use created user's ID
      location,
      title: `${sample(descriptors)} ${sample(places)}`,
      description: 'Nestled in the heart of the forest, this tranquil campground offers breathtaking views, peaceful trails, and the perfect escape from city life.',
      price,
      geometry: geoData.body.features[0].geometry,
      images: [
        {
          url: 'https://res.cloudinary.com/dph1k6ezo/image/upload/v1753018775/Yelpcamp/gdtgggurwuwv8hwu9e5p.jpg',
          filename: 'Yelpcamp/gdtgggurwuwv8hwu9e5p'
        },
        {
          url: 'https://res.cloudinary.com/dph1k6ezo/image/upload/v1753018483/Yelpcamp/nt3hteagoilovqoe6rcg.jpg',
          filename: 'Yelpcamp/nt3hteagoilovqoe6rcg'
        }
      ]
    });

    await camp.save();
  }

  console.log("🌱 Seeded successfully!");
};

seedDB().then(() => {
  mongoose.connection.close();
});
