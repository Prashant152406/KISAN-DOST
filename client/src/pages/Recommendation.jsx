// import React, { useState, useEffect } from "react";
// import {
//   MapPin,
//   Thermometer,
//   Calendar,
//   Leaf,
//   ArrowLeft,
//   Search,
//   CheckCircle,
//   Sprout,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const districts = {
//     'Andhra Pradesh': ['Anantapur', 'Chittoor', 'East Godavari', 'Guntur', 'Kadapa', 'Krishna', 'Kurnool', 'Nellore', 'Prakasam', 'Rayalaseema', 'Srikakulam', 'Visakhapatnam', 'West Godavari', 'Vijayawada'],
//     'Arunachal Pradesh': ['Tawang', 'West Kameng', 'East Kameng', 'Papum Pare', 'Kra Daadi', 'Kurung Kumey', 'Lower Subansiri', 'Upper Subansiri', 'West Siang', 'East Siang', 'Siang', 'Lower Dibang Valley', 'Upper Dibang Valley', 'Anjaw', 'Changlang', 'Lohit'],
//     'Assam': ['Barpeta', 'Bongaigaon', 'Cachar', 'Charaideo', 'Darrang', 'Dhemaji', 'Dibrugarh', 'Goalpara', 'Golaghat', 'Hailakandi', 'Jorhat', 'Kamrup', 'Kamrup Metropolitan', 'Karbi Anglong', 'Karimganj', 'Kokrajhar', 'Lakhimpur', 'Morigaon', 'Nagaon', 'Nalbari', 'Sivasagar', 'Sonitpur', 'Tinsukia', 'Udalguri', 'West Karbi Anglong'],
//     'Bihar': ['Araria', 'Aurangabad', 'Banka', 'Begusarai', 'Bhagalpur', 'Bhojpur', 'Buxar', 'Darbhanga', 'Gaya', 'Gopalganj', 'Jamui', 'Jehanabad', 'Kaimur', 'Katihar', 'Khagaria', 'Kishanganj', 'Lakhisarai', 'Madhepura', 'Madhubani', 'Munger', 'Muzaffarpur', 'Nalanda', 'Nawada', 'Patna', 'Purnia', 'Rohtas', 'Saharsa', 'Samastipur', 'Saran', 'Sheikhpura', 'Sheohar', 'Sitamarhi', 'Siwan', 'Supaul', 'Vaishali'],
//     'Chhattisgarh': ['Balod', 'Baloda Bazar', 'Balrampur', 'Bastar', 'Bijapur', 'Bilaspur', 'Dantewada', 'Dhamtari', 'Durg', 'Gariaband', 'Janjgir-Champa', 'Jashpur', 'Kabirdham', 'Kanker', 'Korba', 'Kondagaon', 'Mahasamund', 'Mungeli', 'Narayanpur', 'Raigarh', 'Raipur', 'Rajnandgaon', 'Surajpur', 'Surguja'],
//     'Goa': ['North Goa', 'South Goa'],
//     'Gujarat': ['Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banas Kantha', 'Baroda', 'Bhavnagar', 'Botad', 'Chhota Udaipur', 'Dahod', 'Dangs', 'Gandhinagar', 'Junagadh', 'Kheda', 'Kutch', 'Mahisagar', 'Mehsana', 'Narmada', 'Navsari', 'Panchmahal', 'Patan', 'Porbandar', 'Rajkot', 'Sabarkantha', 'Surat', 'Sabar Kantha', 'Surendranagar', 'Tapi', 'Vadodara', 'Valsad'],
//     'Haryana': ['Ambala', 'Bhiwani', 'Faridabad', 'Fatehabad', 'Gurgaon', 'Hisar', 'Jhajjar', 'Jind', 'Kaithal', 'Karnal', 'Kurukshetra', 'Mahendragarh', 'Narnaul', 'Palwal', 'Panchkula', 'Panipat', 'Rewari', 'Sirsa', 'Sonipat', 'Yamunanagar'],
//     'Himachal Pradesh': ['Bilaspur', 'Chamba', 'Hamirpur', 'Kangra', 'Kullu', 'Kinnaur', 'Mandi', 'Solan', 'Sirmaur', 'Una'],
//     'Jharkhand': ['Bokaro', 'Chatra', 'Deoghar', 'Dhanbad', 'Dumka', 'Giridih', 'Godda', 'Gumla', 'Hazaribagh', 'Jamtara', 'Khunti', 'Koderma', 'Latehar', 'Lohardaga', 'Pakur', 'Palamu', 'Ranchi', 'Sahebganj', 'Seraikela-Kharsawan', 'Simdega', 'West Singhbhum'],
//     'Karnataka': ['Bagalkot', 'Ballari', 'Belagavi', 'Bengaluru Rural', 'Bengaluru Urban', 'Bidar', 'Chamarajanagar', 'Chikkaballapura', 'Chikkamagaluru', 'Chitradurga', 'Dakshina Kannada', 'Davangere', 'Dharwad', 'Gadag', 'Hassan', 'Haveri', 'Kalaburagi', 'Kodagu', 'Kolar', 'Koppal', 'Mandya', 'Mysuru', 'Raichur', 'Ramanagara', 'Shivamogga', 'Tumakuru', 'Udupi', 'Uttara Kannada', 'Vijayapura', 'Yadgir'],
//     'Kerala': ['Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 'Kollam', 'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad', 'Pathanamthitta', 'Thrissur', 'Thiruvananthapuram', 'Wayanad'],
//     'Madhya Pradesh': ['Alirajpur', 'Anuppur', 'Ashok Nagar', 'Balaghat', 'Barwani', 'Betul', 'Bhind', 'Bhopal', 'Burhanpur', 'Chhatarpur', 'Chhindwara', 'Damoh', 'Datia', 'Dewas', 'Dhar', 'Dindori', 'Guna', 'Gwalior', 'Hoshangabad', 'Indore', 'Jabalpur', 'Jhabua', 'Khandwa', 'Khargone', 'Mandla', 'Mandsaur', 'Morena', 'Narsinghpur', 'Neemuch', 'Panchmahal', 'Panna', 'Rajgarh', 'Ratlam', 'Rewa', 'Sagar', 'Satna', 'Sehore', 'Seoni', 'Shahdol', 'Shajapur', 'Sheopur', 'Shivpuri', 'Singrauli', 'Tikamgarh', 'Ujjain', 'Umaria', 'Vidisha'],
//     'Maharashtra': ['Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Bhandara', 'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded', 'Nandurbar', 'Nasik', 'Osmanabad', 'Palghar', 'Parbhani', 'Pune', 'Raigad', 'Ratnagiri', 'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal'],
//     'Manipur': ['Bishnupur', 'Chandel', 'Churachandpur', 'Imphal East', 'Imphal West', 'Jiribam', 'Kangpokpi', 'Noney', 'Senapati', 'Tamenglong', 'Thoubal', 'Ukhrul'],
//     'Meghalaya': ['East Garo Hills', 'East Khasi Hills', 'Jaintia Hills', 'Ri Bhoi', 'South Garo Hills', 'South Khasi Hills', 'West Garo Hills', 'West Khasi Hills'],
//     'Mizoram': ['Aizawl', 'Champhai', 'Kolasib', 'Lawngtlai', 'Lunglei', 'Mamit', 'Serchhip', 'Saiha'],
//     'Nagaland': ['Dimapur', 'Kohima', 'Mokokchung', 'Mon', 'Phek', 'Tuensang', 'Wokha', 'Zunheboto'],
//     'Odisha': ['Angul', 'Balangir', 'Balasore', 'Bargarh', 'Bhadrak', 'Boudh', 'Cuttack', 'Deogarh', 'Dhenkanal', 'Gajapati', 'Ganjam', 'Jagatsinghpur', 'Jajpur', 'Jharsuguda', 'Kalahandi', 'Kandhamal', 'Kendrapara', 'Kendujhar', 'Khurda', 'Koraput', 'Malkangiri', 'Mayurbhanj', 'Nabarangpur', 'Nayagarh', 'Nuapada', 'Puri', 'Rayagada', 'Sambalpur', 'Subarnapur', 'Sundargarh'],
//     'Punjab': ['Amritsar', 'Barnala', 'Bathinda', 'Faridkot', 'Fatehgarh Sahib', 'Fazilka', 'Firozpur', 'Gurdaspur', 'Hoshiarpur', 'Jalandhar', 'Kapurthala', 'Ludhiana', 'Mansa', 'Moga', 'Muktsar', 'Nawanshahr', 'Patiala', 'Rupnagar', 'Sangrur', 'Shaheed Bhagat Singh Nagar', 'Tarn Taran'],
//     'Rajasthan': ['Ajmer', 'Alwar', 'Banswara', 'Baran', 'Barmer', 'Bhilwara', 'Bikaner', 'Bundi', 'Chittorgarh', 'Churu', 'Dausa', 'Dholpur', 'Dungarpur', 'Hanumangarh', 'Jaipur', 'Jaisalmer', 'Jalore', 'Jhalawar', 'Jhunjhunu', 'Jodhpur', 'Karauli', 'Kota', 'Nagaur', 'Pali', 'Pratapgarh', 'Rajsamand', 'Sawai Madhopur', 'Sikar', 'Sirohi', 'Tonk', 'Udaipur'],
//     'Sikkim': ['East Sikkim', 'North Sikkim', 'South Sikkim', 'West Sikkim'],
//     'Tamil Nadu': ['Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul', 'Erode', 'Kancheepuram', 'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai', 'Nagapattinam', 'Namakkal', 'Nilgiris', 'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur', 'The Nilgiris', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tiruppur', 'Vellore', 'Villupuram', 'Virudhunagar'],
//     'Telangana': ['Adilabad', 'Hyderabad', 'Jagitial', 'Jangaon', 'Jayashankar', 'Jubilee Hills', 'Kamareddy', 'Karimnagar', 'Khammam', 'Komaram Bheem', 'Mahabubnagar', 'Mancherial', 'Medak', 'Medchal', 'Mulugu', 'Nalgonda', 'Nirmal', 'Nizamabad', 'Peddapalli', 'Rangareddy', 'Sangareddy', 'Siddipet', 'Suryapet', 'Vikarabad', 'Warangal', 'Yadadri'],
//     'Tripura': ['Dhalai', 'Khowai', 'North Tripura', 'Sepahijala', 'South Tripura', 'Unakoti', 'West Tripura'],
//     'Uttar Pradesh': ['Agra', 'Aligarh', 'Allahabad', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya', 'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia', 'Banda', 'Barabanki', 'Bareilly', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli', 'Chitrakoot', 'Deoria', 'Etah', 'Etawah', 'Faizabad', 'Farrukhabad', 'Fatehpur', 'Firozabad', 'Gautam Buddha Nagar', 'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur', 'Hapur', 'Hardoi', 'Hathras', 'Jalaun', 'Jaunpur', 'Jhansi', 'Kanpur', 'Kannauj', 'Kaushambi', 'Kushinagar', 'Lakhimpur Kheri', 'Lucknow', 'Mau', 'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Pratapgarh', 'Raebareli', 'Rampur', 'Saharanpur', 'Sant Kabir Nagar', 'Shahjahanpur', 'Shrawasti', 'Siddharth Nagar', 'Sitapur', 'Sonbhadra', 'Sultanpur', 'Unnao', 'Varanasi'],
//     'Uttarakhand': ['Almora', 'Bageshwar', 'Chamoli', 'Champawat', 'Dehradun', 'Haridwar', 'Nainital', 'Pauri Garhwal', 'Pithoragarh', 'Rudraprayag', 'Tehri Garhwal', 'Udham Singh Nagar', 'Uttarkashi'],
//     'West Bengal': ['Alipurduar', 'Bankura', 'Birbhum', 'Cooch Behar', 'Dakshin Dinajpur', 'Darjeeling', 'Hooghly', 'Howrah', 'Jalpaiguri', 'Jhargram', 'Kalimpong', 'Koch Bihar', 'Kolkata', 'Maldah', 'Murshidabad', 'Nadia', 'North 24 Parganas', 'Paschim Medinipur', 'Purba Medinipur', 'Purulia', 'South 24 Parganas', 'Uttar Dinajpur'],
// };

