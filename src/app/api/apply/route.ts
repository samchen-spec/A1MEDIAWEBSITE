import { NextResponse } from "next/server";

// Replace with real Google Apps Script URL
const GOOGLE_SHEETS_URL = "https://script.google.com/a/macros/a1media.info/s/AKfycbxeFd_hlBlES7tuxeRak8mSQZ7m0MQ2ykiVMFCCkSZxCf2P40ZbR-DYo6XPuJBrNyuuSw/exec";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Log to console as backup
    console.log("═══════════════════════════════════════");
    console.log("NEW APPLICATION RECEIVED");
    console.log("═══════════════════════════════════════");
    console.log(JSON.stringify(data, null, 2));
    console.log("═══════════════════════════════════════");

    // POST to Google Sheets via Apps Script
    await fetch(GOOGLE_SHEETS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Application submission error:", error);
    return NextResponse.json({ error: "Failed to process application" }, { status: 500 });
  }
}
