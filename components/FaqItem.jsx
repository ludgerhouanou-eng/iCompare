export default function FaqItem({ q, a, defaultOpen = false }) {
  return (
    <details className="faq-item" open={defaultOpen || undefined}>
      <summary>
        {q}
        <span className="faq-icon" aria-hidden="true">
          +
        </span>
      </summary>
      <div className="faq-a">{a}</div>
    </details>
  );
}