// const soilData = {
//   "sandy": ["pearl millet", "cotton", "cassava"],
//   "loamy": ["wheat", "sugarcane", "vegetables"],
//   "clayey": ["rice", "paddy", "soybeans"],
//   "silty": ["maize", "barley", "fruits"],
// };

// const climateData = {
//   "tropical": ["rice", "sugarcane", "banana"],
//   "temperate": ["wheat", "barley", "potatoes"],
//   "arid": ["millet", "sorghum", "dates"],
//   "semi-arid": ["maize", "cotton", "groundnuts"],
// };

// const monthData = {
//   "January": ["wheat", "barley", "mustard"],
//   "February": ["wheat", "barley", "mustard"],
//   "March": ["corn", "rice", "maize"],
//   "April": ["maize", "groundnut", "cotton"],
//   "May": ["cotton", "groundnut", "vegetables"],
//   "June": ["paddy", "sugarcane", "banana"],
//   "July": ["paddy", "sugarcane", "banana"],
//   "August": ["paddy", "sugarcane", "banana"],
//   "September": ["paddy", "sugarcane", "banana"],
//   "October": ["cotton", "mustard", "vegetables"],
//   "November": ["wheat", "barley", "vegetables"],
//   "December": ["wheat", "barley", "mustard"],
// };

