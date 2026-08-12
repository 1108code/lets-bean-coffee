"use client";

import { useEffect, useMemo, useState } from "react";

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

type CmsContent = {
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

const storageKey = "lets-bean-cms-draft";
const publishedStorageKey = "lets-bean-cms-published";
const cmsPasswordKey = "lets-bean-cms-password";
const cmsApiPath = "/.netlify/functions/cms";

const defaultContent: CmsContent = {
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
  address:
    "1st Floor Anest Tower Lopez Avenue Batong Malake, Los Banos, Philippines",
  weekdayLabel: "Monday-Friday",
  weekdayHours: "10:00 AM - 10:00 PM",
  weekendLabel: "Saturday-Sunday",
  weekendHours: "4:00 PM - 10:00 PM",
  messengerUrl: "https://m.me/689891387533123",
  messengerLabel: "m.me/689891387533123",
  facebook: "https://www.facebook.com/letsbeancoffee/",
  instagram: "https://www.instagram.com/letsbeancafe/",
  tiktok: "https://www.tiktok.com/@letsbeancoffee3",
  menu: [
    { title: "COFFEE", image: "/photos/photo-07.jpg", imageAlt: "/photos/menu-sample-coffee.webp" },
    { title: "NON-COFFEE", image: "/photos/photo-02.jpg", imageAlt: "/photos/menu-sample-non-coffee.webp" },
    { title: "PASTRIES", image: "/photos/photo-03.jpg", imageAlt: "/photos/menu-sample-pastries.webp" },
    { title: "RICE MEALS", image: "/photos/photo-04.jpg", imageAlt: "/photos/menu-sample-rice-meals.webp" },
    { title: "SNACKS", image: "/photos/snacks-fries.webp", imageAlt: "/photos/snacks-flatbread.webp" },
  ],
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

function updateListItem<T extends object>(
  list: T[],
  index: number,
  updates: Partial<T>,
) {
  return list.map((item, itemIndex) =>
    itemIndex === index ? { ...item, ...updates } : item,
  );
}

function normalizeContent(nextContent: Partial<CmsContent>): CmsContent {
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

export default function CmsPage() {
  const [content, setContent] = useState(defaultContent);
  const [activePanel, setActivePanel] = useState("hero");
  const [copyStatus, setCopyStatus] = useState("Ready");
  const [cmsPassword, setCmsPassword] = useState("");

  useEffect(() => {
    const savedPassword = window.sessionStorage.getItem(cmsPasswordKey);
    if (savedPassword) {
      setCmsPassword(savedPassword);
    }

    let isCurrent = true;

    async function loadContent() {
      try {
        const response = await fetch(cmsApiPath, { cache: "no-store" });
        if (response.ok) {
          const data = (await response.json()) as { content?: Partial<CmsContent> };
          if (data.content && isCurrent) {
            setContent(normalizeContent(data.content));
            setCopyStatus("Loaded online");
            window.setTimeout(() => setCopyStatus("Ready"), 1800);
            return;
          }
        }
      } catch {
        // Local preview falls back to the browser draft.
      }

      const savedContent = window.localStorage.getItem(storageKey);
      if (savedContent && isCurrent) {
        setContent(normalizeContent(JSON.parse(savedContent) as Partial<CmsContent>));
      }
    }

    loadContent();
    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(content));
  }, [content]);

  useEffect(() => {
    window.sessionStorage.setItem(cmsPasswordKey, cmsPassword);
  }, [cmsPassword]);

  const exportedJson = useMemo(() => {
    const { copyright, ...safeEditableContent } = content;
    return JSON.stringify(
      {
        note: "Safe CMS backup only. Locked/legal fields are intentionally excluded.",
        editableContent: safeEditableContent,
      },
      null,
      2,
    );
  }, [content]);

  async function copyJson() {
    await navigator.clipboard.writeText(exportedJson);
    setCopyStatus("Copied JSON");
    window.setTimeout(() => setCopyStatus("Ready"), 1800);
  }

  async function publishContent() {
    const normalizedContent = normalizeContent(content);
    setCopyStatus("Publishing...");

    try {
      const response = await fetch(cmsApiPath, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-cms-password": cmsPassword,
        },
        body: JSON.stringify({ content: normalizedContent }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || "Publish failed");
      }

      window.localStorage.setItem(
        publishedStorageKey,
        JSON.stringify(normalizedContent),
      );
      setContent(normalizedContent);
      setCopyStatus("Published online");
    } catch (error) {
      window.localStorage.setItem(
        publishedStorageKey,
        JSON.stringify(normalizedContent),
      );
      setCopyStatus(error instanceof Error ? error.message : "Saved locally");
    }

    window.setTimeout(() => setCopyStatus("Ready"), 2600);
  }

  async function readPhoto(file: File) {
    const source = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") resolve(reader.result);
        reject(new Error("Could not read photo"));
      };
      reader.onerror = () => reject(new Error("Could not read photo"));
      reader.readAsDataURL(file);
    });

    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const photo = new Image();
      photo.onload = () => resolve(photo);
      photo.onerror = () => reject(new Error("Could not optimize photo"));
      photo.src = source;
    });

    const maxDimension = 1400;
    const scale = Math.min(1, maxDimension / Math.max(image.width, image.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(image.width * scale);
    canvas.height = Math.round(image.height * scale);

    const context = canvas.getContext("2d");
    if (!context) return source;

    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    return await new Promise<string>((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(source);
            return;
          }
          const reader = new FileReader();
          reader.onload = () =>
            resolve(typeof reader.result === "string" ? reader.result : source);
          reader.readAsDataURL(blob);
        },
        "image/webp",
        0.74,
      );
    });
  }

  async function handleUpload(file: File | undefined, onReady: (imageData: string) => void) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setCopyStatus("Use image file");
      window.setTimeout(() => setCopyStatus("Ready"), 1800);
      return;
    }

    setCopyStatus("Optimizing photo...");
    try {
      const imageData = await readPhoto(file);
      onReady(imageData);
      setCopyStatus("Photo added");
    } catch {
      setCopyStatus("Photo failed");
    }
    window.setTimeout(() => setCopyStatus("Ready"), 1800);
  }

  function renderTextField(label: string, key: keyof CmsContent, rows = 1) {
    const value = content[key] as string;
    return (
      <label key={String(key)}>
        {label}
        {rows > 1 ? (
          <textarea
            rows={rows}
            value={value}
            onChange={(event) =>
              setContent({ ...content, [key]: event.target.value })
            }
          />
        ) : (
          <input
            value={value}
            onChange={(event) =>
              setContent({ ...content, [key]: event.target.value })
            }
          />
        )}
      </label>
    );
  }

  return (
    <main className="cms-shell">
      <aside className="cms-sidebar">
        <a className="cms-logo" href="/">
          <img src="/lets-bean-logo-light.png" alt="Let's Bean Coffee logo" />
          <span>Content Studio</span>
        </a>
        <nav className="cms-tabs" aria-label="CMS sections">
          {["hero", "sections", "menu", "reviews", "contact", "order", "locked", "backup"].map((panel) => (
            <button
              className={activePanel === panel ? "active" : ""}
              key={panel}
              onClick={() => setActivePanel(panel)}
              type="button"
            >
              {panel}
            </button>
          ))}
        </nav>
        <a className="cms-view-site" href="/">
          View Website
        </a>
      </aside>

      <section className="cms-workspace">
        <div className="cms-topbar">
          <div>
            <p>LET'S BEAN COFFEE</p>
            <h1>Website CMS</h1>
          </div>
          <div className="cms-status">
            <label className="cms-password">
              CMS Password
              <input
                aria-label="CMS password"
                placeholder="Enter password"
                type="password"
                value={cmsPassword}
                onChange={(event) => setCmsPassword(event.target.value)}
              />
            </label>
            <span>{copyStatus}</span>
            <button onClick={publishContent} type="button">
              Publish
            </button>
            <button onClick={() => setContent(defaultContent)} type="button">
              Reset Draft
            </button>
          </div>
        </div>
        <p className="cms-publish-note">
          Drafts autosave in this browser. On Netlify, Publish saves online so
          updates and uploaded photos appear on desktop, tablet, and mobile.
        </p>

        {activePanel === "hero" && (
          <div className="cms-grid">
            <section className="cms-panel">
              <h2>Hero Section</h2>
              <label>
                Main headline
                <input
                  value={content.heroTitle}
                  onChange={(event) =>
                    setContent({ ...content, heroTitle: event.target.value })
                  }
                />
              </label>
              <label>
                Accent headline
                <input
                  value={content.heroAccent}
                  onChange={(event) =>
                    setContent({ ...content, heroAccent: event.target.value })
                  }
                />
              </label>
              <label>
                Supporting copy
                <textarea
                  rows={5}
                  value={content.heroCopy}
                  onChange={(event) =>
                    setContent({ ...content, heroCopy: event.target.value })
                  }
                />
              </label>
              <label>
                About copy
                <textarea
                  rows={5}
                  value={content.aboutCopy}
                  onChange={(event) =>
                    setContent({ ...content, aboutCopy: event.target.value })
                  }
                />
              </label>
              <div className="cms-upload-row">
                <label>
                  About photo
                  <input
                    accept="image/*"
                    type="file"
                    onChange={(event) =>
                      handleUpload(event.target.files?.[0], (imageData) =>
                        setContent({ ...content, aboutImage: imageData }),
                      )
                    }
                  />
                </label>
                <label>
                  Private room photo
                  <input
                    accept="image/*"
                    type="file"
                    onChange={(event) =>
                      handleUpload(event.target.files?.[0], (imageData) =>
                        setContent({ ...content, privateImage: imageData }),
                      )
                    }
                  />
                </label>
              </div>
            </section>
            <section className="cms-preview-card dark-preview">
              <p>Live Draft</p>
              <h2>
                {content.heroTitle}
                <span>{content.heroAccent}</span>
              </h2>
              <small>{content.heroCopy}</small>
            </section>
          </div>
        )}

        {activePanel === "sections" && (
          <section className="cms-panel">
            <h2>Section Copy</h2>
            <div className="cms-form-grid">
              {renderTextField("Menu eyebrow", "menuEyebrow")}
              {renderTextField("Menu heading", "menuHeading")}
              {renderTextField("Menu note", "menuNote", 3)}
              {renderTextField("Menu CTA", "menuCta")}
              {renderTextField("About eyebrow", "aboutEyebrow")}
              {renderTextField("About heading", "aboutHeading")}
              {renderTextField("Private eyebrow", "privateEyebrow")}
              {renderTextField("Private heading", "privateHeading")}
              {renderTextField("Private copy", "privateCopy", 4)}
              {renderTextField("Private image label", "privateLabelTitle")}
              {renderTextField("Private image CTA", "privateLabelCta")}
              {renderTextField("Private primary CTA", "privatePrimaryCta")}
              {renderTextField("Private secondary CTA", "privateSecondaryCta")}
              {renderTextField("Reviews eyebrow", "reviewsEyebrow")}
              {renderTextField("Reviews heading", "reviewsHeading")}
              {renderTextField("Reviews copy", "reviewsCopy", 4)}
              {renderTextField("Reviews CTA", "reviewsCta")}
            </div>
          </section>
        )}

        {activePanel === "menu" && (
          <section className="cms-panel">
            <h2>Menu Categories</h2>
            <div className="cms-list">
              {content.menu.map((item, index) => (
                <article className="cms-list-item" key={`${item.title}-${index}`}>
                  <div className="cms-dual-preview" aria-label={`${item.title} photo preview`}>
                    <img src={item.image} alt="" />
                    <img src={item.imageAlt || item.image} alt="" />
                  </div>
                  <label>
                    Category name
                    <input
                      value={item.title}
                      onChange={(event) =>
                        setContent({
                          ...content,
                          menu: updateListItem(content.menu, index, {
                            title: event.target.value,
                          }),
                        })
                      }
                    />
                  </label>
                  <label>
                    Photo 1 path
                    <input
                      value={item.image}
                      onChange={(event) =>
                        setContent({
                          ...content,
                          menu: updateListItem(content.menu, index, {
                            image: event.target.value,
                          }),
                        })
                      }
                    />
                  </label>
                  <label>
                    Photo 1 upload
                    <input
                      accept="image/*"
                      type="file"
                      onChange={(event) =>
                        handleUpload(event.target.files?.[0], (imageData) =>
                          setContent({
                            ...content,
                            menu: updateListItem(content.menu, index, {
                              image: imageData,
                            }),
                          }),
                        )
                      }
                    />
                  </label>
                  <label>
                    Photo 2 path
                    <input
                      value={item.imageAlt || ""}
                      onChange={(event) =>
                        setContent({
                          ...content,
                          menu: updateListItem(content.menu, index, {
                            imageAlt: event.target.value,
                          }),
                        })
                      }
                    />
                  </label>
                  <label>
                    Photo 2 upload
                    <input
                      accept="image/*"
                      type="file"
                      onChange={(event) =>
                        handleUpload(event.target.files?.[0], (imageData) =>
                          setContent({
                            ...content,
                            menu: updateListItem(content.menu, index, {
                              imageAlt: imageData,
                            }),
                          }),
                        )
                      }
                    />
                  </label>
                </article>
              ))}
            </div>
          </section>
        )}

        {activePanel === "reviews" && (
          <section className="cms-panel">
            <h2>Customer Review Area</h2>
            <div className="cms-list">
              {content.reviews.map((item, index) => (
                <article className="cms-list-item compact" key={`${item.title}-${index}`}>
                  <div className="cms-review-preview">
                    <img src={item.image || "/photos/review-sample-cozy.webp"} alt="" />
                  </div>
                  <label>
                    Review title
                    <input
                      value={item.title}
                      onChange={(event) =>
                        setContent({
                          ...content,
                          reviews: updateListItem(content.reviews, index, {
                            title: event.target.value,
                          }),
                        })
                      }
                    />
                  </label>
                  <label>
                    Review text
                    <textarea
                      rows={4}
                      value={item.body}
                      onChange={(event) =>
                        setContent({
                          ...content,
                          reviews: updateListItem(content.reviews, index, {
                            body: event.target.value,
                          }),
                        })
                      }
                    />
                  </label>
                  <label>
                    Review photo path
                    <input
                      value={item.image || ""}
                      onChange={(event) =>
                        setContent({
                          ...content,
                          reviews: updateListItem(content.reviews, index, {
                            image: event.target.value,
                          }),
                        })
                      }
                    />
                  </label>
                  <label>
                    Upload review photo
                    <input
                      accept="image/*"
                      type="file"
                      onChange={(event) =>
                        handleUpload(event.target.files?.[0], (imageData) =>
                          setContent({
                            ...content,
                            reviews: updateListItem(content.reviews, index, {
                              image: imageData,
                            }),
                          }),
                        )
                      }
                    />
                  </label>
                </article>
              ))}
            </div>
          </section>
        )}

        {activePanel === "contact" && (
          <section className="cms-panel">
            <h2>Business Information</h2>
            <div className="cms-form-grid">
              {[
                ["Email", "email"],
                ["Address", "address"],
                ["Weekday label", "weekdayLabel"],
                ["Weekday hours", "weekdayHours"],
                ["Weekend label", "weekendLabel"],
                ["Weekend hours", "weekendHours"],
                ["Messenger URL", "messengerUrl"],
                ["Messenger label", "messengerLabel"],
                ["Facebook", "facebook"],
                ["Instagram", "instagram"],
                ["TikTok", "tiktok"],
              ].map(([label, key]) => (
                <label key={key}>
                  {label}
                  <input
                    value={content[key as keyof CmsContent] as string}
                    onChange={(event) =>
                      setContent({
                        ...content,
                        [key]: event.target.value,
                      })
                    }
                  />
                </label>
              ))}
            </div>
          </section>
        )}

        {activePanel === "order" && (
          <section className="cms-panel">
            <h2>Order, Payment, Footer</h2>
            <div className="cms-form-grid">
              {renderTextField("Order eyebrow", "orderEyebrow")}
              {renderTextField("Order heading", "orderHeading")}
              {renderTextField("Payment intro text", "paymentIntro")}
              {renderTextField("Footer brand line", "footerLine")}
            </div>
          </section>
        )}

        {activePanel === "locked" && (
          <section className="cms-panel locked-panel">
            <h2>Locked Items</h2>
            <p className="cms-note">
              These are intentionally locked because changing them can break
              layout, behavior, accessibility, or integrations.
            </p>
            <div className="locked-list">
              <article>
                <span>Layout</span>
                <p>Section order, grid/card structure, spacing system, mobile breakpoints.</p>
              </article>
              <article>
                <span>Navigation Structure</span>
                <p>Anchor IDs, hamburger behavior, sticky header mechanics.</p>
              </article>
              <article>
                <span>Form Logic</span>
                <p>Order form field types, required fields, mailto submit behavior.</p>
              </article>
              <article>
                <span>Payment Logo Styling</span>
                <p>Logo layout and visual treatment are locked to avoid brand display issues.</p>
              </article>
              <article>
                <span>Core Assets</span>
                <p>Logo, favicon, code files, animations, and responsive CSS rules.</p>
              </article>
              <article>
                <span>Copyright</span>
                <p>Legal footer copyright text is locked to avoid accidental ownership/date changes.</p>
              </article>
            </div>
          </section>
        )}

        {activePanel === "backup" && (
          <section className="cms-panel locked-panel">
            <h2>Safe Backup</h2>
            <p className="cms-note">
              This read-only backup includes editable CMS content only. Locked
              legal/system fields, including copyright, are excluded.
            </p>
            <button className="cms-copy" onClick={copyJson} type="button">
              Copy Safe Backup
            </button>
            <textarea className="cms-export" readOnly value={exportedJson} />
          </section>
        )}
      </section>
    </main>
  );
}
