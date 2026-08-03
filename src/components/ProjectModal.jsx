import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "@phosphor-icons/react";

export default function ProjectModal({ project, onClose }) {
  const dialogRef = useRef(null);
  const viewerRef = useRef(null);
  const [firstPageReady, setFirstPageReady] = useState(false);

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

  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return undefined;

    const deferredImages = viewer.querySelectorAll("img[data-src]");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const image = entry.target;
        image.src = image.dataset.src;
        image.removeAttribute("data-src");
        observer.unobserve(image);
      });
    }, {
      root: viewer,
      rootMargin: "700px 0px",
      threshold: 0.01,
    });

    deferredImages.forEach((image) => observer.observe(image));
    return () => observer.disconnect();
  }, [project.id]);

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
          ref={viewerRef}
          className="project-modal__viewer"
          tabIndex="0"
          aria-busy={!firstPageReady}
          aria-label={`${project.title}项目作品集，共${project.pages.length}页，可上下滚动查看`}
        >
          {!firstPageReady ? (
            <div className="project-modal__loading" role="status">
              <span />
              LOADING FIRST PAGE
            </div>
          ) : null}
          <div className="project-modal__pages">
            {project.pages.map((page, index) => (
              <figure
                className="project-modal__page"
                key={page}
                style={{ aspectRatio: project.pageAspect }}
              >
                <img
                  src={index === 0 ? page : undefined}
                  data-src={index === 0 ? undefined : page}
                  alt={`${project.title}项目第${index + 1}页`}
                  width="1600"
                  height={project.pageAspect === "8 / 9" ? "1800" : project.pageAspect === "1600 / 1967" ? "1967" : "900"}
                  decoding="async"
                  fetchPriority={index === 0 ? "high" : "low"}
                  onLoad={index === 0 ? () => setFirstPageReady(true) : undefined}
                  onError={index === 0 ? () => setFirstPageReady(true) : undefined}
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
