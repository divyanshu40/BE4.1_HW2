const express = require("express");
const cors = require("cors");
const { initializeDatabase } = require("./db/db.connect");
const { hotel } = require("./models/hotel.model");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.listen(PORT, () => {
    console.log("The server is running");
});

// function to get all hotels
async function getAllHotels() {
    const hotels = await hotel.find();
    return { hotels: hotels };
}
// function to get hotel by name
async function getHotelByName(hotelName) {
    const hotelDetails = await hotel.findOne({ name: hotelName });
    if (! hotelDetails) {
        return null;
    }
    return { hotel: hotelDetails };
}
// function to get hotel by phone number
async function getHotelByPhoneNumber(hotelPhoneNumber) {
    const hotelDetails = await hotel.findOne({ phoneNumber: hotelPhoneNumber });
    if (! hotelDetails) {
        return null;
    }
    return { hotel: hotelDetails };
}
// function to get hotels by rating
async function getHotelsByRating(hotelRating) {
    const hotels = await hotel.find({ rating: hotelRating });
    return { hotels: hotels };
}
// function to get hotels by category
async function getHotelsByCategory(hotelCategory) {
    const hotels = await hotel.find();
    const filteredHotels = hotels.filter((hotel) => hotel.category.includes(hotelCategory));
    return { hotels: filteredHotels };
}
// function to add new hotel
async function addNewHotel(newHotelData) {
    let addedHotel = await new hotel(newHotelData).save();
    return { newHotel: addedHotel };
}
// function to delete hotel
async function deleteHotelbyId(hotelId) {
    const deletedHotel = await hotel.findByIdAndDelete(hotelId);
    if (! deletedHotel) {
        return null;
    }
    return { deletedHotel: deletedHotel };
}

// api to get all hotels
app.get("/hotels", async (req, res) => {
    try {
        const response = await getAllHotels();
        if (response.hotels.length === 0) {
            return res.status(404).json({ message: "Hotels not found" });
        }
        return res.status(200).json(response);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});
// api to get hotel by name
app.get("/hotels/:hotelName", async (req, res) => {
    const hotelName = req.params.hotelName;
    try {
        const response = await getHotelByName(hotelName);
        if (response === null) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        return res.status(200).json(response);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});
// api to get hotel by phone number
app.get("/hotels/directory/:phoneNumber", async (req, res) => {
    const phoneNumber = req.params.phoneNumber;
    try {
        const response = await getHotelByPhoneNumber(phoneNumber);
        if (response === null) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        return res.status(200).json(response);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});
// api to get all hotels by rating
app.get("/hotels/rating/:hotelRating", async (req, res) => {
    const hotelRating = parseInt(req.params.hotelRating);
    try {
        const response = await getHotelsByRating(hotelRating);
        if (response.hotels.length === 0) {
            return res.status(404).json({ message: "Hotels not found" });
        }
        return res.status(200).json(response);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});
// api to get hotels by category
app.get("/hotels/category/:hotelCategory", async (req, res) => {
    const hotelCategory = req.params.hotelCategory;
    try {
        const response = await getHotelsByCategory(hotelCategory);
        if (response.hotels.length === 0) {
            return res.status(404).json({ message: "Hotels not found" });
        }
        return res.status(200).json(response);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});
// api to add new hotel
app.post("/hotels/new", async (req, res) => {
    let newHotelData = req.body;
    try {
        let response = await addNewHotel(newHotelData);
        return res.status(201).json(response);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});
// api to delete hotel
app.delete("/hotels/delete/:id", async (req, res) => {
    const hotelId = req.params.id;
    try {
        const response = await deleteHotelbyId(hotelId);
        if (response === null) {
            return res.status(404).json({ message: "Hotel not found" });
        }
        return res.status(200).json(response);
    } catch(error) {
        res.status(500).json({ error: error.message });
    }
});

initializeDatabase()