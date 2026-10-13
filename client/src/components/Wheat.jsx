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

const WheatCropInfo = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("wheat-introduction");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sections = [
    { id: "wheat-introduction", title: "Introduction", icon: Leaf },
    { id: "wheat-cropping", title: "Cropping Session", icon: Calendar },
    { id: "wheat-climate-soil", title: "Climate & Soil Requirements", icon: Thermometer },
    { id: "wheat-field-prep", title: "Field Preparation", icon: Scissors },
    { id: "wheat-sowing", title: "Sowing Techniques", icon: Wheat },
    { id: "wheat-fertilizer", title: "Fertilizer Requirements", icon: Package },
    { id: "wheat-irrigation", title: "Irrigation Practices", icon: Droplets },
    { id: "wheat-weed", title: "Weed Management", icon: Scissors },
    { id: "wheat-pests-diseases", title: "Pest & Disease Management", icon: Bug },
    { id: "wheat-harvest", title: "Harvesting Techniques", icon: Wheat },
    { id: "wheat-post-harvest", title: "Post-Harvest Handling", icon: Package },
    { id: "wheat-processing", title: "Processing & Value Addition", icon: Award },
    { id: "wheat-government-support", title: "Government Support", icon: Award },
    { id: "wheat-organic", title: "Organic Practices", icon: Recycle },
    { id: "wheat-intercropping", title: "Intercropping & Rotation", icon: RotateCcw },
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
                Wheat Crop Information
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
          <div id="wheat-introduction">
            <SectionContent title="Introduction to Wheat" icon={Leaf}>
              <p className="leading-relaxed">
                Wheat (Triticum spp.) is one of the most important cereal crops in the world, forming a staple food for many cultures. It is versatile and used in various products including bread, pasta, noodles, and pastries.
              </p>
            </SectionContent>
          </div>

          <div id="wheat-cropping">
            <SectionContent title="Wheat Cropping Session" icon={Calendar}>
              <SubSection title="Sowing Time">
                <ListItems
                  items={[
                    "Rabi Season: Sown from October to December.",
                  ]}
                />
              </SubSection>
              <SubSection title="Harvesting Time">
                <ListItems
                  items={[
                    "Harvesting takes place between March and April after 110-130 days of growth.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="wheat-climate-soil">
            <SectionContent title="Wheat Climate and Soil Requirements" icon={Thermometer}>
              <SubSection title="Climate">
                <ListItems
                  items={[
                    "Wheat thrives in cool, dry climates with temperatures between 15°C and 25°C. It requires moderate rainfall.",
                  ]}
                />
              </SubSection>
              <SubSection title="Soil">
                <ListItems
                  items={[
                    "It grows best in well-drained loamy or clay loam soils with a pH range of 6.0 to 7.5.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="wheat-field-prep">
            <SectionContent title="Wheat Field Preparation" icon={Scissors}>
              <SubSection title="Plowing">
                <ListItems
                  items={[
                    "The field should be plowed thoroughly to ensure proper soil aeration and preparation for sowing.",
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

          <div id="wheat-sowing">
            <SectionContent title="Wheat Sowing Techniques" icon={Wheat}>
              <SubSection title="Seed Rate">
                <ListItems
                  items={["Approximately 100-125 kg of seeds per hectare."]}
                />
              </SubSection>
              <SubSection title="Spacing">
                <ListItems
                  items={["Maintain a spacing of 20-25 cm between rows."]}
                />
              </SubSection>
              <SubSection title="Sowing Depth">
                <ListItems items={["Sow seeds at a depth of 4-6 cm."]} />
              </SubSection>
            </SectionContent>
          </div>

          <div id="wheat-fertilizer">
            <SectionContent title="Wheat Fertilizer Requirements" icon={Package}>
              <SubSection title="Nitrogen (N)">
                <ListItems items={["100-120 kg per hectare."]} />
              </SubSection>
              <SubSection title="Phosphorus (P)">
                <ListItems items={["60-80 kg per hectare."]} />
              </SubSection>
              <SubSection title="Potassium (K)">
                <ListItems items={["40-50 kg per hectare."]} />
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

          <div id="wheat-irrigation">
            <SectionContent title="Wheat Irrigation Practices" icon={Droplets}>
              <SubSection title="Water Management">
                <ListItems
                  items={[
                    "Wheat requires 4-5 irrigations, depending on soil moisture and climatic conditions.",
                  ]}
                />
              </SubSection>
              <SubSection title="Critical Irrigation Stages">
                <ListItems
                  items={[
                    "Crown root initiation stage",
                    "Tillering stage",
                    "Jointing stage",
                    "Flowering stage",
                    "Grain filling stage",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="wheat-weed">
            <SectionContent title="Wheat Weed Management" icon={Scissors}>
              <SubSection title="Manual Weeding">
                <ListItems
                  items={[
                    "First weeding at 20-25 days after sowing.",
                    "Second weeding at 40-45 days after sowing.",
                  ]}
                />
              </SubSection>
              <SubSection title="Chemical Control">
                <ListItems
                  items={[
                    "Use pre-emergence herbicides for broad-spectrum weed control.",
                    "Post-emergence herbicides for specific weed types.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="wheat-pests-diseases">
            <SectionContent title="Wheat Pest and Disease Management" icon={Bug}>
              <SubSection title="Common Pests">
                <ListItems items={["Aphids, termites, and army worms."]} />
              </SubSection>
              <SubSection title="Common Diseases">
                <ListItems items={["Rust diseases (leaf, stem, stripe), loose smut, and powdery mildew."]} />
              </SubSection>
              <SubSection title="Control Measures">
                <ListItems
                  items={[
                    "Use resistant varieties and certified seed.",
                    "Crop rotation and proper field sanitation.",
                    "Apply appropriate fungicides and pesticides when necessary.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="wheat-harvest">
            <SectionContent title="Wheat Harvesting Techniques" icon={Wheat}>
              <SubSection title="Maturity Indicators">
                <ListItems
                  items={[
                    "Grains become hard and golden yellow in color.",
                    "Moisture content reduces to 12-14%.",
                  ]}
                />
              </SubSection>
              <SubSection title="Harvesting Methods">
                <ListItems
                  items={[
                    "Manual harvesting using sickles.",
                    "Mechanical harvesting using combine harvesters.",
                  ]}
                />
              </SubSection>
              <SubSection title="Threshing">
                <ListItems
                  items={[
                    "Traditional threshing using bullocks or tractors.",
                    "Modern threshing using mechanical threshers.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="wheat-post-harvest">
            <SectionContent title="Wheat Post-Harvest Handling" icon={Package}>
              <SubSection title="Drying">
                <ListItems
                  items={[
                    "Sun dry the harvested wheat to reduce moisture content to 10-12%.",
                    "Use mechanical dryers for large quantities.",
                  ]}
                />
              </SubSection>
              <SubSection title="Storage">
                <ListItems
                  items={[
                    "Store in clean, dry, and well-ventilated warehouses.",
                    "Use proper storage containers to prevent pest infestation.",
                  ]}
                />
              </SubSection>
              <SubSection title="Quality Control">
                <ListItems
                  items={[
                    "Regular monitoring for moisture content and pest damage.",
                    "Proper fumigation when necessary.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="wheat-processing">
            <SectionContent title="Wheat Processing and Value Addition" icon={Award}>
              <SubSection title="Primary Processing">
                <ListItems
                  items={[
                    "Cleaning and grading of wheat grains.",
                    "Milling to produce wheat flour of different grades.",
                  ]}
                />
              </SubSection>
              <SubSection title="Value-Added Products">
                <ListItems
                  items={[
                    "Bread, biscuits, and bakery products.",
                    "Pasta, noodles, and macaroni.",
                    "Wheat bran for animal feed and health products.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="wheat-government-support">
            <SectionContent title="Wheat Government Support" icon={Award}>
              <SubSection title="Minimum Support Price (MSP)">
                <ListItems
                  items={[
                    "Government announces MSP for wheat procurement.",
                    "Ensures fair prices for farmers.",
                  ]}
                />
              </SubSection>
              <SubSection title="Subsidies">
                <ListItems
                  items={[
                    "Fertilizer subsidies to reduce input costs.",
                    "Seed subsidies for high-yielding varieties.",
                    "Equipment subsidies for farm mechanization.",
                  ]}
                />
              </SubSection>
              <SubSection title="Training Programs">
                <ListItems
                  items={[
                    "Extension services for modern wheat cultivation techniques.",
                    "Training on best practices and new technologies.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="wheat-organic">
            <SectionContent title="Wheat Organic Practices" icon={Recycle}>
              <SubSection title="Organic Fertilizers">
                <ListItems
                  items={[
                    "Use of farmyard manure and compost.",
                    "Green manuring with leguminous crops.",
                    "Bio-fertilizers like Azotobacter and PSB.",
                  ]}
                />
              </SubSection>
              <SubSection title="Natural Pest Control">
                <ListItems
                  items={[
                    "Use of neem-based products for pest control.",
                    "Biological control using beneficial insects.",
                    "Crop diversification to reduce pest pressure.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="wheat-intercropping">
            <SectionContent title="Wheat Intercropping and Crop Rotation" icon={RotateCcw}>
              <SubSection title="Intercropping Systems">
                <ListItems
                  items={[
                    "Wheat + mustard intercropping for additional income.",
                    "Wheat + gram (chickpea) combination.",
                    "Wheat + lentil intercropping system.",
                  ]}
                />
              </SubSection>
              <SubSection title="Crop Rotation">
                <ListItems
                  items={[
                    "Rice-wheat rotation system in irrigated areas.",
                    "Wheat-maize-mung bean rotation.",
                    "Wheat followed by summer fodder crops.",
                  ]}
                />
              </SubSection>
              <SubSection title="Benefits">
                <ListItems
                  items={[
                    "Improved soil fertility and health.",
                    "Reduced pest and disease incidence.",
                    "Better resource utilization and income generation.",
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

export default WheatCropInfo;
