// worker/index.ts

// This worker is dedicated to serving privacy policies.
// It can provide a list of all policies or a single, specific policy.

interface PolicySection {
  title: string;
  content: string; // Can contain HTML
}

interface PrivacyPolicy {
  title:string;
  effectiveDate: string;
  sections: PolicySection[];
}

// --- Privacy Policy Data ---
// Add new policies here in the future. The key (e.g., "searchit") will be used in the URL.
const policies: Record<string, PrivacyPolicy> = {
  searchit: {
    title: "Privacy Policy for SearchIt (Select To Search)",
    effectiveDate: "September 14, 2025",
    sections: [
      {
        title: "Introduction",
        content: `
          Thank you for using our browser extension. This policy outlines how we handle your data for our different features. Our goal is to be fully transparent and to protect your privacy.<br/><br/>
          We offer two main features, and they handle your data differently:
          <ol class="list-decimal list-inside ml-4">
            <li><b>Standard AI Analysis:</b> Direct, private analysis of an image and prompt.</li>
            <li><b>Google Lens Search:</b> A search feature that requires making your image temporarily public.</li>
          </ol>
        `,
      },
      {
        title: "1. Information We Collect",
        content: `
          For both features, the extension only handles the data you voluntarily provide for a specific task:
          <ul class="list-disc list-inside ml-4">
            <li><b>Image Data:</b> The image file you select.</li>
            <li><b>Text Prompts:</b> The text-based question you provide (for Standard AI Analysis).</li>
          </ul>
        `,
      },
      {
        title: "2. How Your Information is Used and Handled",
        content: `
          How we process your data depends entirely on the feature you choose to use.
          <h4 class="font-semibold mt-4 mb-2">A. For Standard AI Analysis</h4>
          This is the default analysis feature. When you use it, your privacy is maximized.
          <ul class="list-disc list-inside ml-4">
            <li><b>Direct Processing:</b> Your image and text prompt are sent directly and securely to our backend API running on Cloudflare Workers.</li>
            <li><b>No Third-Party Hosting:</b> In this flow, your image is <b>never</b> uploaded to a public third-party image host like ImgBB. It is processed in-memory by our Cloudflare service and then immediately discarded.</li>
            <li><b>Owner Access:</b> As the extension owner, I have no access to the images or prompts you submit through this feature.</li>
          </ul>
          <h4 class="font-semibold mt-4 mb-2">B. For Google Lens Search (Only when you click the Google Search icon)</h4>
          This is a special feature that requires a different data flow.
           <ul class="list-disc list-inside ml-4">
            <li><b>Temporary Public Hosting:</b> To allow Google's service to "see" your image, the extension first uploads your selected image to <b>ImgBB</b>. This creates a temporary, public URL for the image.</li>
            <li><b>Search Execution:</b> This public URL is then used to perform the Google Lens search.</li>
            <li><b>Data Retention:</b> The uploaded image is subject to ImgBB's terms of service and privacy policy regarding how long it is stored.</li>
            <li><b>Owner Access:</b> As the extension owner, I do not have access to your original image file. My access is limited to potentially seeing the public ImgBB URL that is generated for the search.</li>
          </ul>
        `,
      },
       {
        title: "3. Third-Party Services",
        content: `
          Our extension uses the following third-party services:
           <ul class="list-disc list-inside ml-4">
            <li><b>Cloudflare:</b> Used for <b>all</b> backend processing and AI analysis for the Standard AI Analysis feature. It provides a secure environment where your data is processed and immediately discarded.</li>
            <li><b>ImgBB:</b> Used <b>only when you explicitly click the Google Lens Search icon</b>. Its sole purpose is to temporarily host your image. We recommend you review ImgBB's Privacy Policy to understand how they handle data.</li>
          </ul>
        `,
      },
      {
        title: "4. Contact Us",
        content: `If you have any questions about this Privacy Policy, please contact us at <a href="mailto:vididvidid@gmail.com" class="text-blue-500 hover:underline">vididvidid@gmail.com</a>.`,
      },
    ],
  },
  // Example for a future product:
  // anotherapp: {
  //   title: "Privacy Policy for Another App",
  //   effectiveDate: "October 1, 2025",
  //   sections: [ { title: "Test", content: "This is a test policy."} ]
  // }
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }
    
    // --- API Route to get a list of all policies ---
    if (url.pathname === "/privacy/all") {
        const allPolicies = Object.keys(policies).map(key => ({
            id: key,
            title: policies[key].title,
        }));
        return new Response(JSON.stringify(allPolicies), {
            headers: { "Content-Type": "application/json", ...corsHeaders },
        });
    }

    // --- API Route to get a specific policy ---
    if (url.pathname.startsWith("/privacy/")) {
      const projectName = url.pathname.split("/")[2];
      const policy = policies[projectName];

      if (policy) {
        return new Response(JSON.stringify(policy), {
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      } else {
        return new Response(JSON.stringify({ error: "Privacy Policy not found." }), {
          status: 404,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
    }

    // --- Fallback for all other routes ---
    // The vite-plugin-cloudflare handles serving the frontend assets.
    // This is a fallback for direct API access or misconfigured routes.
    return new Response("Not Found. Use /privacy/all to see available policies.", {
      status: 404,
      headers: corsHeaders,
    });
  },
} satisfies ExportedHandler;

