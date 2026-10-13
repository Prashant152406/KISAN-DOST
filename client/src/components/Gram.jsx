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

const Gram = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("introduction");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sections = [
    { id: "introduction", title: "Introduction", icon: Leaf },
    { id: "climate", title: "Climate Requirements", icon: Thermometer },
    { id: "soil", title: "Soil Requirements", icon: Package },
    { id: "varieties", title: "Varieties", icon: BookOpen },
    { id: "sowing", title: "Sowing Techniques", icon: Wheat },
    { id: "manures", title: "Manures & Fertilizers", icon: Recycle },
    { id: "irrigation", title: "Irrigation Practices", icon: Droplets },
    { id: "plant-protection", title: "Plant Protection", icon: Bug },
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
                Gram Crop Information
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
            <SectionContent title="Introduction to Gram" icon={Leaf}>
              <p className="leading-relaxed">
                Gram is one of the most important pulses in India. It is grown for
                its edible seeds, which are rich in protein. Gram is consumed in
                various forms such as dal, flour, and roasted seeds. It is also used
                as fodder for animals.
              </p>
            </SectionContent>
          </div>

          <div id="climate">
            <SectionContent title="Climate Requirements" icon={Thermometer}>
              <p className="leading-relaxed">
                Gram is a cool-season crop and thrives well in areas with moderate
                rainfall (40–50 cm) and a temperature range of 20–25°C. Excessive
                rainfall and severe cold are harmful for its growth.
              </p>
            </SectionContent>
          </div>

          <div id="soil">
            <SectionContent title="Soil Requirements" icon={Package}>
              <p className="leading-relaxed">
                Gram grows well in loamy to clay soils with good drainage. It
                prefers neutral to slightly alkaline soils with a pH of 6–7.5.
              </p>
            </SectionContent>
          </div>

          <div id="varieties">
            <SectionContent title="Varieties" icon={BookOpen}>
              <SubSection title="Popular Varieties">
                <ListItems
                  items={[
                    "Pusa-256",
                    "Avrodhi",
                    "JG-62",
                    "Radhey",
                    "KPG-59",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="sowing">
            <SectionContent title="Sowing Techniques" icon={Wheat}>
              <SubSection title="Sowing Time">
                <ListItems
                  items={["The best time for sowing gram is in October–November."]}
                />
              </SubSection>
              <SubSection title="Spacing">
                <ListItems
                  items={[
                    "Seeds are sown at a spacing of 30 cm between rows and 10 cm between plants.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="manures">
            <SectionContent title="Manures and Fertilizers" icon={Recycle}>
              <SubSection title="Chemical Fertilizers">
                <ListItems
                  items={[
                    "Apply 20–25 kg nitrogen per hectare",
                    "Apply 40–60 kg phosphorus per hectare",
                    "Apply 20 kg potash per hectare"
                  ]}
                />
              </SubSection>
              <SubSection title="Organic Manures">
                <ListItems
                  items={["Organic manures such as FYM or compost are also beneficial."]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="irrigation">
            <SectionContent title="Irrigation Practices" icon={Droplets}>
              <p className="leading-relaxed mb-4">
                Gram is mostly grown as a rainfed crop. However, 2–3 irrigations
                during critical stages can enhance yield.
              </p>
              <SubSection title="Critical Irrigation Stages">
                <ListItems
                  items={[
                    "Branching stage",
                    "Flowering stage",
                    "Pod filling stage"
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="plant-protection">
            <SectionContent title="Plant Protection" icon={Bug}>
              <SubSection title="Common Pests">
                <ListItems
                  items={[
                    "Pod borer",
                    "Cutworms"
                  ]}
                />
              </SubSection>
              <SubSection title="Common Diseases">
                <ListItems
                  items={[
                    "Wilt",
                    "Blight",
                    "Rust"
                  ]}
                />
              </SubSection>
              <SubSection title="Control Measures">
                <ListItems
                  items={[
                    "Use resistant varieties",
                    "Adopt integrated pest management practices for control"
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

export default Gram;
