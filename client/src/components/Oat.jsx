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
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Oat = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("oat-introduction");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sections = [
    { id: "oat-introduction", title: "Introduction", icon: Leaf },
    { id: "oat-cropping", title: "Cropping Session", icon: Calendar },
    { id: "oat-climate-soil", title: "Climate & Soil Requirements", icon: Thermometer },
    { id: "oat-field-prep", title: "Field Preparation", icon: Scissors },
    { id: "oat-sowing", title: "Sowing Techniques", icon: Wheat },
    { id: "oat-fertilizer", title: "Fertilizer Requirements", icon: Package },
    { id: "oat-irrigation", title: "Irrigation Practices", icon: Droplets },
    { id: "oat-weed", title: "Weed Management", icon: Scissors },
    { id: "oat-pests-diseases", title: "Pest & Disease Management", icon: Bug },
    { id: "oat-harvest", title: "Harvesting Techniques", icon: Wheat },
    { id: "oat-post-harvest", title: "Post-Harvest Handling", icon: Package },
    { id: "oat-processing", title: "Value Addition & Processing", icon: Award },
    { id: "oat-government-support", title: "Government Schemes", icon: Award },
    { id: "oat-organic", title: "Organic Practices", icon: Recycle },
    { id: "oat-intercropping", title: "Intercropping & Rotation", icon: RotateCcw },
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
                Oat Crop Information
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
          <div id="oat-introduction">
            <SectionContent title="Introduction to Oat" icon={Leaf}>
              <p className="leading-relaxed">
                Oat (Avena sativa) is a cereal grain grown for its seed, which is known for its nutritional value and versatility. Oats are used for human consumption, livestock feed, and in various industrial applications.
              </p>
            </SectionContent>
          </div>

          <div id="oat-cropping">
            <SectionContent title="Oat Cropping Session" icon={Calendar}>
              <SubSection title="Sowing Time">
                <ListItems
                  items={[
                    "Spring Oats: Sown from February to April.",
                    "Winter Oats: Sown from September to October.",
                  ]}
                />
              </SubSection>
              <SubSection title="Harvesting Time">
                <ListItems
                  items={[
                    "Spring Oats: Harvested from July to September.",
                    "Winter Oats: Harvested from June to July.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="oat-climate-soil">
            <SectionContent title="Oat Climate and Soil Requirements" icon={Thermometer}>
              <SubSection title="Climate">
                <ListItems
                  items={[
                    "Oats thrive in cool, moist climates with temperatures between 10°C and 25°C. They require adequate rainfall.",
                  ]}
                />
              </SubSection>
              <SubSection title="Soil">
                <ListItems
                  items={[
                    "Oats grow best in well-drained loamy or sandy loam soils with a pH range of 5.5 to 7.0.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="oat-field-prep">
            <SectionContent title="Oat Field Preparation" icon={Scissors}>
              <SubSection title="Plowing">
                <ListItems
                  items={[
                    "The field should be plowed thoroughly to ensure proper soil aeration.",
                  ]}
                />
              </SubSection>
              <SubSection title="Leveling">
                <ListItems
                  items={[
                    "Level the field to ensure even distribution of seeds and water.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="oat-sowing">
            <SectionContent title="Oat Sowing Techniques" icon={Wheat}>
              <SubSection title="Seed Rate">
                <ListItems
                  items={["Approximately 80-100 kg of seeds per hectare."]}
                />
              </SubSection>
              <SubSection title="Spacing">
                <ListItems
                  items={["Maintain a spacing of 20-25 cm between rows."]}
                />
              </SubSection>
              <SubSection title="Sowing Depth">
                <ListItems items={["Sow seeds at a depth of 2-4 cm."]} />
              </SubSection>
            </SectionContent>
          </div>

          <div id="oat-fertilizer">
            <SectionContent title="Oat Fertilizer Requirements" icon={Package}>
              <SubSection title="Nitrogen (N)">
                <ListItems items={["40-60 kg per hectare."]} />
              </SubSection>
              <SubSection title="Phosphorus (P)">
                <ListItems items={["20-30 kg per hectare."]} />
              </SubSection>
              <SubSection title="Potassium (K)">
                <ListItems items={["20-30 kg per hectare."]} />
              </SubSection>
              <SubSection title="Organic Manure">
                <ListItems
                  items={[
                    "Apply 8-10 tons of compost or farmyard manure per hectare.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="oat-irrigation">
            <SectionContent title="Oat Irrigation Practices" icon={Droplets}>
              <SubSection title="Water Management">
                <ListItems
                  items={[
                    "Oats require 2-3 irrigations depending on soil moisture and climatic conditions. The critical stages for irrigation are tillering and flowering.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="oat-weed">
            <SectionContent title="Oat Weed Management" icon={Scissors}>
              <SubSection title="Manual Weeding">
                <ListItems
                  items={[
                    "Regular weeding is essential to prevent competition for nutrients and water.",
                  ]}
                />
              </SubSection>
              <SubSection title="Herbicides">
                <ListItems
                  items={[
                    "Use selective herbicides if manual weeding is not feasible.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="oat-pests-diseases">
            <SectionContent title="Oat Pest and Disease Management" icon={Bug}>
              <SubSection title="Common Pests">
                <ListItems items={["Aphids, armyworms, and oat leaf miners."]} />
              </SubSection>
              <SubSection title="Common Diseases">
                <ListItems items={["Crown rust, powdery mildew, and smut."]} />
              </SubSection>
              <SubSection title="Control Measures">
                <ListItems
                  items={[
                    "Use resistant varieties, crop rotation, and appropriate pesticides.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="oat-harvest">
            <SectionContent title="Oat Harvesting Techniques" icon={Wheat}>
              <SubSection title="Maturity Indicators">
                <ListItems
                  items={["Grains harden and turn golden yellow."]}
                />
              </SubSection>
              <SubSection title="Harvesting Time">
                <ListItems
                  items={[
                    "Harvest when the moisture content of the grains is around 14-16%.",
                  ]}
                />
              </SubSection>
              <SubSection title="Threshing">
                <ListItems
                  items={[
                    "Use mechanical threshers or manual methods to separate grains from the chaff.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="oat-post-harvest">
            <SectionContent title="Oat Post-Harvest Handling and Storage" icon={Package}>
              <SubSection title="Drying">
                <ListItems
                  items={[
                    "Dry the harvested grains to reduce moisture content to below 12%.",
                  ]}
                />
              </SubSection>
              <SubSection title="Storage">
                <ListItems
                  items={[
                    "Store in a cool, dry place to prevent mold and insect infestation.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="oat-processing">
            <SectionContent title="Oat Value Addition and Processing" icon={Award}>
              <SubSection title="Grain Processing">
                <ListItems
                  items={[
                    "Oat grains can be processed into oatmeal, rolled oats, oat flour, and other products.",
                  ]}
                />
              </SubSection>
              <SubSection title="Animal Feed">
                <ListItems
                  items={["Oats are also used as feed for livestock and horses."]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="oat-government-support">
            <SectionContent title="Oat Government Schemes and Support" icon={Award}>
              <SubSection title="Subsidies">
                <ListItems
                  items={[
                    "Various government schemes provide subsidies for seeds, fertilizers, and equipment.",
                  ]}
                />
              </SubSection>
              <SubSection title="Training Programs">
                <ListItems
                  items={[
                    "Training programs are available to educate farmers on best practices.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="oat-organic">
            <SectionContent title="Oat Organic Practices" icon={Recycle}>
              <SubSection title="Bio-fertilizers">
                <ListItems
                  items={[
                    "Use bio-fertilizers like Azospirillum for seed treatment to enhance nitrogen fixation.",
                  ]}
                />
              </SubSection>
              <SubSection title="Composting">
                <ListItems
                  items={[
                    "Incorporate organic matter to improve soil fertility and structure.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="oat-intercropping">
            <SectionContent title="Oat Intercropping and Crop Rotation" icon={RotateCcw}>
              <SubSection title="Intercropping">
                <ListItems
                  items={[
                    "Plant legumes or pulses alongside oats to improve soil fertility and reduce pest incidence.",
                  ]}
                />
              </SubSection>
              <SubSection title="Crop Rotation">
                <ListItems
                  items={[
                    "Rotate oats with other crops like wheat or barley to maintain soil health and reduce disease pressure.",
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

export default Oat;
