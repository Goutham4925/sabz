import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    let settings = await prisma.siteSetting.findFirst();
    if (!settings) {
      settings = await prisma.siteSetting.create({
        data: {
          hero_title: "Crafted with Tradition. Baked with Love.",
          hero_subtitle: "Premium biscuits made with the finest ingredients.",
        },
      });
    }
    return NextResponse.json(settings);
  } catch (err) {
    console.error("GET /api/settings error:", err);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = Number(searchParams.get("id") || "1");

  try {
    const body = await req.json();
    const allowed = [
      "hero_title","hero_subtitle","hero_badge_text","hero_image_url","hero_years_label",
      "hero_customers_label","hero_flavors_label","about_badge","about_title","about_paragraph1",
      "about_paragraph2","about_image_url","about_highlight_1_title","about_highlight_1_desc",
      "about_highlight_2_title","about_highlight_2_desc","about_highlight_3_title","about_highlight_3_desc",
      "about_highlight_4_title","about_highlight_4_desc","products_title","products_subtitle",
      "cta_title","cta_subtitle","cta_image_url","cta_primary_label","cta_primary_href","cta_badge_text",
      "footer_text","footer_subtext","privacy_policy","terms_conditions",
      "social_facebook","social_instagram","social_twitter","navbar_logo","navbar_brand_image","show_company_text",
    ];
    const data: Record<string, unknown> = {};
    allowed.forEach((key) => {
      if (key in body) data[key] = body[key] === "" ? null : body[key];
    });

    const updated = await prisma.siteSetting.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT /api/settings error:", err);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
