import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateAdherence } from "@/lib/adherence";
import { CreateEntryPayload } from "@/types";

// GET /api/checklists — listar entradas (com filtros)
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const params = req.nextUrl.searchParams;
  const deviceId = params.get("deviceId");
  const formType = params.get("formType");
  const date = params.get("date");

  const where: any = {};
  if (deviceId) where.deviceId = deviceId;
  if (formType) where.schema = { formType };
  if (date) {
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);
    where.filledAt = { gte: start, lt: end };
  }

  const entries = await prisma.checklistEntry.findMany({
    where,
    include: {
      schema: { select: { name: true, formType: true } },
      device: {
        select: {
          type: true,
          patient: { select: { name: true, medicalRecord: true } },
        },
      },
      user: { select: { name: true } },
    },
    orderBy: { filledAt: "desc" },
    take: 100,
  });

  return NextResponse.json(entries);
}

// POST /api/checklists — criar nova entrada
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const body: CreateEntryPayload = await req.json();
  const userId = (session.user as any).id;

  // Buscar schema para calcular adesão
  const schema = await prisma.checklistSchema.findUnique({
    where: { id: body.schemaId },
  });

  if (!schema) {
    return NextResponse.json({ error: "Schema não encontrado" }, { status: 404 });
  }

  const schemaFields = schema.fields as any;
  const isAdherent = calculateAdherence(body.responses, schemaFields.adherenceRules);

  // Verificar duplicata (syncId para offline)
  if (body.syncId) {
    const existing = await prisma.checklistEntry.findUnique({
      where: { syncId: body.syncId },
    });
    if (existing) {
      return NextResponse.json(existing); // Idempotente
    }
  }

  const entry = await prisma.checklistEntry.create({
    data: {
      schemaId: body.schemaId,
      deviceId: body.deviceId,
      userId,
      shift: body.shift,
      dayNumber: body.dayNumber,
      isAdherent,
      responses: body.responses,
      syncId: body.syncId,
    },
    include: {
      schema: { select: { name: true, formType: true } },
    },
  });

  return NextResponse.json(entry, { status: 201 });
}
