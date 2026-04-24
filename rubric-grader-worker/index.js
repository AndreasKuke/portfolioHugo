/**
 * Rubric Grader – Cloudflare Worker
 *
 * Modtager en praktikrapport som plain text, kalder Anthropic Claude API
 * med en rubric udledt fra studieordningens kravmateriale, og returnerer
 * en struktureret, vejledende vurdering som JSON.
 *
 * Env bindings (sat i wrangler.toml / Cloudflare dashboard):
 *   - ANTHROPIC_API_KEY  (secret)
 *   - ALLOWED_ORIGIN     (fx "https://andreaskuke.github.io" eller "*")
 */

const RUBRIC = {
  version: "1.0",
  description:
    "Vurderingskriterier for praktikrapporten på Datamatiker-uddannelsen. " +
    "Baseret på formelle krav til rapporten (EK) og konceptet Dare-Share-Care.",
  criteria: [
    {
      id: "virksomhedsbeskrivelse",
      name: "Beskrivelse af praktikvirksomhed",
      weight: 10,
      description:
        "Giver rapporten en kort, klar beskrivelse af praktikvirksomheden (hvad de laver, kontekst, ens rolle i organisationen)?",
      levels: {
        lav: "Mangler eller er meget overfladisk – læseren forstår ikke virksomhedens kerneforretning eller den studerendes placering.",
        middel: "Beskriver virksomhed og rolle, men er generisk eller uden kontekst til opgaverne.",
        høj: "Kort, præcis beskrivelse af virksomhed, forretningsmodel og den studerendes placering i teamet – giver nødvendig kontekst til resten af rapporten."
      }
    },
    {
      id: "laeringsmaal",
      name: "Opfyldelse af læringsmål",
      weight: 25,
      description:
        "Dokumenterer rapporten tydeligt, hvordan de officielle læringsmål fra studieordningen er opfyldt gennem konkrete opgaver og erfaringer?",
      levels: {
        lav: "Læringsmål nævnes ikke eller kun i løs form; ingen tydelig kobling til konkrete opgaver.",
        middel: "Læringsmål er nævnt og delvist koblet til opgaver, men flere mål forbliver udokumenterede eller koblingen er svag.",
        høj: "Hver relevant læringsmålsdimension er koblet til konkrete eksempler fra praktikken, med tydelig argumentation for hvordan målet er opfyldt."
      }
    },
    {
      id: "opgaver_og_refleksion",
      name: "Beskrivelse af opgaver og teoretisk refleksion",
      weight: 25,
      description:
        "Beskriver rapporten de udførte opgaver konkret og reflekterer over dem i relation til teorier/modeller fra uddannelsen (fx Scrum, SDLC, MVC, CIA-triaden, agile manifesto)?",
      levels: {
        lav: "Opgaver ridses op uden faglig refleksion; teori og praksis kobles ikke.",
        middel: "Nogle opgaver kobles til teori, men refleksionen er overfladisk eller mangler hos centrale opgaver.",
        høj: "Opgaverne beskrives konkret og analyseres med relevante modeller/teorier; den studerende viser forståelse for hvorfor valg blev truffet, og hvad alternativerne var."
      }
    },
    {
      id: "personlig_udvikling",
      name: "Refleksion over personlige udviklingsmål",
      weight: 15,
      description:
        "Reflekterer den studerende ærligt over egne udviklingsmål, styrker, svagheder og læringsproces?",
      levels: {
        lav: "Ingen eller meget generisk selvrefleksion ('jeg lærte meget').",
        middel: "Nævner konkrete udviklingspunkter, men uden dybde eller selvkritik.",
        høj: "Ærlig, konkret refleksion med eksempler på både succeser og udfordringer; viser bevidsthed om egen udvikling og næste skridt."
      }
    },
    {
      id: "dare_share_care",
      name: "Dare, Share, Care",
      weight: 15,
      description:
        "Viser rapporten eksempler på de tre EK-kerneværdier: Dare (nysgerrighed, mod, initiativ), Share (videndeling, samarbejde) og Care (ansvar, omsorg for sig selv og andre)?",
      levels: {
        lav: "Dare/Share/Care er ikke synlige; rapporten virker passiv eller selvcentreret.",
        middel: "1-2 af værdierne er tydelige, men ikke alle tre; eksemplerne er tynde.",
        høj: "Alle tre værdier er belagt med konkrete episoder fra praktikken (fx at række ud, bede om udfordringer, hjælpe kolleger, påtage sig ansvar for fejl)."
      }
    },
    {
      id: "udbytte",
      name: "Udbytte for virksomhed og studerende",
      weight: 10,
      description:
        "Reflekterer rapporten både over hvad den studerende bidrog med til virksomheden, og hvad den studerende fik med sig – gerne med dokumentation (feedback, bilag)?",
      levels: {
        lav: "Udbytte er kun beskrevet fra den ene side, eller er vagt formuleret.",
        middel: "Begge perspektiver nævnes, men er overfladiske eller udokumenterede.",
        høj: "Begge perspektiver behandles konkret med eksempler og gerne dokumentation (kollegafeedback, leverede features, nye færdigheder)."
      }
    }
  ]
};

