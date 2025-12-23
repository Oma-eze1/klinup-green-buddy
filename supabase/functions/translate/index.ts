import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    // Use Modal N-ATLaS endpoint (OpenAI-compatible)
    const MODAL_NATLAS_URL = Deno.env.get('MODAL_NATLAS_URL') || 'https://jahswill4jahs--natlas-vllm-serve.modal.run/v1/chat/completions';
    console.log(`Translating to ${targetLanguage}: "${text.substring(0, 50)}..."`);
    const response = await fetch(MODAL_NATLAS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'n-atlas',
        messages: [
          {
            role: 'user',
            content: `Translate the following English text to ${targetLanguage} (only output the translation):\n${text}`
          }
        ],
        temperature: 0.2,
        max_tokens: 256,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Modal N-ATLaS API error:', response.status, errorText);
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded, please try again later' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      return new Response(
        JSON.stringify({ error: 'Translation failed', details: errorText }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    let translatedText = text;
    if (data?.choices?.[0]?.message?.content) {
      translatedText = String(data.choices[0].message.content).trim();
    }
    console.log(`Translation result: "${translatedText.substring(0, 50)}..."`);

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
