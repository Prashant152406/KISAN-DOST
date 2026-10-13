import React, { useState, useEffect } from "react";
import {
  Leaf,
  Calendar,
  Thermometer,
  Droplets,
  Scissors,
  Bug,
  Wheat,
  Package,
  Award,
  Recycle,
  RotateCcw,
  ChevronRight,
  Menu,
  X,
  ArrowLeft,
  BookOpen,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Rice = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("introduction");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sections = [
    { id: "introduction", title: "Introduction", icon: Leaf },
    { id: "types", title: "Types of Rice", icon: BookOpen },
    { id: "cropping-session", title: "Cropping Session", icon: Calendar },
    { id: "climate-soil", title: "Climate & Soil Requirements", icon: Thermometer },
    { id: "field-preparation", title: "Field Preparation", icon: Scissors },
    { id: "sowing-techniques", title: "Sowing Techniques", icon: Wheat },
    { id: "fertilizer", title: "Fertilizer Requirements", icon: Package },
    { id: "irrigation", title: "Irrigation Practices", icon: Droplets },
    { id: "weed-management", title: "Weed Management", icon: Scissors },
    { id: "pests-diseases", title: "Pest & Disease Management", icon: Bug },
    { id: "harvesting", title: "Harvesting Techniques", icon: Wheat },
    { id: "post-harvest", title: "Post-Harvest Handling", icon: Package },
    { id: "value-addition", title: "Value Addition & Processing", icon: Award },
    { id: "government-schemes", title: "Government Schemes", icon: Award },
    { id: "organic-practices", title: "Organic Practices", icon: Recycle },
    { id: "intercropping", title: "Intercropping & Rotation", icon: RotateCcw },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.6 }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  const SectionContent = ({ title, children, icon: Icon }) => (
    <section className="bg-white rounded-xl p-6 mb-6 shadow-sm border border-green-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-green-100 rounded-lg">
          <Icon className="w-5 h-5 text-green-700" />
        </div>
        <h2 className="text-2xl font-bold text-green-800">{title}</h2>
      </div>
      <div className="text-green-700">{children}</div>
    </section>
  );

  const SubSection = ({ title, children }) => (
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center gap-2">
        <ChevronRight className="w-4 h-4" />
        {title}
      </h3>
      <div className="ml-6">{children}</div>
    </div>
  );

  const ListItems = ({ items }) => (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex items-start gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 pt-16">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-800 to-emerald-800 text-white py-6 sticky top-16 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/crop-seasons")}
              className="p-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <Wheat className="w-8 h-8" />
              <h1 className="text-2xl md:text-3xl font-bold">
                Rice Crop Information
              </h1>
            </div>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar Navigation */}
        <nav
          className={`
      ${isMobileMenuOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0"
            }
      fixed left-0 h-screen w-72 bg-green-900 text-white p-4 z-40
      transform transition-transform duration-300 ease-in-out
      overflow-y-auto
    `}
        >
          <div className="space-y-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`
                w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200
                ${activeSection === section.id
                      ? "bg-green-700 text-white shadow-md"
                      : "hover:bg-green-800 text-green-100"
                    }
              `}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm font-medium">{section.title}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Overlay for mobile */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="w-full pl-0 lg:pl-72 p-4 lg:p-8">
          <div id="introduction">
            <SectionContent title="Introduction to Rice" icon={Leaf}>
              <p className="leading-relaxed">
                Rice is a staple food for a large part of the world's population, especially in Asia. It comes in two main types: paddy rice and deepwater rice. Paddy rice is grown in fields that can be flooded with water, while deepwater rice is grown in areas prone to flooding.
              </p>
            </SectionContent>
          </div>

          <div id="types">
            <SectionContent title="Types of Rice" icon={BookOpen}>
              <SubSection title="Paddy Rice">
                <ListItems
                  items={[
                    "Also known as lowland rice, it is grown in irrigated fields.",
                  ]}
                />
              </SubSection>
              <SubSection title="Deepwater Rice">
                <ListItems
                  items={[
                    "Grows in areas with deep flooding, such as river deltas.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="cropping-session">
            <SectionContent title="Cropping Session" icon={Calendar}>
              <SubSection title="Sowing Time">
                <ListItems
                  items={[
                    "Paddy Rice: Typically sown from late May to early June.",
                    "Deepwater Rice: Sowing can vary but usually starts at the beginning of the rainy season.",
                  ]}
                />
              </SubSection>
              <SubSection title="Harvesting Time">
                <ListItems
                  items={[
                    "Paddy Rice: Harvested from late October to early December.",
                    "Deepwater Rice: Harvested depending on the flooding cycle, usually from November to January.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="climate-soil">
            <SectionContent title="Climate and Soil Requirements" icon={Thermometer}>
              <SubSection title="Climate">
                <ListItems
                  items={[
                    "Rice thrives in warm, humid climates with temperatures between 20°C and 30°C.",
                  ]}
                />
              </SubSection>
              <SubSection title="Soil">
                <ListItems
                  items={[
                    "Prefers clayey loam soils that can retain water. The ideal pH for rice cultivation is between 5.5 and 7.0.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="field-preparation">
            <SectionContent title="Field Preparation" icon={Scissors}>
              <SubSection title="Plowing">
                <ListItems
                  items={[
                    "Plow the field thoroughly to ensure proper soil aeration and preparation for flooding.",
                  ]}
                />
              </SubSection>
              <SubSection title="Leveling">
                <ListItems
                  items={[
                    "Level the field to ensure uniform water distribution.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="sowing-techniques">
            <SectionContent title="Sowing Techniques" icon={Wheat}>
              <SubSection title="Broadcasting">
                <ListItems
                  items={[
                    "Scattering seeds manually or mechanically over the field.",
                  ]}
                />
              </SubSection>
              <SubSection title="Transplanting">
                <ListItems
                  items={[
                    "Growing seedlings in nurseries and transplanting them into the main field.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="fertilizer">
            <SectionContent title="Fertilizer Requirements" icon={Package}>
              <SubSection title="Nitrogen (N)">
                <ListItems items={["60-100 kg per hectare."]} />
              </SubSection>
              <SubSection title="Phosphorus (P)">
                <ListItems items={["30-50 kg per hectare."]} />
              </SubSection>
              <SubSection title="Potassium (K)">
                <ListItems items={["30-50 kg per hectare."]} />
              </SubSection>
              <SubSection title="Organic Manure">
                <ListItems
                  items={[
                    "Apply 10-15 tons of compost or farmyard manure per hectare.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="irrigation">
            <SectionContent title="Irrigation Practices" icon={Droplets}>
              <SubSection title="Water Management">
                <ListItems
                  items={[
                    "Rice fields should be flooded with 2-5 cm of water during the vegetative stage.",
                    "Maintain continuous flooding during flowering and grain filling stages.",
                    "Drain the field 7-10 days before harvesting.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="weed-management">
            <SectionContent title="Weed Management" icon={Scissors}>
              <SubSection title="Manual Weeding">
                <ListItems
                  items={[
                    "Hand weeding should be done 2-3 times during the crop season.",
                    "First weeding at 20-25 days after transplanting.",
                  ]}
                />
              </SubSection>
              <SubSection title="Herbicides">
                <ListItems
                  items={[
                    "Pre-emergence herbicides can be applied 3 days after transplanting.",
                    "Post-emergence herbicides for specific weed control.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="pests-diseases">
            <SectionContent title="Pest and Disease Management" icon={Bug}>
              <SubSection title="Common Pests">
                <ListItems items={["Brown planthopper, stem borer, and rice leaf folder."]} />
              </SubSection>
              <SubSection title="Common Diseases">
                <ListItems items={["Blast, bacterial leaf blight, and sheath blight."]} />
              </SubSection>
              <SubSection title="Control Measures">
                <ListItems
                  items={[
                    "Use resistant varieties and integrated pest management practices.",
                    "Apply appropriate pesticides and fungicides as needed.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="harvesting">
            <SectionContent title="Harvesting Techniques" icon={Wheat}>
              <SubSection title="Maturity Indicators">
                <ListItems
                  items={[
                    "Grains become golden yellow and hard.",
                    "80-85% of the grains have matured.",
                  ]}
                />
              </SubSection>
              <SubSection title="Harvesting Time">
                <ListItems
                  items={[
                    "Harvest when moisture content is around 20-25%.",
                    "Use sickles for manual harvesting or combine harvesters for mechanical harvesting.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="post-harvest">
            <SectionContent title="Post-Harvest Handling and Storage" icon={Package}>
              <SubSection title="Drying">
                <ListItems
                  items={[
                    "Sun dry the harvested rice to reduce moisture content to 14%.",
                    "Use mechanical dryers for large-scale operations.",
                  ]}
                />
              </SubSection>
              <SubSection title="Storage">
                <ListItems
                  items={[
                    "Store in clean, dry warehouses with proper ventilation.",
                    "Use hermetic storage bags to prevent pest infestation.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="value-addition">
            <SectionContent title="Value Addition and Processing" icon={Award}>
              <SubSection title="Rice Processing">
                <ListItems
                  items={[
                    "Milling to remove husk and bran layers.",
                    "Polishing to produce white rice.",
                  ]}
                />
              </SubSection>
              <SubSection title="Value-Added Products">
                <ListItems
                  items={[
                    "Rice flour, rice bran oil, and rice wine.",
                    "Puffed rice and rice flakes for snack foods.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="government-schemes">
            <SectionContent title="Government Schemes and Support" icon={Award}>
              <SubSection title="Subsidies">
                <ListItems
                  items={[
                    "Subsidies available for seeds, fertilizers, and farm equipment.",
                    "Minimum Support Price (MSP) for rice procurement.",
                  ]}
                />
              </SubSection>
              <SubSection title="Training Programs">
                <ListItems
                  items={[
                    "Extension services for modern rice cultivation techniques.",
                    "Training on integrated pest management and organic farming.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="organic-practices">
            <SectionContent title="Organic Practices" icon={Recycle}>
              <SubSection title="Bio-fertilizers">
                <ListItems
                  items={[
                    "Use of blue-green algae for nitrogen fixation in rice fields.",
                    "Application of Azolla as green manure.",
                  ]}
                />
              </SubSection>
              <SubSection title="Natural Pest Control">
                <ListItems
                  items={[
                    "Use of neem-based pesticides and pheromone traps.",
                    "Encouraging beneficial insects and birds in rice fields.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="intercropping">
            <SectionContent title="Intercropping and Crop Rotation" icon={RotateCcw}>
              <SubSection title="Rice-Fish Culture">
                <ListItems
                  items={[
                    "Integration of fish farming with rice cultivation for additional income.",
                    "Fish help control pests and provide natural fertilizer.",
                  ]}
                />
              </SubSection>
              <SubSection title="Crop Rotation">
                <ListItems
                  items={[
                    "Rotate rice with legumes like pulses to improve soil fertility.",
                    "Rice-wheat rotation system in northern plains.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Rice;
