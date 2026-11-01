import { binaryToHexHash } from "@/lib/crypto/dhash-utils";

export interface CompressedClientImage {
  base64DataUrl: string; // data:image/jpeg;base64,...
  base64Raw: string; // base64 payload without prefix
  mimeType: "image/jpeg";
  originalSizeBytes: number;
  compressedSizeBytes: number;
  width: number;
  height: number;
  clientDhashBinary: string;
  clientDhashHex: string;
  clientLuminance9x8: number[][];
}

export interface SyntheticToLetPreset {
  title: string;
  titleBn: string;
  rentText: string;
  advanceText: string;
  phoneText: string;
  badgeText: string;
  isScamStyle?: boolean;
}

/**
 * Compresses an image client-side to <= maxDimension and quality 0.82.
 * Simultaneously samples a 9x8 offscreen canvas to compute the 64-bit dHash in browser.
 * Protects Vercel serverless functions against 4.5 MB payload limits.
 */
export async function compressAndHashImageOnClient(
  file: File,
  maxDimension = 1400,
  quality = 0.82
): Promise<CompressedClientImage> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      try {
        URL.revokeObjectURL(objectUrl);

        // 1. Calculate downscaled dimensions preserving aspect ratio
        let targetWidth = img.naturalWidth || img.width;
        let targetHeight = img.naturalHeight || img.height;

        if (targetWidth > maxDimension || targetHeight > maxDimension) {
          if (targetWidth > targetHeight) {
            targetHeight = Math.round((targetHeight * maxDimension) / targetWidth);
            targetWidth = maxDimension;
          } else {
            targetWidth = Math.round((targetWidth * maxDimension) / targetHeight);
            targetHeight = maxDimension;
          }
        }

        // 2. High quality downscale canvas
        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });

        if (!ctx) {
          throw new Error("Unable to obtain 2D rendering context for image compression");
        }

        // Clean background for transparent PNGs
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, targetWidth, targetHeight);
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        const base64DataUrl = canvas.toDataURL("image/jpeg", quality);
        const base64Raw = base64DataUrl.replace(/^data:image\/[a-z]+;base64,/, "");
        const compressedSizeBytes = Math.round((base64Raw.length * 3) / 4);

        // 3. 9x8 Grayscale Canvas for Client dHash
        const dhashCanvas = document.createElement("canvas");
        dhashCanvas.width = 9;
        dhashCanvas.height = 8;
        const dhashCtx = dhashCanvas.getContext("2d", { willReadFrequently: true });

        if (!dhashCtx) {
          throw new Error("Unable to obtain 9x8 canvas context for dHash calculation");
        }

        dhashCtx.drawImage(img, 0, 0, 9, 8);
        const imgData = dhashCtx.getImageData(0, 0, 9, 8).data;

        // Convert RGBA to BT.601 Grayscale: 0.299*R + 0.587*G + 0.114*B
        const clientLuminance9x8: number[][] = [];
        const rawGrayscale: number[] = [];

        for (let row = 0; row < 8; row++) {
          const rowValues: number[] = [];
          for (let col = 0; col < 9; col++) {
            const idx = (row * 9 + col) * 4;
            const r = imgData[idx];
            const g = imgData[idx + 1];
            const b = imgData[idx + 2];
            const gray = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
            rowValues.push(gray);
            rawGrayscale.push(gray);
          }
          clientLuminance9x8.push(rowValues);
        }

        // Compute 64-bit horizontal difference hash: left < right -> '1', else '0'
        let clientDhashBinary = "";
        for (let row = 0; row < 8; row++) {
          for (let col = 0; col < 8; col++) {
            const left = rawGrayscale[row * 9 + col];
            const right = rawGrayscale[row * 9 + col + 1];
            clientDhashBinary += left < right ? "1" : "0";
          }
        }

        const clientDhashHex = binaryToHexHash(clientDhashBinary);

        resolve({
          base64DataUrl,
          base64Raw,
          mimeType: "image/jpeg",
          originalSizeBytes: file.size,
          compressedSizeBytes,
          width: targetWidth,
          height: targetHeight,
          clientDhashBinary,
          clientDhashHex,
          clientLuminance9x8,
        });
      } catch (err) {
        URL.revokeObjectURL(objectUrl);
        reject(err);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image file into browser canvas"));
    };

    img.src = objectUrl;
  });
}