// const Recommendation = () => {
//   const navigate = useNavigate();
//   const [state, setState] = useState("");
//   const [district, setDistrict] = useState("");
//   const [districtsList, setDistrictsList] = useState([]);
//   const [soilType, setSoilType] = useState("");
//   const [climate, setClimate] = useState("");
//   const [month, setMonth] = useState("");
//   const [recommendedCrops, setRecommendedCrops] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     if (state && districts[state]) {
//       setDistrictsList(districts[state]);
//       setDistrict("");
//     } else {
//       setDistrictsList([]);
//       setDistrict("");
//     }
//   }, [state]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!state || !district || !soilType || !climate || !month) {
//       alert("Please select all fields");
//       return;
//     }

//     setIsLoading(true);
    
//     // Simulate API call delay
//     setTimeout(() => {
//       const soilCrops = soilData[soilType] || [];
//       const climateCrops = climateData[climate] || [];
//       const monthCrops = monthData[month] || [];
//       const combinedCrops = Array.from(new Set([...soilCrops, ...climateCrops, ...monthCrops]));
//       setRecommendedCrops(combinedCrops);
//       setIsLoading(false);
//     }, 1500);
//   };

//   return (
//     <div id='recommendations' className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 pt-16">
//       {/* Header */}
//       <header className="bg-gradient-to-r from-green-800 to-emerald-800 text-white py-6 sticky top-16 z-50 shadow-lg">
//         <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => navigate("/")}
//               className="p-2 rounded-lg hover:bg-green-700 transition-colors"
//             >
//               <ArrowLeft className="w-6 h-6" />
//             </button>
//             <div className="flex items-center gap-3">
//               <Sprout className="w-8 h-8" />
//               <h1 className="text-2xl md:text-3xl font-bold">
//                 Crop Recommendation System
//               </h1>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-4xl mx-auto p-4 lg:p-8">
//         {/* Form Section */}
//         <div className="bg-white rounded-xl p-8 mb-8 shadow-sm border border-green-100">
//           <div className="text-center mb-8">
//             <h2 className="text-3xl font-bold text-green-800 mb-2">
//               Find the Best Crops for Your Land
//             </h2>
//             <p className="text-green-600">
//               Get personalized crop recommendations based on your location, soil, and climate
//             </p>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Location Section */}
//             <div className="grid md:grid-cols-2 gap-6">
//               <div>
//                 <label className="flex items-center gap-2 text-lg font-semibold text-green-800 mb-3">
//                   <MapPin className="w-5 h-5" />
//                   Select State
//                 </label>
//                 <select
//                   value={state}
//                   onChange={(e) => setState(e.target.value)}
//                   className="w-full p-4 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
//                 >
//                   <option value="">Choose your state</option>
//                   {Object.keys(districts).map((s) => (
//                     <option key={s} value={s}>{s}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="flex items-center gap-2 text-lg font-semibold text-green-800 mb-3">
//                   <MapPin className="w-5 h-5" />
//                   Select District
//                 </label>
//                 <select
//                   value={district}
//                   onChange={(e) => setDistrict(e.target.value)}
//                   disabled={!districtsList.length}
//                   className="w-full p-4 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
//                 >
//                   <option value="">Choose your district</option>
//                   {districtsList.map((d) => (
//                     <option key={d} value={d}>{d}</option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {/* Soil and Climate Section */}
//             <div className="grid md:grid-cols-2 gap-6">
//               <div>
//                 <label className="flex items-center gap-2 text-lg font-semibold text-green-800 mb-3">
//                   <Leaf className="w-5 h-5" />
//                   Soil Type
//                 </label>
//                 <select
//                   value={soilType}
//                   onChange={(e) => setSoilType(e.target.value)}
//                   className="w-full p-4 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
//                 >
//                   <option value="">Choose soil type</option>
//                   <option value="sandy">Sandy / रेतीली</option>
//                   <option value="loamy">Loamy / बलुई</option>
//                   <option value="clayey">Clayey / चिकनी</option>
//                   <option value="silty">Silty / सिलटी</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="flex items-center gap-2 text-lg font-semibold text-green-800 mb-3">
//                   <Thermometer className="w-5 h-5" />
//                   Climate Type
//                 </label>
//                 <select
//                   value={climate}
//                   onChange={(e) => setClimate(e.target.value)}
//                   className="w-full p-4 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
//                 >
//                   <option value="">Choose climate type</option>
//                   <option value="tropical">Tropical / उष्णकटिबंधीय</option>
//                   <option value="temperate">Temperate / समशीतोष्ण</option>
//                   <option value="arid">Arid / शुष्क</option>
//                   <option value="semi-arid">Semi-Arid / अर्ध-शुष्क</option>
//                 </select>
//               </div>
//             </div>

//             {/* Month Selection */}
//             <div>
//               <label className="flex items-center gap-2 text-lg font-semibold text-green-800 mb-3">
//                 <Calendar className="w-5 h-5" />
//                 Planting Month
//               </label>
//               <select
//                 value={month}
//                 onChange={(e) => setMonth(e.target.value)}
//                 className="w-full p-4 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
//               >
//                 <option value="">Choose planting month</option>
//                 {Object.keys(monthData).map((m) => (
//                   <option key={m} value={m}>{m}</option>
//                 ))}
//               </select>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-4 px-8 rounded-lg font-semibold text-lg transition-colors shadow-lg flex items-center justify-center gap-2"
//             >
//               {isLoading ? (
//                 <>
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                   Analyzing...
//                 </>
//               ) : (
//                 <>
//                   <Search className="w-5 h-5" />
//                   Get Crop Recommendations
//                 </>
//               )}
//             </button>
//           </form>
//         </div>

//         {/* Results Section */}
//         {recommendedCrops.length > 0 && (
//           <div className="bg-white rounded-xl p-8 shadow-sm border border-green-100">
//             <div className="text-center mb-6">
//               <h3 className="text-2xl font-bold text-green-800 mb-2 flex items-center justify-center gap-2">
//                 <CheckCircle className="w-6 h-6 text-green-600" />
//                 Recommended Crops for Your Land
//               </h3>
//               <p className="text-green-600">
//                 Based on your location: {district}, {state}
//               </p>
//             </div>

//             <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
//               {recommendedCrops.map((crop, index) => (
//                 <div
//                   key={crop}
//                   className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200 hover:shadow-md transition-shadow"
//                 >
//                   <div className="flex items-center gap-3">
//                     <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
//                       <Sprout className="w-5 h-5 text-green-600" />
//                     </div>
//                     <div>
//                       <h4 className="font-semibold text-green-800 capitalize">
//                         {crop}
//                       </h4>
//                       <p className="text-sm text-green-600">
//                         Suitable for your conditions
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="mt-6 text-center">
//               <p className="text-green-700 font-medium">
//                 Found {recommendedCrops.length} suitable crops for your farming conditions
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Recommendation;


// import React, { useState } from "react";
// import {
//   MapPin,
//   Thermometer,
//   Droplets,
//   Leaf,
//   ArrowLeft,
//   Sprout,
//   Upload,
//   X,
//   Loader2,
//   AlertTriangle,
//   CheckCircle,
//   Info,
//   Calendar,
//   Sparkles,
//   FlaskConical,
// } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import {
//   predictCrops,
//   fetchWeather,
//   extractSoilReport,
//   getCropInfo,
// } from "../services/cropRecommendationApi";

