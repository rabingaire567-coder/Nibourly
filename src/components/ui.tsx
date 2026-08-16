import { useEffect, useRef, useState, type ReactNode } from "react";

/* Scroll-reveal wrapper */
export function Reveal({ children, delay = "", className = "" }: { children: ReactNode; delay?: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal ${delay} ${visible ? "visible" : ""} ${className}`}>
      {children}
    </div>
  );
}

/* Animated counter */
export function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [n, setN] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const dur = 1400;
          const t0 = performance.now();
          const tick = (t: number) => {
            const p = Math.min((t - t0) / dur, 1);
            setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to]);

  return (
    <span ref={ref}>
      {n.toLocaleString()}
      {suffix}
    </span>
  );
}

/* Section heading */
export function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: ReactNode; sub?: string }) {
  return (
    <Reveal className="section-head">
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {sub && <p>{sub}</p>}
    </Reveal>
  );
}

/* Modal */
export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="modal-back" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="icon-btn close-x" onClick={onClose} aria-label="Close" style={{ position: "absolute", top: 16, right: 16 }}>
          ✕
        </button>
        <h3>{title}</h3>
        {children}
      </div>
    </div>
  );
}

/* Toast */
export function Toast({ message }: { message: string }) {
  const [show, setShow] = useState(!!message);
  useEffect(() => {
    setShow(!!message);
    if (!message) return;
    const t = setTimeout(() => setShow(false), 2600);
    return () => clearTimeout(t);
  }, [message]);
  if (!show || !message) return null;
  return (
    <div className="toast">
      <span>✅</span> {message}
    </div>
  );
}

/* Badge */
export function Badge({ color, children }: { color: "red" | "green" | "gold" | "blue" | "violet"; children: ReactNode }) {
  return <span className={`badge badge-${color}`}>{children}</span>;
}

/* Empty state */
export function Empty({ icon, title, sub }: { icon: string; title: string; sub?: string }) {
  return (
    <div className="empty">
      <span className="e-ico">{icon}</span>
      <h3 style={{ marginBottom: 6 }}>{title}</h3>
      {sub && <p className="small muted">{sub}</p>}
    </div>
  );
}

/* Status pill for reports */
export function StatusPill({ status }: { status: string }) {
  if (status === "open") return <span className="badge badge-red">● Open</span>;
  if (status === "in-progress") return <span className="badge badge-gold">● In Progress</span>;
  return <span className="badge badge-green">● Resolved</span>;
}
