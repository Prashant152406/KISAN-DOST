import { Sprout, Bug } from "lucide-react";
import { useNavigate } from "react-router-dom";

/**
 * Shared sub-navigation shown at the top of both the Crop
 * Recommendation and Disease Detection pages, so the two feel like
 * one "AI Farm Tools" module even though they're separate routes.
 */
const FarmToolsTabs = ({ active }) => {
  const navigate = useNavigate();

  const tabs = [
    { key: "recommendation", label: "Crop Recommendation", icon: Sprout, path: "/recommendations" },
    { key: "disease", label: "Disease Detection", icon: Bug, path: "/disease-detection" },
  ];

  return (
    <div className="flex gap-2 mb-6 bg-white rounded-lg p-1.5 border border-green-100 shadow-sm w-fit mx-auto">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            onClick={() => navigate(tab.path)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? "bg-green-600 text-white"
                : "text-green-700 hover:bg-green-50"
            }`}
          >
            <Icon className="w-4 h-4" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default FarmToolsTabs;
