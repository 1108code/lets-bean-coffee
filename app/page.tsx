"use client";

import { useEffect, useState } from "react";

const messengerUrl = "https://m.me/689891387533123";
const address =
  "1st Floor Anest Tower Lopez Avenue Batong Malake, Los Baños, Philippines";
const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

const navItems = [
  ["HOME", "#home"],
  ["MENU", "#menu"],
  ["PRIVATE ROOM", "#private-room"],
  ["ABOUT US", "#about"],
  ["CONTACT", "#contact"],
];

const menuCards = [
  {
    title: "COFFEE",
    image: "/photos/photo-07.jpg",
    imageAlt: "/photos/menu-sample-coffee.webp",
  },
  {
    title: "NON-COFFEE",
    image: "/photos/photo-02.jpg",
    imageAlt: "/photos/menu-sample-non-coffee.webp",
  },
  {
    title: "PASTRIES",
    image: "/photos/photo-03.jpg",
    imageAlt: "/photos/menu-sample-pastries.webp",
  },
  {
    title: "RICE MEALS",
    image: "/photos/photo-04.jpg",
    imageAlt: "/photos/menu-sample-rice-meals.webp",
  },
  {
    title: "SNACKS",
    image: "/photos/snacks-fries.webp",
    imageAlt: "/photos/snacks-flatbread.webp",
  },
];

type MenuItem = {
  title: string;
  image: string;
  imageAlt?: string;
};

type ReviewItem = {
  title: string;
  body: string;
  image?: string;
};

type SiteContent = {
  heroTitle: string;
  heroAccent: string;
  heroCopy: string;
  menuEyebrow: string;
  menuHeading: string;
  menuNote: string;
  menuCta: string;
  aboutEyebrow: string;
  aboutHeading: string;
  aboutCopy: string;
  aboutImage: string;
  privateImage: string;
  privateEyebrow: string;
  privateHeading: string;
  privateCopy: string;
  privateLabelTitle: string;
  privateLabelCta: string;
  privatePrimaryCta: string;
  privateSecondaryCta: string;
  reviewsEyebrow: string;
  reviewsHeading: string;
  reviewsCopy: string;
  reviewsCta: string;
  orderEyebrow: string;
  orderHeading: string;
  paymentIntro: string;
  footerLine: string;
  copyright: string;
  email: string;
  address: string;
  weekdayLabel: string;
  weekdayHours: string;
  weekendLabel: string;
  weekendHours: string;
  messengerUrl: string;
  messengerLabel: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  menu: MenuItem[];
  reviews: ReviewItem[];
};

const publishedStorageKey = "lets-bean-cms-published";
const cmsApiPath = "/.netlify/functions/cms";

const defaultContent: SiteContent = {
  heroTitle: "AUTHENTIC POURS.",
  heroAccent: "UNFILTERED VIBES.",
  heroCopy:
    "A cozy space for good coffee, great conversations, and meaningful moments.",
  menuEyebrow: "OUR MENU",
  menuHeading: "SOMETHING FOR EVERY CRAVING",
  menuNote: "Full menu available soon. Message us for today's selections.",
  menuCta: "ASK FOR TODAY'S MENU",
  aboutEyebrow: "ABOUT LET'S BEAN COFFEE",
  aboutHeading: "MORE THAN JUST COFFEE",
  aboutCopy:
    "We're here to serve quality brews, delicious bites, and a space where you can relax, focus, and connect. Thank you for being part of our journey.",
  aboutImage: "/photos/about-drink-feature.png",
  privateImage: "/photos/private-room-storefront.png",
  privateEyebrow: "PRIVATE ROOM RENTAL",
  privateHeading: "A QUIET SPACE FOR YOUR MOMENTS",
  privateCopy:
    "Reserve a comfortable private room for meetings, study sessions, small gatherings, and private conversations.",
  privateLabelTitle: "PRIVATE ROOM RENTAL",
  privateLabelCta: "INQUIRE FOR DETAILS",
  privatePrimaryCta: "INQUIRE NOW",
  privateSecondaryCta: "MESSAGE US",
  reviewsEyebrow: "CUSTOMER REVIEWS",
  reviewsHeading: "KIND WORDS FROM OUR GUESTS",
  reviewsCopy:
    "We are preparing a space for real customer notes and shared moments. Visit our social pages to see the latest posts and leave your own Let's Bean Coffee experience.",
  reviewsCta: "VIEW FACEBOOK PAGE",
  orderEyebrow: "ORDER / INQUIRY",
  orderHeading: "LET US PREPARE SOMETHING FOR YOU",
  paymentIntro: "BPI or BDO Bank Transfer",
  footerLine: "Authentic Pours. Unfiltered Vibes.",
  copyright: "© 2026 LET'S BEAN COFFEE. ALL RIGHTS RESERVED.",
  email: "letsbean.cafe@gmail.com",
  address,
  weekdayLabel: "Monday-Friday",
  weekdayHours: "10:00 AM - 10:00 PM",
  weekendLabel: "Saturday-Sunday",
  weekendHours: "4:00 PM - 10:00 PM",
  messengerUrl,
  messengerLabel: "m.me/689891387533123",
  facebook: "https://www.facebook.com/letsbeancoffee/",
  instagram: "https://www.instagram.com/letsbeancafe/",
  tiktok: "https://www.tiktok.com/@letsbeancoffee3",
  menu: menuCards,
  reviews: [
    {
      title: "Cozy Moments",
      body: "Customer stories and cafe moments can be featured here once available.",
      image: "/photos/review-sample-cozy.webp",
    },
    {
      title: "Favorite Orders",
      body: "Highlight real drink, pastry, meal, and snack feedback from guests.",
      image: "/photos/review-sample-orders.webp",
    },
    {
      title: "Private Room Notes",
      body: "Share real impressions from meetings, study sessions, and small gatherings.",
      image: "/photos/review-sample-private-room.webp",
    },
  ],
};

