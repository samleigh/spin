import React, { useMemo, useState } from "react";
import { Spin } from "./pages/Spin";

const PLATFORM_OPTIONS = [
  "Youtube",
  "Snap Stars",
  "TikTok Shop",
  "Meta Reels",
  "Affiliate",
  "Spotify",
  "Shopify",
  "Shorts/Reels",
  "Snapchat"
];

const defaultData = {
  eyebrowText: "iA CLIENT PORTAL",
  clientName: "Publisher Pete",
  period: "Jan 1 - Jan 31, 2026",

  pdfUrl: "https://example.com/statement.pdf",
  emailButtonText: "Email Rep",
  downloadButtonText: "Download PDF",
  csvButtonText: "Export CSV",

  repName: "Random Rep",
  repRole: "Managing Partner",
  repEmail: "my@emailhere.com",
  repPhoto:
    "https://static.wixstatic.com/media/d6e6bf_84677ff6497648f48a455a306fc544fe~mv2.png",

  stat1Label: "NET REVENUE",
  stat1Value: "204",
  stat1Prefix: "$",
  stat1Suffix: "",
  stat1Note: "Current period net earnings reflected after reconciliation.",

  stat2Label: "IMPRESSIONS",
  stat2Value: "185k",
  stat2Prefix: "",
  stat2Suffix: "",
  stat2Note: "Primary monetization metric with month-over-month lift.",

  stat3Label: "AUDIENCE",
  stat3Value: "2.96m",
  stat3Prefix: "",
  stat3Suffix: "",
  stat3Note: "Active reach across current reporting channels and linked platforms.",

  stat4Label: "PARTICIPATION",
  stat4Value: "80",
  stat4Prefix: "",
  stat4Suffix: "%",
  stat4Note: "Net-60 per current structure",

  chartTitle: "Net Revenue Quadrimester",
  chartSubtitle: "Monthly net revenue across the reporting window.",
  chartMaxMode: "manual",
  chartMax: "1000",

  m1Label: "Oct",
  m1Value: "243",
  m2Label: "Nov",
  m2Value: "189",
  m3Label: "Dec",
  m3Value: "163",
  m4Label: "Jan/28",
  m4Value: "204",

  donutTitle: "Participation (Net-60)",
  donutSubtitle: "Current payout split across the agreement structure.",
  participationPercent: "80",
  donutNote: "Client / company split is currently structured at 80 / 20.",

  contactTitle: "Contact Your Representative",
  contactSubtitle:
    "Questions about accounting changes, statement adjustments, or payout detail? Reach out to your inArtists representative.",
  contactButtonText: "Email Representative",

  tableTitle: "Earnings by Channel (YtD)",
  tableSubtitle: "Platform-level visibility with current reconciliation status.",

  recentTitle: "Recent Activity",
  recentSubtitle: "A snapshot of the latest updates to your account.",

  noticeTitle: "INFORMATIONAL NOTICE",
  infoNotice:
    "The data presented in this report is provided for informational purposes only and may be subject to adjustment. For the most accurate and up-to-date reporting, please contact a member of our team."
};

const defaultChannels = [
  {
    platform: "Youtube",
    gross: "695.66",
    net: "556.53",
    audience: "2.96m",
    status: "CURRENT"
  },
  {
    platform: "Shorts/Reels",
    gross: "0",
    net: "0",
    audience: "0",
    status: "PENDING"
  },
  {
    platform: "Shopify",
    gross: "0",
    net: "0",
    audience: "0",
    status: "PENDING"
  },
  {
    platform: "Affiliate",
    gross: "0",
    net: "0",
    audience: "0",
    status: "REVIEW"
  }
];

