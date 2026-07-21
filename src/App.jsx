import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  CarProfile,
  Copy,
  EnvelopeSimple,
  GridFour,
  Lightning,
  List,
  MagicWand,
  Phone,
  Stack,
  UsersThree,
  X,
} from "@phosphor-icons/react";
import GlassSurface from "./components/GlassSurface";
import Grainient from "./components/Grainient";
import TextType from "./components/TextType";

const projects = [
  {
    id: "01",
    title: "获课",
    type: "APP / PRODUCT DESIGN",
    year: "2022–2023",
    image: "/assets/project-huoke.jpg",
    description: "面向管理培训行业的售课平台，从需求理解、原型推演到高保真 UI 与开发交付。",
  },
  {
    id: "02",
    title: "伏羲云后台系统",
    type: "WEB / DESIGN SYSTEM",
    year: "2023–2025",
    image: "/assets/project-fuxi.jpg",
    description: "梳理 HOK 获客文化业务链路，统一高频列表、表单与数据展示场景。",
  },
  {
    id: "03",
    title: "奥世美病例提交系统",
    type: "WEB + APP / EXPERIENCE",
    year: "2024–2025",
    image: "/assets/project-aoshimei.jpg",
    description: "为正畸牙科医生重构病例提交体验，降低制作周期并提升操作效率。",
  },
  {
    id: "04",
    title: "OTD 3.0",
    type: "AUTOMOTIVE HMI / UI/UX",
    year: "2024–2025",
    image: "/assets/project-otd.jpg",
    description: "面向海外市场的旗舰车载系统，负责从 0 到 1 的视觉系统与原型交互。",
  },
];

const capabilities = [
  {
    icon: GridFour,
    index: "A.01",
    title: "信息架构",
    body: "把复杂业务拆成清晰路径，让结构、内容与操作优先级自然成立。",
  },
  {
    icon: Stack,
    index: "A.02",
    title: "多端产品设计",
    body: "覆盖 APP、Web 后台与跨屏产品，建立一致、可扩展的体验系统。",
  },
  {
    icon: CarProfile,
    index: "A.03",
    title: "车载 HMI",
    body: "理解驾驶场景、视线成本与海外用户习惯，平衡美感与安全效率。",
  },
  {
    icon: MagicWand,
    index: "A.04",
    title: "视觉系统",
    body: "从概念语言到组件规范，建立有识别度且能真实落地的视觉秩序。",
  },
  {
    icon: Lightning,
    index: "A.05",
    title: "AI 辅助设计",
    body: "用 AI 扩展灵感、视觉生产与原型验证，同时保持设计判断。",
  },
  {
    icon: UsersThree,
    index: "A.06",
    title: "协作与交付",
    body: "与产品和研发共同评估方案，推动走查、测试与上线验收。",
  },
];

