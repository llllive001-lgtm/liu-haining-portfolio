import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  ArrowDown,
  ArrowUpRight,
  Copy,
  EnvelopeSimple,
  List,
  Phone,
  X,
} from "@phosphor-icons/react";
import GlassSurface from "./components/GlassSurface";
import Grainient from "./components/Grainient";
import TextType from "./components/TextType";
import BorderGlow from "./components/BorderGlow";
import CountUp from "./components/CountUp";
import CircularGallery from "./components/CircularGallery";
import usePortfolioMotion from "./hooks/usePortfolioMotion";

const projects = [
  {
    id: "01",
    title: "爱医健康",
    type: "HEALTHCARE APP / UI/UX",
    year: "2025–2026",
    image: "/assets/project-aiyi-cover.jpg",
    pages: [
      "/assets/project-aiyi-page-01.jpg",
      "/assets/project-aiyi-page-02.jpg",
      "/assets/project-aiyi-page-03.jpg",
      "/assets/project-aiyi-page-04.jpg",
      "/assets/project-aiyi-page-05.jpg",
      "/assets/project-aiyi-page-06.jpg",
      "/assets/project-aiyi-page-07.jpg",
      "/assets/project-aiyi-page-08.jpg",
      "/assets/project-aiyi-page-09.jpg",
      "/assets/project-aiyi-page-10.jpg",
      "/assets/project-aiyi-page-11.jpg",
      "/assets/project-aiyi-page-12.jpg",
      "/assets/project-aiyi-page-13.jpg",
    ],
    description: "围绕在线问诊、健康数据与家庭健康档案，打造更有陪伴感的移动医疗体验。",
  },
  {
    id: "02",
    title: "获客一下",
    type: "APP / PRODUCT DESIGN",
    year: "2022–2023",
    image: "/assets/project-huoke-cover.jpg",
    pages: [
      "/assets/project-huoke-page-01.jpg",
      "/assets/project-huoke-page-02.jpg",
      "/assets/project-huoke-page-03.jpg",
      "/assets/project-huoke-page-04.jpg",
      "/assets/project-huoke-page-05.jpg",
      "/assets/project-huoke-page-06.jpg",
      "/assets/project-huoke-page-07.jpg",
      "/assets/project-huoke-page-08.jpg",
      "/assets/project-huoke-page-09.jpg",
      "/assets/project-huoke-page-10.jpg",
      "/assets/project-huoke-page-11.jpg",
    ],
    description: "面向管理培训行业的售课平台，从需求理解、原型推演到高保真 UI 与开发交付。",
  },
  {
    id: "03",
    title: "获客管理",
    type: "DATA APP / PRODUCT DESIGN",
    year: "2022–2023",
    image: "/assets/project-huoke-admin-cover.jpg",
    pages: [
      "/assets/project-huoke-admin-page-01.jpg",
      "/assets/project-huoke-admin-page-02.jpg",
      "/assets/project-huoke-admin-page-03.jpg",
      "/assets/project-huoke-admin-page-04.jpg",
      "/assets/project-huoke-admin-page-05.jpg",
      "/assets/project-huoke-admin-page-06.jpg",
      "/assets/project-huoke-admin-page-07.jpg",
      "/assets/project-huoke-admin-page-08.jpg",
    ],
    description: "面向讲师与运营团队的数据管理工具，整合浏览、脱敏、评估与业务跟进流程。",
  },
  {
    id: "04",
    title: "伏羲云",
    type: "WEB / DESIGN SYSTEM",
    year: "2023–2025",
    image: "/assets/project-fuxi-cover.jpg",
    pages: [
      "/assets/project-fuxi-page-01.jpg",
      "/assets/project-fuxi-page-02.jpg",
      "/assets/project-fuxi-page-03.jpg",
      "/assets/project-fuxi-page-04.jpg",
      "/assets/project-fuxi-page-05.jpg",
      "/assets/project-fuxi-page-06.jpg",
      "/assets/project-fuxi-page-07.jpg",
      "/assets/project-fuxi-page-08.jpg",
      "/assets/project-fuxi-page-09.jpg",
      "/assets/project-fuxi-page-10.jpg",
      "/assets/project-fuxi-page-11.jpg",
      "/assets/project-fuxi-page-12.jpg",
    ],
    description: "梳理 HOK 获客文化业务链路，统一高频列表、表单与数据展示场景。",
  },
  {
    id: "05",
    title: "奥世美",
    type: "WEB + APP / EXPERIENCE",
    year: "2024–2025",
    image: "/assets/project-aoshimei-cover.jpg",
    pages: [
      "/assets/project-aoshimei-page-01.jpg",
      "/assets/project-aoshimei-page-02.jpg",
      "/assets/project-aoshimei-page-03.jpg",
      "/assets/project-aoshimei-page-04.jpg",
      "/assets/project-aoshimei-page-05.jpg",
      "/assets/project-aoshimei-page-06.jpg",
      "/assets/project-aoshimei-page-07.jpg",
      "/assets/project-aoshimei-page-08.jpg",
      "/assets/project-aoshimei-page-09.jpg",
      "/assets/project-aoshimei-page-10.jpg",
    ],
    description: "为正畸牙科医生重构病例提交体验，降低制作周期并提升操作效率。",
  },
  {
    id: "06",
    title: "艺术家",
    type: "BRAND WEB / VISUAL DESIGN",
    year: "2022",
    image: "/assets/project-art-furniture-cover.jpg",
    pages: [
      "/assets/project-artist-page-01.jpg",
      "/assets/project-artist-page-02.jpg",
      "/assets/project-artist-page-03.jpg",
      "/assets/project-artist-page-04.jpg",
      "/assets/project-artist-page-05.jpg",
      "/assets/project-artist-page-06.jpg",
      "/assets/project-artist-page-07.jpg",
    ],
    description: "以克制的空间语言与暖色材质表达，完成艺术家具品牌网站的视觉与浏览体验。",
  },
  {
    id: "07",
    title: "OTD 3.0",
    type: "AUTOMOTIVE HMI / UI/UX",
    year: "2025",
    image: "/assets/project-otd-cover.jpg",
    pages: [
      "/assets/project-otd-page-01.jpg",
      "/assets/project-otd-page-02.jpg",
      "/assets/project-otd-page-03.jpg",
      "/assets/project-otd-page-04.jpg",
      "/assets/project-otd-page-05.jpg",
      "/assets/project-otd-page-06.jpg",
    ],
    description: "面向海外市场的旗舰车载系统，负责从 0 到 1 的视觉系统与原型交互。",
  },
  {
    id: "08",
    title: "其他设计",
    type: "MOTORCYCLE HMI / UI DESIGN",
    year: "2025",
    image: "/assets/project-moto-pno-cover.jpg",
    pages: [
      "/assets/project-other-page-01.jpg",
      "/assets/project-other-page-02.jpg",
      "/assets/project-other-page-03.jpg",
      "/assets/project-other-page-04.jpg",
    ],
    description: "探索摩托车智能座舱界面，在骑行信息、车辆状态与快捷应用之间建立清晰层级。",
  },
];

