const Hero = () => {
  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        bg-[#03030d]

        /* MOBILE — full-bleed poster, tall enough for the scrim without eating the page */
        h-[320px]

        /* DESKTOP */
        md:h-auto
        md:min-h-full
        md:w-[42%]
        md:self-stretch
      "
    >

      {/* =====================================================
          MOBILE IMAGE — FULL BLEED, TEXT SITS OVER BOTTOM SCRIM
      ====================================================== */}
      <div
        className="
          absolute
          inset-0
          overflow-hidden
          md:hidden
        "
      >
        <img
          src="/images/jananayagan-hero3.jpeg"
          alt="Jana Nayagan"
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover
            object-[68%_12%]
          "
        />

        {/* Even wash so the image doesn't compete with text */}
        <div className="absolute inset-0 bg-black/15" />

        {/* Bottom scrim — this is what makes the text legible, not a left/right split */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-[#03030d]
            via-[#03030d]/70
            to-transparent
          "
        />

        {/* Faint top scrim so the logo always has contrast, even on a bright frame */}
        <div
          className="
            absolute
            inset-x-0
            top-0
            h-24
            bg-gradient-to-b
            from-[#03030d]/70
            to-transparent
          "
        />
      </div>


      {/* =====================================================
          DESKTOP IMAGE
      ====================================================== */}
      <div
        className="
          absolute
          inset-0
          hidden
          overflow-hidden
          md:block
        "
      >
        <img
          src="/images/jananayagan-hero3.jpeg"
          alt="Jana Nayagan"
          className="
            absolute
            inset-0
            h-full
            w-full
            object-cover

            md:left-[2%]
            md:h-full
            md:w-[125%]
            md:max-w-none
            md:object-[70%_5%]
          "
        />

        {/* Overall overlay */}
        <div className="absolute inset-0 bg-black/15" />

        {/* Bottom fade */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-[#03030d]
            via-[#03030d]/25
            to-transparent
          "
        />

        {/* Left dark overlay */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-[#03030d]
            via-[#03030d]/50
            to-transparent
          "
        />

        {/* Purple glow */}
        <div
          className="
            absolute
            bottom-[-100px]
            left-[45%]
            h-[300px]
            w-[300px]
            rounded-full
            bg-purple-700/20
            blur-[110px]
          "
        />
      </div>


      {/* =====================================================
          ZEE5 LOGO
      ====================================================== */}
      <div
        className="
          absolute
          left-4
          top-4
          z-30

          md:left-10
          md:top-8

          lg:left-12
          lg:top-10
        "
      >
        <img
          src="/images/Logo_zee5.png"
          alt="ZEE5"
          className="
            h-[56px]
            w-[56px]
            object-contain
            drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]

            md:h-[82px]
            md:w-[82px]
          "
        />
      </div>


      {/* =====================================================
          MOBILE CONTENT — FULL WIDTH, ANCHORED TO THE BOTTOM SCRIM
      ====================================================== */}
      <div
        className="
          absolute
          inset-x-0
          bottom-0
          z-20
          w-full
          px-5
          pb-4
          md:hidden
        "
      >

        {/* Main heading */}
        <h1
          className="
            font-black
            uppercase
            leading-[0.9]
            tracking-[-0.03em]
            drop-shadow-[0_4px_12px_rgba(0,0,0,0.95)]
          "
        >

          {/* THALAPATHY'S */}
          <span
            className="
              block
              whitespace-nowrap
              text-[clamp(18px,6.2vw,26px)]
              text-white
            "
          >
            THALAPATHY'S
          </span>

          {/* ONE LAST DANCE — kept on one line at this width, reads cleaner than a 3rd stacked line */}
          <span
            className="
              block
              bg-gradient-to-r
              from-pink-500
              via-fuchsia-400
              to-blue-500
              bg-clip-text
              text-[clamp(20px,6.8vw,28px)]
              text-transparent
            "
          >
            ONE LAST DANCE!
          </span>

        </h1>

        {/* Tagline */}
        <p
          className="
            mt-2
            text-[12px]
            font-bold
            leading-[1.3]
            text-white
          "
        >
          Watch it. Celebrate it. Own it.
        </p>

        {/* Bottom action line */}
        <div className="mt-2.5 flex items-center gap-2">
          <span className="h-px w-8 bg-purple-500" />
          <span
            className="
              whitespace-nowrap
              text-[8px]
              font-semibold
              tracking-[0.25em]
              text-gray-200
            "
          >
            WATCH • CELEBRATE • OWN
          </span>
        </div>

      </div>


      {/* =====================================================
          DESKTOP CONTENT
      ====================================================== */}
      <div
        className="
          relative
          z-10
          hidden
          min-h-full
          flex-col
          justify-end
          px-10
          pb-10

          md:flex

          lg:px-12
          lg:pb-12
        "
      >

        {/* Main heading */}
        <h1
          className="
            max-w-[95%]
            font-black
            uppercase
            leading-[0.88]
            tracking-[-0.05em]
            drop-shadow-[0_5px_18px_rgba(0,0,0,0.95)]
          "
        >

          {/* THALAPATHY'S */}
          <span
            className="
              block
              whitespace-nowrap
              text-[clamp(34px,3.5vw,54px)]
              text-white
            "
          >
            THALAPATHY'S
          </span>

          {/* ONE LAST */}
          <span
            className="
              block
              bg-gradient-to-r
              from-pink-500
              via-fuchsia-400
              to-blue-500
              bg-clip-text
              text-[clamp(38px,3.8vw,58px)]
              text-transparent
            "
          >
            ONE LAST
          </span>

          {/* DANCE */}
          <span
            className="
              block
              bg-gradient-to-r
              from-pink-500
              via-fuchsia-400
              to-blue-500
              bg-clip-text
              text-[clamp(38px,3.8vw,58px)]
              text-transparent
            "
          >
            DANCE!
          </span>

        </h1>


        {/* Tagline */}
        <p
          className="
            mt-5
            text-[15px]
            font-bold
            leading-[1.5]
            text-white
          "
        >
          Watch it. Celebrate it. Own it.
        </p>


        {/* Description */}
        <p
          className="
            mt-3
            max-w-[390px]
            text-[12px]
            font-medium
            leading-[1.7]
            text-gray-200
          "
        >
          Watch{" "}
          <span className="font-bold text-white">
            Jana Nayagan
          </span>{" "}
          on Zee 5 and share your Thalapathy moment with us.
          Stand a chance to own an exclusive lenticular poster
          celebrating Thalapathy's One Last Dance.
        </p>


        {/* Bottom action line */}
        <div className="mt-7 flex items-center gap-3">

          <span className="h-px w-10 bg-purple-500" />

          <span
            className="
              whitespace-nowrap
              text-[8px]
              font-semibold
              tracking-[0.3em]
              text-gray-200
            "
          >
            WATCH • CELEBRATE • OWN
          </span>

        </div>

      </div>

    </section>
  );
};

export default Hero;