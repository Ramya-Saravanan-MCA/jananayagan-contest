const steps = [
  {
    number: "01",
    title: "WATCH",
    description: "Watch Jana Nayagan on Zee 5.",
  },
  {
    number: "02",
    title: "SHARE",
    description: "Share your viewing moment on your story.",
  },
  {
    number: "03",
    title: "SUBMIT",
    description: "Upload your screenshot and enter the campaign.",
  },
];

const CampaignSteps = () => {
  return (
    <section className="bg-[#080816] px-6 py-16 md:px-12">

      <div className="mx-auto max-w-6xl">

        <div className="mb-10 text-center">
          <p className="text-sm font-semibold tracking-[0.2em] text-teal-300">
            HOW TO PARTICIPATE
          </p>

          <h2 className="mt-3 text-3xl font-black md:text-5xl">
            WATCH. SHARE. <span className="text-teal-300">WIN.</span>
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">

          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-2xl border border-purple-500/30 bg-purple-950/20 p-7"
            >

              <span className="text-sm font-black text-teal-300">
                {step.number}
              </span>

              <h3 className="mt-4 text-xl font-black">
                {step.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                {step.description}
              </p>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
};

export default CampaignSteps;