// 1. IMPORT all necessary assets at the top of the file.
// NOTE: Adjust the relative paths (e.g., '../assets/demo.png') to correctly point from this file's location to the actual asset.

import tajthumb from "../assets/demo.png";        // Assuming demo.png is the thumb for Ajanta
import ajantaThumb from "../assets/demo2.png";  // Relative path from data folder to assets/thumbs/ellora.jpg
import elloraThumb from "../assets/demo3.png"; // Relative path from data folder to assets/thumbs/tajmahal.jpg
import konarkThumb from "../assets/demo4.png";
import ajantamodel from "../models/indian_fort.glb"
import taj from "../models/taj.glb"
import ramThumb from "../assets/ram.png";   // your generated thumbnail
import ramModel from "../models/ayodhya_ram_mandir.glb";           // if you have/plan a 3D model


export const SITES = [
  {
    id: "ajanta",
    title: "Ajanta Caves",
    location: "Aurangabad, Maharashtra",
    // 2. Use the imported variable
    thumb: ajantaThumb  ,
    summary: "Ancient rock-cut Buddhist cave monuments known for murals and sculptures.",
    tags: ["Buddhist", "Cave", "Murals"],
    glb: ajantamodel, // These paths are often fine if files are in the public folder
    video: "/assets/videos/ajanta_4way.mp4",
  },
  {
    id: "ellora",
    title: "Ellora Caves",
    location: "Aurangabad, Maharashtra",
    // 2. Use the imported variable
    thumb: elloraThumb,
    summary: "Monolithic temples carved from rock, dedicated to Hindu, Buddhist, and Jain traditions.",
    tags: ["Temple", "Monolithic"],
    glb: ajantamodel,
    video: "/assets/videos/ellora_4way.mp4",
  },
  {
    id: "tajmahal",
    title: "Taj Mahal",
    location: "Agra, Uttar Pradesh",
    // 2. Use the imported variable
    thumb: tajthumb,
    summary: "A UNESCO World Heritage Site, the Taj Mahal is an ivory-white marble mausoleum built by Mughal emperor Shah Jahan in memory of Mumtaz Mahal.",
    tags: ["Mughal", "Marble", "Monument"],
    glb: taj,
    video: "/assets/videos/tajmahal_4way.mp4"
  },
  {
  id: "konark",
  title: "Konark Temple",
  location: "Puri, Odisha",
  thumb: konarkThumb,
  summary: "A 13th-century CE Sun Temple designed as a colossal chariot with intricately carved wheels, pillars, and walls dedicated to Surya, the Sun God.",
  tags: ["Temple", "Sun Temple", "Kalinga Architecture"],
  glb: ajantamodel,
  video: "/assets/videos/konark_4way.mp4"
},
{
  id: "rammandir",
  title: "Ram Mandir",
  location: "Ayodhya, Uttar Pradesh",
  thumb: ramThumb,
  summary:
    "A newly constructed grand Hindu temple dedicated to Lord Ram at his birthplace in Ayodhya, known for its intricate Nagara-style architecture.",
  tags: ["Temple", "Hindu", "Nagara Architecture"],
  glb: ramModel, // or use ajantamodel temporarily
  video: "/assets/videos/rammandir_4way.mp4",
},


];