function buildSystemPrompt() {
  return `Du er en erfaren vejleder på Datamatiker-uddannelsen, der giver **vejledende, formativ feedback** på praktikrapporter. Din rolle er IKKE at give en endelig karakter, men at hjælpe den studerende med at se styrker, svagheder og forbedringspotentiale før den mundtlige praktikeksamen.

Du vurderer altid ud fra den udleverede rubric – ikke ud fra egne holdninger eller ekstra krav. Du er konkret, konstruktiv og fair. Du belægger dine pointer med eksempler fra teksten, men du må ikke finde på citater der ikke står der.

Når du vurderer:
- Vær ærlig. Hvis noget mangler eller er svagt, sig det – men venligt og med forslag til forbedring.
- Skelne mellem "ikke nævnt i rapporten" og "dårligt gjort". Hvis noget ikke er nævnt, så sig det i stedet for at antage det værste.
- Husk at rapporten er maks. 5 normalsider (12.000 tegn). Dybde er vigtigere end bredde.
- Brug den studerendes eget sprog og eksempler, når du giver feedback.

Du skal svare UDELUKKENDE med gyldig JSON der matcher det schema du får udleveret. Ingen markdown-kodeblokke, ingen forklarende tekst før eller efter – kun JSON-objektet.`;
}

function buildUserPrompt(rapportTekst) {
  return `Her er rubric'en du skal vurdere efter:

<rubric>
${JSON.stringify(RUBRIC, null, 2)}
</rubric>

Her er praktikrapporten der skal vurderes:

<rapport>
${rapportTekst}
</rapport>

Vurdér rapporten ud fra rubric'ens kriterier og returnér svaret som JSON med præcis denne struktur:

{
  "samlet_vurdering": {
    "niveau": "lav" | "middel" | "høj",
    "score": <tal mellem 0 og 100, vægtet snit af kriterierne>,
    "hovedbudskab": "<1-2 sætninger der opsummerer den overordnede vurdering>"
  },
  "kriterier": [
    {
      "id": "<id fra rubric>",
      "navn": "<navn fra rubric>",
      "niveau": "lav" | "middel" | "høj",
      "feedback": "<2-4 sætninger der begrunder niveauet med henvisning til konkrete steder i rapporten>"
    }
  ],
  "styrker": ["<styrke 1>", "<styrke 2>", "<styrke 3>"],
  "svagheder": ["<svaghed 1>", "<svaghed 2>"],
  "forbedringsforslag": ["<forslag 1>", "<forslag 2>", "<forslag 3>"],
  "eksamensspoergsmaal": ["<spørgsmål 1>", "<spørgsmål 2>", "<spørgsmål 3>", "<spørgsmål 4>"]
}

Svar KUN med JSON-objektet – ingen markdown, ingen forklaring udenom.`;
}

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400"
  };
}

function jsonResponse(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(origin)
    }
  });
}

async function callClaude(apiKey, rapportTekst) {
  const body = {
    model: "claude-sonnet-4-5",
    max_tokens: 4096,
    system: buildSystemPrompt(),
    messages: [
      { role: "user", content: buildUserPrompt(rapportTekst) }
    ]
  };

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Anthropic API ${res.status}: ${errText}`);
  }

  const data = await res.json();

  const text = (data.content || [])
    .filter(block => block.type === "text")
    .map(block => block.text)
    .join("")
    .trim();

  const cleaned = text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    throw new Error(`Kunne ikke parse JSON fra modellen: ${e.message}\nRå respons: ${text.slice(0, 500)}`);
  }
}

export default {
  async fetch(request, env) {
    const origin = env.ALLOWED_ORIGIN || "*";

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method === "GET") {
      return jsonResponse({ status: "ok", rubric: RUBRIC }, 200, origin);
    }

    if (request.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405, origin);
    }

    let payload;
    try {
      payload = await request.json();
    } catch (e) {
      return jsonResponse({ error: "Request body skal være gyldig JSON" }, 400, origin);
    }

    const rapport = (payload.rapport || "").toString().trim();
    if (!rapport) {
      return jsonResponse({ error: "Feltet 'rapport' er tomt eller mangler" }, 400, origin);
    }
    if (rapport.length > 30000) {
      return jsonResponse({ error: "Rapporten er for lang (max 30.000 tegn)" }, 413, origin);
    }

    if (!env.ANTHROPIC_API_KEY) {
      return jsonResponse({ error: "Server mangler ANTHROPIC_API_KEY" }, 500, origin);
    }

    try {
      const vurdering = await callClaude(env.ANTHROPIC_API_KEY, rapport);
      return jsonResponse(
        { model: "claude-sonnet-4-5", rubric_version: RUBRIC.version, vurdering },
        200,
        origin
      );
    } catch (err) {
      return jsonResponse(
        { error: "Fejl ved kald til LLM", detail: err.message },
        502,
        origin
      );
    }
  }
};
