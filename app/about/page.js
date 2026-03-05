import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="about-page">
      {/* floating stars background */}
      <div className="magic-stars" aria-hidden="true">
        <div className="star star--1"></div>
        <div className="star star--2"></div>
        <div className="star star--3"></div>
        <div className="star star--4"></div>
        <div className="star star--5"></div>
        <div className="star star--6"></div>
        <div className="star star--7"></div>
        <div className="star star--8"></div>
      </div>

      {/* ── Hero ── */}
      <section className="about-hero">
        <div className="about-hero-grid">
          <div className="about-hero-copy">
            <span className="about-badge">UGA Hacks 11 &middot; Cox Challenge</span>
            <h1>GreenFleet</h1>
            <p>
              A sustainability fleet &amp; dispatch command center built at UGAHacks 11.
              We turn battery recycling operations into real-time, AI-powered insights
              so dealerships can make smarter, greener choices in seconds.
            </p>
            <div className="about-hero-actions">
              <Link href="/signup" className="about-btn about-btn--magic">
                Begin Your Quest
              </Link>
              <Link href="/" className="about-btn about-btn--ghost">
                Back to Home
              </Link>
            </div>
          </div>
          <div className="about-hero-mascot">
            <div className="mascot-card">
              <div className="mascot-glow" />
              <img
                src="/Gemini_Generated_Image_6en1yi6en1yi6en1.png"
                alt="GreenFleet wizard mascot"
                className="mascot-figure"
              />
              <div className="mascot-sparkle" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="about-section about-features">
        <div className="about-container">
          <h2 className="section-title">Enchanted Abilities</h2>
          <p className="section-subtitle">
            Each spell in our grimoire serves a purpose
          </p>
          <div className="about-features-grid">
            <div className="feature-card magic-card">
              <div className="feature-icon magic-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>
              </div>
              <h3>Crystal Dashboard</h3>
              <p>Gaze into real-time recycling volumes, fleet efficiency, and environmental impact across 14 dealerships.</p>
            </div>
            <div className="feature-card magic-card">
              <div className="feature-icon magic-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
              </div>
              <h3>Enchanted Map</h3>
              <p>Visualize every dealership, vehicle status, and risk level on a live, spellbound map.</p>
            </div>
            <div className="feature-card magic-card">
              <div className="feature-icon magic-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
              </div>
              <h3>Pathfinder Spell</h3>
              <p>AI-powered route optimization conjures the most efficient recycling pickup paths.</p>
            </div>
            <div className="feature-card magic-card">
              <div className="feature-icon magic-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              </div>
              <h3>Oracle Chat</h3>
              <p>Gemini 2.0-powered familiar answers sustainability questions and analyzes recyclability.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Recycling Facts – interactive flip cards ── */}
      <section className="about-section about-facts">
        <div className="about-container">
          <h2 className="section-title">Ancient Scrolls of Knowledge</h2>
          <p className="section-subtitle">Hover to unveil recycling secrets hidden within</p>

          <div className="facts-grid">
            <div className="fact-flip">
              <div className="fact-flip-inner">
                <div className="fact-front">
                  <span className="fact-emoji">&#x1F50B;</span>
                  <h3>Car Batteries</h3>
                  <p className="fact-hint">Reveal the scroll</p>
                </div>
                <div className="fact-back">
                  <p>Car batteries are the <strong>#1 most recycled product</strong> in the US — over 99% are recycled, more than aluminum cans or newspapers.</p>
                </div>
              </div>
            </div>

            <div className="fact-flip">
              <div className="fact-flip-inner">
                <div className="fact-front">
                  <span className="fact-emoji">&#x267B;&#xFE0F;</span>
                  <h3>Aluminum</h3>
                  <p className="fact-hint">Reveal the scroll</p>
                </div>
                <div className="fact-back">
                  <p>Recycling one aluminum can saves enough energy to <strong>run a TV for 3 hours</strong>. Aluminum can be recycled infinitely without losing quality.</p>
                </div>
              </div>
            </div>

            <div className="fact-flip">
              <div className="fact-flip-inner">
                <div className="fact-front">
                  <span className="fact-emoji">&#x1F30A;</span>
                  <h3>Ocean Plastic</h3>
                  <p className="fact-hint">Reveal the scroll</p>
                </div>
                <div className="fact-back">
                  <p>Over <strong>8 million tons</strong> of plastic enter the ocean every year — that&apos;s like dumping a garbage truck of plastic every minute.</p>
                </div>
              </div>
            </div>

            <div className="fact-flip">
              <div className="fact-flip-inner">
                <div className="fact-front">
                  <span className="fact-emoji">&#x1F333;</span>
                  <h3>Paper &amp; Trees</h3>
                  <p className="fact-hint">Reveal the scroll</p>
                </div>
                <div className="fact-back">
                  <p>Recycling one ton of paper <strong>saves 17 trees</strong>, 7,000 gallons of water, and 3 cubic yards of landfill space.</p>
                </div>
              </div>
            </div>

            <div className="fact-flip">
              <div className="fact-flip-inner">
                <div className="fact-front">
                  <span className="fact-emoji">&#x1F4F1;</span>
                  <h3>E-Waste</h3>
                  <p className="fact-hint">Reveal the scroll</p>
                </div>
                <div className="fact-back">
                  <p>Only <strong>17% of e-waste</strong> is properly recycled. One million recycled phones can recover 35,000 lbs of copper and 75 lbs of gold.</p>
                </div>
              </div>
            </div>

            <div className="fact-flip">
              <div className="fact-flip-inner">
                <div className="fact-front">
                  <span className="fact-emoji">&#x1F697;</span>
                  <h3>Vehicle Recycling</h3>
                  <p className="fact-hint">Reveal the scroll</p>
                </div>
                <div className="fact-back">
                  <p>About <strong>80% of a vehicle</strong> can be recycled. The auto recycling industry is the 16th largest in the US, saving 85 million barrels of oil annually.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section className="about-section about-tech">
        <div className="about-container">
          <h2 className="section-title">GreenFleet Ingredients</h2>
          <div className="tech-pills">
            <span className="tech-pill">Next.js 15</span>
            <span className="tech-pill">React 18</span>
            <span className="tech-pill">Supabase</span>
            <span className="tech-pill">Leaflet Maps</span>
            <span className="tech-pill">Gemini 2.0 Flash</span>
            <span className="tech-pill">Pure CSS</span>
          </div>
        </div>
      </section>

      {/* ── Team + Project ── */}
      <section className="about-section about-brief">
        <div className="about-container">
          <div className="about-brief-grid">
            <div className="about-brief-card">
              <span>Quest</span>
              <h3>The Challenge</h3>
              <p>
                Built for the Cox Automotive challenge at UGAHacks 11 — track and optimize
                battery recycling operations across Ford dealerships with real-time data,
                AI-driven routes, and sustainability analytics.
              </p>
            </div>
            <div className="about-brief-card">
              <span>Guild</span>
              <h3>The Wizards</h3>
              <div className="team-member">
                <div className="team-avatar-circle">DS</div>
                <span>Diego Sanchez-Carapia</span>
              </div>
              <div className="team-member">
                <div className="team-avatar-circle">VT</div>
                <span>Vi Tran</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="about-section about-cta">
        <div className="about-container about-cta-inner">
          <div>
            <h2>Ready to Cast Your Spell?</h2>
            <p>Join the guild and start making a measurable impact today.</p>
          </div>
          <Link href="/signup" className="about-btn about-btn--magic about-btn--lg">
            Enter the Portal
          </Link>
        </div>
      </section>
    </div>
  )
}