function MenuIcon({ title }: { title: string }) {
  if (title === "PASTRIES") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M9 31c1.5-8.2 8.8-14.5 17.4-14.5 6.3 0 11.6 3.6 14.1 8.8" />
        <path d="M10 31c2.7 3.4 7.4 5.5 13 5.5 7.7 0 14.2-4 17.3-10" />
        <path d="M17 25c2 1 3.6 2.8 4.4 5.2" />
        <path d="M25 20.5c2.3 2 3.4 4.7 3.2 8" />
        <path d="M33.5 23.5c1.7 1.1 3 2.7 3.8 4.7" />
      </svg>
    );
  }

  if (title === "SNACKS") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M13 18h22l-2.2 22H15.2L13 18Z" />
        <path d="M17 18v-4h14v4" />
        <path d="M20 14c0-3 2-5 4-5s4 2 4 5" />
        <path d="M20 27c2.5-2 5.5-2 8 0" />
        <path d="M19 33h10" />
        <path d="M35 18h3v7" />
      </svg>
    );
  }

  if (title === "NON-COFFEE") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M16 20h18l-2.4 19H18.4L16 20Z" />
        <path d="M19 20l-1-6h5" />
        <path d="M24 14h11" />
        <path d="M26 14l-2 6" />
        <path d="M20 28h10" />
        <path d="M22 33h6" />
        <path d="M34 22h3v6h-3" />
      </svg>
    );
  }

  if (title === "RICE MEALS") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M12 26c1.2 7.2 6.2 12 12 12s10.8-4.8 12-12H12Z" />
        <path d="M15 26c1.8-5.8 5.1-8.6 9-8.6s7.2 2.8 9 8.6" />
        <path d="M18 18c-1.6-2-1.6-4 0-6" />
        <path d="M24 17c-1.6-2-1.6-4 0-6" />
        <path d="M30 18c-1.6-2-1.6-4 0-6" />
        <path d="M17 33h14" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M13 22h22v8c0 5-4 9-9 9h-4c-5 0-9-4-9-9v-8Z" />
      <path d="M35 24h3.5c3 0 4.5 2 4.5 4.5S41.2 33 38.5 33H35" />
      <path d="M10 39h28" />
      <path d="M18 16c-1.6-2-1.6-4 0-6" />
      <path d="M24 16c-1.6-2-1.6-4 0-6" />
      <path d="M30 16c-1.6-2-1.6-4 0-6" />
    </svg>
  );
}

