import { NextRequest, NextResponse } from "next/server";
import { getAllProperties, PropertyFilterInput } from "@/lib/repositories/property-repository";
import { BD_NEIGHBORHOOD_BENCHMARKS, findNeighborhoodBenchmark } from "@/lib/data/bd-neighborhood-benchmarks";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const city = searchParams.get("city") || undefined;
    const neighborhood = searchParams.get("neighborhood") || undefined;
    const maxRentParam = searchParams.get("maxRent");
    const minBedsParam = searchParams.get("minBeds");
    const tenantType = searchParams.get("tenantType") || undefined;
    const verifiedOnlyParam = searchParams.get("verifiedOnly");
    const q = searchParams.get("q") || undefined;

    const filters: PropertyFilterInput = {
      city,
      neighborhood,
      maxRent: maxRentParam ? parseInt(maxRentParam, 10) : undefined,
      minBeds: minBedsParam ? parseInt(minBedsParam, 10) : undefined,
      tenantType,
      verifiedOnly: verifiedOnlyParam === "true",
      q,
    };

    const { properties, dataSource } = await getAllProperties(filters);

    // If specific neighborhood requested, attach benchmark, else attach full catalog
    let benchmarks = null;
    if (neighborhood) {
      benchmarks = findNeighborhoodBenchmark(neighborhood);
    } else {
      benchmarks = BD_NEIGHBORHOOD_BENCHMARKS;
    }

    return NextResponse.json({
      success: true,
      count: properties.length,
      dataSource,
      properties,
      benchmarks,
    });
  } catch (error) {
    console.error("[API /api/properties] Error retrieving property catalog:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch property listings",
      },
      { status: 500 }
    );
  }
}
