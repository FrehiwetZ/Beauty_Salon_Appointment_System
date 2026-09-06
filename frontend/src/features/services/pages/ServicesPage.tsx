import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import ServiceGrid from "../components/ServiceGrid";
import { useLanguage } from "../../../context/LanguageContext";

function ServicesPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-pink-50">

      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-5 py-8 sm:py-10">

        <div className="text-center mb-10">

          <p className="text-pink-600 font-medium">
            {t('nav.services')}
          </p>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            {t('services.subtitle')}
          </h1>

          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            {t('services.description')}
          </p>

        </div>

        <ServiceGrid />

      </main>

      <Footer />

    </div>
  );
}

export default ServicesPage;