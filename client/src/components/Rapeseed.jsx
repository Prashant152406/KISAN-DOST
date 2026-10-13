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

const RapeseedMustard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("rapeseed-introduction");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sections = [
    // Rapeseed sections
    { id: "rapeseed-introduction", title: "Rapeseed Introduction", icon: Leaf },
    { id: "rapeseed-cropping", title: "Rapeseed Cropping", icon: Calendar },
    { id: "rapeseed-climate-soil", title: "Rapeseed Climate & Soil", icon: Thermometer },
    { id: "rapeseed-field-prep", title: "Rapeseed Field Preparation", icon: Scissors },
    { id: "rapeseed-sowing", title: "Rapeseed Sowing", icon: Wheat },
    { id: "rapeseed-fertilizer", title: "Rapeseed Fertilizer", icon: Package },
    { id: "rapeseed-irrigation", title: "Rapeseed Irrigation", icon: Droplets },
    { id: "rapeseed-weed", title: "Rapeseed Weed Management", icon: Scissors },
    { id: "rapeseed-pests-diseases", title: "Rapeseed Pest & Disease", icon: Bug },
    { id: "rapeseed-harvest", title: "Rapeseed Harvesting", icon: Wheat },
    // Mustard sections
    { id: "mustard-introduction", title: "Mustard Introduction", icon: Leaf },
    { id: "mustard-cropping", title: "Mustard Cropping", icon: Calendar },
    { id: "mustard-climate-soil", title: "Mustard Climate & Soil", icon: Thermometer },
    { id: "mustard-field-prep", title: "Mustard Field Preparation", icon: Scissors },
    { id: "mustard-sowing", title: "Mustard Sowing", icon: Wheat },
    { id: "mustard-fertilizer", title: "Mustard Fertilizer", icon: Package },
    { id: "mustard-irrigation", title: "Mustard Irrigation", icon: Droplets },
    { id: "mustard-weed", title: "Mustard Weed Management", icon: Scissors },
    { id: "mustard-pests-diseases", title: "Mustard Pest & Disease", icon: Bug },
    { id: "mustard-harvest", title: "Mustard Harvesting", icon: Wheat },
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
                Rapeseed and Mustard Crop Information
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
          {/* RAPESEED SECTIONS */}
          <div id="rapeseed-introduction">
            <SectionContent title="Introduction to Rapeseed (Canola)" icon={Leaf}>
              <p className="leading-relaxed">
                Rapeseed (Brassica napus), also known as canola, is a bright-yellow flowering member of the family Brassicaceae, cultivated mainly for its oil-rich seed. It is widely grown for its oil, which is used in cooking, biofuels, and as an industrial lubricant.
              </p>
            </SectionContent>
          </div>

          <div id="rapeseed-cropping">
            <SectionContent title="Rapeseed Cropping Session" icon={Calendar}>
              <SubSection title="Sowing Time">
                <ListItems
                  items={[
                    "Rapeseed is typically sown in the autumn (September to October) or spring (March to April), depending on the climate.",
                  ]}
                />
              </SubSection>
              <SubSection title="Harvesting Time">
                <ListItems
                  items={[
                    "The crop usually matures in 5-7 months, with harvesting taking place between April and June for autumn-sown crops, and August to September for spring-sown crops.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="rapeseed-climate-soil">
            <SectionContent title="Rapeseed Climate and Soil Requirements" icon={Thermometer}>
              <SubSection title="Climate">
                <ListItems
                  items={[
                    "Rapeseed thrives in cool, temperate climates with adequate rainfall. It requires a frost-free growing period of about 150-200 days.",
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

          <div id="rapeseed-field-prep">
            <SectionContent title="Rapeseed Field Preparation" icon={Scissors}>
              <SubSection title="Plowing">
                <ListItems
                  items={[
                    "The field should be plowed deeply to ensure proper soil aeration and preparation for sowing.",
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

          <div id="rapeseed-sowing">
            <SectionContent title="Rapeseed Sowing Techniques" icon={Wheat}>
              <SubSection title="Seed Rate">
                <ListItems
                  items={["Approximately 3-4 kg of seeds per hectare."]}
                />
              </SubSection>
              <SubSection title="Spacing">
                <ListItems
                  items={[
                    "Maintain a spacing of 30-45 cm between rows and 15-20 cm between plants within a row.",
                  ]}
                />
              </SubSection>
              <SubSection title="Sowing Depth">
                <ListItems items={["Sow seeds at a depth of 1-2 cm."]} />
              </SubSection>
            </SectionContent>
          </div>

          <div id="rapeseed-fertilizer">
            <SectionContent title="Rapeseed Fertilizer Requirements" icon={Package}>
              <SubSection title="Nitrogen (N)">
                <ListItems items={["120-150 kg per hectare."]} />
              </SubSection>
              <SubSection title="Phosphorus (P)">
                <ListItems items={["40-60 kg per hectare."]} />
              </SubSection>
              <SubSection title="Potassium (K)">
                <ListItems items={["40-60 kg per hectare."]} />
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

          <div id="rapeseed-irrigation">
            <SectionContent title="Rapeseed Irrigation Practices" icon={Droplets}>
              <SubSection title="Water Management">
                <ListItems
                  items={[
                    "Rapeseed requires adequate moisture during critical growth stages. Provide 2-3 irrigations during vegetative growth, flowering, and pod formation.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="rapeseed-weed">
            <SectionContent title="Rapeseed Weed Management" icon={Scissors}>
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

          <div id="rapeseed-pests-diseases">
            <SectionContent title="Rapeseed Pest and Disease Management" icon={Bug}>
              <SubSection title="Common Pests">
                <ListItems items={["Flea beetles, aphids, and cabbage seed weevil."]} />
              </SubSection>
              <SubSection title="Common Diseases">
                <ListItems items={["Blackleg, sclerotinia, and clubroot."]} />
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

          <div id="rapeseed-harvest">
            <SectionContent title="Rapeseed Harvesting Techniques" icon={Wheat}>
              <SubSection title="Maturity Indicators">
                <ListItems
                  items={[
                    "The pods turn brown and make a rattling sound when shaken.",
                  ]}
                />
              </SubSection>
              <SubSection title="Harvesting Time">
                <ListItems
                  items={[
                    "Harvest when moisture content is around 8-10% to prevent seed loss.",
                  ]}
                />
              </SubSection>
              <SubSection title="Threshing">
                <ListItems
                  items={[
                    "Use combine harvesters or manual methods to separate seeds from pods.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          {/* MUSTARD SECTIONS */}
          <div id="mustard-introduction">
            <SectionContent title="Introduction to Mustard" icon={Leaf}>
              <p className="leading-relaxed">
                Mustard (Brassica juncea) is an essential oilseed crop valued for its seeds, oil, and green leaves. It is widely cultivated in various parts of the world for culinary and medicinal purposes.
              </p>
            </SectionContent>
          </div>

          <div id="mustard-cropping">
            <SectionContent title="Mustard Cropping Session" icon={Calendar}>
              <SubSection title="Sowing Time">
                <ListItems
                  items={[
                    "Mustard is typically sown during the Rabi season, between October and November.",
                  ]}
                />
              </SubSection>
              <SubSection title="Harvesting Time">
                <ListItems
                  items={[
                    "The crop usually matures in 90-120 days, with harvesting taking place between February and March.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="mustard-climate-soil">
            <SectionContent title="Mustard Climate and Soil Requirements" icon={Thermometer}>
              <SubSection title="Climate">
                <ListItems
                  items={[
                    "Mustard thrives in cool, dry climates with temperatures between 10°C and 25°C. It requires moderate rainfall and well-drained soil.",
                  ]}
                />
              </SubSection>
              <SubSection title="Soil">
                <ListItems
                  items={[
                    "It grows best in well-drained loamy or sandy loam soils with a pH range of 6.0 to 7.5.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="mustard-field-prep">
            <SectionContent title="Mustard Field Preparation" icon={Scissors}>
              <SubSection title="Plowing">
                <ListItems
                  items={[
                    "The field should be plowed thoroughly to ensure proper soil aeration and seedbed preparation.",
                  ]}
                />
              </SubSection>
              <SubSection title="Leveling">
                <ListItems
                  items={[
                    "Level the field to ensure uniform sowing and irrigation.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="mustard-sowing">
            <SectionContent title="Mustard Sowing Techniques" icon={Wheat}>
              <SubSection title="Seed Rate">
                <ListItems
                  items={["Approximately 3-5 kg of seeds per hectare."]}
                />
              </SubSection>
              <SubSection title="Spacing">
                <ListItems
                  items={[
                    "Maintain a spacing of 30 cm between rows and 10-15 cm between plants within a row.",
                  ]}
                />
              </SubSection>
              <SubSection title="Sowing Depth">
                <ListItems items={["Sow seeds at a depth of 2-3 cm."]} />
              </SubSection>
            </SectionContent>
          </div>

          <div id="mustard-fertilizer">
            <SectionContent title="Mustard Fertilizer Requirements" icon={Package}>
              <SubSection title="Nitrogen (N)">
                <ListItems items={["60-80 kg per hectare."]} />
              </SubSection>
              <SubSection title="Phosphorus (P)">
                <ListItems items={["40-50 kg per hectare."]} />
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

          <div id="mustard-irrigation">
            <SectionContent title="Mustard Irrigation Practices" icon={Droplets}>
              <SubSection title="Water Management">
                <ListItems
                  items={[
                    "Mustard requires 2-3 irrigations during critical stages: pre-flowering, flowering, and pod filling stages.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="mustard-weed">
            <SectionContent title="Mustard Weed Management" icon={Scissors}>
              <SubSection title="Manual Weeding">
                <ListItems
                  items={[
                    "First weeding at 20-25 days after sowing and second weeding at 45-50 days after sowing.",
                  ]}
                />
              </SubSection>
              <SubSection title="Herbicides">
                <ListItems
                  items={[
                    "Pre-emergence herbicides can be applied for effective weed control.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="mustard-pests-diseases">
            <SectionContent title="Mustard Pest and Disease Management" icon={Bug}>
              <SubSection title="Common Pests">
                <ListItems items={["Aphids, flea beetles, and diamondback moth."]} />
              </SubSection>
              <SubSection title="Common Diseases">
                <ListItems items={["White rust, alternaria blight, and downy mildew."]} />
              </SubSection>
              <SubSection title="Control Measures">
                <ListItems
                  items={[
                    "Use resistant varieties, proper crop rotation, and integrated pest management practices.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="mustard-harvest">
            <SectionContent title="Mustard Harvesting Techniques" icon={Wheat}>
              <SubSection title="Maturity Indicators">
                <ListItems
                  items={[
                    "The siliquae turn yellowish-brown and seeds rattle inside the pods.",
                  ]}
                />
              </SubSection>
              <SubSection title="Harvesting Time">
                <ListItems
                  items={[
                    "Harvest when 75% of siliquae have turned brown to prevent seed shattering.",
                  ]}
                />
              </SubSection>
              <SubSection title="Threshing">
                <ListItems
                  items={[
                    "Use mechanical threshers or traditional beating methods to separate seeds.",
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

export default RapeseedMustard;
