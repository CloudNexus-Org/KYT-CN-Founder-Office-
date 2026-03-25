const whyCards = [
  {
    icon: "🚀",
    title: "Innovative & scalable solutions",
    body:
      "We leverage the latest advancements in cloud computing, AI, and automation to develop smart, future-ready IT solutions. Our approach ensures your business stays ahead in the digital era.",
  },
  {
    icon: "🤝",
    title: "Tailored approach",
    body:
      "Every business is unique, and so are its challenges. We take a consultative approach, designing customized IT strategies that align with your goals, industry demands, and operational needs.",
  },
  {
    icon: "🔧",
    title: "Product-driven innovation",
    body:
      "Beyond consulting, we develop intelligent digital products that simplify daily operations, enhance efficiency, and improve user experiences. From HRMS systems to AI-powered automation tools, our solutions make technology work for you.",
  },
  {
    icon: "🔒",
    title: "Security & reliability",
    body:
      "Cybersecurity and data protection are at the core of everything we do. We implement robust security protocols to safeguard your IT infrastructure, ensuring compliance, privacy, and peace of mind.",
  },
  {
    icon: "🌍",
    title: "Expert team & global experience",
    body:
      "Our team of seasoned IT consultants, engineers, and strategists brings extensive experience in helping businesses worldwide navigate complex technological landscapes.",
  },
  {
    icon: "📈",
    title: "Business-centric results",
    body:
      "We do not just implement technology, we align it with your business objectives, ensuring measurable improvements in efficiency, productivity, and profitability.",
  },
  {
    icon: "✨",
    title: "End-to-end support",
    body:
      "From initial consultation to deployment and ongoing support, we are committed to providing seamless, 24/7 assistance, ensuring smooth and uninterrupted IT operations.",
  },
];

const missionPoints = [
  "Developing industry-leading IT solutions and products that enable businesses to operate efficiently, automate workflows, and stay ahead in a rapidly evolving digital world.",
  "Transforming outdated methodologies by replacing legacy systems with modern, intelligent, and scalable solutions tailored to each business's needs.",
  "Driving digital innovation through AI, cloud computing, and automation, ensuring seamless integration of technology into daily business operations.",
  "Empowering businesses of all sizes with accessible, secure, and intelligent IT infrastructure that fosters productivity and long-term success.",
];

const socialLinks = [
  { label: "in", href: "https://www.linkedin.com/company/cloudnexusorg/" },
  { label: "X", href: "https://x.com" },
  { label: "f", href: "https://facebook.com" },
  { label: "ig", href: "https://www.instagram.com/cloudnexus.in?igsh=MXVmNDNvdWViZmR6Yw==" },
];

function WhyCard({ icon, title, body }) {
  return (
    <article className="glass-panel rounded-2xl p-6">
      <div className="mb-4 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#00AEEF] bg-[#000000] text-xl text-[#FFFFFF]">{icon}</div>
        <h4 className="font-display text-2xl font-semibold leading-tight text-[#FFFFFF]">{title}</h4>
      </div>
      <p className="text-base leading-relaxed text-[#FFFFFF]">- {body}</p>
    </article>
  );
}

