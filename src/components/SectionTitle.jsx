function SectionTitle({ eyebrow, title, subtitle }) {
  return (
    <div className="section-header">
      {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}

export default SectionTitle;
