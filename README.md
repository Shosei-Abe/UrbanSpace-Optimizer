# Urban Space Optimizer

Urban Space Optimizer is an AI- and data-driven smart mobility solution designed to improve urban parking efficiency. The project targets cities like Budapest and helps reduce congestion, optimize parking usage, and support sustainable transport infrastructure.

## 🚗 Problem Statement

Urban centers are increasingly congested due to inefficient parking space management. Drivers waste time and fuel searching for parking, and cities lack real-time data to plan and allocate space efficiently.

## 🧠 Solution

Urban Space Optimizer offers a cloud-based prototype that:
- Maps available parking using static and simulated real-time data
- Predicts occupancy trends based on time and location
- Filters results by EV charger availability
- Provides route guidance with traffic-aware APIs

## 💡 Features

- 🔍 **Parking Search**: Search nearby parking zones and facilities  
- 📊 **Occupancy Prediction**: Estimate availability based on zone/time trends  
- 🔋 **EV Charger Filter**: Display only EV-compatible parking  
- 🧭 **Navigation Integration**: Live route guidance via Google APIs  

## 🏗️ Architecture Overview

- **Frontend**: React (prototype UI) or Figma mockup  
- **Backend**: Firebase / Google Cloud (data logic, storage)  
- **APIs**: Google Maps Places, Directions, and Traffic APIs  

## 📦 Dataset Strategy

| Data Type              | Source                        | Type       |
|------------------------|-------------------------------|------------|
| Parking Zones          | Budapest Municipality         | Static     |
| Parking Facilities     | Google Places / Parkopedia    | Static     |
| Traffic & Routing      | Google Maps APIs              | Real-time  |
| Occupancy Simulation   | Custom rules based on time    | Simulated  |
| EV Charger Locations   | Google Places, OSM            | Static     |

## 🧪 Current Status

- ✅ MVP feature set defined  
- ✅ Initial occupancy simulation logic implemented  
- ✅ UI wireframes created (Figma)  
- ✅ API integration plan complete  
- ⏳ Prediction model: Basic logic done, refinement in progress  

## 📹 Demo Video

A 3-minute video summary of the project is available [link placeholder].

## 🧑‍💻 Team

- **Shosei Abe** – Project Owner, Eszterházy Károly Catholic University  
- Shosei Abe – Project leader, software development, Eszterhazy Karoly Catholic University  
- Ramawickrama Gamachchige Prabuddhika Sandamini – Urban engineering, University of Debrecen

## 📍 Target City

Budapest, Hungary

## 📝 License

[MIT License] or [Specify Your License Here]

---

**Note:** This project is currently in PoC (Proof of Concept) phase and being developed as part of a university smart city innovation program.
