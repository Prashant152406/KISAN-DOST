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

const Cucumber = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("cucumber-introduction");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sections = [
    { id: "cucumber-introduction", title: "Introduction", icon: Leaf },
    { id: "cucumber-cropping", title: "Cropping Session", icon: Calendar },
    { id: "cucumber-climate-soil", title: "Climate & Soil Requirements", icon: Thermometer },
    { id: "cucumber-field-prep", title: "Field Preparation", icon: Scissors },
    { id: "cucumber-sowing", title: "Sowing Techniques", icon: Wheat },
    { id: "cucumber-fertilizer", title: "Fertilizer Requirements", icon: Package },
    { id: "cucumber-irrigation", title: "Irrigation Practices", icon: Droplets },
    { id: "cucumber-weed", title: "Weed Management", icon: Scissors },
    { id: "cucumber-pests-diseases", title: "Pest & Disease Management", icon: Bug },
    { id: "cucumber-harvest", title: "Harvesting Techniques", icon: Wheat },
    { id: "cucumber-post-harvest", title: "Post-Harvest Handling", icon: Package },
    { id: "cucumber-processing", title: "Value Addition & Processing", icon: Award },
    { id: "cucumber-government-support", title: "Government Schemes", icon: Award },
    { id: "cucumber-organic", title: "Organic Practices", icon: Recycle },
    { id: "cucumber-intercropping", title: "Intercropping & Rotation", icon: RotateCcw },
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
              <Leaf className="w-8 h-8" />
              <h1 className="text-2xl md:text-3xl font-bold">
                Cucumber Crop Information
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
          <div id="cucumber-introduction">
            <SectionContent title="Introduction to Cucumber" icon={Leaf}>
              <p className="leading-relaxed">
                Cucumber (Cucumis sativus) is a widely cultivated plant in the gourd family, Cucurbitaceae. It is grown for its edible fruit, which is commonly consumed as a vegetable. Cucumbers are known for their refreshing taste and high water content, making them popular in salads, pickles, and various culinary dishes.
              </p>
            </SectionContent>
          </div>

          <div id="cucumber-cropping">
            <SectionContent title="Cucumber Cropping Session" icon={Calendar}>
              <SubSection title="Sowing Time">
                <ListItems
                  items={[
                    "Summer Season: Sown from March to June.",
                  ]}
                />
              </SubSection>
              <SubSection title="Harvesting Time">
                <ListItems
                  items={[
                    "Harvesting takes place between June and October after 50-70 days of growth.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="cucumber-climate-soil">
            <SectionContent title="Cucumber Climate and Soil Requirements" icon={Thermometer}>
              <SubSection title="Climate">
                <ListItems
                  items={[
                    "Cucumber thrives in warm, sunny climates with temperatures between 20°C and 30°C. It requires moderate rainfall and a consistent moisture supply.",
                  ]}
                />
              </SubSection>
              <SubSection title="Soil">
                <ListItems
                  items={[
                    "It grows best in well-drained sandy loam or loamy soils with a pH range of 5.5 to 6.8.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="cucumber-field-prep">
            <SectionContent title="Cucumber Field Preparation" icon={Scissors}>
              <SubSection title="Plowing">
                <ListItems
                  items={[
                    "The field should be plowed thoroughly to ensure proper soil aeration and preparation for sowing.",
                  ]}
                />
              </SubSection>
              <SubSection title="Bed Preparation">
                <ListItems
                  items={[
                    "Raised beds or mounds should be prepared to ensure good drainage and root development.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="cucumber-sowing">
            <SectionContent title="Cucumber Sowing Techniques" icon={Wheat}>
              <SubSection title="Seed Rate">
                <ListItems
                  items={["Approximately 2-3 kg of seeds per hectare."]}
                />
              </SubSection>
              <SubSection title="Spacing">
                <ListItems
                  items={[
                    "Maintain a spacing of 1-1.5 meters between rows and 0.5-0.75 meters between plants within a row.",
                  ]}
                />
              </SubSection>
              <SubSection title="Sowing Depth">
                <ListItems items={["Sow seeds at a depth of 2-3 cm."]} />
              </SubSection>
            </SectionContent>
          </div>

          <div id="cucumber-fertilizer">
            <SectionContent title="Cucumber Fertilizer Requirements" icon={Package}>
              <SubSection title="Nitrogen (N)">
                <ListItems items={["60-80 kg per hectare."]} />
              </SubSection>
              <SubSection title="Phosphorus (P)">
                <ListItems items={["40-50 kg per hectare."]} />
              </SubSection>
              <SubSection title="Potassium (K)">
                <ListItems items={["40-50 kg per hectare."]} />
              </SubSection>
              <SubSection title="Organic Manure">
                <ListItems
                  items={[
                    "Apply 15-20 tons of compost or farmyard manure per hectare.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="cucumber-irrigation">
            <SectionContent title="Cucumber Irrigation Practices" icon={Droplets}>
              <SubSection title="Water Management">
                <ListItems
                  items={[
                    "Cucumber requires regular watering, especially during the flowering and fruiting stages. Drip or furrow irrigation is recommended for consistent moisture levels.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="cucumber-weed">
            <SectionContent title="Cucumber Weed Management" icon={Scissors}>
              <SubSection title="Manual Weeding">
                <ListItems
                  items={[
                    "Regular weeding is essential to prevent competition for nutrients and water.",
                  ]}
                />
              </SubSection>
              <SubSection title="Mulching">
                <ListItems
                  items={[
                    "Use organic mulches to suppress weeds and retain soil moisture.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="cucumber-pests-diseases">
            <SectionContent title="Cucumber Pest and Disease Management" icon={Bug}>
              <SubSection title="Common Pests">
                <ListItems items={["Aphids, cucumber beetles, and spider mites."]} />
              </SubSection>
              <SubSection title="Common Diseases">
                <ListItems items={["Powdery mildew, downy mildew, and bacterial wilt."]} />
              </SubSection>
              <SubSection title="Control Measures">
                <ListItems
                  items={[
                    "Use resistant varieties, crop rotation, and appropriate pesticides. Apply neem oil or insecticidal soaps in organic farming.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="cucumber-harvest">
            <SectionContent title="Cucumber Harvesting Techniques" icon={Wheat}>
              <SubSection title="Maturity Indicators">
                <ListItems
                  items={[
                    "The cucumbers should be firm, green, and reach the desired size (usually 15-20 cm long).",
                  ]}
                />
              </SubSection>
              <SubSection title="Harvesting Time">
                <ListItems
                  items={[
                    "Harvest when the cucumbers are fully grown but still tender. Pick them regularly to encourage continuous production.",
                  ]}
                />
              </SubSection>
              <SubSection title="Handling">
                <ListItems
                  items={[
                    "Handle the cucumbers gently to avoid bruising and damage.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="cucumber-post-harvest">
            <SectionContent title="Cucumber Post-Harvest Handling and Storage" icon={Package}>
              <SubSection title="Cleaning">
                <ListItems
                  items={[
                    "Clean the harvested cucumbers with water to remove soil and debris.",
                  ]}
                />
              </SubSection>
              <SubSection title="Storage">
                <ListItems
                  items={[
                    "Store in a cool, humid environment at temperatures between 10°C and 13°C with 90-95% relative humidity to maintain freshness.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="cucumber-processing">
            <SectionContent title="Cucumber Value Addition and Processing" icon={Award}>
              <SubSection title="Pickling">
                <ListItems items={["Cucumbers can be processed into pickles."]} />
              </SubSection>
              <SubSection title="Culinary Uses">
                <ListItems
                  items={[
                    "Fresh cucumbers are used in salads, sandwiches, and other dishes.",
                  ]}
                />
              </SubSection>
              <SubSection title="Juicing">
                <ListItems
                  items={["Cucumbers can be juiced for a refreshing drink."]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="cucumber-government-support">
            <SectionContent title="Cucumber Government Schemes and Support" icon={Award}>
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

          <div id="cucumber-organic">
            <SectionContent title="Cucumber Organic Practices" icon={Recycle}>
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

          <div id="cucumber-intercropping">
            <SectionContent title="Cucumber Intercropping and Crop Rotation" icon={RotateCcw}>
              <SubSection title="Intercropping">
                <ListItems
                  items={[
                    "Plant legumes or pulses alongside cucumbers to improve soil fertility and reduce pest incidence.",
                  ]}
                />
              </SubSection>
              <SubSection title="Crop Rotation">
                <ListItems
                  items={[
                    "Rotate cucumbers with other crops like maize or beans to maintain soil health and reduce disease pressure.",
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

export default Cucumber;
