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

const Maize = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("introduction");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sections = [
    { id: "introduction", title: "Introduction", icon: Leaf },
    { id: "types", title: "Types of Maize", icon: Package },
    { id: "cultivation", title: "Cultivation", icon: Calendar },
    { id: "uses", title: "Uses", icon: Award },
    { id: "nutritional", title: "Nutritional Benefits", icon: Thermometer },
    { id: "pests-diseases", title: "Pests and Diseases", icon: Bug },
    { id: "modern-developments", title: "Modern Developments", icon: Recycle },
    { id: "cultural-significance", title: "Cultural Significance", icon: RotateCcw },
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
                Maize (Zea mays) Crop Information
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
            <SectionContent title="Introduction to Maize" icon={Leaf}>
              <p className="leading-relaxed">
                Maize (Zea mays) is a tall, stout grass that produces cereal grains. It was domesticated by indigenous peoples in southern Mexico about 9,000 years ago from wild teosinte. Today, it is a staple food in many parts of the world, with the total production of maize surpassing that of wheat and rice.
              </p>
            </SectionContent>
          </div>

          <div id="types">
            <SectionContent title="Types of Maize" icon={Package}>
              <SubSection title="Sweet Corn">
                <ListItems
                  items={["Grown for human consumption, often eaten as a vegetable."]}
                />
              </SubSection>
              <SubSection title="Field Corn">
                <ListItems
                  items={[
                    "Used primarily for animal feed, as well as for making products like cornmeal, corn syrup, and ethanol.",
                  ]}
                />
              </SubSection>
              <SubSection title="Popcorn">
                <ListItems
                  items={["A type of maize that pops when heated, popular as a snack."]}
                />
              </SubSection>
              <SubSection title="Dent Corn">
                <ListItems
                  items={[
                    "Characterized by a dent in the crown of the kernel, used for livestock feed and industrial products.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="cultivation">
            <SectionContent title="Cultivation" icon={Calendar}>
              <SubSection title="Sowing Time">
                <ListItems
                  items={["Typically sown between May and August, depending on the region."]}
                />
              </SubSection>
              <SubSection title="Harvesting Time">
                <ListItems
                  items={[
                    "Matures in 60-90 days, with harvesting taking place between September and November.",
                  ]}
                />
              </SubSection>
              <SubSection title="Climate">
                <ListItems
                  items={[
                    "Prefers temperatures between 25°C and 35°C and requires adequate rainfall (40-65 cm annually).",
                  ]}
                />
              </SubSection>
              <SubSection title="Soil">
                <ListItems
                  items={[
                    "Grows best in well-drained sandy or loamy soils with a pH range of 6.0 to 7.5.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="uses">
            <SectionContent title="Uses" icon={Award}>
              <SubSection title="Food">
                <ListItems
                  items={[
                    "Used to make a wide variety of dishes including tortillas, tamales, polenta, and hominy grits.",
                  ]}
                />
              </SubSection>
              <SubSection title="Animal Feed">
                <ListItems
                  items={["Both the grain and the whole plant can be used as feed for livestock."]}
                />
              </SubSection>
              <SubSection title="Industrial Uses">
                <ListItems
                  items={[
                    "Used in the production of ethanol, corn syrup, corn oil, and various other products.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="nutritional">
            <SectionContent title="Nutritional Benefits" icon={Thermometer}>
              <p className="leading-relaxed">
                Maize is rich in carbohydrates, vitamins, and minerals. It provides essential nutrients like vitamins A, B, and C, and is a good source of dietary fiber.
              </p>
            </SectionContent>
          </div>

          <div id="pests-diseases">
            <SectionContent title="Pests and Diseases" icon={Bug}>
              <p className="leading-relaxed">
                Maize is susceptible to various pests and diseases, including the European corn borer and corn rootworms, which can cause significant crop losses.
              </p>
            </SectionContent>
          </div>

          <div id="modern-developments">
            <SectionContent title="Modern Developments" icon={Recycle}>
              <p className="leading-relaxed">
                Modern plant breeding has greatly increased maize output and qualities such as nutrition, drought tolerance, and pest resistance. Many maize varieties are now genetically modified to enhance these traits.
              </p>
            </SectionContent>
          </div>

          <div id="cultural-significance">
            <SectionContent title="Cultural Significance" icon={RotateCcw}>
              <p className="leading-relaxed">
                In Mesoamerica, maize is considered sacred and is often depicted in sculptures and deified as a maize god.
              </p>
            </SectionContent>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Maize;