// const FIELD_META = {
//   N: { label: "Nitrogen (N)", hint: "typical range 0–140" },
//   P: { label: "Phosphorus (P)", hint: "typical range 5–145" },
//   K: { label: "Potassium (K)", hint: "typical range 5–205" },
//   ph: { label: "Soil pH", hint: "typical range 3.5–9.5" },
//   temperature: { label: "Temperature (°C)", hint: "" },
//   humidity: { label: "Humidity (%)", hint: "" },
//   rainfall: { label: "Rainfall (mm)", hint: "" },
// };

// const EMPTY_FORM = { N: "", P: "", K: "", ph: "", temperature: "", humidity: "", rainfall: "" };

// const Recommendation = () => {
//   const navigate = useNavigate();

//   // ---------- Location + weather ----------
//   const [locationStatus, setLocationStatus] = useState("idle"); // idle | requesting | granted | denied | error
//   const [locationMessage, setLocationMessage] = useState("");
//   const [weatherLoading, setWeatherLoading] = useState(false);
//   const [weatherSource, setWeatherSource] = useState("");

//   // ---------- Form ----------
//   const [form, setForm] = useState(EMPTY_FORM);
//   const [autoFilled, setAutoFilled] = useState(new Set());

//   const updateField = (field, value) => {
//     setForm((f) => ({ ...f, [field]: value }));
//     // Once the farmer edits a field by hand, it's no longer "auto-filled".
//     setAutoFilled((prev) => {
//       const next = new Set(prev);
//       next.delete(field);
//       return next;
//     });
//   };

//   // ---------- Soil report upload ----------
//   const [soilFile, setSoilFile] = useState(null);
//   const [soilExtracting, setSoilExtracting] = useState(false);
//   const [soilExtractError, setSoilExtractError] = useState("");
//   const [soilNotes, setSoilNotes] = useState("");

//   // ---------- Prediction ----------
//   const [predicting, setPredicting] = useState(false);
//   const [predictError, setPredictError] = useState("");
//   const [predictions, setPredictions] = useState([]);
//   const [modelMeta, setModelMeta] = useState(null);

//   // ---------- Crop growing-guide modal ----------
//   const [selectedCrop, setSelectedCrop] = useState(null); // { crop, display_name } | null
//   const [cropInfoCache, setCropInfoCache] = useState({});
//   const [cropInfoLoading, setCropInfoLoading] = useState(false);
//   const [cropInfoError, setCropInfoError] = useState("");

//   const handleUseLocation = () => {
//     if (!navigator.geolocation) {
//       setLocationStatus("error");
//       setLocationMessage(
//         "Your browser doesn't support location access. Please enter the climate values manually below."
//       );
//       return;
//     }

//     setLocationStatus("requesting");
//     setLocationMessage("");

//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         setLocationStatus("granted");
//         const { latitude, longitude } = position.coords;

//         setWeatherLoading(true);
//         try {
//           const data = await fetchWeather(latitude, longitude);
//           setForm((f) => ({
//             ...f,
//             temperature: data.temperature ?? f.temperature,
//             humidity: data.humidity ?? f.humidity,
//             rainfall: data.rainfall ?? f.rainfall,
//           }));
//           setAutoFilled((prev) => new Set([...prev, "temperature", "humidity", "rainfall"]));
//           setWeatherSource(data.source);
//         } catch (err) {
//           setLocationMessage(err.message);
//         } finally {
//           setWeatherLoading(false);
//         }
//       },
//       (error) => {
//         setLocationStatus("denied");
//         setLocationMessage(
//           error.code === error.PERMISSION_DENIED
//             ? "Location permission denied. You can still enter the climate values manually below."
//             : "Couldn't get your location. You can still enter the climate values manually below."
//         );
//       },
//       { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
//     );
//   };

//   const handleSoilFileChange = (e) => {
//     setSoilFile(e.target.files?.[0] || null);
//     setSoilExtractError("");
//     setSoilNotes("");
//   };

//   const handleExtractSoilReport = async () => {
//     if (!soilFile) return;
//     setSoilExtracting(true);
//     setSoilExtractError("");
//     try {
//       const data = await extractSoilReport(soilFile);
//       setForm((f) => ({
//         ...f,
//         N: data.N ?? f.N,
//         P: data.P ?? f.P,
//         K: data.K ?? f.K,
//         ph: data.ph ?? f.ph,
//         temperature: data.temperature ?? f.temperature,
//         humidity: data.humidity ?? f.humidity,
//         rainfall: data.rainfall ?? f.rainfall,
//       }));
//       setAutoFilled((prev) => new Set([...prev, ...(data.fields_found || [])]));
//       setSoilNotes(data.notes || "");
//       if (!data.fields_found || data.fields_found.length === 0) {
//         setSoilExtractError(
//           "Couldn't find any recognizable values in that file. Please enter them manually below."
//         );
//       }
//     } catch (err) {
//       setSoilExtractError(err.message);
//     } finally {
//       setSoilExtracting(false);
//     }
//   };

//   const handlePredict = async (e) => {
//     e.preventDefault();
//     const parsed = {};
//     for (const key of Object.keys(EMPTY_FORM)) {
//       const value = parseFloat(form[key]);
//       if (Number.isNaN(value)) {
//         setPredictError("Please fill in all seven fields with valid numbers before submitting.");
//         return;
//       }
//       parsed[key] = value;
//     }

//     setPredicting(true);
//     setPredictError("");
//     setPredictions([]);
//     try {
//       const data = await predictCrops({ ...parsed, top_n: 5 });
//       setPredictions(data.predictions);
//       setModelMeta({ model_name: data.model_name, accuracy: data.accuracy });
//     } catch (err) {
//       setPredictError(err.message);
//     } finally {
//       setPredicting(false);
//     }
//   };

//   const handleViewGuide = async (prediction) => {
//     setSelectedCrop(prediction);
//     setCropInfoError("");
//     if (cropInfoCache[prediction.crop]) return; // already fetched — no repeat call

//     setCropInfoLoading(true);
//     try {
//       const data = await getCropInfo(prediction.crop);
//       setCropInfoCache((prev) => ({ ...prev, [prediction.crop]: data }));
//     } catch (err) {
//       setCropInfoError(err.message);
//     } finally {
//       setCropInfoLoading(false);
//     }
//   };

//   const closeModal = () => {
//     setSelectedCrop(null);
//     setCropInfoError("");
//   };

