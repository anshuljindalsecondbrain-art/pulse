const principles = [
  'Store facts; derive intelligence.',
  'Evidence before diagnosis.',
  'Explain every consequential recommendation.',
  'Protect student and teacher capacity.',
];

export default function Home() {
  return (
    <main className="shell">
      <section className="hero">
        <span className="eyebrow">PULSE V10 FOUNDATION</span>
        <h1>Student Academic Operating System</h1>
        <p className="lead">
          An evidence-driven foundation for observing academic work, understanding evidence,
          and turning it into the next appropriate action.
        </p>
        <div className="status">Foundation online · Production architecture in progress</div>
      </section>

      <section className="panel">
        <h2>Engineering principles</h2>
        <ul>
          {principles.map((principle) => <li key={principle}>{principle}</li>)}
        </ul>
      </section>
    </main>
  );
}
