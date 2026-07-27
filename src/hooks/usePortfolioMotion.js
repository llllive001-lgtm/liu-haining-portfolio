import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const REVEAL_EASE = "expo.out";
const CINEMATIC_EASE = "power4.inOut";

export default function usePortfolioMotion(rootRef) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(".opening-screen", { display: "none" });
        gsap.set(".motion-text__inner, .project-card, .capability-card, .profile-showcase > *, .profile-stats > *", {
          clearProps: "all",
        });
        document.body.classList.add("motion-ready");
      });

      media.add("(prefers-reduced-motion: no-preference)", () => {
        document.body.classList.add("motion-enabled", "motion-lock");

        ScrollTrigger.config({
          limitCallbacks: true,
          ignoreMobileResize: true,
        });

        const opening = root.querySelector(".opening-screen");
        const openingCounter = root.querySelector(".opening-screen__counter");
        const counterState = { value: 0 };
        const heroBackground = root.querySelector(".hero-background");
        const heroShade = root.querySelector(".hero-shade");
        const heroTitleLines = gsap.utils.toArray(".hero .hero-type-line", root);
        const heroSupport = gsap.utils.toArray(
          ".hero-note, .hero-coordinate, .hero-status, .hero-title-right a",
          root,
        );

        gsap.set(opening, { display: "grid", clipPath: "inset(0 0 0% 0)" });
        gsap.set(".opening-screen__rule", { scaleX: 0, transformOrigin: "left center" });
        gsap.set(".opening-screen__identity > *", { yPercent: 120, opacity: 0 });
        gsap.set(".opening-screen__meta", { y: 24, opacity: 0 });
        gsap.set(".site-header", { y: -88, opacity: 0 });
        gsap.set(heroBackground, {
          scale: 1.18,
          filter: "saturate(0.72) contrast(1.12) brightness(0.28)",
          transformOrigin: "center center",
        });
        gsap.set(heroShade, { opacity: 0.84 });
        gsap.set(heroTitleLines, {
          yPercent: 125,
          scaleY: 0.58,
          scaleX: 0.88,
          skewY: 4,
          opacity: 0,
          transformOrigin: "left bottom",
        });
        gsap.set(heroSupport, { y: 36, opacity: 0 });

        const openingTimeline = gsap.timeline({
          defaults: { ease: CINEMATIC_EASE },
          onComplete: () => {
            document.body.classList.remove("motion-lock");
            document.body.classList.add("motion-ready");
            gsap.set(opening, { display: "none" });
            gsap.set([heroBackground, heroShade, ".site-header", ...heroSupport], {
              clearProps: "transform,opacity,filter",
            });
            ScrollTrigger.refresh();
          },
        });

        openingTimeline
          .to(".opening-screen__rule", { scaleX: 1, duration: 1.05 }, 0.08)
          .to(".opening-screen__identity > *", {
            yPercent: 0,
            opacity: 1,
            duration: 1.15,
            stagger: 0.12,
          }, 0.18)
          .to(".opening-screen__meta", { y: 0, opacity: 1, duration: 0.9 }, 0.36)
          .to(counterState, {
            value: 100,
            duration: 1.55,
            ease: "power2.inOut",
            onUpdate: () => {
              if (openingCounter) openingCounter.textContent = String(Math.round(counterState.value)).padStart(3, "0");
            },
          }, 0.12)
          .to(".opening-screen__identity > *, .opening-screen__meta", {
            yPercent: -115,
            opacity: 0,
            duration: 0.78,
            stagger: 0.05,
          }, 1.48)
          .to(opening, {
            clipPath: "inset(0 0 100% 0)",
            duration: 1.18,
          }, 1.64)
          .to(heroBackground, {
            scale: 1,
            filter: "saturate(0.86) contrast(1.06) brightness(0.66)",
            duration: 2.15,
            ease: "power3.out",
          }, 1.5)
          .to(heroShade, { opacity: 1, duration: 1.5, ease: "power2.out" }, 1.5)
          .to(".site-header", { y: 0, opacity: 1, duration: 1.15, ease: REVEAL_EASE }, 1.78)
          .to(heroTitleLines, {
            yPercent: 0,
            scaleY: 1,
            scaleX: 1,
            skewY: 0,
            opacity: 1,
            duration: 1.45,
            stagger: 0.13,
            ease: REVEAL_EASE,
          }, 1.82)
          .to(heroSupport, {
            y: 0,
            opacity: 1,
            duration: 1.05,
            stagger: 0.1,
            ease: "power3.out",
          }, 2.18);

        const setupSectionHeading = (section) => {
          const heading = section.querySelector(":scope > .frame > .profile-heading");
          if (!heading) return;
          const title = heading.querySelector(".motion-text__inner");
          const pill = heading.querySelector(".profile-pill");

          gsap.timeline({
            scrollTrigger: {
              trigger: heading,
              start: "top 84%",
              once: true,
            },
          })
            .fromTo(title, {
              yPercent: 125,
              scaleY: 0.62,
              scaleX: 0.78,
              skewY: 3,
              opacity: 0,
              transformOrigin: "left bottom",
            }, {
              yPercent: 0,
              scaleY: 1,
              scaleX: 1,
              skewY: 0,
              opacity: 1,
              duration: 1.5,
              ease: REVEAL_EASE,
            })
            .fromTo(pill, {
              x: -48,
              opacity: 0,
            }, {
              x: 0,
              opacity: 1,
              duration: 0.9,
              ease: "power3.out",
            }, "-=0.72");
        };

        const about = root.querySelector("#about");
        const work = root.querySelector("#work");
        const capabilities = root.querySelector("#capabilities");
        const contact = root.querySelector("#contact");

        [about, work, capabilities].forEach((section) => section && setupSectionHeading(section));

        if (about) {
          const profileCards = gsap.utils.toArray(".profile-showcase > *", about);
          const statCards = gsap.utils.toArray(".profile-stats > *", about);
          const portraitImage = about.querySelector(".profile-portrait img");

          gsap.timeline({
            scrollTrigger: {
              trigger: ".profile-showcase",
              start: "top 82%",
              once: true,
            },
          })
            .fromTo(profileCards, {
              y: 120,
              opacity: 0,
              clipPath: "inset(0 0 100% 0)",
            }, {
              y: 0,
              opacity: 1,
              clipPath: "inset(0 0 0% 0)",
              duration: 1.45,
              stagger: 0.18,
              ease: REVEAL_EASE,
              onComplete: () => gsap.set(profileCards, { clearProps: "transform,opacity,clipPath" }),
            })
            .fromTo(statCards, {
              y: 82,
              scale: 0.94,
              opacity: 0,
            }, {
              y: 0,
              scale: 1,
              opacity: 1,
              duration: 1.05,
              stagger: 0.12,
              ease: "power3.out",
              onComplete: () => gsap.set(statCards, { clearProps: "transform,opacity" }),
            }, "-=0.58");

          if (portraitImage) {
            gsap.fromTo(portraitImage, {
              yPercent: -3,
              scale: 1.06,
            }, {
              yPercent: 3,
              ease: "none",
              scrollTrigger: {
                trigger: ".profile-showcase",
                start: "top bottom",
                end: "bottom top",
                scrub: 1.2,
              },
            });
          }
        }

        if (work) {
          const projectCards = gsap.utils.toArray('[data-gallery-copy="1"] .project-card', work);
          const projectMedia = gsap.utils.toArray('[data-gallery-copy="1"] .project-media', work);
          const projectImages = gsap.utils.toArray('[data-gallery-copy="1"] .project-media img', work);

          gsap.timeline({
            scrollTrigger: {
              trigger: ".project-list",
              start: "top 86%",
              once: true,
            },
          })
            .fromTo(projectCards, {
              opacity: 0,
            }, {
              opacity: 1,
              duration: 1.35,
              stagger: 0.12,
              ease: REVEAL_EASE,
              onComplete: () => gsap.set(projectCards, { clearProps: "opacity" }),
            })
            .fromTo(projectMedia, {
              clipPath: "inset(0 100% 0 0)",
            }, {
              clipPath: "inset(0 0% 0 0)",
              duration: 1.45,
              stagger: 0.08,
              ease: CINEMATIC_EASE,
              onComplete: () => gsap.set(projectMedia, { clearProps: "clipPath" }),
            }, 0.08)
            .fromTo(projectImages, {
              scale: 1.06,
            }, {
              scale: 1,
              duration: 1.8,
              stagger: 0.08,
              ease: "power3.out",
              onComplete: () => gsap.set(projectImages, { clearProps: "transform" }),
            }, 0.12);
        }

        if (capabilities) {
          const capabilityCards = gsap.utils.toArray(".capability-card", capabilities);
          gsap.fromTo(capabilityCards, {
            y: 108,
            opacity: 0,
            clipPath: "inset(0 0 100% 0)",
          }, {
            y: 0,
            opacity: 1,
            clipPath: "inset(0 0 0% 0)",
            duration: 1.32,
            stagger: 0.14,
            ease: REVEAL_EASE,
            onComplete: () => gsap.set(capabilityCards, { clearProps: "transform,opacity,clipPath" }),
            scrollTrigger: {
              trigger: ".capability-grid",
              start: "top 83%",
              once: true,
            },
          });
        }

        if (contact) {
          const contactTitle = contact.querySelector(".motion-text__inner");
          const contactSupport = gsap.utils.toArray(
            ".contact-top, .contact > .contact-inner > .eyebrow, .contact-actions, .contact-bottom",
            contact,
          );
          const contactBackground = contact.querySelector(".contact-bg");

          gsap.timeline({
            scrollTrigger: {
              trigger: contact,
              start: "top 76%",
              once: true,
            },
          })
            .fromTo(contactTitle, {
              yPercent: 125,
              scaleY: 0.66,
              scaleX: 0.8,
              opacity: 0,
              transformOrigin: "left bottom",
            }, {
              yPercent: 0,
              scaleY: 1,
              scaleX: 1,
              opacity: 1,
              duration: 1.55,
              ease: REVEAL_EASE,
            })
            .fromTo(contactSupport, {
              y: 48,
              opacity: 0,
            }, {
              y: 0,
              opacity: 1,
              duration: 1.05,
              stagger: 0.12,
              ease: "power3.out",
              onComplete: () => gsap.set(contactSupport, { clearProps: "transform,opacity" }),
            }, "-=0.86");

          if (contactBackground) {
            gsap.fromTo(contactBackground, {
              scale: 1.12,
              yPercent: -4,
            }, {
              scale: 1.04,
              yPercent: 4,
              ease: "none",
              scrollTrigger: {
                trigger: contact,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.25,
              },
            });
          }
        }

        const refresh = () => ScrollTrigger.refresh();
        window.addEventListener("load", refresh, { once: true });

        return () => {
          window.removeEventListener("load", refresh);
          document.body.classList.remove("motion-enabled", "motion-lock", "motion-ready");
        };
      });
    }, root);

    return () => {
      document.body.classList.remove("motion-enabled", "motion-lock", "motion-ready");
      media.revert();
      context.revert();
    };
  }, [rootRef]);
}