function ButtonIcon({ type }: { type: "cup" | "menu" | "chat" }) {
  if (type === "menu") {
    return (
      <svg className="button-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 5.8h14" />
        <path d="M5 12h14" />
        <path d="M5 18.2h10" />
      </svg>
    );
  }

  if (type === "chat") {
    return (
      <svg className="button-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 6.4c1.7-1.8 4.1-2.8 7-2.8 4.9 0 8.6 3.3 8.6 7.8s-3.7 7.8-8.6 7.8c-1 0-2-.1-2.9-.4L5 21v-4.5c-1-1.3-1.6-3.1-1.6-5.1 0-1.9.6-3.6 1.6-5Z" />
        <path d="m8 12.9 2.6-2.7 2.7 2.1 2.8-2.9" />
      </svg>
    );
  }

  return (
    <svg className="button-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5.6 10.7h10.8v4c0 2.8-2.3 5.1-5.1 5.1h-.6c-2.8 0-5.1-2.3-5.1-5.1v-4Z" />
      <path d="M16.4 11.9h1.7c1.5 0 2.4 1 2.4 2.3s-.9 2.3-2.4 2.3h-1.7" />
      <path d="M4 20h14" />
      <path d="M8.2 7.9c-.8-1-.8-2 0-3" />
      <path d="M12 7.9c-.8-1-.8-2 0-3" />
      <path d="M15.8 7.9c-.8-1-.8-2 0-3" />
    </svg>
  );
}

function normalizeContent(nextContent: Partial<SiteContent>): SiteContent {
  return {
    ...defaultContent,
    ...nextContent,
    menu: (nextContent.menu || defaultContent.menu).map((item, index) => ({
      ...defaultContent.menu[index],
      ...item,
      imageAlt: item.imageAlt || item.image,
    })),
    reviews: (nextContent.reviews || defaultContent.reviews).map((item, index) => ({
      ...defaultContent.reviews[index],
      ...item,
      image: item.image || defaultContent.reviews[index]?.image,
    })),
  };
}