//   const isAutoFilled = (field) => autoFilled.has(field);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 pt-16">
//       {/* Header */}
//       <header className="bg-gradient-to-r from-green-800 to-emerald-800 text-white py-6 sticky top-16 z-50 shadow-lg">
//         <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
//           <div className="flex items-center gap-4">
//             <button
//               onClick={() => navigate("/")}
//               className="p-2 rounded-lg hover:bg-green-700 transition-colors"
//             >
//               <ArrowLeft className="w-6 h-6" />
//             </button>
//             <div className="flex items-center gap-3">
//               <Sprout className="w-8 h-8" />
//               <h1 className="text-2xl md:text-3xl font-bold">Crop Recommendation System</h1>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-4xl mx-auto p-4 lg:p-8 space-y-8">
//         <div className="text-center">
//           <h2 className="text-3xl font-bold text-green-800 mb-2">
//             Find the Best Crops for Your Land
//           </h2>
//           <p className="text-green-600">
//             A machine-learning model trained on soil and climate data recommends crops for you —
//             then AI explains exactly how to grow each one.
//           </p>
//         </div>

//         <form onSubmit={handlePredict} className="space-y-8">
//           {/* ---------------- Step 1: Location & Climate ---------------- */}
//           <div className="bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-green-100">
//             <h3 className="flex items-center gap-2 text-xl font-bold text-green-800 mb-1">
//               <MapPin className="w-5 h-5" /> Step 1 — Location &amp; Climate
//             </h3>
//             <p className="text-sm text-green-600 mb-5">
//               Share your location to auto-fill temperature, humidity and rainfall, or enter them
//               yourself.
//             </p>

//             <button
//               type="button"
//               onClick={handleUseLocation}
//               disabled={locationStatus === "requesting" || weatherLoading}
//               className="mb-4 inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-5 py-3 rounded-lg font-medium transition-colors"
//             >
//               {locationStatus === "requesting" || weatherLoading ? (
//                 <>
//                   <Loader2 className="w-4 h-4 animate-spin" />
//                   {locationStatus === "requesting" ? "Requesting permission…" : "Fetching weather…"}
//                 </>
//               ) : (
//                 <>
//                   <MapPin className="w-4 h-4" /> Use My Current Location
//                 </>
//               )}
//             </button>

//             {locationMessage && (
//               <div className="mb-4 flex items-start gap-2 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3">
//                 <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
//                 <span>{locationMessage}</span>
//               </div>
//             )}

//             <div className="grid sm:grid-cols-3 gap-4">
//               {["temperature", "humidity", "rainfall"].map((field) => (
//                 <div key={field}>
//                   <label className="flex items-center gap-1.5 text-sm font-semibold text-green-800 mb-2">
//                     {field === "rainfall" ? (
//                       <Droplets className="w-4 h-4" />
//                     ) : (
//                       <Thermometer className="w-4 h-4" />
//                     )}
//                     {FIELD_META[field].label}
//                     {isAutoFilled(field) && (
//                       <span className="ml-1 text-[10px] font-medium bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
//                         auto-filled
//                       </span>
//                     )}
//                   </label>
//                   <input
//                     type="number"
//                     step="any"
//                     value={form[field]}
//                     onChange={(e) => updateField(field, e.target.value)}
//                     placeholder="Required"
//                     className="w-full p-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
//                   />
//                 </div>
//               ))}
//             </div>
//             {weatherSource && (
//               <p className="text-xs text-green-500 mt-2 flex items-center gap-1">
//                 <Info className="w-3.5 h-3.5" /> {weatherSource}
//               </p>
//             )}
//           </div>

//           {/* ---------------- Step 2: Soil Nutrients ---------------- */}
//           <div className="bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-green-100">
//             <h3 className="flex items-center gap-2 text-xl font-bold text-green-800 mb-1">
//               <FlaskConical className="w-5 h-5" /> Step 2 — Soil Nutrients
//             </h3>
//             <p className="text-sm text-green-600 mb-5">
//               Enter your soil test values, or upload a photo/PDF of your soil health card and
//               we'll read it for you.
//             </p>

//             {/* Soil report upload */}
//             <div className="mb-6 border-2 border-dashed border-green-200 rounded-lg p-4 bg-green-50/50">
//               <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
//                 <label className="flex items-center gap-2 text-sm font-medium text-green-700 bg-white border border-green-300 px-4 py-2.5 rounded-lg cursor-pointer hover:bg-green-50 transition-colors">
//                   <Upload className="w-4 h-4" />
//                   {soilFile ? soilFile.name : "Choose soil report (image or PDF)"}
//                   <input
//                     type="file"
//                     accept="image/jpeg,image/png,image/webp,application/pdf"
//                     onChange={handleSoilFileChange}
//                     className="hidden"
//                   />
//                 </label>
//                 <button
//                   type="button"
//                   onClick={handleExtractSoilReport}
//                   disabled={!soilFile || soilExtracting}
//                   className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
//                 >
//                   {soilExtracting ? (
//                     <>
//                       <Loader2 className="w-4 h-4 animate-spin" /> Reading report…
//                     </>
//                   ) : (
//                     "Extract Values"
//                   )}
//                 </button>
//               </div>

//               {soilExtractError && (
//                 <div className="mt-3 flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
//                   <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
//                   <span>{soilExtractError}</span>
//                 </div>
//               )}
//               {soilNotes && (
//                 <div className="mt-3 flex items-start gap-2 text-sm text-blue-800 bg-blue-50 border border-blue-200 rounded-lg p-3">
//                   <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
//                   <span>{soilNotes}</span>
//                 </div>
//               )}
//             </div>

//             <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
//               {["N", "P", "K", "ph"].map((field) => (
//                 <div key={field}>
//                   <label className="flex items-center gap-1.5 text-sm font-semibold text-green-800 mb-2">
//                     <Leaf className="w-4 h-4" />
//                     {FIELD_META[field].label}
//                     {isAutoFilled(field) && (
//                       <span className="ml-1 text-[10px] font-medium bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
//                         detected
//                       </span>
//                     )}
//                   </label>
//                   <input
//                     type="number"
//                     step="any"
//                     value={form[field]}
//                     onChange={(e) => updateField(field, e.target.value)}
//                     placeholder={FIELD_META[field].hint}
//                     className="w-full p-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* ---------------- Submit ---------------- */}
//           {predictError && (
//             <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
//               <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
//               <span>{predictError}</span>
//             </div>
//           )}

//           <button
//             type="submit"
//             disabled={predicting}
//             className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-4 px-8 rounded-lg font-semibold text-lg transition-colors shadow-lg flex items-center justify-center gap-2"
//           >
//             {predicting ? (
//               <>
//                 <Loader2 className="w-5 h-5 animate-spin" /> Analyzing…
//               </>
//             ) : (
//               <>
//                 <Sparkles className="w-5 h-5" /> Get AI Crop Recommendations
//               </>
//             )}
//           </button>
//         </form>