const experiences = [
  {
    company: "杭州市爱医问问智慧科技有限公司",
    role: "产品设计",
    time: "2025.11 — 至今",
  },
  {
    company: "深圳市路之音科技有限公司",
    role: "UI 设计师",
    time: "2023.04 — 2025.06",
  },
  {
    company: "深圳市获客教育科技有限公司",
    role: "UI 设计师",
    time: "2022.02 — 2023.02",
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

function BrandMark() {
  return (
    <a className="brand" href="#top" aria-label="回到首页">
      <TypeText text="LIU HAI NING DESIGN" className="brand-name" speed={22} />
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
            <a href="#about" onClick={close}><TypeText text="ABOUT" delay={180} speed={24} /></a>
            <a href="#work" onClick={close}><TypeText text="WORK" delay={230} speed={24} /></a>
            <a href="#capabilities" onClick={close}><TypeText text="CAPABILITIES" delay={280} speed={24} /></a>
            <a className="nav-contact" href="#contact" onClick={close}>
              <TypeText text="CONTACT" delay={330} speed={24} /> <ArrowUpRight size={15} />
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
          <TypeText text="Visual" delay={120} speed={42} />
          <TypeText text="And Product" delay={320} speed={38} />
        </h1>

        <div className="hero-note">
          <TypeText as="p" className="eyebrow" text="UI / UE · PRODUCT EXPERIENCE · AI" delay={520} speed={18} />
          <TypeText as="p" text="Working at the intersection of product logic, visual systems and emerging tools — turning complex information into clear, memorable experiences." delay={700} speed={9} />
        </div>

        <div className="hero-title-right">
          <TypeText as="p" text="AI" delay={300} speed={70} />
          <TypeText as="p" text="Designer" delay={470} speed={52} cursor />
          <a href="#work"><TypeText text="VIEW SELECTED WORK" delay={860} speed={20} /> <ArrowDown size={17} /></a>
        </div>

        <div className="hero-coordinate" aria-hidden="true">
          <TypeText text="PORTFOLIO / 2026" delay={620} speed={20} />
          <TypeText text="30°16′N 120°09′E" delay={720} speed={20} />
        </div>
      </div>
      <div className="hero-status">
        <span className="status-dot" />
        <TypeText text="AVAILABLE FOR NEW OPPORTUNITIES" delay={900} speed={18} />
      </div>
    </section>
  );
}

function SectionHeading({ index, kicker, title, description }) {
  return (
    <div className="section-heading">
      <TypeText as="div" className="section-number" text={`/${index}`} speed={24} />
      <div>
        <TypeText as="p" className="eyebrow" text={kicker} speed={16} />
        <TypeText as="h2" text={title} delay={90} speed={22} />
      </div>
      {description && <TypeText as="p" className="section-description" text={description} delay={180} speed={10} />}
    </div>
  );
}

function About() {
  return (
    <section className="section about" id="about">
      <div className="frame">
        <div className="profile-heading">
          <TypeText as="h2" className="profile-title" text="PROFILE" speed={34} />
          <TypeText className="profile-pill" text="个人经历" delay={140} speed={28} />
        </div>

        <div className="profile-showcase">
          <div className="portrait-wrap profile-portrait">
            <img src="/assets/profile-source.jpg" alt="刘海宁 Nick 个人照片" />
            <div className="portrait-label">
              <TypeText text="NICK / 刘海宁" speed={18} />
              <TypeText text="HANGZHOU · CHINA" delay={120} speed={18} />
            </div>
          </div>

          <article className="profile-summary">
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
          </article>
        </div>

        <div className="profile-stats" aria-label="个人项目数据">
          <div><TypeText as="strong" text="05+" speed={64} /><TypeText text="年设计经验" delay={80} speed={24} /></div>
          <div><TypeText as="strong" text="20+" delay={80} speed={64} /><TypeText text="项目交付" delay={140} speed={24} /></div>
          <div><TypeText as="strong" text="03" delay={160} speed={64} /><TypeText text="产品场景" delay={200} speed={24} /></div>
          <div><TypeText as="strong" text="06" delay={220} speed={64} /><TypeText text="核心能力" delay={260} speed={24} /></div>
        </div>

        <div className="profile-experience-label">
          <TypeText text="WORK EXPERIENCE" speed={20} />
          <TypeText text="工作履历" delay={100} speed={24} />
        </div>
        <div className="experience-list">
          {experiences.map((item, index) => (
            <article className="experience-row" key={item.company}>
              <TypeText className="experience-index" text={`0${index + 1}`} speed={34} />
              <TypeText as="h3" text={item.company} delay={80} speed={16} />
              <TypeText as="p" text={item.role} delay={140} speed={20} />
              <TypeText as="time" text={item.time} delay={180} speed={20} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Work() {
  return (
    <section className="section work" id="work">
      <div className="frame">
        <SectionHeading
          index="02"
          kicker="SELECTED PROJECTS / 2022—2026"
          title="跨越移动端、后台系统与车载场景的产品实践。"
          description="项目视觉封面为当前基础版的艺术化占位；后续替换成你的真实作品截图后，会继续完善项目详情与案例叙事。"
        />
        <div className="project-list">
          {projects.map((project) => (
            <article className="project-card" key={project.id} tabIndex="0">
              <img src={project.image} alt={`${project.title} 项目视觉封面`} />
              <div className="project-overlay" />
              <div className="project-topline">
                <TypeText text={`/${project.id}`} speed={26} />
                <TypeText text={project.type} delay={80} speed={18} />
                <TypeText text={project.year} delay={140} speed={18} />
              </div>
              <div className="project-copy">
                <TypeText as="h3" text={project.title} delay={100} speed={32} />
                <TypeText as="p" text={project.description} delay={180} speed={10} />
              </div>
              <span className="project-action" aria-hidden="true"><ArrowUpRight size={28} /></span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Capabilities() {
  return (
    <section className="section capabilities" id="capabilities">
      <div className="frame">
        <SectionHeading
          index="03"
          kicker="CAPABILITIES / DESIGN PRACTICE"
          title="设计能力不是清单，而是一套持续解决问题的方法。"
        />
        <div className="capability-grid">
          {capabilities.map(({ icon: Icon, ...item }) => (
            <article className="capability-card" key={item.index}>
              <div className="capability-top">
                <TypeText text={item.index} speed={28} />
                <Icon size={30} weight="light" />
              </div>
              <TypeText as="h3" text={item.title} delay={80} speed={28} />
              <TypeText as="p" text={item.body} delay={150} speed={11} />
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
        <TypeText as="h2" text={"有新的想法，\n一起让它发生。"} delay={220} speed={34} cursor />
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
    <main>
      <div className="site-grainient" aria-hidden="true">
        <Grainient
          color1="#315f79"
          color2="#071019"
          color3="#172743"
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
