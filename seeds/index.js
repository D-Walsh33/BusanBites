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
const axios = require('axios');
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

async function seedImg() {
    try {
        const resp = await axios.get('https://api.unsplash.com/photos/random', {
            params: {
                client_id: 'qfTOQqhbt4clz0YUp4sjb0JNZp1IHgGW5ijFbuRebzs',
                collections: 1424340
            }
        })
        return resp.data.urls.small
    } catch (err) {
        console.log(err)
    }
}


const seedDB = async () => {
    await Restaurant.deleteMany({});
    const r = new Restaurant({ name: 'New Restaurant' });
    for (let i = 0; i < 15; i++) {
        const random8 = Math.floor(Math.random() * 8);
        const random8a = Math.floor(Math.random() * 8);
        const rest = new Restaurant({
            name: names[random8] + ' ' + foods[random8a],
            location: `${hoods[random8]}`,
            geometry: {
                type: "Point",
                coordinates: [129.0756, 35.1796]
            },
            // author: "63a029e6db4b18f36e441b44", for desktop
            author: "638d8f6f4cbe81e72ca28bf8", // for laptop
            images: [
                {
                    url: 'https://res.cloudinary.com/djelcbgal/image/upload/v1671442064/BusanBites/cabdbfcqxvtgs1fpq9ks.png',
                    filename: 'BusanBites/l2fpw2qzwmasanikwrd2'

                },
                {
                    url: 'https://res.cloudinary.com/djelcbgal/image/upload/v1671443271/BusanBites/s10vhzoqnuk140omykzx.png',
                    filename: 'BusanBites/r8wdoboyony9ga9ritd5'
                }
            ],
            description: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. At odio adipisci repellendus voluptates tempora, in unde commodi quisquam esse quaerat reprehenderit deserunt nobis laborum, similique vel suscipit laudantium fugiat laboriosam!'
        })
        await rest.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});