const capabilities = [
  {
    visual: "/assets/capability-project.png",
    index: "01",
    category: "CORE",
    title: "完整项目主导能力",
    details: ["需求拆解与项目节奏规划", "跨阶段推进视觉落地", "把控质量、效率与交付结果"],
  },
  {
    visual: "/assets/capability-system.png",
    index: "02",
    category: "CORE",
    title: "品牌与视觉系统搭建",
    details: ["品牌语言与视觉概念定义", "组件规范与设计系统沉淀", "建立一致、可扩展的体验秩序"],
  },
  {
    visual: "/assets/capability-automotive.png",
    index: "03",
    category: "SYSTEM",
    title: "多端产品与车载 HMI",
    details: ["APP、Web 后台与跨屏产品", "驾驶场景与视线成本分析", "从概念视觉到交互原型"],
  },
  {
    visual: "/assets/capability-ai.png",
    index: "04",
    category: "SYSTEM",
    title: "AI 设计提效",
    details: ["AI 辅助视觉探索", "高效生成与方案验证", "保持一致的设计判断"],
  },
  {
    visual: "/assets/capability-team.png",
    index: "05",
    category: "SYSTEM",
    title: "跨团队协作与交付",
    details: ["产品与研发协同评估", "设计走查与开发验收", "推动方案按节点上线"],
  },
];

