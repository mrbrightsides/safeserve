# Third-Party APIs & Services 📡

SafeServe MBG relies on high-performance AI services to provide real-time food safety intelligence.

## Google Gemini API

We use the `@google/genai` SDK to power our intelligence engine.

### Models Used
*   **`gemini-3-flash-preview`**: Primary model for high-frequency tasks (Triage, Chat, Briefings).
*   **`gemini-3-pro-preview`**: Used for complex reasoning and high-accuracy risk analysis.

### Features Utilized

#### 1. Google Search Grounding
Used in the **Regional Risk Assessment** to fetch real-world context on food safety trends in Indonesia.
```typescript
config: {
  tools: [{ googleSearch: {} }]
}
```

#### 2. Multimodal Vision
Used in the **Vendor Portal** to analyze kitchen sanitation. The model processes base64-encoded images to identify risks.
```typescript
contents: {
  parts: [
    { inlineData: { mimeType: 'image/jpeg', data: base64Image } },
    { text: "Analyze hygiene compliance..." }
  ]
}
```

#### 3. Structured JSON Output
Used across the platform to ensure AI responses can be programmatically consumed by our UI components.
```typescript
config: {
  responseMimeType: "application/json",
  responseSchema: {
    type: Type.OBJECT,
    properties: {
      score: { type: Type.NUMBER },
      observations: { type: Type.ARRAY, items: { type: Type.STRING } }
    }
  }
}
```

## Data & Telemetry
*   **Dicebear API**: Used for generating consistent, role-based user avatars.
*   **Unsplash API**: High-quality imagery for the landing page and portal headers.
*   **Blockchain Simulation**: Mocked SHA-256 hashing for the "Integrity Proofs" ledger.

---
For API quota increases or technical support, contact [support@elpeef.com](mailto:support@elpeef.com).