function AboutCloudnexusSection() {
  return (
    <section className="mt-12 border-t border-[#00AEEF] pt-12">
      <div className="mx-auto max-w-5xl text-center">
        <p className="font-display text-xs uppercase tracking-[0.2em] text-[#00AEEF]">About CloudNexus</p>
        <h2 className="mt-3 font-display text-4xl font-bold text-[#FFFFFF] md:text-5xl">Who we are</h2>
        <div className="mx-auto mt-4 h-px w-16 bg-[#00AEEF]" />
      </div>

      <div className="mx-auto mt-10 max-w-6xl">
        <article className="glass-panel rounded-2xl p-8">
          <p className="text-xl leading-relaxed text-[#FFFFFF] md:text-2xl">
            At CloudNexus, we are more than just an IT consulting company. We are innovators, problem-solvers, and architects of the digital future. We specialize in progressive IT solutions, cloud transformation, AI-driven automation, and enterprise consulting, helping businesses thrive in an ever-evolving tech landscape.
          </p>
          <p className="mt-6 text-xl leading-relaxed text-[#FFFFFF] md:text-2xl">
            Our team of technology experts, strategists, and problem-solvers collaborates closely with clients to design tailored solutions that enhance efficiency, drive growth, and future-proof operations. Whether it is cloud migration, software development, automation, or cybersecurity, we ensure that your IT ecosystem is agile, secure, and optimized for success.
          </p>
        </article>
      </div>

      <div className="mx-auto mt-12 max-w-6xl">
        <h3 className="font-display text-3xl font-semibold text-[#FFFFFF] md:text-4xl">
          Why <span className="text-[#00AEEF]">CloudNexus</span>?
        </h3>
        <div className="mt-4 h-px bg-[#00AEEF]" />
        <p className="mt-4 text-lg leading-relaxed text-[#FFFFFF] md:text-xl">
          Choosing the right technology partner is crucial for business success. At CloudNexus, we do not just offer IT solutions, we create transformative experiences that drive innovation, efficiency, and growth. Here is why businesses trust us:
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {whyCards.slice(0, 6).map((card) => (
            <WhyCard key={card.title} {...card} />
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          <div className="xl:col-start-2">
            <WhyCard {...whyCards[6]} />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-6xl">
        <h3 className="font-display text-3xl font-semibold text-[#FFFFFF] md:text-4xl">
          Our <span className="text-[#00AEEF]">vision</span> &amp; mission
        </h3>
        <div className="mt-4 h-px bg-[#00AEEF]" />

        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <article className="glass-panel rounded-2xl p-8">
            <div className="mb-5 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#00AEEF] bg-[#000000] text-xl">🌍</div>
              <h4 className="font-display text-3xl font-semibold uppercase tracking-[0.08em] text-[#FFFFFF]">Vision</h4>
            </div>
            <p className="text-lg leading-relaxed text-[#FFFFFF] md:text-xl">
              To be the global leader in IT solutions and digital product innovation, empowering businesses with progressive technology that enhances efficiency, scalability, and growth. At CloudNexus, we envision a future where businesses thrive by leveraging smart, automated, and future-ready solutions.
            </p>
          </article>

          <article className="glass-panel rounded-2xl p-8">
            <div className="mb-5 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#00AEEF] bg-[#000000] text-xl">🚀</div>
              <h4 className="font-display text-3xl font-semibold uppercase tracking-[0.08em] text-[#FFFFFF]">Mission</h4>
            </div>
            <p className="text-lg leading-relaxed text-[#FFFFFF] md:text-xl">At CloudNexus, our mission is to redefine the IT landscape by:</p>
            <ul className="mt-4 space-y-4 text-lg leading-relaxed text-[#FFFFFF] md:text-xl">
              {missionPoints.map((point) => (
                <li key={point} className="flex gap-3">
                  <span className="text-[#00AEEF]">●</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>

      <footer className="mt-14 border-t border-[#00AEEF] py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6">
          <div className="flex items-center gap-4">
            <img src="/assets/cloudnexus-logo.png" alt="CloudNexus" className="h-8 w-8" />
            <span className="font-display text-3xl font-semibold uppercase tracking-[0.1em] text-[#FFFFFF]">CloudNexus</span>
            <span className="text-[#00AEEF]">|</span>
            <span className="rounded-full border border-[#00AEEF] px-4 py-1 text-lg text-[#FFFFFF]">Know Your Team</span>
          </div>

          <div className="flex items-center gap-4">
            {socialLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full border border-[#00AEEF] text-2xl text-[#FFFFFF] transition-[border-color,color] duration-200 hover:border-[#FFFFFF] hover:text-[#00AEEF]"
                aria-label={`Open ${item.label}`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </section>
  );
}

export default AboutCloudnexusSection;
