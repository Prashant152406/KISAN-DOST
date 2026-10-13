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

const Millet = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("introduction");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sections = [
    { id: "introduction", title: "Introduction", icon: Leaf },
    { id: "types", title: "Types of Millet", icon: BookOpen },
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
                Millet Crop Information
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
            <SectionContent title="Introduction to Millet" icon={Leaf}>
              <p className="leading-relaxed">
                Millet is highly valued for its nutritional benefits, being rich in fiber, proteins, vitamins, and minerals. It is gluten-free and suitable for people with celiac disease or gluten intolerance. It is also beneficial for diabetics and helps in weight management.
              </p>
            </SectionContent>
          </div>

          <div id="types">
            <SectionContent title="Types of Millet" icon={BookOpen}>
              <SubSection title="Pearl Millet (Bajra)">
                <ListItems
                  items={["Commonly grown in arid and semi-arid regions."]}
                />
              </SubSection>
              <SubSection title="Finger Millet (Ragi)">
                <ListItems
                  items={["Known for its high calcium content."]}
                />
              </SubSection>
              <SubSection title="Foxtail Millet">
                <ListItems
                  items={["Rich in dietary fiber."]}
                />
              </SubSection>
              <SubSection title="Proso Millet">
                <ListItems
                  items={["High in protein."]}
                />
              </SubSection>
              <SubSection title="Kodo Millet">
                <ListItems
                  items={["Has high dietary fiber and protein."]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="cropping-session">
            <SectionContent title="Cropping Session" icon={Calendar}>
              <SubSection title="Sowing Time">
                <ListItems
                  items={[
                    "Millet is typically sown between May and August, depending on the region.",
                  ]}
                />
              </SubSection>
              <SubSection title="Harvesting Time">
                <ListItems
                  items={[
                    "The crop usually matures in 60-90 days, with harvesting taking place between September and November.",
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
                    "Millet thrives in warm climates with temperatures between 25°C and 35°C. It is highly drought-tolerant.",
                  ]}
                />
              </SubSection>
              <SubSection title="Soil">
                <ListItems
                  items={[
                    "It grows best in well-drained sandy or loamy soils with a pH range of 6.0 to 7.5.",
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
                    "The field should be plowed thoroughly to ensure proper soil aeration and moisture retention.",
                  ]}
                />
              </SubSection>
              <SubSection title="Furrowing">
                <ListItems items={["Create furrows for sowing seeds."]} />
              </SubSection>
            </SectionContent>
          </div>

          <div id="sowing-techniques">
            <SectionContent title="Sowing Techniques" icon={Wheat}>
              <SubSection title="Seed Rate">
                <ListItems
                  items={["Approximately 4-5 kg of seeds per hectare."]}
                />
              </SubSection>
              <SubSection title="Spacing">
                <ListItems
                  items={[
                    "Maintain a spacing of 25-30 cm between rows and 5-10 cm between plants within a row.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="fertilizer">
            <SectionContent title="Fertilizer Requirements" icon={Package}>
              <SubSection title="Nitrogen">
                <ListItems items={["40-80 kg per acre."]} />
              </SubSection>
              <SubSection title="Phosphorus">
                <ListItems
                  items={["Apply as per soil test recommendations."]}
                />
              </SubSection>
              <SubSection title="Potassium">
                <ListItems
                  items={["Apply as per soil test recommendations."]}
                />
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
                    "Millet is drought-tolerant but benefits from irrigation in dry spells. Ensure proper moisture conservation techniques.",
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

          <div id="pests-diseases">
            <SectionContent title="Pest and Disease Management" icon={Bug}>
              <SubSection title="Common Pests">
                <ListItems items={["Stem borers, shoot flies, and aphids."]} />
              </SubSection>
              <SubSection title="Common Diseases">
                <ListItems items={["Downy mildew, leaf blight, and rust."]} />
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

          <div id="harvesting">
            <SectionContent title="Harvesting Techniques" icon={Wheat}>
              <SubSection title="Maturity Indicators">
                <ListItems
                  items={[
                    "The grains harden and the plants turn golden brown.",
                  ]}
                />
              </SubSection>
              <SubSection title="Harvesting Time">
                <ListItems
                  items={[
                    "Harvest when the moisture content is around 12-14%.",
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

          <div id="post-harvest">
            <SectionContent title="Post-Harvest Handling and Storage" icon={Package}>
              <SubSection title="Drying">
                <ListItems
                  items={[
                    "Dry the harvested grains to reduce moisture content to below 10%.",
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

          <div id="value-addition">
            <SectionContent title="Value Addition and Processing" icon={Award}>
              <SubSection title="Grain Processing">
                <ListItems
                  items={[
                    "Millet grains can be processed into flour, porridge, and other food products.",
                  ]}
                />
              </SubSection>
              <SubSection title="Fodder">
                <ListItems
                  items={[
                    "The green fodder is rich in protein and minerals, making it excellent feed for livestock.",
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

          <div id="organic-practices">
            <SectionContent title="Organic Practices" icon={Recycle}>
              <SubSection title="Bio-fertilizers">
                <ListItems
                  items={[
                    "Use bio-fertilizers like Azospirillum and phosphobacteria for seed treatment or soil treatment.",
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

          <div id="intercropping">
            <SectionContent title="Intercropping and Crop Rotation" icon={RotateCcw}>
              <SubSection title="Intercropping">
                <ListItems
                  items={[
                    "Plant legumes or pulses alongside millet to improve soil fertility and reduce pest incidence.",
                  ]}
                />
              </SubSection>
              <SubSection title="Crop Rotation">
                <ListItems
                  items={[
                    "Rotate millet with other crops to maintain soil health and reduce disease pressure.",
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

export default Millet;