//         {/* ---------------- Results ---------------- */}
//         {predictions.length > 0 && (
//           <div className="bg-white rounded-xl p-8 shadow-sm border border-green-100">
//             <div className="text-center mb-6">
//               <h3 className="text-2xl font-bold text-green-800 mb-1 flex items-center justify-center gap-2">
//                 <CheckCircle className="w-6 h-6 text-green-600" /> Recommended Crops
//               </h3>
//               {modelMeta && (
//                 <p className="text-sm text-green-500">
//                   {modelMeta.model_name} · {(modelMeta.accuracy * 100).toFixed(1)}% test accuracy
//                 </p>
//               )}
//             </div>

//             <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
//               {predictions.map((p) => (
//                 <div
//                   key={p.crop}
//                   className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-lg border border-green-200 hover:shadow-md transition-shadow"
//                 >
//                   <div className="flex items-center gap-3 mb-3">
//                     <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
//                       <Sprout className="w-5 h-5 text-green-600" />
//                     </div>
//                     <div>
//                       <h4 className="font-semibold text-green-800">{p.display_name}</h4>
//                       <p className="text-xs text-green-600">
//                         {(p.probability * 100).toFixed(1)}% match
//                       </p>
//                     </div>
//                   </div>
//                   <div className="w-full bg-green-100 rounded-full h-1.5 mb-3">
//                     <div
//                       className="bg-green-600 h-1.5 rounded-full"
//                       style={{ width: `${Math.min(p.probability * 100, 100)}%` }}
//                     />
//                   </div>
//                   <button
//                     type="button"
//                     onClick={() => handleViewGuide(p)}
//                     className="w-full text-sm font-medium text-green-700 border border-green-300 rounded-lg py-2 hover:bg-green-100 transition-colors"
//                   >
//                     View Growing Guide
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* ---------------- Growing Guide Modal ---------------- */}
//       {selectedCrop && (
//         <div
//           className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
//           onClick={closeModal}
//         >
//           <div
//             className="bg-white rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="sticky top-0 bg-gradient-to-r from-green-800 to-emerald-800 text-white p-5 flex items-center justify-between rounded-t-xl">
//               <h3 className="text-xl font-bold flex items-center gap-2">
//                 <Sprout className="w-5 h-5" /> {selectedCrop.display_name}
//               </h3>
//               <button
//                 onClick={closeModal}
//                 className="p-1.5 rounded-lg hover:bg-green-700 transition-colors"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             <div className="p-6">
//               {cropInfoLoading && (
//                 <div className="flex flex-col items-center justify-center py-12 text-green-600">
//                   <Loader2 className="w-8 h-8 animate-spin mb-3" />
//                   <p className="text-sm">Asking AI for a growing guide…</p>
//                 </div>
//               )}

//               {!cropInfoLoading && cropInfoError && (
//                 <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-4">
//                   <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
//                   <span>{cropInfoError}</span>
//                 </div>
//               )}

//               {!cropInfoLoading &&
//                 !cropInfoError &&
//                 cropInfoCache[selectedCrop.crop] &&
//                 (() => {
//                   const info = cropInfoCache[selectedCrop.crop];
//                   return (
//                     <div className="space-y-6">
//                       <div className="grid sm:grid-cols-2 gap-4">
//                         <InfoBlock icon={Calendar} label="Season" value={info.season} />
//                         <InfoBlock icon={Calendar} label="Sowing Time" value={info.sowing_time} />
//                         <InfoBlock icon={Droplets} label="Irrigation" value={info.irrigation} />
//                         <InfoBlock icon={Calendar} label="Harvest Time" value={info.harvest_time} />
//                       </div>

//                       <GuideSection title="Growing Process">
//                         <ol className="space-y-2 list-decimal list-inside text-green-900">
//                           {info.growing_process.map((step, i) => (
//                             <li key={i} className="text-sm leading-relaxed">
//                               {step}
//                             </li>
//                           ))}
//                         </ol>
//                       </GuideSection>

//                       <GuideSection title="Fertilizers">
//                         <BulletList items={info.fertilizers} />
//                       </GuideSection>

//                       <GuideSection title="Pesticides & Pest Control">
//                         <div className="space-y-2">
//                           {info.pesticides.map((item, i) => (
//                             <div
//                               key={i}
//                               className="text-sm bg-green-50 border border-green-100 rounded-lg p-3"
//                             >
//                               <span className="font-semibold text-green-800">{item.name}</span>
//                               <span className="text-green-700"> — {item.purpose}</span>
//                             </div>
//                           ))}
//                         </div>
//                       </GuideSection>

//                       <GuideSection title="Common Diseases">
//                         <BulletList items={info.common_diseases} />
//                       </GuideSection>

//                       <GuideSection title="Tips for Better Yield">
//                         <BulletList items={info.tips} />
//                       </GuideSection>
//                     </div>
//                   );
//                 })()}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const InfoBlock = ({ icon: Icon, label, value }) => (
//   <div className="bg-green-50 border border-green-100 rounded-lg p-3">
//     <p className="flex items-center gap-1.5 text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">
//       <Icon className="w-3.5 h-3.5" /> {label}
//     </p>
//     <p className="text-sm text-green-900">{value}</p>
//   </div>
// );

// const GuideSection = ({ title, children }) => (
//   <div>
//     <h4 className="text-sm font-bold text-green-800 uppercase tracking-wide mb-2">{title}</h4>
//     {children}
//   </div>
// );

// const BulletList = ({ items }) => (
//   <ul className="space-y-1.5">
//     {items.map((item, i) => (
//       <li key={i} className="flex items-start gap-2 text-sm text-green-900">
//         <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
//         <span>{item}</span>
//       </li>
//     ))}
//   </ul>
// );

// export default Recommendation;

import React, { useState } from "react";
import {
  MapPin,
  Thermometer,
  Droplets,
  Leaf,
  ArrowLeft,
  Sprout,
  Upload,
  X,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Info,
  Calendar,
  Sparkles,
  FlaskConical,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  predictCrops,
  fetchWeather,
  extractSoilReport,
  getCropInfo,
} from "../services/cropRecommendationApi";
import FarmToolsTabs from "../components/FarmToolsTabs";

const FIELD_META = {
  N: { label: "Nitrogen (N)", hint: "typical range 0–140" },
  P: { label: "Phosphorus (P)", hint: "typical range 5–145" },
  K: { label: "Potassium (K)", hint: "typical range 5–205" },
  ph: { label: "Soil pH", hint: "typical range 3.5–9.5" },
  temperature: { label: "Temperature (°C)", hint: "" },
  humidity: { label: "Humidity (%)", hint: "" },
  rainfall: { label: "Rainfall (mm)", hint: "" },
};

const EMPTY_FORM = { N: "", P: "", K: "", ph: "", temperature: "", humidity: "", rainfall: "" };

