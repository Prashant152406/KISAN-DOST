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

const BitterGourd = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("introduction");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sections = [
    { id: "introduction", title: "Introduction", icon: Leaf },
    { id: "cropping-session", title: "Cropping Session", icon: Calendar },
    {
      id: "climate-soil",
      title: "Climate & Soil Requirements",
      icon: Thermometer,
    },
    { id: "field-preparation", title: "Field Preparation", icon: Scissors },
    { id: "sowing-techniques", title: "Sowing Techniques", icon: Wheat },
    {
      id: "fertilizer-requirements",
      title: "Fertilizer Requirements",
      icon: Package,
    },
    { id: "irrigation", title: "Irrigation Practices", icon: Droplets },
    { id: "weed-management", title: "Weed Management", icon: Scissors },
    { id: "pest-disease", title: "Pest & Disease Management", icon: Bug },
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
              <Leaf className="w-8 h-8" />
              <h1 className="text-2xl md:text-3xl font-bold">
                Bitter Gourd Crop Information
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
            <SectionContent title="Introduction to Bitter Gourd" icon={Leaf}>
              <p className="leading-relaxed">
                Bitter Gourd (Momordica charantia), also known as Bitter Melon or Karela, is a tropical and subtropical vine widely grown for its edible fruit. It is known for its bitter taste and various medicinal properties, particularly in managing diabetes and promoting digestive health.
              </p>
            </SectionContent>
          </div>

          <div id="cropping-session">
            <SectionContent title="Cropping Session" icon={Calendar}>
              <SubSection title="Sowing Time">
                <ListItems
                  items={[
                    "Summer and Rainy Season: Sown from March to July.",
                  ]}
                />
              </SubSection>
              <SubSection title="Harvesting Time">
                <ListItems
                  items={[
                    "Harvesting typically occurs between June and October, after 90-100 days of growth.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="climate-soil">
            <SectionContent
              title="Climate and Soil Requirements"
              icon={Thermometer}
            >
              <SubSection title="Climate">
                <ListItems
                  items={[
                    "Bitter gourd thrives in warm, humid climates with temperatures between 24°C and 30°C. It requires moderate to high rainfall during the growing period.",
                  ]}
                />
              </SubSection>
              <SubSection title="Soil">
                <ListItems
                  items={[
                    "Bitter gourd grows best in well-drained sandy loam or loamy soils with a pH range of 6.0 to 7.0.",
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
                    "Plow the field thoroughly to ensure good soil aeration and preparation for sowing.",
                  ]}
                />
              </SubSection>
              <SubSection title="Bed Preparation">
                <ListItems items={["Prepare raised beds or mounds to enhance drainage and support root development."]} />
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
                    "Maintain a spacing of 2-2.5 meters between rows and 0.75-1 meter between plants within a row.",
                  ]}
                />
              </SubSection>
              <SubSection title="Sowing Depth">
                <ListItems items={["Sow seeds at a depth of 1-2 cm."]} />
              </SubSection>
            </SectionContent>
          </div>

          <div id="fertilizer-requirements">
            <SectionContent title="Fertilizer Requirements" icon={Package}>
              <SubSection title="Nitrogen (N)">
                <ListItems items={["60-80 kg per hectare."]} />
              </SubSection>
              <SubSection title="Phosphorus (P)">
                <ListItems
                  items={["40-50 kg per hectare."]}
                />
              </SubSection>
              <SubSection title="Potassium (K)">
                <ListItems
                  items={["40-50 kg per hectare."]}
                />
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

          <div id="irrigation">
            <SectionContent title="Irrigation Practices" icon={Droplets}>
              <SubSection title="Water Management">
                <ListItems
                  items={[
                    "Bitter gourd requires regular watering, especially during the flowering and fruiting stages. Avoid waterlogging to prevent root rot.",
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
                    "Regular weeding is necessary to reduce competition for water and nutrients.",
                  ]}
                />
              </SubSection>
              <SubSection title="Mulching">
                <ListItems
                  items={[
                    "Use organic mulches to suppress weeds and retain moisture in the soil.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="pest-disease">
            <SectionContent title="Pest and Disease Management" icon={Bug}>
              <SubSection title="Common Pests">
                <ListItems items={["Fruit flies, aphids, and red pumpkin beetles."]} />
              </SubSection>
              <SubSection title="Common Diseases">
                <ListItems items={["Powdery mildew, downy mildew, and mosaic virus."]} />
              </SubSection>
              <SubSection title="Control Measures">
                <ListItems
                  items={[
                    "Use resistant varieties, crop rotation, and organic pesticides like neem oil or insecticidal soap.",
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
                    "Fruits should be harvested when they are green and immature, before turning yellow.",
                  ]}
                />
              </SubSection>
              <SubSection title="Harvesting Time">
                <ListItems
                  items={[
                    "Harvest when fruits are tender and reach 10-15 cm in length.",
                  ]}
                />
              </SubSection>
              <SubSection title="Handling">
                <ListItems
                  items={[
                    "Handle the fruits gently to avoid bruising and damage.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="post-harvest">
            <SectionContent
              title="Post-Harvest Handling and Storage"
              icon={Package}
            >
              <SubSection title="Cleaning">
                <ListItems
                  items={[
                    "Clean the harvested fruits with water to remove soil and debris.",
                  ]}
                />
              </SubSection>
              <SubSection title="Storage">
                <ListItems
                  items={[
                    "Store in a cool, humid environment at temperatures between 10°C and 12°C with 85-90% relative humidity.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="value-addition">
            <SectionContent title="Value Addition and Processing" icon={Award}>
              <SubSection title="Culinary Uses">
                <ListItems
                  items={[
                    "Bitter gourd is used in curries, stir-fries, and salads.",
                  ]}
                />
              </SubSection>
              <SubSection title="Juicing">
                <ListItems
                  items={[
                    "Can be juiced for its medicinal properties, especially for managing blood sugar.",
                  ]}
                />
              </SubSection>
              <SubSection title="Drying">
                <ListItems
                  items={[
                    "Slice and dry bitter gourd for longer shelf life.",
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
                    "Subsidies for seeds, fertilizers, and farming equipment are available through various government schemes.",
                  ]}
                />
              </SubSection>
              <SubSection title="Training Programs">
                <ListItems
                  items={[
                    "Training programs are available to educate farmers on best agricultural practices for bitter gourd cultivation.",
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
                    "Bio-fertilizers like Azospirillum can be used for seed treatment to enhance nitrogen fixation.",
                  ]}
                />
              </SubSection>
              <SubSection title="Composting">
                <ListItems
                  items={[
                    "Composting helps improve soil fertility and structure, promoting healthy plant growth.",
                  ]}
                />
              </SubSection>
            </SectionContent>
          </div>

          <div id="intercropping">
            <SectionContent
              title="Intercropping and Crop Rotation"
              icon={RotateCcw}
            >
              <SubSection title="Intercropping">
                <ListItems
                  items={[
                    "Legumes and pulses can be intercropped with bitter gourd to improve soil fertility and reduce pest incidences.",
                  ]}
                />
              </SubSection>
              <SubSection title="Crop Rotation">
                <ListItems
                  items={[
                    "Rotate bitter gourd with crops like maize or beans to maintain soil health and reduce disease pressure.",
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

export default BitterGourd;
