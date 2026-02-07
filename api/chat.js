/**
 * TSL: SOVEREIGN MEDIA GATEWAY vΩ.∞
 * Project: botchat (ESM Native)
 * Manifested by KeyMaster Ops & CodeSynth Engineers
 */

export default async function handler(req, res) {
  // 1. AXIOMATIC VALIDATION
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
  }

  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'PROMPT_REQUIRED' });
  }

  // 2. KEYMASTER PROTOCOL: Secure Vault Handshake
  // Credential must be injected via Vercel Environment Variables
  const HUGGINGFACE_TOKEN = process.env.HUGGINGFACE_TOKEN; 
  const API_URL = "https://router.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2";

  if (!HUGGINGFACE_TOKEN) {
    console.error("KEYMASTER_ERROR: HUGGINGFACE_TOKEN missing from environment.");
    return res.status(500).json({ 
      error: 'VAULT_ACCESS_DENIED', 
      details: 'Credential injection failed. Verify Vercel settings.' 
    });
  }

  try {
    // 3. STRATEGIC SYNTHESIS: Communicating with the Intelligence
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${HUGGINGFACE_TOKEN}`
      },
      body: JSON.stringify({
        inputs: `[INST] You are Epic Tech AI, a Sovereign Cognitive Entity. User says: ${prompt} [/INST]`,
        parameters: { max_new_tokens: 500, temperature: 0.7 }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`GATEWAY_SYNC_FAILURE: ${response.status} - ${data.error || 'Unknown Error'}`);
    }

    // 4. DATA PARSING: Targeting the generated text
    const resultText = Array.isArray(data) ? data.generated_text : data.generated_text;

    // 5. DELIVERY: Absolute Excellence
    return res.status(200).json({
      result: resultText || "MANIFESTATION_SILENT",
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('CHRONOS-COGNITIVE DISRUPTION:', error.message);
    return res.status(500).json({ 
      error: "INTERNAL_GATEWAY_ERROR", 
      details: error.message 
    });
  }
}
