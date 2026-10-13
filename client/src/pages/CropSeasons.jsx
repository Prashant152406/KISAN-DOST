import { Leaf, Calendar, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CropSeasons = () => {
  const navigate = useNavigate();

  const seasons = [
    {
      name: "Rabi",
      subtitle: "Harvest Season: April - June",
      description:
        "Winter crops sown in October-December and harvested in spring",
      crops: [
        { name: "Barley", path: "/barley" },
        { name: "Gram", path: "/gram" },
        { name: "Rapeseed", path: "/rapeseed" },
        { name: "Oat", path: "/oat" },
        { name: "Wheat", path: "/wheat" },
      ],
      color: "from-emerald-600 to-green-700",
      icon: "🌾",
    },
    {
      name: "Kharif",
      subtitle: "Harvest Season: September - October",
      description: "Monsoon crops sown in June-July and harvested in autumn",
      crops: [
        { name: "Rice", path: "/rice" },
        { name: "Jowar", path: "/jowar" },
        { name: "Maize", path: "/maize" },
        { name: "Soybean", path: "/soybean" },
        { name: "Bajra", path: "/bajra" },
        { name: "Millet", path: "/millet" },
      ],
      color: "from-green-600 to-emerald-700",
      icon: "🌱",
    },
    {
      name: "Zaid",
      subtitle: "Harvest Season: March - July",
      description: "Summer crops grown with irrigation during dry season",
      crops: [
        { name: "Pumpkin", path: "/pumpkin" },
        { name: "Cucumber", path: "/cucumber" },
      ],
      color: "from-lime-600 to-green-600",
      icon: "☀️",
    },
  ];

  const handleCropClick = (cropPath) => {
    navigate(cropPath);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 pt-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-800 to-emerald-800 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-4">
            <Leaf className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Crop Seasons Overview</h1>
          </div>
          <p className="text-green-100 text-lg max-w-2xl">
            Explore the three main agricultural seasons in India and discover
            the crops grown in each period.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {seasons.map((season, index) => (
            <div key={season.name} className="group">
              {/* Season Card */}
              <div
                className={`bg-gradient-to-br ${season.color} rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 mb-6`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{season.icon}</span>
                  <div>
                    <h2 className="text-2xl font-bold">{season.name}</h2>
                    <div className="flex items-center gap-2 text-green-100">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{season.subtitle}</span>
                    </div>
                  </div>
                </div>
                <p className="text-green-100 text-sm leading-relaxed">
                  {season.description}
                </p>
              </div>

              {/* Crops Grid */}
              <div className="grid grid-cols-1 gap-3">
                {season.crops.map((crop, cropIndex) => (
                  <button
                    key={crop.name}
                    onClick={() => handleCropClick(crop.path)}
                    className="bg-white border-2 border-green-200 rounded-lg p-4 hover:border-green-400 hover:bg-green-50 transition-all duration-200 group/crop shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-green-800 group-hover/crop:text-green-900">
                        {crop.name}
                      </span>
                      <ArrowRight className="w-4 h-4 text-green-600 opacity-0 group-hover/crop:opacity-100 transform translate-x-0 group-hover/crop:translate-x-1 transition-all duration-200" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-16 bg-green-100 rounded-2xl p-8 border border-green-200">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-green-800 mb-4">
              Understanding Seasonal Agriculture
            </h3>
            <p className="text-green-700 leading-relaxed">
              India's agricultural calendar revolves around these three main
              seasons, each optimized for different climatic conditions. Rabi
              crops benefit from cool, dry weather; Kharif crops thrive during
              the monsoon; and Zaid crops are cultivated during the hot, dry
              summer months with intensive irrigation support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CropSeasons;