const Recommendation = () => {
  const navigate = useNavigate();

  // ---------- Location + weather ----------
  const [locationStatus, setLocationStatus] = useState("idle"); // idle | requesting | granted | denied | error
  const [locationMessage, setLocationMessage] = useState("");
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherSource, setWeatherSource] = useState("");

  // ---------- Form ----------
  const [form, setForm] = useState(EMPTY_FORM);
  const [autoFilled, setAutoFilled] = useState(new Set());

  const updateField = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    setAutoFilled((prev) => {
      const next = new Set(prev);
      next.delete(field);
      return next;
    });
  };

  // ---------- Soil report upload ----------
  const [soilFile, setSoilFile] = useState(null);
  const [soilExtracting, setSoilExtracting] = useState(false);
  const [soilExtractError, setSoilExtractError] = useState("");
  const [soilNotes, setSoilNotes] = useState("");

  // ---------- Prediction ----------
  const [predicting, setPredicting] = useState(false);
  const [predictError, setPredictError] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [modelMeta, setModelMeta] = useState(null);

  // ---------- Crop growing-guide modal ----------
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [cropInfoCache, setCropInfoCache] = useState({});
  const [cropInfoLoading, setCropInfoLoading] = useState(false);
  const [cropInfoError, setCropInfoError] = useState("");

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus("error");
      setLocationMessage(
        "Your browser doesn't support location access. Please enter the climate values manually below."
      );
      return;
    }

    setLocationStatus("requesting");
    setLocationMessage("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setLocationStatus("granted");
        const { latitude, longitude } = position.coords;

        setWeatherLoading(true);
        try {
          const data = await fetchWeather(latitude, longitude);
          setForm((f) => ({
            ...f,
            temperature: data.temperature ?? f.temperature,
            humidity: data.humidity ?? f.humidity,
            rainfall: data.rainfall ?? f.rainfall,
          }));
          setAutoFilled((prev) => new Set([...prev, "temperature", "humidity", "rainfall"]));
          setWeatherSource(data.source);
        } catch (err) {
          setLocationMessage(err.message);
        } finally {
          setWeatherLoading(false);
        }
      },
      (error) => {
        setLocationStatus("denied");
        setLocationMessage(
          error.code === error.PERMISSION_DENIED
            ? "Location permission denied. You can still enter the climate values manually below."
            : "Couldn't get your location. You can still enter the climate values manually below."
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  const handleSoilFileChange = (e) => {
    setSoilFile(e.target.files?.[0] || null);
    setSoilExtractError("");
    setSoilNotes("");
  };

  const handleExtractSoilReport = async () => {
    if (!soilFile) return;
    setSoilExtracting(true);
    setSoilExtractError("");
    try {
      const data = await extractSoilReport(soilFile);
      setForm((f) => ({
        ...f,
        N: data.N ?? f.N,
        P: data.P ?? f.P,
        K: data.K ?? f.K,
        ph: data.ph ?? f.ph,
        temperature: data.temperature ?? f.temperature,
        humidity: data.humidity ?? f.humidity,
        rainfall: data.rainfall ?? f.rainfall,
      }));
      setAutoFilled((prev) => new Set([...prev, ...(data.fields_found || [])]));
      setSoilNotes(data.notes || "");
      if (!data.fields_found || data.fields_found.length === 0) {
        setSoilExtractError(
          "Couldn't find any recognizable values in that file. Please enter them manually below."
        );
      }
    } catch (err) {
      setSoilExtractError(err.message);
    } finally {
      setSoilExtracting(false);
    }
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    const parsed = {};
    for (const key of Object.keys(EMPTY_FORM)) {
      const value = parseFloat(form[key]);
      if (Number.isNaN(value)) {
        setPredictError("Please fill in all seven fields with valid numbers before submitting.");
        return;
      }
      parsed[key] = value;
    }

    setPredicting(true);
    setPredictError("");
    setPredictions([]);
    try {
      const data = await predictCrops({ ...parsed, top_n: 5 });
      setPredictions(data.predictions);
      setModelMeta({ model_name: data.model_name, accuracy: data.accuracy });
    } catch (err) {
      setPredictError(err.message);
    } finally {
      setPredicting(false);
    }
  };

  const handleViewGuide = async (prediction) => {
    setSelectedCrop(prediction);
    setCropInfoError("");
    if (cropInfoCache[prediction.crop]) return;

    setCropInfoLoading(true);
    try {
      const data = await getCropInfo(prediction.crop);
      setCropInfoCache((prev) => ({ ...prev, [prediction.crop]: data }));
    } catch (err) {
      setCropInfoError(err.message);
    } finally {
      setCropInfoLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedCrop(null);
    setCropInfoError("");
  };

  const isAutoFilled = (field) => autoFilled.has(field);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 pt-16">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-800 to-emerald-800 text-white py-6 sticky top-16 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="p-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <Sprout className="w-8 h-8" />
              <h1 className="text-2xl md:text-3xl font-bold">Crop Recommendation System</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-4 lg:p-8 space-y-8">
        <FarmToolsTabs active="recommendation" />

        <div className="text-center">
          <h2 className="text-3xl font-bold text-green-800 mb-2">
            Find the Best Crops for Your Land
          </h2>
          <p className="text-green-600">
            A machine-learning model trained on soil and climate data recommends crops for you —
            then AI explains exactly how to grow each one.
          </p>
        </div>

        <form onSubmit={handlePredict} className="space-y-8">
          {/* ---------------- Step 1: Location & Climate ---------------- */}
          <div className="bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-green-100">
            <h3 className="flex items-center gap-2 text-xl font-bold text-green-800 mb-1">
              <MapPin className="w-5 h-5" /> Step 1 — Location &amp; Climate
            </h3>
            <p className="text-sm text-green-600 mb-5">
              Share your location to auto-fill temperature, humidity and rainfall, or enter them
              yourself.
            </p>

            <button
              type="button"
              onClick={handleUseLocation}
              disabled={locationStatus === "requesting" || weatherLoading}
              className="mb-4 inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-5 py-3 rounded-lg font-medium transition-colors"
            >
              {locationStatus === "requesting" || weatherLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {locationStatus === "requesting" ? "Requesting permission…" : "Fetching weather…"}
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4" /> Use My Current Location
                </>
              )}
            </button>

            {locationMessage && (
              <div className="mb-4 flex items-start gap-2 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg p-3">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{locationMessage}</span>
              </div>
            )}

            <div className="grid sm:grid-cols-3 gap-4">
              {["temperature", "humidity", "rainfall"].map((field) => (
                <div key={field}>
                  <label className="flex items-center gap-1.5 text-sm font-semibold text-green-800 mb-2">
                    {field === "rainfall" ? (
                      <Droplets className="w-4 h-4" />
                    ) : (
                      <Thermometer className="w-4 h-4" />
                    )}
                    {FIELD_META[field].label}
                    {isAutoFilled(field) && (
                      <span className="ml-1 text-[10px] font-medium bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                        auto-filled
                      </span>
                    )}
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={form[field]}
                    onChange={(e) => updateField(field, e.target.value)}
                    placeholder="Required"
                    className="w-full p-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                  />
                </div>
              ))}
            </div>
            {weatherSource && (
              <p className="text-xs text-green-500 mt-2 flex items-center gap-1">
                <Info className="w-3.5 h-3.5" /> {weatherSource}
              </p>
            )}
          </div>

          {/* ---------------- Step 2: Soil Nutrients ---------------- */}
          <div className="bg-white rounded-xl p-6 lg:p-8 shadow-sm border border-green-100">
            <h3 className="flex items-center gap-2 text-xl font-bold text-green-800 mb-1">
              <FlaskConical className="w-5 h-5" /> Step 2 — Soil Nutrients
            </h3>
            <p className="text-sm text-green-600 mb-5">
              Enter your soil test values, or upload a photo/PDF of your soil health card and
              we'll read it for you.
            </p>

            {/* Soil report upload */}
            <div className="mb-6 border-2 border-dashed border-green-200 rounded-lg p-4 bg-green-50/50">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <label className="flex items-center gap-2 text-sm font-medium text-green-700 bg-white border border-green-300 px-4 py-2.5 rounded-lg cursor-pointer hover:bg-green-50 transition-colors">
                  <Upload className="w-4 h-4" />
                  {soilFile ? soilFile.name : "Choose soil report (image or PDF)"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    onChange={handleSoilFileChange}
                    className="hidden"
                  />
                </label>
                <button
                  type="button"
                  onClick={handleExtractSoilReport}
                  disabled={!soilFile || soilExtracting}
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
                >
                  {soilExtracting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Reading report…
                    </>
                  ) : (
                    "Extract Values"
                  )}
                </button>
              </div>

              {soilExtractError && (
                <div className="mt-3 flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{soilExtractError}</span>
                </div>
              )}
              {soilNotes && (
                <div className="mt-3 flex items-start gap-2 text-sm text-blue-800 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{soilNotes}</span>
                </div>
              )}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {["N", "P", "K", "ph"].map((field) => (
                <div key={field}>
                  <label className="flex items-center gap-1.5 text-sm font-semibold text-green-800 mb-2">
                    <Leaf className="w-4 h-4" />
                    {FIELD_META[field].label}
                    {isAutoFilled(field) && (
                      <span className="ml-1 text-[10px] font-medium bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">
                        detected
                      </span>
                    )}
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={form[field]}
                    onChange={(e) => updateField(field, e.target.value)}
                    placeholder={FIELD_META[field].hint}
                    className="w-full p-3 border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ---------------- Submit ---------------- */}
          {predictError && (
            <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{predictError}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={predicting}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-4 px-8 rounded-lg font-semibold text-lg transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            {predicting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Analyzing…
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" /> Get AI Crop Recommendations
              </>
            )}
          </button>
        </form>

        {/* ---------------- Results ---------------- */}
        {predictions.length > 0 && (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-green-100">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-green-800 mb-1 flex items-center justify-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-600" /> Recommended Crops
              </h3>
              {modelMeta && (
                <p className="text-sm text-green-500">
                  {modelMeta.model_name} · {(modelMeta.accuracy * 100).toFixed(1)}% test accuracy
                </p>
              )}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {predictions.map((p) => (
                <div
                  key={p.crop}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-lg border border-green-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Sprout className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800">{p.display_name}</h4>
                      <p className="text-xs text-green-600">
                        {(p.probability * 100).toFixed(1)}% match
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-green-100 rounded-full h-1.5 mb-3">
                    <div
                      className="bg-green-600 h-1.5 rounded-full"
                      style={{ width: `${Math.min(p.probability * 100, 100)}%` }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleViewGuide(p)}
                    className="w-full text-sm font-medium text-green-700 border border-green-300 rounded-lg py-2 hover:bg-green-100 transition-colors"
                  >
                    View Growing Guide
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ---------------- Growing Guide Modal ---------------- */}
      {selectedCrop && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-gradient-to-r from-green-800 to-emerald-800 text-white p-5 flex items-center justify-between rounded-t-xl">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Sprout className="w-5 h-5" /> {selectedCrop.display_name}
              </h3>
              <button
                onClick={closeModal}
                className="p-1.5 rounded-lg hover:bg-green-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {cropInfoLoading && (
                <div className="flex flex-col items-center justify-center py-12 text-green-600">
                  <Loader2 className="w-8 h-8 animate-spin mb-3" />
                  <p className="text-sm">Asking AI for a growing guide…</p>
                </div>
              )}

              {!cropInfoLoading && cropInfoError && (
                <div className="flex items-start gap-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-4">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{cropInfoError}</span>
                </div>
              )}

              {!cropInfoLoading &&
                !cropInfoError &&
                cropInfoCache[selectedCrop.crop] &&
                (() => {
                  const info = cropInfoCache[selectedCrop.crop];
                  return (
                    <div className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <InfoBlock icon={Calendar} label="Season" value={info.season} />
                        <InfoBlock icon={Calendar} label="Sowing Time" value={info.sowing_time} />
                        <InfoBlock icon={Droplets} label="Irrigation" value={info.irrigation} />
                        <InfoBlock icon={Calendar} label="Harvest Time" value={info.harvest_time} />
                      </div>

                      <GuideSection title="Growing Process">
                        <ol className="space-y-2 list-decimal list-inside text-green-900">
                          {info.growing_process.map((step, i) => (
                            <li key={i} className="text-sm leading-relaxed">
                              {step}
                            </li>
                          ))}
                        </ol>
                      </GuideSection>

                      <GuideSection title="Fertilizers">
                        <BulletList items={info.fertilizers} />
                      </GuideSection>

                      <GuideSection title="Pesticides & Pest Control">
                        <div className="space-y-2">
                          {info.pesticides.map((item, i) => (
                            <div
                              key={i}
                              className="text-sm bg-green-50 border border-green-100 rounded-lg p-3"
                            >
                              <span className="font-semibold text-green-800">{item.name}</span>
                              <span className="text-green-700"> — {item.purpose}</span>
                            </div>
                          ))}
                        </div>
                      </GuideSection>

                      <GuideSection title="Common Diseases">
                        <BulletList items={info.common_diseases} />
                      </GuideSection>

                      <GuideSection title="Tips for Better Yield">
                        <BulletList items={info.tips} />
                      </GuideSection>
                    </div>
                  );
                })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InfoBlock = ({ icon: Icon, label, value }) => (
  <div className="bg-green-50 border border-green-100 rounded-lg p-3">
    <p className="flex items-center gap-1.5 text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">
      <Icon className="w-3.5 h-3.5" /> {label}
    </p>
    <p className="text-sm text-green-900">{value}</p>
  </div>
);

const GuideSection = ({ title, children }) => (
  <div>
    <h4 className="text-sm font-bold text-green-800 uppercase tracking-wide mb-2">{title}</h4>
    {children}
  </div>
);

const BulletList = ({ items }) => (
  <ul className="space-y-1.5">
    {items.map((item, i) => (
      <li key={i} className="flex items-start gap-2 text-sm text-green-900">
        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-1.5 flex-shrink-0" />
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

export default Recommendation;
