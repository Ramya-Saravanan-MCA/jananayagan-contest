import { useState } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import EntryForm from "../components/EntryForm";
import SuccessPopup from "../components/SuccessPopup";

const Home = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [submittedGender, setSubmittedGender] = useState("");

  const handleSuccess = (gender) => {
    setSubmittedGender(gender);
    setShowSuccess(true);
  };

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#03030d] text-white">
      <Header />

      <div className="flex w-full flex-col md:flex-row md:items-stretch">
        <Hero />

        <section
          className="
            flex
            w-full
            items-start
            justify-center
            px-4
            py-7
            sm:px-6
            sm:py-9
            md:w-[58%]
            md:px-7
            md:py-10
            lg:px-10
            lg:py-12
          "
        >
          <div className="w-full max-w-[920px]">
            <EntryForm onSuccess={handleSuccess} />
          </div>
        </section>
      </div>

      {showSuccess && (
        <SuccessPopup
          gender={submittedGender}
          onClose={() => setShowSuccess(false)}
        />
      )}
    </main>
  );
};

export default Home;