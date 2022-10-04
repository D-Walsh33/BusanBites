const hoods = [
    'Haeundae',
    'Seomyeon',
    'Jeonpo',
    'Hwamyeong',
    'Yeongdo',
    'Jangsan',
    'Gwanganli',
    'Centum City'
]

const names = [
    'Yugane',
    'HQ',
    "David's",
    'pancake',
    "Sally's",
    "Beacon",
    'Beer Shop',
    "Kimbap Cheonkuk"
]

const foods = [
    'pizza',
    'chicken',
    'korean',
    'soup',
    'southern',
    'asian',
    'bread',
    'tacos'
]

const mongoose = require('mongoose');
const Restaurant = require('../models/restaurant');
mongoose.connect('mongodb://localhost:27017/busanbites', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async () => {
    await Restaurant.deleteMany({});
    const r = new Restaurant({ name: 'New Restaurant' });
    for (let i = 0; i < 50; i++) {
        const random8 = Math.floor(Math.random() * 8);
        const random8a = Math.floor(Math.random() * 8);
        const rest = new Restaurant({
            name: names[random8] + ' ' + foods[random8a],
            location: `${hoods[random8]}`
        })
        await rest.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});