export default function Home() {
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    let isCurrent = true;

    async function loadContent() {
      try {
        const response = await fetch(cmsApiPath, { cache: "no-store" });
        if (response.ok) {
          const data = (await response.json()) as { content?: Partial<SiteContent> };
          if (data.content && isCurrent) {
            const normalizedContent = normalizeContent(data.content);
            setContent(normalizedContent);
            window.localStorage.setItem(
              publishedStorageKey,
              JSON.stringify(normalizedContent),
            );
            return;
          }
        }
      } catch {
        // Local preview falls back to the browser copy.
      }

      const savedContent = window.localStorage.getItem(publishedStorageKey);
      if (savedContent && isCurrent) {
        setContent(normalizeContent(JSON.parse(savedContent) as Partial<SiteContent>));
      }
    }

    loadContent();
    return () => {
      isCurrent = false;
    };
  }, []);

  const activeMessengerUrl = content.messengerUrl || messengerUrl;
  const activeMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(content.address)}`;
  const activeMenu = content.menu?.length ? content.menu : menuCards;
  const activeReviews = content.reviews?.length ? content.reviews : defaultContent.reviews;

  return (
    <main>
      <header className="site-header">
        <a href="#home" className="brand" aria-label="Let's Bean Coffee home">
          <img src="/lets-bean-logo-light.png" alt="Let's Bean Coffee logo" />
        </a>
        <input className="nav-toggle" type="checkbox" id="nav-toggle" />
        <label className="hamburger" htmlFor="nav-toggle" aria-label="Open menu">
          <span />
          <span />
          <span />
        </label>
        <nav className="main-nav" aria-label="Primary navigation">
          {navItems.map(([label, href]) => (
            <a key={label} href={href}>
              {label}
            </a>
          ))}
        </nav>
        <a className="order-button header-order" href="#order">
          ORDER NOW <ButtonIcon type="cup" />
        </a>
      </header>

      <section id="home" className="hero">
        <div className="hero-shade" />
        <div className="hero-content">
          <p className="eyebrow">LET'S BEAN COFFEE</p>
          <h1>
            {content.heroTitle}
            <span>{content.heroAccent}</span>
          </h1>
          <p className="hero-copy">{content.heroCopy}</p>
          <div className="hero-actions">
            <a className="gold-button" href="#menu">
              VIEW MENU <ButtonIcon type="menu" />
            </a>
            <a className="outline-button" href="#contact">
              CONTACT US <ButtonIcon type="chat" />
            </a>
          </div>
        </div>
        <div className="messenger-card" aria-label="Messenger contact prompt">
          <p>Hello! How can we help you today?</p>
          <a href={activeMessengerUrl} target="_blank" rel="noreferrer">
            Chat with us
          </a>
          <span className="messenger-dot" aria-hidden="true">
            <img src="/icons/messenger.svg" alt="" />
          </span>
        </div>
      </section>

      <section id="menu" className="menu-section">
        <div className="section-heading centered">
          <p>{content.menuEyebrow}</p>
          <h2>{content.menuHeading}</h2>
          <span className="menu-note">
            {content.menuNote}
          </span>
          <span className="divider" />
        </div>
        <div className="menu-grid">
          {activeMenu.map((card) => (
            <a
              className="menu-card"
              href="#order"
              key={card.title}
            >
              <span className="menu-card-images" aria-hidden="true">
                <img className="menu-card-image primary" src={card.image} alt="" />
                <img className="menu-card-image secondary" src={card.imageAlt || card.image} alt="" />
              </span>
              <span className="card-overlay" />
              <span className="card-icon" aria-hidden="true">
                <MenuIcon title={card.title} />
              </span>
              <strong>{card.title}</strong>
            </a>
          ))}
        </div>
        <div className="menu-cta-row">
          <a className="menu-message-button" href={activeMessengerUrl} target="_blank" rel="noreferrer">
            {content.menuCta}
          </a>
        </div>
      </section>

      <section id="about" className="about-section">
        <div className="about-copy">
          <p className="eyebrow dark">{content.aboutEyebrow}</p>
          <h2>{content.aboutHeading}</h2>
          <p>{content.aboutCopy}</p>
          <div className="signature">Let’s Bean Coffee ♥</div>
        </div>
        <img
          className="about-image"
          src={content.aboutImage}
          alt="Let's Bean Coffee branded matcha drink in the cafe"
        />
      </section>

      <section id="private-room" className="private-section">
        <div className="private-visual" aria-label="Let's Bean Coffee private room visual">
          <img
            className="private-visual-main"
            src={content.privateImage}
            alt="Let's Bean Coffee storefront entrance"
          />
          <span className="private-visual-filter" aria-hidden="true" />
          <div className="private-visual-label">
            <span>{content.privateLabelTitle}</span>
            <strong>{content.privateLabelCta}</strong>
          </div>
        </div>
        <div>
          <p className="eyebrow">{content.privateEyebrow}</p>
          <h2>{content.privateHeading}</h2>
          <p>{content.privateCopy}</p>
          <div className="private-actions">
            <a className="gold-button" href="#order">
              {content.privatePrimaryCta}
            </a>
            <a className="outline-button light" href={activeMessengerUrl} target="_blank" rel="noreferrer">
              {content.privateSecondaryCta}
            </a>
          </div>
        </div>
      </section>

      <section className="reviews-section" aria-labelledby="reviews-heading">
        <div className="reviews-copy">
          <p className="eyebrow dark">{content.reviewsEyebrow}</p>
          <h2 id="reviews-heading">{content.reviewsHeading}</h2>
          <p>{content.reviewsCopy}</p>
          <a className="review-link" href={content.facebook} target="_blank" rel="noreferrer">
            {content.reviewsCta} <ButtonIcon type="chat" />
          </a>
        </div>
        <div className="review-cards" aria-label="Customer review placeholders">
          {activeReviews.map((review, index) => (
            <article className="review-card-rotator" key={`${review.title}-${index}`}>
              <div className="review-card-face review-text-face">
                <h3>{review.title}</h3>
                <p>“{review.body}”</p>
              </div>
              <div className="review-card-face review-photo-face" aria-hidden="true">
                <img src={review.image || "/photos/review-sample-cozy.webp"} alt="" />
                <span>{review.title}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="info-section">
        <article>
          <span className="info-icon line-icon clock-icon" aria-hidden="true" />
          <h3>BUSINESS HOURS</h3>
          <p><strong>{content.weekdayLabel}</strong>{content.weekdayHours}</p>
          <p><strong>{content.weekendLabel}</strong>{content.weekendHours}</p>
        </article>
        <article>
          <span className="info-icon line-icon mail-icon" aria-hidden="true" />
          <h3>CONTACT US</h3>
          <a href={`mailto:${content.email}`}>{content.email}</a>
          <a className="messenger-link" href={activeMessengerUrl} target="_blank" rel="noreferrer">
            <img className="messenger-logo" src="/icons/messenger.svg" alt="" aria-hidden="true" />
            {content.messengerLabel}
          </a>
        </article>
        <article>
          <span className="info-icon line-icon location-icon" aria-hidden="true" />
          <h3>LOCATION</h3>
          <a href={activeMapsUrl} target="_blank" rel="noreferrer">
            {content.address}
          </a>
        </article>
        <article>
          <span className="info-icon line-icon card-icon-small" aria-hidden="true" />
          <h3>PAYMENT METHODS</h3>
          <p>{content.paymentIntro}</p>
          <div className="payment-logos" aria-label="Accepted payment methods">
            <span className="pay-logo gcash">GCash</span>
            <span className="pay-logo maya">maya</span>
            <span className="pay-logo gotyme">GoTyme</span>
            <img className="maribank-logo" src="/icons/maribank-logo.png" alt="MariBank" />
          </div>
        </article>
        <article>
          <span className="info-icon line-icon social-icon" aria-hidden="true" />
          <h3>FOLLOW US</h3>
          <a className="social-row" href={content.facebook} target="_blank" rel="noreferrer">
            <span className="social-badge facebook" aria-hidden="true">f</span>
            <span>Facebook<small>@letsbeancoffee</small></span>
          </a>
          <a className="social-row" href={content.instagram} target="_blank" rel="noreferrer">
            <span className="social-badge instagram" aria-hidden="true" />
            <span>Instagram<small>@letsbeancafe</small></span>
          </a>
          <a className="social-row" href={content.tiktok} target="_blank" rel="noreferrer">
            <span className="social-badge tiktok" aria-hidden="true">♪</span>
            <span>TikTok<small>@letsbeancoffee3</small></span>
          </a>
        </article>
      </section>

      <section id="order" className="order-section">
        <div className="section-heading">
          <p>{content.orderEyebrow}</p>
          <h2>{content.orderHeading}</h2>
        </div>
        <form
          className="order-form"
          action={`mailto:${content.email}`}
          method="post"
          encType="text/plain"
        >
          <label>Name<input name="name" type="text" required /></label>
          <label>Contact Number<input name="contact" type="tel" required /></label>
          <label>Email<input name="email" type="email" /></label>
          <label>Order Type<select name="orderType"><option>Order</option><option>Inquiry</option><option>Private Room Rental</option></select></label>
          <label>Selected Product / Category<select name="category">{activeMenu.map((card) => <option key={card.title}>{card.title}</option>)}</select></label>
          <label>Quantity<input name="quantity" type="number" min="1" defaultValue="1" /></label>
          <label className="wide">Additional Notes<textarea name="notes" rows={5} /></label>
          <p className="form-note">
            Orders and inquiries will be confirmed through Messenger or the
            contact details provided.
          </p>
          <button className="gold-button form-submit" type="submit">
            SUBMIT INQUIRY
          </button>
          <a className="messenger-submit" href={activeMessengerUrl} target="_blank" rel="noreferrer">
            Continue through Messenger
          </a>
        </form>
      </section>

      <footer className="site-footer">
        <img src="/lets-bean-logo-light.png" alt="Let's Bean Coffee logo" />
        <nav aria-label="Footer navigation">
          {navItems.map(([label, href]) => (
            <a key={label} href={href}>{label}</a>
          ))}
        </nav>
        <a href={`mailto:${content.email}`}>{content.email}</a>
        <a className="footer-address" href={activeMapsUrl} target="_blank" rel="noreferrer">
          {content.address}
        </a>
        <div className="footer-socials">
          <a href={content.facebook} target="_blank" rel="noreferrer">Facebook</a>
          <a href={content.instagram} target="_blank" rel="noreferrer">Instagram</a>
          <a href={content.tiktok} target="_blank" rel="noreferrer">TikTok</a>
          <a href={activeMessengerUrl} target="_blank" rel="noreferrer">Messenger</a>
        </div>
        <p>{content.footerLine}</p>
        <small>{content.copyright}</small>
      </footer>

      <a className="floating-messenger" href={activeMessengerUrl} target="_blank" rel="noreferrer" aria-label="Open Facebook Messenger">
        <img src="/icons/messenger.svg" alt="" aria-hidden="true" />
      </a>
    </main>
  );
}