function TypeText({ text, as = "span", className = "", delay = 0, speed = 14, cursor = false, ...props }) {
  return (
    <TextType
      text={text}
      as={as}
      typingSpeed={speed}
      initialDelay={delay}
      loop={false}
      showCursor={cursor}
      hideCursorWhileTyping={false}
      cursorCharacter="_"
      cursorBlinkDuration={0.55}
      startOnVisible
      className={className}
      {...props}
    />
  );
}

function MotionText({ text, as = "span", className = "", ...props }) {
  const Component = as;
  return (
    <Component className={`motion-text ${className}`.trim()} aria-label={text} {...props}>
      <span className="motion-text__inner" aria-hidden="true">{text}</span>
    </Component>
  );
}

function ResumeGlow({ children, className = "" }) {
  return (
    <BorderGlow
      className={className}
      edgeSensitivity={24}
      glowColor="209 100 82"
      backgroundColor="#081117"
      borderRadius={0}
      glowRadius={24}
      glowIntensity={0.82}
      coneSpread={23}
      colors={["#f1f8ff", "#acd9ff", "#6ea9ff"]}
      fillOpacity={0.2}
    >
      {children}
    </BorderGlow>
  );
}

function BrandMark() {
  return (
    <a className="brand" href="#top" aria-label="回到首页">
      <TypeText text="LIU HAI NING DESIGN" className="brand-name" delay={2050} speed={22} />
    </a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [isDocked, setIsDocked] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => {
    let frameId;

    const updateDockedState = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        const secondScreen = document.querySelector("#about");
        if (!secondScreen) return;
        setIsDocked(window.scrollY >= secondScreen.offsetTop - 64);
      });
    };

    updateDockedState();
    window.addEventListener("scroll", updateDockedState, { passive: true });
    window.addEventListener("resize", updateDockedState);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", updateDockedState);
      window.removeEventListener("resize", updateDockedState);
    };
  }, []);

  return (
    <header className={isDocked ? "site-header is-docked" : "site-header"}>
      <GlassSurface
        width="100%"
        height="100%"
        borderRadius={22}
        borderWidth={0.08}
        brightness={68}
        opacity={0.86}
        blur={10}
        displace={0.55}
        backgroundOpacity={0.08}
        saturation={1.75}
        distortionScale={-115}
        redOffset={0}
        greenOffset={10}
        blueOffset={22}
        mixBlendMode="screen"
        className="nav-glass"
      >
        <div className="nav-glass__inner">
          <BrandMark />
          <button
            className="menu-button"
            type="button"
            aria-label={open ? "关闭菜单" : "打开菜单"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={22} /> : <List size={22} />}
          </button>
          <nav className={open ? "nav is-open" : "nav"} aria-label="主导航">
            <a href="#about" onClick={close}><TypeText text="ABOUT" delay={2180} speed={24} /></a>
            <a href="#work" onClick={close}><TypeText text="WORK" delay={2260} speed={24} /></a>
            <a href="#capabilities" onClick={close}><TypeText text="CAPABILITIES" delay={2340} speed={24} /></a>
            <a className="nav-contact" href="#contact" onClick={close}>
              <TypeText text="CONTACT" delay={2420} speed={24} /> <ArrowUpRight size={15} />
            </a>
          </nav>
        </div>
      </GlassSurface>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="top">
      <video
        className="hero-background"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/assets/hero-rabbit.png"
        aria-hidden="true"
        tabIndex="-1"
        disablePictureInPicture
      >
        <source src="/assets/hero-rabbit-motion.mp4" type="video/mp4" />
      </video>
      <div className="hero-shade" />

      <div className="hero-layout frame">
        <h1 className="hero-title hero-title-left">
          <TypeText className="hero-type-line" text="Visual" delay={2020} speed={58} />
          <TypeText className="hero-type-line" text="And Product" delay={2220} speed={54} />
        </h1>

        <div className="hero-note">
          <TypeText as="p" className="eyebrow" text="UI / UE · PRODUCT EXPERIENCE · AI" delay={2520} speed={18} />
          <TypeText as="p" text="Working at the intersection of product logic, visual systems and emerging tools — turning complex information into clear, memorable experiences." delay={2700} speed={9} />
        </div>

        <div className="hero-title-right">
          <TypeText as="p" className="hero-type-line" text="AI" delay={2180} speed={64} />
          <TypeText
            as="p"
            className="hero-type-line"
            text="Designer"
            delay={2340}
            speed={58}
            cursor
            cursorCharacter="|"
            cursorClassName="hero-type-cursor"
          />
          <a href="#work"><TypeText text="VIEW SELECTED WORK" delay={2920} speed={20} /> <ArrowDown size={17} /></a>
        </div>

        <div className="hero-coordinate" aria-hidden="true">
          <TypeText text="PORTFOLIO / 2026" delay={2540} speed={20} />
          <TypeText text="30°16′N 120°09′E" delay={2660} speed={20} />
        </div>
      </div>
      <div className="hero-status">
        <span className="status-dot" />
        <TypeText text="AVAILABLE FOR NEW OPPORTUNITIES" delay={3100} speed={18} />
      </div>
    </section>
  );
}

