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

const Pumpkin = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("pumpkin-introduction");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sections = [
    { id: "pumpkin-introduction", title: "Introduction", icon: Leaf },
    { id: "pumpkin-cropping", title: "Cropping Session", icon: Calendar },
    { id: "pumpkin-climate-soil", title: "Climate & Soil Requirements", icon: Thermometer },
    { id: "pumpkin-field-prep", title: "Field Preparation", icon: Scissors },
    { id: "pumpkin-sowing", title: "Sowing Techniques", icon: Wheat },
    { id: "pumpkin-fertilizer", title: "Fertilizer Requirements", icon: Package },
    { id: "pumpkin-irrigation", title: "Irrigation Practices", icon: Droplets },
    { id: "pumpkin-weed", title: "Weed Management", icon: Scissors },
    { id: "pumpkin-pests-diseases", title: "Pest & Disease Management", icon: Bug },
    { id: "pumpkin-harvest", title: "Harvesting Techniques", icon: Wheat },
    { id: "pumpkin-post-harvest", title: "Post-Harvest Handling", icon: Package },
    { id: "pumpkin-processing", title: "Value Addition & Processing", icon: Award },
    { id: "pumpkin-government-support", title: "Government Schemes", icon: Award },
    { id: "pumpkin-organic", title: "Organic Practices", icon: Recycle },
    { id: "pumpkin-intercropping", title: "Intercropping & Rotation", icon: RotateCcw },
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
                Pumpkin Crop Information
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
          <div id="pumpkin-introduction">
            <SectionContent title="Introduction to Pumpkin" icon={Leaf}>
              <p className="leading-relaxed">
                Pumpkin (Cucurbita spp.) is a versatile and nutrient-rich vegetable, widely grown for its edible fruit, seeds, and flowers. It is used in various culinary dishes, as well as for decorative purposes, especially during Halloween.
              </p>
            </SectionContent>
          </div>

          <div id="pumpkin-cropping">
            <SectionContent title="Pumpkin Cropping Session" icon={Calendar}>
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
                    "Harvesting takes place between June and October after 90-120 days of growth.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="pumpkin-climate-soil">
            <SectionContent title="Pumpkin Climate and Soil Requirements" icon={Thermometer}>
              <SubSection title="Climate">
                <ListItems
                  items={[
                    "Pumpkin thrives in warm, sunny climates with temperatures between 20°C and 30°C. It requires moderate rainfall.",
                  ]}
                />
              </SubSection>
              <SubSection title="Soil">
                <ListItems
                  items={[
                    "It grows best in well-drained sandy loam or loamy soils with a pH range of 6.0 to 7.5.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="pumpkin-field-prep">
            <SectionContent title="Pumpkin Field Preparation" icon={Scissors}>
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

          <div id="pumpkin-sowing">
            <SectionContent title="Pumpkin Sowing Techniques" icon={Wheat}>
              <SubSection title="Seed Rate">
                <ListItems
                  items={["Approximately 2-3 kg of seeds per hectare."]}
                />
              </SubSection>
              <SubSection title="Spacing">
                <ListItems
                  items={[
                    "Maintain a spacing of 1-1.5 meters between rows and 0.75-1 meter between plants within a row.",
                  ]}
                />
              </SubSection>
              <SubSection title="Sowing Depth">
                <ListItems items={["Sow seeds at a depth of 2-3 cm."]} />
              </SubSection>
            </SectionContent>
          </div>

          <div id="pumpkin-fertilizer">
            <SectionContent title="Pumpkin Fertilizer Requirements" icon={Package}>
              <SubSection title="Nitrogen (N)">
                <ListItems items={["60-80 kg per hectare."]} />
              </SubSection>
              <SubSection title="Phosphorus (P)">
                <ListItems items={["40-50 kg per hectare."]} />
              </SubSection>
              <SubSection title="Potassium (K)">
                <ListItems items={["30-40 kg per hectare."]} />
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

          <div id="pumpkin-irrigation">
            <SectionContent title="Pumpkin Irrigation Practices" icon={Droplets}>
              <SubSection title="Water Management">
                <ListItems
                  items={[
                    "Pumpkin requires regular watering, especially during the flowering and fruiting stages. Avoid waterlogging, as it can lead to root rot.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="pumpkin-weed">
            <SectionContent title="Pumpkin Weed Management" icon={Scissors}>
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

          <div id="pumpkin-pests-diseases">
            <SectionContent title="Pumpkin Pest and Disease Management" icon={Bug}>
              <SubSection title="Common Pests">
                <ListItems items={["Pumpkin beetles, aphids, and fruit flies."]} />
              </SubSection>
              <SubSection title="Common Diseases">
                <ListItems items={["Powdery mildew, downy mildew, and pumpkin rot."]} />
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

          <div id="pumpkin-harvest">
            <SectionContent title="Pumpkin Harvesting Techniques" icon={Wheat}>
              <SubSection title="Maturity Indicators">
                <ListItems
                  items={[
                    "The skin of the pumpkin hardens and turns a deep, uniform color.",
                  ]}
                />
              </SubSection>
              <SubSection title="Harvesting Time">
                <ListItems
                  items={[
                    "Harvest when the pumpkins reach full size and color, and the stem starts to dry.",
                  ]}
                />
              </SubSection>
              <SubSection title="Handling">
                <ListItems
                  items={[
                    "Cut the pumpkins with a portion of the stem attached to improve storage life.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="pumpkin-post-harvest">
            <SectionContent title="Pumpkin Post-Harvest Handling and Storage" icon={Package}>
              <SubSection title="Curing">
                <ListItems
                  items={[
                    "Cure harvested pumpkins in a warm, dry place for 10-14 days to harden the skin.",
                  ]}
                />
              </SubSection>
              <SubSection title="Storage">
                <ListItems
                  items={[
                    "Store in a cool, dry place with good ventilation to prevent rot and prolong shelf life.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="pumpkin-processing">
            <SectionContent title="Pumpkin Value Addition and Processing" icon={Award}>
              <SubSection title="Culinary Uses">
                <ListItems
                  items={[
                    "Pumpkin can be used to make soups, pies, curries, and other dishes.",
                  ]}
                />
              </SubSection>
              <SubSection title="Seed Processing">
                <ListItems
                  items={[
                    "Pumpkin seeds can be roasted and consumed as a healthy snack.",
                  ]}
                />
              </SubSection>
              <SubSection title="Decorative Uses">
                <ListItems
                  items={[
                    "Pumpkins are widely used for decorative purposes, especially during Halloween.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="pumpkin-government-support">
            <SectionContent title="Pumpkin Government Schemes and Support" icon={Award}>
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

          <div id="pumpkin-organic">
            <SectionContent title="Pumpkin Organic Practices" icon={Recycle}>
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

          <div id="pumpkin-intercropping">
            <SectionContent title="Pumpkin Intercropping and Crop Rotation" icon={RotateCcw}>
              <SubSection title="Intercropping">
                <ListItems
                  items={[
                    "Plant legumes or pulses alongside pumpkins to improve soil fertility and reduce pest incidence.",
                  ]}
                />
              </SubSection>
              <SubSection title="Crop Rotation">
                <ListItems
                  items={[
                    "Rotate pumpkins with other crops like maize or beans to maintain soil health and reduce disease pressure.",
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

export default Pumpkin;
