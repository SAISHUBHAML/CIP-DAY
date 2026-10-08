// Sign-ups, games, the organisers' badminton draw, coordinators and default match times.

// [name, (mobile removed for the public site), class, gender, branch, games]
const P = [
  ["Nikhil Singh Katiyar", "", "M.Tech", "M", "Smart Mobility", "bwsrlh"],
  ["Neha Mishra", "", "Ph.D.", "F", "MSME & Chemical Engg", "bwsrlh"],
  ["Sri Vadan Surakattula", "", "M.Tech", "M", "Lightweight Engg", "bwrlh"],
  ["Girada Narendrakumar", "", "Ph.D.", "M", "CIP", "b"],
  ["Shubham Chakraborty", "", "Ph.D.", "M", "Fluid Mechanics / ID", "b"],
  ["Sumitkumar Chandanshive", "", "M.Tech", "M", "MDI", "bvtw"],
  ["Rubleen Khosa", "", "Ph.D.", "F", "BME and BT", "bvtwslh"],
  ["Para Akhil", "", "M.Tech", "M", "ICMP", "bw"],
  ["Firdaus Ali", "", "Ph.D.", "M", "PhD", "sl"],
  ["Vishnu Varun", "", "M.Tech", "M", "MDI", "vw"],
  ["Mohana Krishnan H", "", "M.Tech", "M", "Ophthalmic Engg", "wr"],
  ["Razaul Mustafa", "", "M.Tech", "M", "MDI", "bsrl"],
  ["Yash Chindhe", "", "M.Tech", "M", "Defence Technologies", "b"],
  ["Sreerag P", "", "Ph.D.", "M", "Physics", "bvw"],
  ["Pranav Varadpande", "", "M.Tech", "M", "Smart Mobility", "b"],
  ["Aditya Naik", "", "M.Tech", "M", "Additive Manufacturing", "t"],
  ["Prahas", "", "M.Tech", "M", "Smart Mobility", "btwsrlh"],
  ["G Sanjay Aravindhan", "", "Ph.D.", "M", "MSME & BME", "b"],
  ["Dhanush S", "", "M.Tech", "M", "Defence Technologies", "bw"],
  ["Devashish Nagpal", "", "M.Tech", "M", "Smart Mobility", "btwsrlh"],
  ["Yadla Komal Tulasi Swamy", "", "M.Tech", "M", "Additive Manufacturing", "vt"],
  ["Jatin", "", "M.Tech", "M", "Additive Manufacturing", "bvtwr"],
  ["S. Ramakrishna", "", "M.Tech", "M", "ICMP", "bw"],
  ["Harsh Saxena", "", "M.Tech", "M", "Additive Manufacturing", "bw"],
  ["Vakada Keerthana Vedavathi", "", "M.Tech", "F", "Defence Technologies", "wsrlh"],
  ["Karanam Mallikarjun Sahithi", "", "M.Tech", "F", "Lightweighting Engg", "t"],
  ["Ch Manasa Gangotri", "", "M.Tech", "F", "Ophthalmic Engg", "wrl"],
  ["Sai Krishna", "", "M.Tech", "M", "Additive Manufacturing", "bvtw"],
  ["Banothu Sagar", "", "M.Tech", "M", "Smart Mobility", "bvwsrlh"],
  ["Sawan Kumar", "", "M.Tech", "M", "Ophthalmic Engg", "bvsrlh"],
  ["Madhava", "", "M.Tech", "M", "Additive Manufacturing", "bvw"],
  ["Pranav Anish", "", "M.Tech", "M", "MDI", "bvtwsrlh"],
  ["Vasu Dev Ganda", "", "M.Tech", "M", "MDI", "bwsrlh"],
  ["Al Amin", "", "Ph.D.", "M", "ID-PhD", "bv"],
  ["Junaid Sayyad", "", "M.Tech", "M", "Additive Manufacturing", "bvtwsrlh"],
  ["Syed Nasir Ahmed", "", "M.Tech", "M", "Additive Manufacturing", "w"],
  ["Hrutik Gaikwad", "", "M.Tech", "M", "Additive Manufacturing", "bvwsrlh"],
  ["Hardik Gupta", "", "M.Tech", "M", "MDI", "tw"],
  ["Bandi Shiva Kumar", "", "M.Tech", "M", "Lightweighting Engg", "wrlh"],
  ["Kailash Sathya Narayanan", "", "M.Tech", "M", "MDI", "brl"],
  ["Vishnu Babu", "", "M.Sc.", "M", "Medical Physics", "wsrlh"],
  ["Rohit", "", "M.Tech", "M", "Defence Technologies", "btwsrlh"],
  ["Shubham", "", "M.Tech", "M", "Defence Technology", "wrlh"],
  ["Sreehari K N", "", "M.Tech", "M", "Defence Technologies", "wrlh"]
];
const G = [
  ["b", "Badminton", "\u{1F3F8}", "sport"],
  ["v", "Volleyball", "\u{1F3D0}", "sport"],
  ["t", "Table Tennis", "\u{1F3D3}", "sport"],
  ["w", "Tug of War", "\u{1FAA2}", "activity"],
  ["s", "Slow Cycling", "\u{1F6B2}", "activity"],
  ["r", "Three Leg Race", "\u{1F45F}", "activity"],
  ["l", "Lemon Spoon Race", "\u{1F944}", "activity"],
  ["h", "Beg Borrow Steal", "\u{1F3AF}", "activity"]
];
const g1 = [
  ["Nikhil Singh Katiyar", "Sri Vadan Surakattula"],
  ["Girada Narendrakumar", "Shubham Chakraborty"],
  ["Sumitkumar Chandanshive", "Para Akhil"],
  ["Razaul Mustafa", "Jatin"],
  ["Yash Chindhe", "Sreerag P"],
  ["Prahas", "G Sanjay Aravindhan"],
  ["Dhanush S", "Devashish Nagpal"]
];
const g2 = [
  ["S. Ramakrishna", "Harsh Saxena"],
  ["Sai Krishna", "Banothu Sagar"],
  ["Sumitkumar Chandanshive", "Sawan Kumar"],
  ["Madhava", "Pranav Anish"],
  ["Vasu Dev Ganda", "Al Amin"],
  ["Junaid Sayyad", "Kailash Sathya Narayanan"],
  ["Hrutik Gaikwad", "Rohit"]
];
const FIX = {
  b: g1.concat(g2)
};
// coordinators: [name, role, instagram handle or "", photo path or "", phone (optional)]
const C = [
  ["Madhava", "Coordinator", "kbm_0706", "photos/madhava.jpg"],
  ["Junaid", "Coordinator", "its_jojo.007", "photos/junaid.jpg"],
  ["Hrutik Gaikwad", "Coordinator", "_hrutik_5122", "photos/hruthik.jpg", "7045542185"],
  ["Syed Nasir", "Coordinator", "nasir_nae8", "photos/nasir.jpg", "7032897527"],
  ["Saishubham Laisetti", "Coordinator", "", ""],
  ["Yadla Komal", "Coordinator", "komalyadla", ""]
];
const t1 = ["20:30", "20:50", "21:10", "21:30", "21:50", "22:10", "22:30"],
  TIMES = {
    b: {}
  };
t1.concat(t1).forEach((t, i) => TIMES.b["0-" + i] = "8," + t);
["8,23:00", "8,23:30", "9,20:30", "8,23:00", "8,23:30", "9,20:30", "9,21:00"].forEach((t, i) => TIMES.b["1-" + i] = t);