const defaultActivity = [
  {
    number: "1",
    title: "January payout in queue",
    meta: "Generated and published to the client portal."
  },
  {
    number: "2",
    title: "Audience report refreshed",
    meta: "Platform data updated for the current reporting period."
  },
  {
    number: "3",
    title: "Payment breakdown available",
    meta: "Statement exports are ready for PDF download."
  },
  {
    number: "4",
    title: "Rep contact assigned",
    meta: "Support contact is listed for current support and adjustments."
  }
];

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function cleanNumber(value) {
  const n = Number(String(value ?? "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function formatMoneyLikeInput(value) {
  const n = cleanNumber(value);
  const hasDecimals = String(value).includes(".");
  return n.toLocaleString(undefined, {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2
  });
}

function getStatusPillClass(status) {
  const s = String(status || "").toUpperCase();
  if (s === "CURRENT") return "green";
  if (s === "PENDING") return "amber";
  return "gray";
}

function computeChartScale(data) {
  const raw = [data.m1Value, data.m2Value, data.m3Value, data.m4Value].map(cleanNumber);
  const maxValue = Math.max(...raw, 1);

  let yMax;
  if (data.chartMaxMode === "manual") {
    yMax = Math.max(cleanNumber(data.chartMax), maxValue, 1);
  } else {
    if (maxValue <= 100) yMax = 100;
    else if (maxValue <= 250) yMax = 250;
    else if (maxValue <= 500) yMax = 500;
    else if (maxValue <= 1000) yMax = 1000;
    else if (maxValue <= 2500) yMax = 2500;
    else yMax = Math.ceil(maxValue / 1000) * 1000;
  }

  const ticks = [
    yMax,
    Math.round(yMax * 0.75),
    Math.round(yMax * 0.5),
    Math.round(yMax * 0.25),
    0
  ];

  const bars = [
    {
      label: data.m1Label,
      value: data.m1Value,
      percent: Math.max(10, (cleanNumber(data.m1Value) / yMax) * 100)
    },
    {
      label: data.m2Label,
      value: data.m2Value,
      percent: Math.max(10, (cleanNumber(data.m2Value) / yMax) * 100)
    },
    {
      label: data.m3Label,
      value: data.m3Value,
      percent: Math.max(10, (cleanNumber(data.m3Value) / yMax) * 100)
    },
    {
      label: data.m4Label,
      value: data.m4Value,
      percent: Math.max(10, (cleanNumber(data.m4Value) / yMax) * 100)
    }
  ];

  return { yMax, ticks, bars };
}

function compileEmbed(data, channels, activity) {
  const { ticks, bars } = computeChartScale(data);
  const participation = Math.max(0, Math.min(100, cleanNumber(data.participationPercent)));

  const rowsHtml = channels
    .map((c) => {
      const pill = getStatusPillClass(c.status);
      return `
            <tr>
              <td>${escapeHtml(c.platform)}</td>
              <td>$${escapeHtml(formatMoneyLikeInput(c.gross))}</td>
              <td>$${escapeHtml(formatMoneyLikeInput(c.net))}</td>
              <td>${escapeHtml(c.audience)}</td>
              <td><span class="pill ${pill}">${escapeHtml(c.status)}</span></td>
            </tr>`;
    })
    .join("");

  const activityHtml = activity
    .map(
      (a) => `
          <div class="activity-item">
            <div class="activity-num">${escapeHtml(a.number)}</div>
            <div>
              <div class="activity-title">${escapeHtml(a.title)}</div>
              <div class="activity-meta">${escapeHtml(a.meta)}</div>
            </div>
          </div>`
    )
    .join("");

  return `<div id="ia-client-dashboard">
  <style>
    #ia-client-dashboard {
      --bg: #f3efe8;
      --panel: #ffffff;
      --ink: #142033;
      --muted: #637086;
      --navy: #24384f;
      --gold: #d8b547;
      --line: #e6e0d7;
      --soft: #f7f4ee;
      --shadow: 0 18px 50px rgba(20, 32, 51, 0.08);
      font-family: Inter, Helvetica Neue, Arial, sans-serif;
      background: var(--bg);
      color: var(--ink);
      padding: 24px;
      box-sizing: border-box;
      width: 100%;
      max-width: 100%;
      overflow-x: hidden;
    }

    #ia-client-dashboard *,
    #ia-client-dashboard *::before,
    #ia-client-dashboard *::after {
      box-sizing: border-box;
    }

    #ia-client-dashboard .wrap {
      max-width: 1360px;
      margin: 0 auto;
    }

    #ia-client-dashboard h1,
    #ia-client-dashboard h2,
    #ia-client-dashboard h3,
    #ia-client-dashboard p {
      margin: 0;
    }

    #ia-client-dashboard .hero {
      background: linear-gradient(135deg, #ffffff 0%, #fbfaf7 100%);
      border: 1px solid rgba(20, 32, 51, 0.06);
      border-radius: 28px;
      box-shadow: var(--shadow);
      padding: 28px;
      display: grid;
      grid-template-columns: 1.45fr 0.8fr;
      gap: 24px;
      align-items: center;
    }

    #ia-client-dashboard .eyebrow {
      display: inline-block;
      font-size: 11px;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      font-weight: 800;
      color: #7e6820;
      background: #fff7dc;
      border: 1px solid rgba(216, 181, 71, 0.35);
      border-radius: 999px;
      padding: 8px 12px;
      margin-bottom: 14px;
    }

    #ia-client-dashboard .title {
      font-size: 58px;
      line-height: 0.95;
      font-weight: 900;
      letter-spacing: -0.05em;
      margin-bottom: 10px;
      word-break: break-word;
    }

    #ia-client-dashboard .subtitle {
      font-size: 17px;
      line-height: 1.6;
      color: var(--muted);
      max-width: 780px;
    }

    #ia-client-dashboard .hero-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      align-self: center;
    }

    #ia-client-dashboard .btn,
    #ia-client-dashboard .contact-btn {
      border-radius: 18px;
      padding: 14px 16px;
      text-align: center;
      font-size: 14px;
      font-weight: 700;
      text-decoration: none;
      display: block;
      transition: transform 0.2s ease, opacity 0.2s ease, box-shadow 0.2s ease;
      word-break: break-word;
      -webkit-appearance: none;
      appearance: none;
      touch-action: manipulation;
      cursor: pointer;
      position: relative;
      z-index: 20;
    }

    #ia-client-dashboard .btn:hover,
    #ia-client-dashboard .contact-btn:hover {
      transform: translateY(-1px);
      opacity: 0.97;
    }

    #ia-client-dashboard .btn-primary {
      background: #101826;
      color: #fff;
      box-shadow: 0 14px 28px rgba(16, 24, 38, 0.18);
    }

    #ia-client-dashboard .btn-secondary {
      background: #fff;
      color: var(--ink);
      border: 1px solid var(--line);
    }

    #ia-client-dashboard .btn-csv {
      background: #28a745;
      color: #fff;
      box-shadow: 0 14px 28px rgba(40, 167, 69, 0.18);
    }

    #ia-client-dashboard .stats {
      margin-top: 18px;
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 16px;
    }

    #ia-client-dashboard .stat {
      background: var(--navy);
      color: #fff;
      border-radius: 28px;
      padding: 24px;
      box-shadow: 0 18px 50px rgba(36, 56, 79, 0.16);
      min-height: 165px;
    }

    #ia-client-dashboard .stat-label {
      font-size: 12px;
      line-height: 1.4;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      font-weight: 800;
      color: rgba(255,255,255,0.72);
      margin-bottom: 18px;
    }

    #ia-client-dashboard .stat-value {
      font-size: 64px;
      line-height: 0.95;
      font-weight: 900;
      letter-spacing: -0.06em;
      margin-bottom: 12px;
      word-break: break-word;
    }

    #ia-client-dashboard .stat-value.revenue {
      color: #63ff4c;
    }

    #ia-client-dashboard .stat-note {
      font-size: 14px;
      color: #bdd2e8;
      line-height: 1.5;
    }

    #ia-client-dashboard .main-grid {
      margin-top: 18px;
      display: grid;
      grid-template-columns: minmax(0, 1.42fr) minmax(320px, 0.78fr);
      gap: 18px;
      align-items: start;
    }

    #ia-client-dashboard .panel {
      background: var(--panel);
      border-radius: 28px;
      box-shadow: var(--shadow);
      border: 1px solid rgba(20, 32, 51, 0.05);
      padding: 24px;
    }

    #ia-client-dashboard .panel-title {
      font-size: 22px;
      line-height: 1.1;
      font-weight: 900;
      letter-spacing: -0.03em;
      margin-bottom: 6px;
      word-break: break-word;
    }

    #ia-client-dashboard .panel-sub {
      font-size: 14px;
      color: var(--muted);
      line-height: 1.5;
    }

    #ia-client-dashboard .chart-shell {
      margin-top: 18px;
      border-radius: 24px;
      background: linear-gradient(180deg, #263d56 0%, #22374e 100%);
      min-height: 420px;
      position: relative;
      overflow: hidden;
    }

    #ia-client-dashboard .chart-inner {
      position: relative;
      min-height: 420px;
      padding: 24px 20px 22px 22px;
    }

    #ia-client-dashboard .plot-wrap {
      position: relative;
    }

    #ia-client-dashboard .y-axis {
      position: absolute;
      left: 0;
      top: 8px;
      height: 260px;
      width: 56px;
      color: rgba(255,255,255,0.78);
      font-size: 12px;
      font-weight: 700;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      text-align: right;
      padding-right: 12px;
      z-index: 3;
      pointer-events: none;
    }

    #ia-client-dashboard .plot-area {
      position: relative;
      margin-left: 66px;
      margin-right: 8px;
      margin-top: 8px;
      height: 260px;
    }

    #ia-client-dashboard .chart-grid {
      position: absolute;
      inset: 0;
      display: grid;
      grid-template-rows: repeat(4, 1fr);
      pointer-events: none;
      z-index: 1;
    }

    #ia-client-dashboard .chart-grid div {
      border-top: 1px solid rgba(255,255,255,0.10);
    }

    #ia-client-dashboard .bars {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: flex-end;
      gap: 18px;
      z-index: 2;
    }

    #ia-client-dashboard .bar-wrap {
      flex: 1;
      min-width: 0;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      height: 100%;
    }

    #ia-client-dashboard .bar {
      width: 100%;
      max-width: 138px;
      background: linear-gradient(180deg, #f5f2ec 0%, #dfdbd4 100%);
      border-radius: 18px 18px 10px 10px;
      box-shadow:
        inset 0 0 0 1px rgba(255,255,255,0.18),
        0 12px 22px rgba(8, 18, 32, 0.18);
      transition: transform 0.2s ease, filter 0.2s ease, box-shadow 0.2s ease;
      cursor: pointer;
    }

    #ia-client-dashboard .bar:hover {
      transform: translateY(-4px);
      filter: brightness(1.03);
      box-shadow:
        inset 0 0 0 1px rgba(255,255,255,0.18),
        0 18px 30px rgba(8, 18, 32, 0.26);
    }

    #ia-client-dashboard .bar-tip {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      top: -34px;
      background: rgba(255,255,255,0.12);
      backdrop-filter: blur(6px);
      color: #fff;
      border: 1px solid rgba(255,255,255,0.16);
      border-radius: 10px;
      padding: 6px 10px;
      font-size: 12px;
      font-weight: 800;
      opacity: 0;
      transition: opacity 0.2s ease, top 0.2s ease;
      white-space: nowrap;
      pointer-events: none;
      z-index: 4;
    }

    #ia-client-dashboard .bar-wrap:hover .bar-tip {
      opacity: 1;
      top: -40px;
    }

    #ia-client-dashboard .x-labels {
      margin-left: 66px;
      margin-right: 8px;
      display: flex;
      gap: 18px;
      padding-top: 12px;
    }

    #ia-client-dashboard .x-label-wrap {
      flex: 1;
      min-width: 0;
      text-align: center;
    }

    #ia-client-dashboard .bar-label {
      color: rgba(255,255,255,0.88);
      font-size: 13px;
      font-weight: 700;
      line-height: 1.2;
      word-break: break-word;
    }

    #ia-client-dashboard .bar-sub {
      margin-top: 3px;
      color: rgba(255,255,255,0.62);
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.04em;
      line-height: 1.2;
      word-break: break-word;
    }

    #ia-client-dashboard .split-panel {
      display: grid;
      gap: 18px;
    }

    #ia-client-dashboard .donut-card {
      text-align: center;
    }

    #ia-client-dashboard .donut {
      width: 252px;
      height: 252px;
      border-radius: 50%;
      background: conic-gradient(#334b67 0 ${participation}%, #9db8d6 ${participation}% 100%);
      position: relative;
      box-shadow: inset 0 0 0 1px rgba(20,32,51,0.05);
      margin: 18px auto 10px;
      max-width: 100%;
    }

    #ia-client-dashboard .donut:before {
      content: "";
      position: absolute;
      inset: 54px;
      background: #fff;
      border-radius: 50%;
      box-shadow: 0 10px 24px rgba(20,32,51,0.08);
    }

    #ia-client-dashboard .donut-center {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2;
      font-size: 56px;
      font-weight: 900;
      letter-spacing: -0.06em;
      color: var(--ink);
    }

    #ia-client-dashboard .split-note {
      margin-top: 8px;
      font-size: 13px;
      color: var(--muted);
      line-height: 1.5;
    }

    #ia-client-dashboard .contact-card {
      display: grid;
      grid-template-columns: 96px 1fr;
      gap: 16px;
      align-items: center;
      background: var(--soft);
      border-radius: 24px;
      padding: 16px;
      margin-top: 18px;
    }

    #ia-client-dashboard .rep-photo {
      width: 96px;
      height: 96px;
      border-radius: 20px;
      background: #ddd;
      object-fit: cover;
      display: block;
      max-width: 100%;
    }

    #ia-client-dashboard .rep-name {
      font-size: 22px;
      font-weight: 900;
      letter-spacing: -0.03em;
      margin-bottom: 4px;
      word-break: break-word;
    }

    #ia-client-dashboard .rep-role {
      font-size: 14px;
      line-height: 1.5;
      color: var(--muted);
      font-weight: 700;
    }

    #ia-client-dashboard .contact-btn {
      background: #b8aca6;
      color: #fff;
    }

    #ia-client-dashboard .lower-grid {
      margin-top: 18px;
      display: grid;
      grid-template-columns: minmax(0, 1.28fr) minmax(320px, 0.82fr);
      gap: 18px;
      align-items: start;
    }

    #ia-client-dashboard table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 18px;
      overflow: hidden;
      border-radius: 22px;
      table-layout: fixed;
    }

    #ia-client-dashboard thead th {
      text-align: left;
      background: #f6f4ef;
      color: var(--muted);
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      font-weight: 800;
      padding: 16px 18px;
      border-bottom: 1px solid var(--line);
    }

    #ia-client-dashboard tbody td {
      padding: 16px 18px;
      border-bottom: 1px solid #eee7dc;
      font-size: 14px;
      color: #334155;
      word-break: break-word;
    }

    #ia-client-dashboard tbody tr:last-child td {
      border-bottom: none;
    }

    #ia-client-dashboard tbody td:first-child {
      font-weight: 800;
      color: var(--ink);
    }

    #ia-client-dashboard .pill {
      display: inline-block;
      border-radius: 999px;
      padding: 7px 10px;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-weight: 800;
    }

    #ia-client-dashboard .pill.green {
      background: #eaf8ef;
      color: #177245;
    }

    #ia-client-dashboard .pill.amber {
      background: #fff5dd;
      color: #8a6312;
    }

    #ia-client-dashboard .pill.gray {
      background: #eef1f4;
      color: #5d6b7c;
    }

    #ia-client-dashboard .activity-panel {
      background: #101826;
      color: #fff;
    }

    #ia-client-dashboard .activity-panel .panel-sub {
      color: rgba(255,255,255,0.62);
    }

    #ia-client-dashboard .activity-list {
      margin-top: 18px;
      display: grid;
      gap: 12px;
    }

    #ia-client-dashboard .activity-item {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 22px;
      padding: 16px;
      display: grid;
      grid-template-columns: 40px 1fr;
      gap: 14px;
      align-items: center;
    }

    #ia-client-dashboard .activity-num {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255,255,255,0.08);
      font-size: 14px;
      font-weight: 900;
      flex-shrink: 0;
    }

    #ia-client-dashboard .activity-title {
      font-size: 15px;
      font-weight: 800;
      margin-bottom: 4px;
      line-height: 1.3;
      word-break: break-word;
    }

    #ia-client-dashboard .activity-meta {
      font-size: 13px;
      color: rgba(255,255,255,0.62);
      line-height: 1.45;
      word-break: break-word;
    }

    #ia-client-dashboard .compliance {
      margin-top: 14px;
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 20px;
      padding: 14px 16px;
    }

    #ia-client-dashboard .compliance-title {
      color: #b9d1e8;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      font-weight: 800;
      margin-bottom: 8px;
    }

    #ia-client-dashboard .compliance p {
      font-size: 13px;
      line-height: 1.55;
      color: rgba(255,255,255,0.72);
      max-width: 900px;
    }

    @media (max-width: 1180px) {
      #ia-client-dashboard .hero,
      #ia-client-dashboard .main-grid,
      #ia-client-dashboard .lower-grid {
        grid-template-columns: 1fr;
      }

      #ia-client-dashboard .hero-actions,
      #ia-client-dashboard .stats {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (max-width: 760px) {
      #ia-client-dashboard {
        padding: 10px;
      }

      #ia-client-dashboard .wrap {
        max-width: 100%;
      }

      #ia-client-dashboard .hero,
      #ia-client-dashboard .main-grid,
      #ia-client-dashboard .lower-grid,
      #ia-client-dashboard .stats,
      #ia-client-dashboard .hero-actions,
      #ia-client-dashboard .split-panel,
      #ia-client-dashboard .contact-card {
        grid-template-columns: 1fr;
      }

      #ia-client-dashboard .hero,
      #ia-client-dashboard .panel,
      #ia-client-dashboard .stat {
        border-radius: 20px;
        padding: 18px;
      }

      #ia-client-dashboard .title {
        font-size: 34px;
        line-height: 0.96;
        letter-spacing: -0.04em;
        margin-bottom: 8px;
      }

      #ia-client-dashboard .subtitle {
        font-size: 14px;
        line-height: 1.45;
      }

      #ia-client-dashboard .eyebrow {
        font-size: 10px;
        padding: 7px 10px;
        margin-bottom: 12px;
      }

      #ia-client-dashboard .hero-actions {
        gap: 10px;
        margin-top: 4px;
      }

      #ia-client-dashboard .btn,
      #ia-client-dashboard .contact-btn {
        width: 100%;
        padding: 13px 14px;
        font-size: 14px;
        border-radius: 16px;
      }

      #ia-client-dashboard .stats {
        gap: 12px;
        margin-top: 14px;
      }

      #ia-client-dashboard .stat {
        min-height: auto;
      }

      #ia-client-dashboard .stat-label {
        font-size: 11px;
        margin-bottom: 12px;
      }

      #ia-client-dashboard .stat-value {
        font-size: 42px;
        margin-bottom: 8px;
      }

      #ia-client-dashboard .stat-note {
        font-size: 13px;
        line-height: 1.4;
      }

      #ia-client-dashboard .main-grid,
      #ia-client-dashboard .lower-grid {
        gap: 14px;
        margin-top: 14px;
      }

      #ia-client-dashboard .panel-title {
        font-size: 18px;
        line-height: 1.15;
      }

      #ia-client-dashboard .panel-sub {
        font-size: 13px;
        line-height: 1.45;
      }

      #ia-client-dashboard .chart-shell {
        min-height: 320px;
        border-radius: 20px;
        margin-top: 14px;
      }

      #ia-client-dashboard .chart-inner {
        min-height: 320px;
        padding: 16px 10px 16px 10px;
      }

      #ia-client-dashboard .y-axis {
        width: 34px;
        height: 175px;
        font-size: 10px;
        padding-right: 6px;
        top: 0;
      }

      #ia-client-dashboard .plot-area {
        margin-left: 40px;
        margin-right: 4px;
        margin-top: 0;
        height: 175px;
      }

      #ia-client-dashboard .bars {
        gap: 8px;
      }

      #ia-client-dashboard .bar {
        max-width: 100%;
        border-radius: 12px 12px 8px 8px;
      }

      #ia-client-dashboard .bar-tip {
        font-size: 10px;
        padding: 4px 7px;
        top: -28px;
      }

      #ia-client-dashboard .bar-wrap:hover .bar-tip {
        top: -32px;
      }

      #ia-client-dashboard .x-labels {
        margin-left: 40px;
        margin-right: 4px;
        gap: 8px;
        padding-top: 8px;
      }

      #ia-client-dashboard .bar-label {
        font-size: 10px;
      }

      #ia-client-dashboard .bar-sub {
        font-size: 9px;
        margin-top: 2px;
      }

      #ia-client-dashboard .donut {
        width: 190px;
        height: 190px;
        margin: 14px auto 8px;
      }

      #ia-client-dashboard .donut:before {
        inset: 40px;
      }

      #ia-client-dashboard .donut-center {
        font-size: 38px;
      }

      #ia-client-dashboard .split-note {
        font-size: 12px;
        line-height: 1.45;
      }

      #ia-client-dashboard .contact-card {
        text-align: center;
        gap: 12px;
      }

      #ia-client-dashboard .rep-photo {
        margin: 0 auto;
        width: 84px;
        height: 84px;
        border-radius: 18px;
      }

      #ia-client-dashboard .rep-name {
        font-size: 20px;
      }

      #ia-client-dashboard .rep-role {
        font-size: 13px;
      }

      #ia-client-dashboard table,
      #ia-client-dashboard thead,
      #ia-client-dashboard tbody,
      #ia-client-dashboard th,
      #ia-client-dashboard td,
      #ia-client-dashboard tr {
        display: block;
        width: 100%;
      }

      #ia-client-dashboard thead {
        display: none;
      }

      #ia-client-dashboard tbody tr {
        background: #f8f5ef;
        border: 1px solid var(--line);
        border-radius: 16px;
        padding: 12px;
        margin-bottom: 10px;
      }

      #ia-client-dashboard tbody td {
        border: none;
        padding: 6px 0;
        font-size: 13px;
        display: flex;
        justify-content: space-between;
        gap: 14px;
        align-items: center;
      }

      #ia-client-dashboard tbody td::before {
        font-weight: 800;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.08em;
        font-size: 10px;
        min-width: 78px;
        content: "";
      }

      #ia-client-dashboard tbody tr td:nth-child(1)::before { content: "Channel"; }
      #ia-client-dashboard tbody tr td:nth-child(2)::before { content: "Gross"; }
      #ia-client-dashboard tbody tr td:nth-child(3)::before { content: "Net"; }
      #ia-client-dashboard tbody tr td:nth-child(4)::before { content: "Audience"; }
      #ia-client-dashboard tbody tr td:nth-child(5)::before { content: "Status"; }

      #ia-client-dashboard .activity-list {
        gap: 10px;
        margin-top: 14px;
      }

      #ia-client-dashboard .activity-item {
        grid-template-columns: 34px 1fr;
        gap: 10px;
        padding: 12px;
        border-radius: 18px;
      }

      #ia-client-dashboard .activity-num {
        width: 34px;
        height: 34px;
        font-size: 12px;
      }

      #ia-client-dashboard .activity-title {
        font-size: 14px;
      }

      #ia-client-dashboard .activity-meta {
        font-size: 12px;
        line-height: 1.4;
      }

      #ia-client-dashboard .compliance {
        margin-top: 12px;
        padding: 12px 13px;
        border-radius: 16px;
      }

      #ia-client-dashboard .compliance-title {
        font-size: 10px;
        margin-bottom: 6px;
      }

      #ia-client-dashboard .compliance p {
        font-size: 12px;
        line-height: 1.45;
      }
    }
  </style>

  <div class="wrap">
    <div class="hero">
      <div>
        <div class="eyebrow">${escapeHtml(data.eyebrowText)}</div>
        <h1 class="title">${escapeHtml(data.clientName)}</h1>
        <p class="subtitle">Period: ${escapeHtml(data.period)}</p>
      </div>

      <div class="hero-actions">
        <a href="${escapeHtml(data.pdfUrl)}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">${escapeHtml(
    data.downloadButtonText
  )}</a>
        <button class="btn btn-csv" onclick="window.exportPortalData()">${escapeHtml(data.csvButtonText || "Export CSV")}</button>
      </div>
    </div>

    <div class="stats">
      <div class="stat">
        <div class="stat-label">${escapeHtml(data.stat1Label)}</div>
        <div class="stat-value revenue">${escapeHtml(data.stat1Prefix)}${escapeHtml(
    data.stat1Value
  )}${escapeHtml(data.stat1Suffix)}</div>
        <div class="stat-note">${escapeHtml(data.stat1Note)}</div>
      </div>

      <div class="stat">
        <div class="stat-label">${escapeHtml(data.stat2Label)}</div>
        <div class="stat-value">${escapeHtml(data.stat2Prefix)}${escapeHtml(data.stat2Value)}${escapeHtml(
    data.stat2Suffix
  )}</div>
        <div class="stat-note">${escapeHtml(data.stat2Note)}</div>
      </div>

      <div class="stat">
        <div class="stat-label">${escapeHtml(data.stat3Label)}</div>
        <div class="stat-value">${escapeHtml(data.stat3Prefix)}${escapeHtml(data.stat3Value)}${escapeHtml(
    data.stat3Suffix
  )}</div>
        <div class="stat-note">${escapeHtml(data.stat3Note)}</div>
      </div>

      <div class="stat">
        <div class="stat-label">${escapeHtml(data.stat4Label)}</div>
        <div class="stat-value">${escapeHtml(data.stat4Prefix)}${escapeHtml(data.stat4Value)}${escapeHtml(
    data.stat4Suffix
  )}</div>
        <div class="stat-note">${escapeHtml(data.stat4Note)}</div>
      </div>
    </div>

    <div class="main-grid">
      <div class="panel">
        <h2 class="panel-title">${escapeHtml(data.chartTitle)}</h2>
        <p class="panel-sub">${escapeHtml(data.chartSubtitle)}</p>

        <div class="chart-shell">
          <div class="chart-inner">
            <div class="plot-wrap">
              <div class="y-axis">
                <span>$${ticks[0].toLocaleString()}</span>
                <span>$${ticks[1].toLocaleString()}</span>
                <span>$${ticks[2].toLocaleString()}</span>
                <span>$${ticks[3].toLocaleString()}</span>
                <span>$0</span>
              </div>

              <div class="plot-area">
                <div class="chart-grid">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>

                <div class="bars">
                  ${bars
                    .map(
                      (b) => `
                    <div class="bar-wrap">
                      <div class="bar-tip">${escapeHtml(b.label)} · $${formatMoneyLikeInput(b.value)}</div>
                      <div class="bar" style="height:${b.percent}%"></div>
                    </div>`
                    )
                    .join("")}
                </div>
              </div>
            </div>

            <div class="x-labels">
              ${bars
                .map(
                  (b) => `
                <div class="x-label-wrap">
                  <div class="bar-label">${escapeHtml(b.label)}</div>
                  <div class="bar-sub">$${formatMoneyLikeInput(b.value)}</div>
                </div>`
                )
                .join("")}
            </div>
          </div>
        </div>
      </div>

      <div class="split-panel">
        <div class="panel donut-card">
          <h2 class="panel-title">${escapeHtml(data.donutTitle)}</h2>
          <p class="panel-sub">${escapeHtml(data.donutSubtitle)}</p>
          <div class="donut">
            <div class="donut-center">${participation}%</div>
          </div>
          <p class="split-note">${escapeHtml(data.donutNote)}</p>
        </div>

        <div class="panel">
          <h2 class="panel-title">${escapeHtml(data.contactTitle)}</h2>
          <p class="panel-sub">${escapeHtml(data.contactSubtitle)}</p>

          <div class="contact-card">
            <img class="rep-photo" src="${escapeHtml(data.repPhoto)}" alt="${escapeHtml(data.repName)}" />
            <div>
              <div class="rep-name">${escapeHtml(data.repName)}</div>
              <div class="rep-role">${escapeHtml(data.repRole)}</div>
            </div>
          </div>

          <a href="mailto:${escapeHtml(data.repEmail)}" class="contact-btn">${escapeHtml(
    data.contactButtonText
  )}</a>
        </div>
      </div>
    </div>

    <div class="lower-grid">
      <div class="panel">
        <h2 class="panel-title">${escapeHtml(data.tableTitle)}</h2>
        <p class="panel-sub">${escapeHtml(data.tableSubtitle)}</p>

        <table>
          <thead>
            <tr>
              <th>Channel</th>
              <th>Gross</th>
              <th>Net</th>
              <th>Audience</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>

      <div class="panel activity-panel">
        <h2 class="panel-title">${escapeHtml(data.recentTitle)}</h2>
        <p class="panel-sub">${escapeHtml(data.recentSubtitle)}</p>

        <div class="activity-list">
          ${activityHtml}
        </div>

        <div class="compliance">
          <div class="compliance-title">${escapeHtml(data.noticeTitle)}</div>
          <p>${escapeHtml(data.infoNotice)}</p>
        </div>
      </div>
    </div>
  </div>
</div>

<script>
  window.exportPortalData = function() {
    const data = {
      clientName: "${escapeHtml(data.clientName)}",
      period: "${escapeHtml(data.period)}",
      stat1Label: "${escapeHtml(data.stat1Label)}",
      stat1Value: "${escapeHtml(data.stat1Value)}",
      stat2Label: "${escapeHtml(data.stat2Label)}",
      stat2Value: "${escapeHtml(data.stat2Value)}",
      stat3Label: "${escapeHtml(data.stat3Label)}",
      stat3Value: "${escapeHtml(data.stat3Value)}",
      stat4Label: "${escapeHtml(data.stat4Label)}",
      stat4Value: "${escapeHtml(data.stat4Value)}",
      chartTitle: "${escapeHtml(data.chartTitle)}",
      m1Label: "${escapeHtml(data.m1Label)}",
      m1Value: "${escapeHtml(data.m1Value)}",
      m2Label: "${escapeHtml(data.m2Label)}",
      m2Value: "${escapeHtml(data.m2Value)}",
      m3Label: "${escapeHtml(data.m3Label)}",
      m3Value: "${escapeHtml(data.m3Value)}",
      m4Label: "${escapeHtml(data.m4Label)}",
      m4Value: "${escapeHtml(data.m4Value)}"
    };
    
    const csvContent = [
      "Client Portal Data Export",
      \`Client: \${data.clientName}\`,
      \`Period: \${data.period}\`,
      \`Generated: \${new Date().toLocaleString()}\`,
      "",
      "=== KEY METRICS ===",
      "Metric,Value",
      \`\${data.stat1Label},\${data.stat1Value}\`,
      \`\${data.stat2Label},\${data.stat2Value}\`,
      \`\${data.stat3Label},\${data.stat3Value}\`,
      \`\${data.stat4Label},\${data.stat4Value}\`,
      "",
      "=== MONTHLY REVENUE ===",
      "Month,Revenue",
      \`\${data.m1Label},\${data.m1Value}\`,
      \`\${data.m2Label},\${data.m2Value}\`,
      \`\${data.m3Label},\${data.m3Value}\`,
      \`\${data.m4Label},\${data.m4Value}\`
    ].join("\\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", \`\${data.clientName.replace(/[^a-zA-Z0-9]/g, "_")}_portal_data.csv\`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
</script>
</div>`;
}

function escapeCsvValue(value) {
  const stringValue = String(value ?? "");
  // Escape quotes by doubling them and wrap in quotes if contains comma, quote, or newline
  if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

function downloadCsv(csvContent, filename) {
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function exportChannelsToCsv(channels, clientName, period) {
  const headers = ["Platform", "Gross", "Net", "Audience", "Status"];
  const rows = channels.map(channel => [
    escapeCsvValue(channel.platform),
    escapeCsvValue(channel.gross),
    escapeCsvValue(channel.net),
    escapeCsvValue(channel.audience),
    escapeCsvValue(channel.status)
  ]);
  
  const csvContent = [
    `Channel Earnings Report - ${escapeCsvValue(clientName)}`,
    `Period: ${escapeCsvValue(period)}`,
    `Generated: ${new Date().toLocaleString()}`,
    "",
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n");
  
  const filename = `${clientName.replace(/[^a-zA-Z0-9]/g, "_")}_channels_${period.replace(/[^a-zA-Z0-9]/g, "_")}.csv`;
  downloadCsv(csvContent, filename);
}

function exportActivityToCsv(activity, clientName, period) {
  const headers = ["Number", "Title", "Meta"];
  const rows = activity.map(item => [
    escapeCsvValue(item.number),
    escapeCsvValue(item.title),
    escapeCsvValue(item.meta)
  ]);
  
  const csvContent = [
    `Recent Activity Report - ${escapeCsvValue(clientName)}`,
    `Period: ${escapeCsvValue(period)}`,
    `Generated: ${new Date().toLocaleString()}`,
    "",
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n");
  
  const filename = `${clientName.replace(/[^a-zA-Z0-9]/g, "_")}_activity_${period.replace(/[^a-zA-Z0-9]/g, "_")}.csv`;
  downloadCsv(csvContent, filename);
}

function exportAllDataToCsv(data, channels, activity) {
  const csvContent = [
    `Complete Portal Data Export - ${escapeCsvValue(data.clientName)}`,
    `Period: ${escapeCsvValue(data.period)}`,
    `Generated: ${new Date().toLocaleString()}`,
    "",
    "=== PORTAL METRICS ===",
    "Metric,Value",
    `Client Name,${escapeCsvValue(data.clientName)}`,
    `Period,${escapeCsvValue(data.period)}`,
    `PDF URL,${escapeCsvValue(data.pdfUrl)}`,
    "",
    `=== TOP METRICS ===`,
    `${escapeCsvValue(data.stat1Label)},${escapeCsvValue(data.stat1Prefix + data.stat1Value + data.stat1Suffix)}`,
    `${escapeCsvValue(data.stat2Label)},${escapeCsvValue(data.stat2Prefix + data.stat2Value + data.stat2Suffix)}`,
    `${escapeCsvValue(data.stat3Label)},${escapeCsvValue(data.stat3Prefix + data.stat3Value + data.stat3Suffix)}`,
    `${escapeCsvValue(data.stat4Label)},${escapeCsvValue(data.stat4Prefix + data.stat4Value + data.stat4Suffix)}`,
    "",
    "=== CHANNEL EARNINGS ===",
    "Platform,Gross,Net,Audience,Status",
    ...channels.map(channel => [
      escapeCsvValue(channel.platform),
      escapeCsvValue(channel.gross),
      escapeCsvValue(channel.net),
      escapeCsvValue(channel.audience),
      escapeCsvValue(channel.status)
    ].join(",")),
    "",
    "=== RECENT ACTIVITY ===",
    "Number,Title,Meta",
    ...activity.map(item => [
      escapeCsvValue(item.number),
      escapeCsvValue(item.title),
      escapeCsvValue(item.meta)
    ].join(",")),
    "",
    "=== REPRESENTATIVE INFO ===",
    "Field,Value",
    `Name,${escapeCsvValue(data.repName)}`,
    `Role,${escapeCsvValue(data.repRole)}`,
    `Email,${escapeCsvValue(data.repEmail)}`,
    `Participation %,${escapeCsvValue(data.participationPercent)}`
  ].join("\n");
  
  const filename = `${data.clientName.replace(/[^a-zA-Z0-9]/g, "_")}_complete_export_${new Date().toISOString().split('T')[0]}.csv`;
  downloadCsv(csvContent, filename);
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <div style={{ marginBottom: 14, display: "flex", flexDirection: "column" }}>
      <div style={{ 
        fontSize: 11, 
        color: "#93a0ba", 
        fontWeight: 700, 
        marginBottom: 6,
        minHeight: 16,
        display: "flex",
        alignItems: "center"
      }}>{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          background: "#090d16",
          color: "white",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12,
          padding: "12px 14px",
          outline: "none",
          fontSize: 13,
          lineHeight: 1.4,
          boxSizing: "border-box",
          minHeight: 44
        }}
      />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section
      style={{
        background: "#111624",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 18,
        padding: 18,
        marginBottom: 18
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: 14, fontSize: 18 }}>{title}</h3>
      {children}
    </section>
  );
}

export default function App() {
  const [showSpin, setShowSpin] = useState(window.location.pathname === '/spin');
  
  // Simple routing without react-router-dom
  React.useEffect(() => {
    const handlePopState = () => {
      setShowSpin(window.location.pathname === '/spin');
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (showSpin) {
    return <Spin />;
  }

  return <InArtistsMasterHub />;
}

function InArtistsMasterHub() {
  const [data, setData] = useState(defaultData);
  const [channels, setChannels] = useState(defaultChannels);
  const [activity, setActivity] = useState(defaultActivity);

  const compiled = useMemo(() => compileEmbed(data, channels, activity), [data, channels, activity]);

  function update(key, value) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function updateChannel(index, key, value) {
    setChannels((prev) => prev.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
  }

  function addChannel() {
    setChannels((prev) => [
      ...prev,
      { platform: "Youtube", gross: "0", net: "0", audience: "0", status: "CURRENT" }
    ]);
  }

  function removeChannel(index) {
    setChannels((prev) => prev.filter((_, i) => i !== index));
  }

  function updateActivity(index, key, value) {
    setActivity((prev) => prev.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
  }

  function addActivity() {
    setActivity((prev) => [
      ...prev,
      { number: String(prev.length + 1), title: "New activity item", meta: "Add activity detail here." }
    ]);
  }

  function removeActivity(index) {
    setActivity((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "280px 1.15fr 1fr",
        minHeight: "100vh",
        background: "#06080f",
        color: "white",
        fontFamily: "Inter, Arial, sans-serif"
      }}
    >
      <aside style={{ padding: 24, borderRight: "1px solid rgba(255,255,255,0.08)", background: "#090d16" }}>
        <div style={{ color: "#8b5cf6", fontSize: 12, fontWeight: 900, letterSpacing: "0.18em", marginBottom: 10 }}>
          Powered by iA
        </div>
        <div style={{ fontSize: 34, fontWeight: 900, marginBottom: 18 }}>inArtists.co</div>
        <div
          style={{
            background: "linear-gradient(135deg,#8b5cf6,#6d5dfc)",
            padding: 14,
            borderRadius: 14,
            fontWeight: 800
          }}
        >
          Pay Portal Generator
        </div>
        <div style={{ marginTop: 18, color: "rgba(255,255,255,0.68)", lineHeight: 1.6 }}>
          Manage inputs here. The portal preview and embed code update instantly. Live preview panel below.
        </div>
        
        <div style={{ marginTop: 24 }}>
          <button
            onClick={() => exportAllDataToCsv(data, channels, activity)}
            style={{
              width: "100%",
              border: "1px solid #10b981",
              background: "transparent",
              color: "#10b981",
              borderRadius: 12,
              padding: "12px 14px",
              fontWeight: 800,
              cursor: "pointer",
              fontSize: 12,
              transition: "all 0.2s ease"
            }}
            onMouseOver={(e) => {
              e.target.style.background = "#10b981";
              e.target.style.color = "#090d16";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "transparent";
              e.target.style.color = "#10b981";
            }}
          >
            Export All Data (CSV)
          </button>
        </div>
      </aside>

      <main style={{ padding: 24, overflowY: "auto", borderRight: "1px solid rgba(255,255,255,0.08)" }}>
        <h1 style={{ marginTop: 0, fontSize: 42, marginBottom: 18 }}>Statement Data</h1>

        <Section title="Branding & Hero">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, alignItems: "start" }}>
            <Field label="Eyebrow Text" value={data.eyebrowText} onChange={(v) => update("eyebrowText", v)} />
            <Field label="Client Name" value={data.clientName} onChange={(v) => update("clientName", v)} />
            <Field label="Period" value={data.period} onChange={(v) => update("period", v)} />
            <Field label="PDF URL" value={data.pdfUrl} onChange={(v) => update("pdfUrl", v)} />
            <Field label="Download Button Text" value={data.downloadButtonText} onChange={(v) => update("downloadButtonText", v)} />
            <Field label="Email Button Text" value={data.emailButtonText} onChange={(v) => update("emailButtonText", v)} />
            <Field label="CSV Button Text" value={data.csvButtonText || "Export CSV"} onChange={(v) => update("csvButtonText", v)} />
          </div>
        </Section>

        <Section title="Top Metric Cards">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, alignItems: "start" }}>
            <Field label="Card 1 Label" value={data.stat1Label} onChange={(v) => update("stat1Label", v)} />
            <Field label="Card 1 Value" value={data.stat1Value} onChange={(v) => update("stat1Value", v)} />
            <Field label="Card 1 Prefix" value={data.stat1Prefix} onChange={(v) => update("stat1Prefix", v)} />
            <Field label="Card 1 Suffix" value={data.stat1Suffix} onChange={(v) => update("stat1Suffix", v)} />
            <Field label="Card 1 Note" value={data.stat1Note} onChange={(v) => update("stat1Note", v)} />

            <Field label="Card 2 Label" value={data.stat2Label} onChange={(v) => update("stat2Label", v)} />
            <Field label="Card 2 Value" value={data.stat2Value} onChange={(v) => update("stat2Value", v)} />
            <Field label="Card 2 Prefix" value={data.stat2Prefix} onChange={(v) => update("stat2Prefix", v)} />
            <Field label="Card 2 Suffix" value={data.stat2Suffix} onChange={(v) => update("stat2Suffix", v)} />
            <Field label="Card 2 Note" value={data.stat2Note} onChange={(v) => update("stat2Note", v)} />

            <Field label="Card 3 Label" value={data.stat3Label} onChange={(v) => update("stat3Label", v)} />
            <Field label="Card 3 Value" value={data.stat3Value} onChange={(v) => update("stat3Value", v)} />
            <Field label="Card 3 Prefix" value={data.stat3Prefix} onChange={(v) => update("stat3Prefix", v)} />
            <Field label="Card 3 Suffix" value={data.stat3Suffix} onChange={(v) => update("stat3Suffix", v)} />
            <Field label="Card 3 Note" value={data.stat3Note} onChange={(v) => update("stat3Note", v)} />

            <Field label="Card 4 Label" value={data.stat4Label} onChange={(v) => update("stat4Label", v)} />
            <Field label="Card 4 Value" value={data.stat4Value} onChange={(v) => update("stat4Value", v)} />
            <Field label="Card 4 Prefix" value={data.stat4Prefix} onChange={(v) => update("stat4Prefix", v)} />
            <Field label="Card 4 Suffix" value={data.stat4Suffix} onChange={(v) => update("stat4Suffix", v)} />
            <Field label="Card 4 Note" value={data.stat4Note} onChange={(v) => update("stat4Note", v)} />
          </div>
        </Section>

        <Section title="Quadrimester Chart">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Chart Title" value={data.chartTitle} onChange={(v) => update("chartTitle", v)} />
            <Field label="Chart Subtitle" value={data.chartSubtitle} onChange={(v) => update("chartSubtitle", v)} />

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: "#93a0ba", fontWeight: 700, marginBottom: 6 }}>Chart Max Mode</div>
              <select
                value={data.chartMaxMode}
                onChange={(e) => update("chartMaxMode", e.target.value)}
                style={{
                  width: "100%",
                  background: "#090d16",
                  color: "white",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 12,
                  padding: "12px 14px",
                  outline: "none"
                }}
              >
                <option value="manual">Manual</option>
                <option value="auto">Auto</option>
              </select>
            </div>

            <Field label="Chart Max" value={data.chartMax} onChange={(v) => update("chartMax", v)} />

            <Field label="Month 1 Label" value={data.m1Label} onChange={(v) => update("m1Label", v)} />
            <Field label="Month 1 Value" value={data.m1Value} onChange={(v) => update("m1Value", v)} />
            <Field label="Month 2 Label" value={data.m2Label} onChange={(v) => update("m2Label", v)} />
            <Field label="Month 2 Value" value={data.m2Value} onChange={(v) => update("m2Value", v)} />
            <Field label="Month 3 Label" value={data.m3Label} onChange={(v) => update("m3Label", v)} />
            <Field label="Month 3 Value" value={data.m3Value} onChange={(v) => update("m3Value", v)} />
            <Field label="Month 4 Label" value={data.m4Label} onChange={(v) => update("m4Label", v)} />
            <Field label="Month 4 Value" value={data.m4Value} onChange={(v) => update("m4Value", v)} />
          </div>
        </Section>

        <Section title="Participation Donut & Contact Card">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Donut Title" value={data.donutTitle} onChange={(v) => update("donutTitle", v)} />
            <Field label="Donut Subtitle" value={data.donutSubtitle} onChange={(v) => update("donutSubtitle", v)} />
            <Field
              label="Participation Percent"
              value={data.participationPercent}
              onChange={(v) => {
                update("participationPercent", v);
                update("stat4Value", v);
              }}
            />
            <Field label="Donut Note" value={data.donutNote} onChange={(v) => update("donutNote", v)} />
            <Field label="Contact Title" value={data.contactTitle} onChange={(v) => update("contactTitle", v)} />
            <Field label="Contact Subtitle" value={data.contactSubtitle} onChange={(v) => update("contactSubtitle", v)} />
            <Field label="Rep Name" value={data.repName} onChange={(v) => update("repName", v)} />
            <Field label="Rep Role" value={data.repRole} onChange={(v) => update("repRole", v)} />
            <Field label="Rep Email" value={data.repEmail} onChange={(v) => update("repEmail", v)} />
            <Field label="Rep Photo URL" value={data.repPhoto} onChange={(v) => update("repPhoto", v)} />
            <Field label="Contact Button Text" value={data.contactButtonText} onChange={(v) => update("contactButtonText", v)} />
          </div>
        </Section>

        <Section title="Table Labels">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Table Title" value={data.tableTitle} onChange={(v) => update("tableTitle", v)} />
            <Field label="Table Subtitle" value={data.tableSubtitle} onChange={(v) => update("tableSubtitle", v)} />
          </div>
        </Section>

       <Section title="Channel Rows">
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1.1fr 1fr 1fr 1fr 1fr auto",
        gap: 12,
        fontSize: 11,
        color: "#93a0ba",
        fontWeight: 800,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        paddingBottom: 6,
        textAlign: "center"
      }}
    >
      <div>Platform</div>
      <div>Gross</div>
      <div>Net</div>
      <div>Audience</div>
      <div>Status</div>
      <div></div>
    </div>
  </div>

  {channels.map((row, index) => (
    <div
      key={index}
      style={{
        display: "grid",
        gridTemplateColumns: "1.1fr 1fr 1fr 1fr 1fr auto",
        gap: 12,
        marginBottom: 10
      }}
    >
      <select
        value={row.platform}
        onChange={(e) => updateChannel(index, "platform", e.target.value)}
        style={{
          width: "100%",
          background: "#090d16",
          color: "white",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12,
          padding: "12px 14px",
          outline: "none"
        }}
      >
        {PLATFORM_OPTIONS.map((p) => (
          <option key={p}>{p}</option>
        ))}
      </select>

      <input
        value={row.gross}
        onChange={(e) => updateChannel(index, "gross", e.target.value)}
        placeholder="Gross"
        style={rowStyle}
      />
      <input
        value={row.net}
        onChange={(e) => updateChannel(index, "net", e.target.value)}
        placeholder="Net"
        style={rowStyle}
      />
      <input
        value={row.audience}
        onChange={(e) => updateChannel(index, "audience", e.target.value)}
        placeholder="Audience"
        style={rowStyle}
      />

      <select
        value={row.status}
        onChange={(e) => updateChannel(index, "status", e.target.value)}
        style={rowStyle}
      >
        <option>CURRENT</option>
        <option>PENDING</option>
        <option>IN REVIEW</option>
      </select>

      <button
        onClick={() => removeChannel(index)}
        style={{
          border: "none",
          background: "#7f1d1d",
          color: "white",
          borderRadius: 10,
          padding: "0 14px",
          cursor: "pointer"
        }}
      >
        X
      </button>
    </div>
  ))}

  <button
    onClick={addChannel}
    style={{
      marginTop: 8,
      border: "1px dashed #8b5cf6",
      background: "transparent",
      color: "#8b5cf6",
      borderRadius: 12,
      padding: "12px 14px",
      fontWeight: 800,
      cursor: "pointer"
    }}
  >
    + Add Channel
  </button>
</Section>

        <Section title="Recent Activity Panel">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Recent Title" value={data.recentTitle} onChange={(v) => update("recentTitle", v)} />
            <Field label="Recent Subtitle" value={data.recentSubtitle} onChange={(v) => update("recentSubtitle", v)} />
          </div>

          {activity.map((row, index) => (
            <div
              key={index}
              style={{
                display: "grid",
                gridTemplateColumns: "60px 1fr 1.2fr auto",
                gap: 12,
                marginTop: 10
              }}
            >
              <input value={row.number} onChange={(e) => updateActivity(index, "number", e.target.value)} placeholder="#" style={rowStyle} />
              <input value={row.title} onChange={(e) => updateActivity(index, "title", e.target.value)} placeholder="Title" style={rowStyle} />
              <input value={row.meta} onChange={(e) => updateActivity(index, "meta", e.target.value)} placeholder="Meta" style={rowStyle} />
              <button
                onClick={() => removeActivity(index)}
                style={{
                  border: "none",
                  background: "#7f1d1d",
                  color: "white",
                  borderRadius: 10,
                  padding: "0 14px",
                  cursor: "pointer"
                }}
              >
                X
              </button>
            </div>
          ))}

          <button
            onClick={addActivity}
            style={{
              marginTop: 12,
              border: "1px dashed #8b5cf6",
              background: "transparent",
              color: "#8b5cf6",
              borderRadius: 12,
              padding: "12px 14px",
              fontWeight: 800,
              cursor: "pointer"
            }}
          >
            + Add Activity
          </button>
        </Section>

        <Section title="Informational Notice">
          <Field label="Notice Title" value={data.noticeTitle} onChange={(v) => update("noticeTitle", v)} />
          <textarea
            value={data.infoNotice}
            onChange={(e) => update("infoNotice", e.target.value)}
            style={{
              width: "100%",
              minHeight: 120,
              background: "#090d16",
              color: "white",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 12,
              padding: 14,
              outline: "none",
              resize: "vertical"
            }}
          />
        </Section>
      </main>

      <section style={{ padding: 24, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h2 style={{ margin: 0 }}>Embed Code (Click to Copy)</h2>
        </div>

        <textarea
          readOnly
          value={compiled}
          onClick={(e) => e.target.select()}
          style={{
            flex: 1,
            width: "100%",
            background: "#060b14",
            color: "#67ff9a",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 16,
            padding: 16,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: 11,
            lineHeight: 1.6,
            resize: "none",
            outline: "none",
            cursor: "text"
          }}
        />
      </section>
      
      <section style={{ padding: 44, borderLeft: "1px solid rgba(255,255,255,0.08)" }}>
        <h2 style={{ margin: 0, marginBottom: 14 }}>Live Preview</h2>
        <div style={{
          background: "#ffffff",
          border: "1px solid #e6e0d7",
          borderRadius: 8,
          padding: 8,
          minHeight: 400
        }}>
          <iframe
            srcDoc={compiled}
            style={{
              width: "750%",
              height: "300%",
              minHeight: 600,
              border: "none",
              borderRadius: 4
            }}
            title="Client Portal Preview"
          />
        </div>
      </section>
    </div>
  );
}

const rowStyle = {
  width: "100%",
  background: "#090d16",
  color: "white",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 12,
  padding: "12px 14px",
  outline: "none",
  fontSize: 13,
  lineHeight: 1.4,
  boxSizing: "border-box",
  minHeight: 44
};