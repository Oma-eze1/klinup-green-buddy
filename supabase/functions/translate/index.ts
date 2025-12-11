import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Language code mapping for N-ATLaS
const languageMap: Record<string, string> = {
  'hausa': 'hau',
  'igbo': 'ibo', 
  'yoruba': 'yor',
  'english': 'eng'
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, targetLanguage } = await req.json();
    
    if (!text || !targetLanguage) {
      return new Response(
        JSON.stringify({ error: 'Missing text or targetLanguage' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If target is English, return original text
    if (targetLanguage.toLowerCase() === 'english') {
      return new Response(
        JSON.stringify({ translatedText: text }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const NATLAS_ENDPOINT_URL = Deno.env.get('NATLAS_ENDPOINT_URL');
    const HF_ACCESS_TOKEN = Deno.env.get('HUGGING_FACE_ACCESS_TOKEN');

    if (!NATLAS_ENDPOINT_URL || !HF_ACCESS_TOKEN) {
      console.error('N-ATLaS endpoint or HF token not configured');
      return new Response(
        JSON.stringify({ error: 'Translation service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const targetLangCode = languageMap[targetLanguage.toLowerCase()] || targetLanguage.toLowerCase();
    
    console.log(`Translating to ${targetLanguage} (${targetLangCode}): "${text.substring(0, 50)}..."`);

    // N-ATLaS uses Llama-3 chat template format
    const systemPrompt = `You are N-ATLaS, a Nigerian language translation assistant by Awarri Technologies. Translate the following English text to ${targetLanguage}. Only output the translation, nothing else. Preserve the meaning and tone.`;

    const response = await fetch(NATLAS_ENDPOINT_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_ACCESS_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: `<|begin_of_text|><|start_header_id|>system<|end_header_id|>\n\n${systemPrompt}<|eot_id|><|start_header_id|>user<|end_header_id|>\n\n${text}<|eot_id|><|start_header_id|>assistant<|end_header_id|>\n\n`,
        parameters: {
          max_new_tokens: 512,
          temperature: 0.3,
          do_sample: true,
          return_full_text: false
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('N-ATLaS error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded, please try again later' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 503) {
        return new Response(
          JSON.stringify({ error: 'Translation service is starting up, please try again in a moment' }),
          { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      return new Response(
        JSON.stringify({ error: 'Translation failed', details: errorText }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    
    // Handle different response formats from HF Inference Endpoints
    let translatedText = text;
    if (Array.isArray(data) && data[0]?.generated_text) {
      translatedText = data[0].generated_text.trim();
    } else if (data.generated_text) {
      translatedText = data.generated_text.trim();
    } else if (typeof data === 'string') {
      translatedText = data.trim();
    }
    
    console.log(`N-ATLaS translation result: "${translatedText.substring(0, 50)}..."`);

    return new Response(
      JSON.stringify({ translatedText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Translation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