function SectionHeading({ title, label }) {
  return (
    <div className="profile-heading section-title-block">
      <MotionText as="h2" className="profile-title" text={title} />
      <TypeText className="profile-pill" text={label} delay={140} speed={28} />
    </div>
  );
}

function About() {
  return (
    <section className="section about" id="about">
      <div className="frame">
        <div className="profile-heading">
          <MotionText as="h2" className="profile-title" text="PROFILE" />
          <TypeText className="profile-pill" text="个人简历" delay={140} speed={28} />
        </div>

        <div className="profile-showcase">
          <ResumeGlow className="portrait-wrap profile-portrait">
            <img src="/assets/profile-rabbit.png" alt="刘海宁个人视觉形象：赛博机械白兔" />
            <div className="portrait-label">
              <TypeText text="NICK / 刘海宁" speed={18} />
              <TypeText text="HANGZHOU · CHINA" delay={120} speed={18} />
            </div>
          </ResumeGlow>

          <ResumeGlow className="profile-summary">
            <div>
              <TypeText
                as="h3"
                text="UI/UE 视觉设计师，擅长把复杂需求转化为清晰、可落地的产品体验。"
                speed={24}
              />
              <TypeText
                as="p"
                text="拥有 5 年 UI/UX 设计经验，覆盖 APP、Web 后台与车载 HMI。熟悉从需求理解、流程梳理、交互原型、高保真视觉到设计规范与研发交付的完整流程，也持续将 AI 引入设计探索与生产。"
                delay={180}
                speed={10}
              />
            </div>
            <div className="profile-contact" aria-label="联系方式">
              <a href="tel:13526323295">
                <Phone size={17} weight="light" />
                <TypeText text="13526323295" delay={300} speed={20} />
              </a>
              <a href="mailto:13526323295@163.com">
                <EnvelopeSimple size={17} weight="light" />
                <TypeText text="13526323295@163.com" delay={380} speed={18} />
              </a>
            </div>
          </ResumeGlow>
        </div>

        <div className="profile-stats" aria-label="个人项目数据">
          <ResumeGlow className="profile-stat-card">
            <strong aria-label="05+"><CountUp to={5} duration={1.8} delay={0.4} padStart={2} /><span className="count-up-suffix">+</span></strong>
            <TypeText text="年设计经验" delay={80} speed={24} />
          </ResumeGlow>
          <ResumeGlow className="profile-stat-card">
            <strong aria-label="20+"><CountUp to={20} duration={1.8} delay={0.52} padStart={2} /><span className="count-up-suffix">+</span></strong>
            <TypeText text="项目交付" delay={140} speed={24} />
          </ResumeGlow>
          <ResumeGlow className="profile-stat-card">
            <strong aria-label="03"><CountUp to={3} duration={1.8} delay={0.64} padStart={2} /></strong>
            <TypeText text="产品场景" delay={200} speed={24} />
          </ResumeGlow>
          <ResumeGlow className="profile-stat-card">
            <strong aria-label="06"><CountUp to={6} duration={1.8} delay={0.76} padStart={2} /></strong>
            <TypeText text="核心能力" delay={260} speed={24} />
          </ResumeGlow>
        </div>

      </div>
    </section>
  );
}

