# SafeServe MBG 🛡️

> **Restoring Trust in the Makan Bergizi Gratis (MBG) Program**  
> *AI-Driven Oversight & Real-Time Incident Response for National Food Safety*

![Status](https://img.shields.io/badge/Status-Hackathon_MVP-orange) ![License](https://img.shields.io/badge/License-MIT-blue) ![Stack](https://img.shields.io/badge/Tech-React_19_Gemini_3-black)

## 🚨 The Challenge: The "MBG Crisis"

In 2025, Indonesia's historic **Makan Bergizi Gratis (MBG)** program—aiming to feed 83 million beneficiaries—faced a critical operational challenge. Within months of launch, over **11,500 students** were affected by food poisoning incidents due to fragmented oversight of hyper-local vendors (UMKM).

**SafeServe** is a centralized, AI-powered food safety intelligence platform designed to replace reactive damage control with **proactive detection and immutable accountability**.

## 💡 The Solution: Unified Safety Ecosystem

SafeServe connects Schools, Vendors, and the Government (BGN/BPOM) in a real-time loop:

### 1. 🏛️ Regulator Dashboard (BGN / BPOM)
*   **Regional Risk Heatmaps**: Live geographical risk assessment powered by **Gemini 3 Pro Search Grounding**.
*   **Predictive Outbreak Scoring**: A hybrid "Brain Circuit" that weights school reports, social sentiment, and IoT anomalies.
*   **Social Pulse**: Automated clustering of social media reports to detect "hidden" outbreaks before they reach official channels.

### 2. 🚚 Vendor Portal (Catering / UMKM)
*   **AI Hygiene Audit**: Multimodal computer vision analysis of prep areas using **Gemini 3 Flash**.
*   **Cold-Chain Telemetry**: Live simulation of refrigeration stability (IoT-ready).
*   **Traceability Ledger**: Clickable batch history with temperature logs, staff wellness records, and verification documents.

### 3. 🏫 School Portal (Teachers / Admins)
*   **AI-Driven Triage**: Real-time symptom analysis providing 1-10 severity scores and immediate medical protocols.
*   **Knowledge Graphing**: Mapping symptom clusters to likely foodborne pathogens.
*   **Vendor Transparency**: One-click "Audit Dossier" to view a vendor's safety history and integrity proofs.

## 🚀 Advanced AI Implementation

SafeServe leverages the full power of the **Google Gemini API**:
- **Multimodal Analysis**: Processing kitchen photos for sanitation compliance.
- **Search Grounding**: Injecting real-world news and regional data into risk models.
- **Structured Intelligence**: Utilizing `responseSchema` for deterministic JSON workflows in incident triage.
- **Resilient Engineering**: Built-in **Circuit Breaker** and **Exponential Backoff** logic to handle API rate limits (429s) gracefully, ensuring "Local Mode" functionality.

## 🛠️ Tech Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Frontend** | React 19 + Vite | Modern, high-performance UI |
| **AI Engine** | Gemini 3 (Flash & Pro) | Predictive scoring, Vision, and Triage |
| **Data Viz** | Recharts | Real-time telemetry and trend analysis |
| **Styling** | Tailwind CSS 4 | Custom OKLCH color system for accessibility |
| **Integrity** | (Mocked) Blockchain Hashes | Ensuring non-repudiation of incident logs |

## ⚖️ Judging Criteria Alignment (Frostbyte Hackathon 2026)

*   **Innovation**: Novel use of social sentiment monitoring to bypass traditional "oversight blindness."
*   **Complexity**: Integration of multimodal vision, real-time telemetry simulation, and robust error-handling patterns.
*   **Impact**: Directly addresses a national-scale public health challenge affecting millions of children.
*   **Clarity**: Role-based portals with specialized workflows for Teachers, Vendors, and Regulators.

---

*Built with ❤️ for the 2026 Frostbyte Hackathon.*