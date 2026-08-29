const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#05050e] px-6 py-12 text-center">

      <div className="text-xl font-black">
        ZEE5
      </div>

      <p className="mt-3 text-xs text-gray-500">
        Watch Jana Nayagan on Zee 5.
      </p>

      <div className="mt-5 flex justify-center gap-5 text-xs">

        <a href="#" className="text-teal-300 hover:underline">
          Terms & Conditions
        </a>

        <a href="#" className="text-teal-300 hover:underline">
          Privacy Policy
        </a>

      </div>

    </footer>
  );
};

export default Footer;