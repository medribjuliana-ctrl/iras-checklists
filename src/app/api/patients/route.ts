import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/patients — listar pacientes (com busca)
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const search = req.nextUrl.searchParams.get("q") || "";

  const patients = await prisma.patient.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { medicalRecord: { contains: search } },
          ],
        }
      : undefined,
    include: {
      devices: {
        where: { status: "ACTIVE" },
        orderBy: { insertionDate: "desc" },
      },
    },
    orderBy: { name: "asc" },
    take: 50,
  });

  return NextResponse.json(patients);
}

// POST /api/patients — criar paciente
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const body = await req.json();
  const { name, medicalRecord, birthDate } = body;

  if (!name || !medicalRecord || !birthDate) {
    return NextResponse.json({ error: "Campos obrigatórios faltando" }, { status: 400 });
  }

  const patient = await prisma.patient.create({
    data: {
      name,
      medicalRecord,
      birthDate: new Date(birthDate),
    },
  });

  return NextResponse.json(patient, { status: 201 });
}