function ProjectModal({ project, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return undefined;

    dialog.showModal();
    document.body.classList.add("project-modal-open");

    const handleCancel = (event) => {
      event.preventDefault();
      onClose();
    };

    dialog.addEventListener("cancel", handleCancel);

    return () => {
      dialog.removeEventListener("cancel", handleCancel);
      document.body.classList.remove("project-modal-open");
      if (dialog.open) dialog.close();
    };
  }, [onClose]);

  return createPortal(
    <dialog
      className="project-modal"
      ref={dialogRef}
      aria-labelledby={`project-modal-title-${project.id}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="project-modal__shell">
        <header className="project-modal__header">
          <div className="project-modal__identity">
            <span>ARCHIVE {project.id}</span>
            <div>
              <h2 id={`project-modal-title-${project.id}`}>{project.title}</h2>
              <p>{project.year} / {project.type}</p>
            </div>
          </div>
          <div className="project-modal__actions">
            <span className="project-modal__page-count">{String(project.pages.length).padStart(2, "0")} PAGES</span>
            <button type="button" onClick={onClose} aria-label={`关闭${project.title}项目详情`} autoFocus>
              <X size={22} />
            </button>
          </div>
        </header>
        <div
          className="project-modal__viewer"
          tabIndex="0"
          aria-label={`${project.title}项目作品集，共${project.pages.length}页，可上下滚动查看`}
        >
          <div className="project-modal__pages">
            {project.pages.map((page, index) => (
              <figure className="project-modal__page" key={page}>
                <img
                  src={page}
                  alt={`${project.title}项目第${index + 1}页`}
                  loading={index < 2 ? "eager" : "lazy"}
                  decoding="async"
                />
              </figure>
            ))}
          </div>
        </div>
      </div>
    </dialog>,
    document.body,
  );
}

function Work() {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <section className="section work" id="work">
      <div className="frame">
        <SectionHeading
          title="SELECTED PROJECTS"
          label="精选项目"
        />
        <div className="project-gallery-toolbar">
          <TypeText text="HORIZONTAL ARCHIVE / 08 PROJECTS" speed={18} />
        </div>
        <CircularGallery
          className="project-list"
          items={projects}
          bend={1.55}
          scrollSpeed={1.35}
          scrollEase={0.065}
          renderItem={(project) => (
            <article
              className="project-card"
              tabIndex="0"
              role="button"
              aria-haspopup="dialog"
              aria-label={`打开${project.title}项目详情`}
              onClick={() => setSelectedProject(project)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setSelectedProject(project);
                }
              }}
            >
              <div className="project-media">
                <img src={project.image} alt={`${project.title} 项目视觉封面`} />
              </div>
              <div className="project-details">
                <div className="project-topline">
                  <TypeText className="project-index" text={`ARCHIVE ${project.id}`} speed={26} />
                  <TypeText text={project.year} delay={80} speed={20} />
                </div>
                <div className="project-copy">
                  <div className="project-meta">
                    <TypeText text={project.type} delay={140} speed={18} />
                  </div>
                  <TypeText as="h3" text={project.title} delay={100} speed={32} />
                  <TypeText as="p" text={project.description} delay={180} speed={10} />
                </div>
                <span className="project-action" aria-hidden="true"><ArrowUpRight size={22} /></span>
              </div>
            </article>
          )}
        />
      </div>
      {selectedProject ? (
        <ProjectModal
          key={selectedProject.id}
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      ) : null}
    </section>
  );
}

function Capabilities() {
  return (
    <section className="section capabilities" id="capabilities">
      <div className="frame">
        <SectionHeading
          title="CAPABILITIES"
          label="个人优势"
        />
        <div className="capability-grid">
          {capabilities.map((item) => (
            <article
              className="capability-card"
              key={item.index}
              tabIndex="0"
              aria-label={`${item.title}：${item.details.join("；")}`}
            >
              <div className="capability-top">
                <TypeText text={item.index} speed={28} />
                <TypeText text={item.category} delay={80} speed={22} />
              </div>
              <TypeText as="h3" text={item.title} delay={80} speed={28} />
              <div className="capability-details" aria-hidden="true">
                {item.details.map((detail, detailIndex) => (
                  <span key={detail} style={{ "--detail-index": detailIndex }}>{detail}</span>
                ))}
              </div>
              <img
                className="capability-visual"
                src={item.visual}
                alt=""
                aria-hidden="true"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [copied, setCopied] = useState(false);
  const email = "13526323295@163.com";

  const copyEmail = async () => {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <footer className="contact" id="contact">
      <img className="contact-bg" src="/assets/signal-background.png" alt="" />
      <div className="frame contact-inner">
        <div className="contact-top">
          <TypeText text="/04" speed={30} />
          <TypeText text="CONTACT / COLLABORATION" delay={80} speed={18} />
          <TypeText text="HANGZHOU · CHINA" delay={140} speed={18} />
        </div>
        <TypeText as="p" className="eyebrow" text="LET'S CREATE SOMETHING MEANINGFUL" delay={120} speed={18} />
        <MotionText as="h2" text={"有新的想法，\n一起让它发生。"} />
        <div className="contact-actions">
          <a href={`mailto:${email}`}>
            <TypeText text={email} delay={360} speed={18} /> <ArrowUpRight size={24} />
          </a>
          <button type="button" onClick={copyEmail}>
            <Copy size={20} /> <TypeText key={copied ? "copied" : "copy"} text={copied ? "COPIED" : "COPY EMAIL"} delay={400} speed={24} />
          </button>
        </div>
        <div className="contact-bottom">
          <TypeText text="© 2026 LIU HAINING" delay={480} speed={18} />
          <a href="tel:13526323295"><TypeText text="TEL · 13526323295" delay={520} speed={18} /></a>
          <a href="#top"><TypeText text="BACK TO TOP ↑" delay={560} speed={18} /></a>
        </div>
      </div>
    </footer>
  );
}

export function App() {
  const rootRef = useRef(null);
  usePortfolioMotion(rootRef);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key.toLowerCase() === "g") {
        document.body.classList.toggle("show-grid");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <main ref={rootRef} className="portfolio-shell">
      <div className="opening-screen" aria-hidden="true">
        <div className="opening-screen__meta">
          <span>CREATIVE DIRECTION</span>
          <span className="opening-screen__counter">000</span>
        </div>
        <div className="opening-screen__identity">
          <strong>LIU HAI NING</strong>
          <small>DESIGN PORTFOLIO / 2026</small>
        </div>
        <span className="opening-screen__rule" />
      </div>
      <div className="site-grainient" aria-hidden="true">
        <Grainient
          color1="#3976a5"
          color2="#050b12"
          color3="#17365b"
          timeSpeed={0.12}
          colorBalance={-0.08}
          warpStrength={0.72}
          warpFrequency={3.4}
          warpSpeed={0.72}
          warpAmplitude={74}
          blendAngle={-18}
          blendSoftness={0.16}
          rotationAmount={240}
          noiseScale={1.45}
          grainAmount={0.055}
          grainScale={2.4}
          grainAnimated
          contrast={1.2}
          gamma={0.92}
          saturation={0.78}
          centerX={0.02}
          centerY={-0.04}
          zoom={0.82}
        />
      </div>
      <Header />
      <Hero />
      <About />
      <Work />
      <Capabilities />
      <Contact />
    </main>
  );
}
