"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import posthog from "posthog-js";

import { crownforgeConfig } from "@/config/crownforge.config";
import FadeIn from "../../shared/FadeIn/FadeIn.jsx";
import Parallax from "../../shared/Parallax/Parallax.jsx";
import SplitText from "../../shared/SplitText/SplitText.jsx";
import Button from "../../ui/Button.jsx";
import PageContainer from "../../ui/PageContainer.jsx";

// Hero background media. Replace these two paths to swap the footage or poster.
// Set HERO_VIDEO_SRC to "" to fall back to the original key-art background.
const HERO_VIDEO_SRC = "/crownforge/studio/hero-background.mp4";
const HERO_POSTER_SRC = "/crownforge/studio/hero-poster.webp";
// Which part of the footage stays in view when the hero is cropped (x y). Applied to both poster and video.
// x keeps the tree, campfire and lantern column in view on narrow screens; y favours the lower part of the
// frame so the campfire is not cut off on short, wide (ultrawide) heroes.
const HERO_OBJECT_POSITION = "60% 70%";

const Hero = ({ hero = crownforgeConfig.hero, heroKeyArtUrl = crownforgeConfig.branding.heroImage }) => {
  const lines = (hero.titleLines || []).filter(Boolean);
  const lastIndex = lines.length - 1;
  const secondaryHref = hero.secondaryCtaHref || "/contact";
  const isExternalSecondary = secondaryHref.startsWith("http");

  // The video only plays when motion is welcome and data saving is off; otherwise the poster stays.
  const [motionAllowed, setMotionAllowed] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      const saveData = navigator.connection?.saveData === true;
      const allowed = !query.matches && !saveData;
      setMotionAllowed(allowed);
      if (!allowed) setVideoReady(false);
    };
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const handleVideoRef = (video) => {
    if (!video) return;
    const attempt = video.play();
    if (attempt && typeof attempt.catch === "function") {
      attempt.catch(() => {
        // Autoplay blocked: keep showing the poster.
        setMotionAllowed(false);
        setVideoReady(false);
      });
    }
  };

  return (
    <section
      id="hero"
      className="relative flex flex-col overflow-hidden pb-20 pt-[120px] max-sm:min-h-screen max-sm:justify-end max-sm:pb-10 max-sm:pt-[60px] lg:landscape:min-h-screen lg:landscape:justify-end lg:landscape:pb-[72px] lg:landscape:pt-[60px]"
    >
      <Parallax
        speed={0.12}
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_70%_55%_at_65%_35%,oklch(28%_0.08_85_/_0.28)_0%,transparent_65%),radial-gradient(ellipse_45%_45%_at_15%_75%,oklch(16%_0.04_85_/_0.18)_0%,transparent_60%)]"
        aria-hidden
      />

      {HERO_VIDEO_SRC ? (
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-[#090909]" aria-hidden="true">
          <img
            className="absolute inset-0 block h-full w-full object-cover"
            style={{ objectPosition: HERO_OBJECT_POSITION }}
            src={HERO_POSTER_SRC}
            alt=""
            decoding="async"
            loading="eager"
            fetchPriority="high"
          />
          {motionAllowed ? (
            <video
              ref={handleVideoRef}
              className={`absolute inset-0 block h-full w-full object-cover transition-opacity duration-700 ${videoReady ? "opacity-100" : "opacity-0"}`}
              style={{ objectPosition: HERO_OBJECT_POSITION }}
              src={HERO_VIDEO_SRC}
              poster={HERO_POSTER_SRC}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              disablePictureInPicture
              disableRemotePlayback
              tabIndex={-1}
              onPlaying={() => setVideoReady(true)}
              onError={() => {
                setMotionAllowed(false);
                setVideoReady(false);
              }}
            />
          ) : null}
        </div>
      ) : null}

      <div className="pointer-events-none absolute inset-0 z-[1]" aria-hidden="true">
        {!HERO_VIDEO_SRC && heroKeyArtUrl ? (
          <FadeIn variant="soft" immediate delay={150} className="absolute inset-0">
            <Parallax speed={0.4} className="absolute inset-0">
              <img
                className="absolute right-0 top-12 block h-full w-full max-w-none object-cover object-center opacity-30 saturate-75 [-webkit-mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.6)_15%,black_40%)] [mask-image:linear-gradient(to_right,transparent_0%,rgba(0,0,0,0.6)_15%,black_40%)] lg:landscape:top-[60px] lg:landscape:w-[65%] lg:landscape:opacity-[0.42]"
                src={heroKeyArtUrl}
                alt=""
                decoding="async"
                loading="eager"
                fetchPriority="high"
              />
            </Parallax>
          </FadeIn>
        ) : null}
        {HERO_VIDEO_SRC ? (
          <>
            <div className="absolute inset-0 bg-black/20 max-sm:bg-black/35" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(9,9,9,0.82)_0%,rgba(9,9,9,0.6)_35%,rgba(9,9,9,0.2)_65%,rgba(9,9,9,0)_85%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(9,9,9,0.9)_0%,rgba(9,9,9,0.35)_9%,transparent_22%)]" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(9,9,9,1)_0%,rgba(9,9,9,0.98)_35%,rgba(9,9,9,0.7)_50%,rgba(9,9,9,0)_70%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(9,9,9,1)_0%,transparent_40%)]" />
          </>
        )}
      </div>

      <PageContainer className="relative z-[3] flex flex-col items-start">
        <h1 className="mb-8 mt-2 font-bebas font-bold leading-[0.88] tracking-[0.01em] text-[clamp(46px,15vw,92px)] uppercase text-ggg-text [font-synthesis:weight_style] sm:mt-6 sm:text-ggg-hero lg:mb-8 lg:mt-10">
          {lines.map((line, index) => (
            <span key={`${line}-${index}`}>
              {index > 0 ? <br /> : null}
              <SplitText
                as="span"
                text={line}
                className={index === lastIndex && lastIndex > 0 ? "text-ggg-accent" : undefined}
                immediate
                startDelay={250 + index * 300}
                stagger={60}
              />
            </span>
          ))}
        </h1>

        <FadeIn
          as="p"
          immediate
          delay={1200}
          className="mb-10 max-w-[480px] font-inter text-[clamp(17px,1.55vw,19px)] font-normal leading-[1.55] text-ggg-muted sm:mb-10 xl:text-[clamp(15px,1.3vw,17px)] xl:leading-[1.7]"
        >
          {hero.body}
        </FadeIn>

        <FadeIn
          immediate
          delay={1450}
          className="mb-2 flex flex-wrap gap-3 sm:inline-grid sm:auto-cols-fr sm:grid-flow-col lg:mb-16"
        >
          <Button
            as={Link}
            href={hero.primaryCtaHref || "/games"}
            variant="primary"
            className="sm:w-full max-[640px]:py-[18px] max-[640px]:text-[15px] max-[400px]:px-4 max-[400px]:text-[13px]"
            onClick={() => posthog.capture("hero_cta_clicked", { cta: "primary", label: hero.primaryCtaLabel })}
          >
            {hero.primaryCtaLabel}
          </Button>
          {hero.secondaryCtaLabel ? (
            <Button
              as={isExternalSecondary ? "a" : Link}
              href={secondaryHref}
              {...(isExternalSecondary ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              variant="ghost"
              className="sm:w-full max-[640px]:py-[18px] max-[640px]:text-[15px] max-[400px]:px-4 max-[400px]:text-[13px]"
              onClick={() => posthog.capture("hero_cta_clicked", { cta: "secondary", label: hero.secondaryCtaLabel })}
            >
              {hero.secondaryCtaLabel}
            </Button>
          ) : null}
        </FadeIn>
      </PageContainer>
    </section>
  );
};

export default Hero;
