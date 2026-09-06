import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import StaffGrid from "../components/StaffGrid";
import { useLanguage } from "../../../context/LanguageContext";

function StaffPage() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen bg-pink-50">

      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-5 py-8 sm:py-12">

        <div className="text-center mb-10">

          <p className="text-pink-600 font-medium">
            {t('staff.ourTeam')}
          </p>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mt-2">
            {t('staff.title')}
          </h1>

          <p className="text-gray-600 mt-3">
            {t('staff.description')}
          </p>

        </div>

        <StaffGrid />

      </main>

      <Footer />

    </div>
  );
}

export default StaffPage;