/**
 * Generates an authentic Bangladesh Facebook "TO-LET / বাসা ভাড়া হবে" advertisement
 * graphic + floor composite (800x1000) on an HTML5 canvas.
 * Allows judges and users to test real image uploads and Gemini Multimodal OCR with 1-click.
 */
export function renderSyntheticToLetPosterDataUrl(preset: SyntheticToLetPreset): string {
  if (typeof window === "undefined" || typeof document === "undefined") {
    // SSR fallback: 1x1 transparent JPEG
    return "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=";
  }

  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 1000;
  const ctx = canvas.getContext("2d");

  if (!ctx) return "";

  // 1. Warm Paper Newsprint Background
  ctx.fillStyle = preset.isScamStyle ? "#FFF5F5" : "#F7F6F2";
  ctx.fillRect(0, 0, 800, 1000);

  // Outer 4px Civic Frame
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#0A0A0A";
  ctx.strokeRect(8, 8, 784, 984);

  // 2. Header Banner
  const headerBg = preset.isScamStyle ? "#DC2626" : "#0A0A0A";
  ctx.fillStyle = headerBg;
  ctx.fillRect(12, 12, 776, 120);

  // Header Sub-pill
  ctx.fillStyle = preset.isScamStyle ? "#0A0A0A" : "#FACC15";
  ctx.fillRect(30, 24, 260, 26);
  ctx.fillStyle = preset.isScamStyle ? "#FFFFFF" : "#0A0A0A";
  ctx.font = "bold 13px 'JetBrains Mono', monospace";
  ctx.fillText(preset.badgeText.toUpperCase(), 40, 42);

  // Main Header Text (Bangla / English)
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 38px 'Hind Siliguri', 'Space Grotesk', sans-serif";
  ctx.fillText(preset.isScamStyle ? "জরুরি টু-লেট // URGENT TO-LET" : "টু-লেট // FLAT TO-LET", 30, 95);

  // Date Watermark
  ctx.font = "bold 13px 'JetBrains Mono', monospace";
  ctx.fillStyle = preset.isScamStyle ? "#FACC15" : "#A1A1AA";
  ctx.fillText("BANGLADESH HOUSING SPECIMEN // DHAKA • SYLHET", 430, 42);

  // 3. Simulated Realistic Interior Photo / Architectural Blueprint Block
  ctx.fillStyle = "#E4E2DD";
  ctx.fillRect(30, 150, 740, 360);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#0A0A0A";
  ctx.strokeRect(30, 150, 740, 360);

  // Interior Blueprint Graphics (Simulated Living Room & Balcony)
  // Wall & Window Outline
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(60, 180, 680, 300);
  ctx.strokeRect(60, 180, 680, 300);

  // Simulated Large Sunlight Window with Glass Panes
  ctx.fillStyle = preset.isScamStyle ? "#FEF08A" : "#E0F2FE";
  ctx.fillRect(100, 200, 240, 180);
  ctx.strokeRect(100, 200, 240, 180);
  // Window grid lines
  ctx.beginPath();
  ctx.moveTo(220, 200);
  ctx.lineTo(220, 380);
  ctx.moveTo(100, 290);
  ctx.lineTo(340, 290);
  ctx.strokeStyle = "#0A0A0A";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Simulated Wooden Flooring perspective lines
  ctx.strokeStyle = "#D4D4D8";
  ctx.lineWidth = 1.5;
  for (let i = 60; i <= 740; i += 45) {
    ctx.beginPath();
    ctx.moveTo(i, 380);
    ctx.lineTo(i - 40, 480);
    ctx.stroke();
  }

  // Simulated Sofa / Interior Furniture block
  ctx.fillStyle = "#1E293B";
  ctx.fillRect(400, 270, 280, 130);
  ctx.strokeRect(400, 270, 280, 130);
  ctx.fillStyle = "#334155";
  ctx.fillRect(420, 250, 240, 35);
  ctx.strokeRect(420, 250, 240, 35);

  // Stamp in photo corner
  ctx.fillStyle = "#0A0A0A";
  ctx.fillRect(50, 435, 290, 30);
  ctx.fillStyle = "#FACC15";
  ctx.font = "bold 12px 'JetBrains Mono', monospace";
  ctx.fillText("ARCHITECTURAL INTERIOR SPECIMEN", 60, 455);

  // 4. Listing Titles
  ctx.fillStyle = "#0A0A0A";
  ctx.font = "bold 28px 'Space Grotesk', 'Plus Jakarta Sans', sans-serif";
  ctx.fillText(preset.title, 30, 545);

  ctx.fillStyle = "#4B5563";
  ctx.font = "500 20px 'Hind Siliguri', sans-serif";
  ctx.fillText(preset.titleBn, 30, 578);

  // Horizontal divider
  ctx.strokeStyle = "#0A0A0A";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(30, 595);
  ctx.lineTo(770, 595);
  ctx.stroke();

  // 5. Price & Financial Terms Callout Box
  const priceBoxBg = preset.isScamStyle ? "#FEE2E2" : "#FFFFFF";
  ctx.fillStyle = priceBoxBg;
  ctx.fillRect(30, 610, 740, 130);
  ctx.lineWidth = 2;
  ctx.strokeStyle = preset.isScamStyle ? "#DC2626" : "#0A0A0A";
  ctx.strokeRect(30, 610, 740, 130);

  // Price Label
  ctx.fillStyle = "#52525B";
  ctx.font = "bold 13px 'JetBrains Mono', monospace";
  ctx.fillText("MONTHLY RENT // মাসিক ভাড়া", 50, 638);

  // Price Amount
  ctx.fillStyle = preset.isScamStyle ? "#DC2626" : "#0A0A0A";
  ctx.font = "bold 44px 'JetBrains Mono', monospace";
  ctx.fillText(preset.rentText, 50, 685);

  // Advance Deposit & Caution
  ctx.fillStyle = "#0A0A0A";
  ctx.font = "bold 18px 'Hind Siliguri', sans-serif";
  ctx.fillText(preset.advanceText, 50, 718);

  if (preset.isScamStyle) {
    ctx.fillStyle = "#DC2626";
    ctx.font = "bold 14px 'JetBrains Mono', monospace";
    ctx.fillText("⚠ DEMANDS IMMEDIATE BKASH ADVANCE BEFORE PROPERTY INSPECTION", 200, 642);
  }

  // 6. Architectural Specification Matrix
  const specs = [
    { label: "BEDROOMS", val: "3 Bed (Master Bed + Balcony)" },
    { label: "BATHROOMS", val: "3 Baths (2 Attached, 1 Common)" },
    { label: "FLOOR AREA", val: "1,550 Sq Ft // 4th Floor (Lift 2)" },
    { label: "UTILITIES", val: "Prepaid Electric Meter + Gas Line" },
  ];

  specs.forEach((s, idx) => {
    const x = 30 + (idx % 2) * 380;
    const y = 760 + Math.floor(idx / 2) * 55;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(x, y, 360, 46);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "#0A0A0A";
    ctx.strokeRect(x, y, 360, 46);

    ctx.fillStyle = "#52525B";
    ctx.font = "bold 10px 'JetBrains Mono', monospace";
    ctx.fillText(s.label, x + 12, y + 17);

    ctx.fillStyle = "#0A0A0A";
    ctx.font = "bold 13px 'Hind Siliguri', 'Space Grotesk', sans-serif";
    ctx.fillText(s.val, x + 12, y + 36);
  });

  // 7. Contact Banner at bottom
  ctx.fillStyle = "#0A0A0A";
  ctx.fillRect(30, 890, 740, 75);

  ctx.fillStyle = "#FACC15";
  ctx.font = "bold 12px 'JetBrains Mono', monospace";
  ctx.fillText("DIRECT OWNER CONTACT // সরাসরি মালিকের যোগাযোগ:", 50, 915);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 26px 'JetBrains Mono', monospace";
  ctx.fillText(preset.phoneText, 50, 948);

  // Watermark stamp
  ctx.fillStyle = "#FACC15";
  ctx.font = "bold 12px 'JetBrains Mono', monospace";
  ctx.fillText("RENTRADAR FORENSIC SPECIMEN", 520, 948);

  return canvas.toDataURL("image/jpeg", 0.88);
}

/**
 * Converts a base64 data URL into a standard browser File object for testing uploads.
 */
export function dataUrlToFile(dataUrl: string, filename = "synthetic-to-let-ad.jpg"): File {
  const arr = dataUrl.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}
