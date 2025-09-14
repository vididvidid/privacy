import React, { useState, useEffect } from 'react';

// Define the structure for the data we expect from the API
interface PolicySection {
  title: string;
  content: string;
}

interface PrivacyPolicy {
  title: string;
  effectiveDate: string;
  sections: PolicySection[];
}

interface PolicyListItem {
  id: string;
  title: string;
}

// --- Style Component ---
// This component injects all the necessary CSS for the theme into the document head.
const ThemeStyles = () => (
  <style>{`
    /* 1. Google Font Imports */
    @import url('https://fonts.googleapis.com/css2?family=Crimson+Text:wght@600&family=Source+Serif+Pro:wght@400;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

    /* 2. CSS Variables (Design Tokens) */
    :root {
      --background: #FBF9F4; /* Warm, inviting canvas */
      --foreground: #2D2D2D; /* Primary text, WCAG AAA */
      --primary: #4A55A2;    /* A deep, elegant indigo for interactive elements */
      --muted: #757575;      /* Secondary info, metadata */

      --font-display: 'Crimson Text', Georgia, 'Times New Roman', serif;
      --font-body: 'Source Serif Pro', Georgia, 'Times New Roman', serif;
      --font-mono: 'IBM Plex Mono', 'Courier New', monospace;
    }

    /* 3. Base & Typography System */
    body {
      background-color: var(--background);
      color: var(--foreground);
      font-family: var(--font-body);
      line-height: 1.7;
      margin: 0;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    h1, h2, h3, h4, h5, h6 {
      font-family: var(--font-display);
      font-weight: 600;
      letter-spacing: -0.02em; /* Tight for large sizes */
    }
    
    /* 4. Layout & Component Styles */
    .main-container {
      display: flex;
      min-height: 100vh;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      box-sizing: border-box;
    }

    .card {
      background-color: rgba(251, 249, 244, 0.8); /* --background with opacity */
      backdrop-filter: blur(4px);
      border: 1px solid rgba(45, 45, 45, 0.1);
      border-radius: 0.625rem; /* 10px */
      box-shadow: 0 4px 15px rgba(45, 45, 45, 0.05);
      padding: 2rem;
      width: 100%;
      box-sizing: border-box;
    }
    
    .responsive-h1 {
      font-size: 2.25rem;
    }

    @media (min-width: 768px) {
      .card {
        padding: 3rem;
      }
      .responsive-h1 {
        font-size: 3rem;
      }
    }

    .link {
      font-family: var(--font-mono);
      font-size: 0.875rem;
      color: var(--primary);
      text-decoration: none;
      transition: color 0.3s ease;
    }
    .link:hover {
      text-decoration: underline;
    }

    .policy-button {
      display: block;
      width: 100%;
      text-align: center;
      background-color: rgba(74, 85, 162, 0.05);
      border: 1px solid rgba(74, 85, 162, 0.2);
      color: var(--primary);
      padding: 1rem;
      border-radius: 0.625rem;
      font-family: var(--font-display);
      font-size: 1.25rem;
      text-decoration: none;
      transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    .policy-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(45, 45, 45, 0.08); /* Hover Lift Effect */
      background-color: rgba(74, 85, 162, 0.1);
      border-color: rgba(74, 85, 162, 0.3);
    }

    .footer {
      text-align: center;
      padding: 1.5rem;
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--muted);
    }

    /* 5. Loader Animation */
    .loader {
      width: 50px;
      aspect-ratio: 1;
      border-radius: 50%;
      border: 8px solid;
      border-color: transparent var(--foreground);
      animation: l1 1s infinite linear;
    }
    @keyframes l1 {
      to { transform: rotate(1turn); }
    }
    
    /* 6. Prose styles for rich text policy content */
    .prose-custom h2 {
      font-size: 1.5rem;
      border-bottom: 1px solid rgba(45, 45, 45, 0.15);
      padding-bottom: 0.5rem;
      margin-top: 2rem;
      margin-bottom: 1rem;
    }
    .prose-custom p, .prose-custom ul, .prose-custom ol {
      font-family: var(--font-body);
      line-height: 1.7;
      color: rgba(45, 45, 45, 0.9);
      letter-spacing: 0.01em;
    }
    .prose-custom a { color: var(--primary); }
    .prose-custom a:hover { text-decoration: underline; }
    .prose-custom strong { font-weight: 600; color: var(--foreground); }
  `}</style>
);


const App: React.FC = () => {
  const [policy, setPolicy] = useState<PrivacyPolicy | null>(null);
  const [policyList, setPolicyList] = useState<PolicyListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const projectName = window.location.pathname.replace(/^\/|\/$/g, '');

    const fetchPolicyData = async () => {
      setLoading(true);
      try {
        if (projectName) {
          const response = await fetch(`/privacy/${projectName}`);
          if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || `Error fetching policy: ${response.status}`);
          }
          const data: PrivacyPolicy = await response.json();
          setPolicy(data);
          setPolicyList([]);
        } else {
          const response = await fetch(`/privacy/all`);
          if (!response.ok) {
            throw new Error(`Error fetching policy list: ${response.status}`);
          }
          const data: PolicyListItem[] = await response.json();
          setPolicyList(data);
          setPolicy(null);
        }
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        setPolicy(null);
        setPolicyList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPolicyData();
  }, []);

  // --- Render Functions with new styling ---

  const renderLoading = () => <div className="loader"></div>;

  const renderError = () => (
    <div className="card" style={{ maxWidth: '32rem', textAlign: 'center' }}>
      <h2 style={{ fontSize: '1.875rem', color: '#991B1B', marginBottom: '1rem' }}>Could Not Load Content</h2>
      <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>{error}</p>
      <a href="/" className="link">&larr; Go to Homepage</a>
    </div>
  );

  const renderPolicyDetails = () => (
    <div className="card" style={{ maxWidth: '56rem' }}>
      <a href="/" className="link" style={{ marginBottom: '2rem', display: 'inline-block' }}>&larr; Back to All Policies</a>
      <h1 className="responsive-h1" style={{ marginBottom: '0.5rem' }}>{policy!.title}</h1>
      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', color: 'var(--muted)', marginBottom: '2.5rem' }}>Effective Date: {policy!.effectiveDate}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {policy!.sections.map((section, index) => (
          <div key={index}>
            <div 
              className="prose-custom"
              dangerouslySetInnerHTML={{ __html: `<h2>${section.title}</h2>${section.content}` }} 
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderPolicyList = () => (
    <div className="card" style={{ maxWidth: '42rem', textAlign: 'center' }}>
      <h1 className="responsive-h1" style={{ marginBottom: '1rem' }}>Privacy Policy Center</h1>
      <p style={{ color: 'var(--muted)', marginBottom: '2rem' }}>Please select a project to view its privacy policy.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {policyList.map(item => (
          <a
            key={item.id}
            href={`/${item.id}`}
            className="policy-button"
          >
            {item.title}
          </a>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    if (loading) return renderLoading();
    if (error) return renderError();
    if (policy) return renderPolicyDetails();
    if (policyList.length > 0) return renderPolicyList();
    return <div className="card" style={{ color: 'var(--muted)', textAlign: 'center' }}>No policies found.</div>;
  };

  return (
    <>
      <ThemeStyles />
      <main className="main-container">
        {renderContent()}
      </main>
      <footer className="footer">
        &copy; {new Date().getFullYear()} Yash Kumar Kasaudhan. All Rights Reserved.
      </footer>
    </>
  );
};

export default App;

