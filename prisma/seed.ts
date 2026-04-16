import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ─── Usuários padrão ───
  const adminPassword = await hash("admin123", 12);
  const nursePassword = await hash("nurse123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@hospital.local" },
    update: {},
    create: {
      name: "Administrador CCIH",
      email: "admin@hospital.local",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });

  const nurse = await prisma.user.upsert({
    where: { email: "enfermeiro@hospital.local" },
    update: {},
    create: {
      name: "Maria Enfermeira",
      email: "enfermeiro@hospital.local",
      passwordHash: nursePassword,
      role: "NURSE",
      coren: "COREN-SP 123456",
    },
  });

  console.log(`  ✅ Usuários: ${admin.name}, ${nurse.name}`);

  // ─── Schemas dos Checklists ───
  const schemas = [
    {
      formType: "CVC_INSERTION",
      name: "CVC — Inserção",
      description: "Checklist de inserção de Cateter Venoso Central",
      fields: {
        sections: [
          {
            id: "identification",
            title: "Identificação",
            fields: [
              { id: "H1", label: "Nome do paciente", type: "text", required: true },
              { id: "H2", label: "Prontuário", type: "text", required: true },
              { id: "H3", label: "Data de nascimento", type: "date", required: true },
              { id: "H4", label: "Unidade", type: "select", required: true, options: ["UTI Adulto", "UTI Neonatal", "UCI", "Clínica Médica", "Clínica Cirúrgica", "Pronto Socorro", "Centro Cirúrgico"] },
              { id: "H5", label: "Leito", type: "text", required: true },
              { id: "H6", label: "Data da inserção", type: "date", required: true },
            ],
          },
          {
            id: "professionals",
            title: "Profissionais",
            fields: [
              { id: "B1", label: "Responsável pela inserção", type: "radio", required: true, options: ["Médico plantonista", "Médico residente", "Médico intensivista"] },
              { id: "B2", label: "Auxiliar", type: "radio", required: true, options: ["Enfermeiro", "Residente enfermagem", "Técnico de enfermagem", "Médico plantonista", "Médico residente"] },
            ],
          },
          {
            id: "indication",
            title: "Indicação e Tipo",
            fields: [
              { id: "C1", label: "Motivo da inserção", type: "check", required: true, options: ["Falência de AVP", "DVA", "NPT", "Hemodiálise", "Monitorização invasiva", "Outro"] },
              { id: "C1_outro", label: "Outro motivo", type: "text", conditional: { field: "C1", includes: "Outro" } },
              { id: "C2", label: "Número de tentativas", type: "radio", required: true, options: ["Uma", "Duas", "Três", "Mais de três"] },
              { id: "C3", label: "Tipo de CVC", type: "radio", required: true, options: ["Mono lúmen", "Duplo lúmen", "Duplo lúmen com prata", "PAI", "Hemodiálise duplo lúmen", "Hemodiálise triplo lúmen", "Outro"] },
            ],
          },
          {
            id: "site",
            title: "Local de Inserção",
            fields: [
              { id: "D1", label: "Local de inserção", type: "radio", required: true, options: ["Jugular interna direita", "Jugular interna esquerda", "Subclávia direita", "Subclávia esquerda", "Femoral direita", "Femoral esquerda", "Radial direita", "Radial esquerda"] },
              { id: "D2", label: "Justificativa femoral", type: "check", conditional: { field: "D1", includes: "Femoral" }, options: ["Plaquetopenia", "Uremia", "RNI alargado", "Dificuldade anatômica", "Outros"] },
              { id: "D9", label: "Punção guiada por USG?", type: "radio", required: true, options: ["Sim", "Não"] },
              { id: "D10", label: "Motivo para não usar USG", type: "radio", conditional: { field: "D9", equals: "Não" }, options: ["Equipamento indisponível", "Limitação técnica"] },
            ],
          },
          {
            id: "hand_hygiene",
            title: "Higiene das Mãos",
            fields: [
              { id: "E1", label: "Higiene das mãos", type: "radio", required: true, options: ["Realizada", "Não realizada"] },
              { id: "E2", label: "Solução utilizada", type: "radio", conditional: { field: "E1", equals: "Realizada" }, options: ["Preparação alcoólica", "Prep. alcoólica com antisséptico", "Sabonete líquido com antisséptico", "Outra"] },
            ],
          },
          {
            id: "antisepsis",
            title: "Antissepsia",
            fields: [
              { id: "F1", label: "Antissepsia da pele", type: "radio", required: true, options: ["Realizada", "Não realizada"] },
              { id: "F2", label: "Solução antisséptica", type: "radio", conditional: { field: "F1", equals: "Realizada" }, options: ["Clorexidina alcoólica", "PVPI alcoólica", "Outra"] },
              { id: "F3", label: "Tempo de fricção", type: "radio", required: true, options: ["Mais de 30 segundos", "Menos de 30 segundos"] },
              { id: "F4", label: "Tempo de secagem", type: "radio", required: true, options: ["2 minutos ou mais", "Menos de 2 minutos"] },
            ],
          },
          {
            id: "barrier",
            title: "Barreira Máxima",
            fields: [
              { id: "G_resp", label: "EPIs do Responsável", type: "tristate_group", items: ["Gorro", "Máscara", "Luva estéril", "Avental estéril manga longa", "Campo estéril da cabeça aos pés"], options: ["Sim", "Não", "Sim, após intervenção"] },
              { id: "G_aux", label: "EPIs do Auxiliar", type: "tristate_group", items: ["Higienizou as mãos", "Utilizou gorro", "Utilizou máscara"], options: ["Sim", "Não", "Sim, após intervenção"] },
            ],
          },
          {
            id: "coverage",
            title: "Cobertura e Fixação",
            fields: [
              { id: "H1_cob", label: "Cobertura estéril aplicada", type: "radio", required: true, options: ["Sim", "Não"] },
              { id: "H2_data", label: "Data registrada no curativo", type: "radio", required: true, options: ["Sim", "Não"] },
            ],
          },
        ],
        adherenceRules: {
          type: "all_must_pass",
          checks: [
            { field: "E1", equals: "Realizada" },
            { field: "F1", equals: "Realizada" },
            { field: "F3", equals: "Mais de 30 segundos" },
            { field: "F4", equals: "2 minutos ou mais" },
            { field: "G_resp", allEqual: "Sim" },
            { field: "G_aux", allEqual: "Sim" },
            { field: "H1_cob", equals: "Sim" },
            { field: "H2_data", equals: "Sim" },
            { field: "D9", equals: "Sim" },
          ],
        },
      },
    },
    {
      formType: "CVC_MAINTENANCE",
      name: "CVC — Manutenção",
      description: "Checklist diário de manutenção do CVC",
      fields: {
        sections: [
          {
            id: "criteria",
            title: "Critérios de Manutenção",
            fields: [
              { id: "K1", label: "Critérios para manutenção do CVC", type: "check", required: true, options: ["Falência de AVP", "DVA", "NPT", "Hemodiálise", "Monitorização invasiva", "Outro"] },
            ],
          },
          {
            id: "measures",
            title: "Medidas de Manutenção",
            fields: [
              { id: "M1", label: "Checagem diária da necessidade de manter o cateter central", type: "yesno", required: true },
              { id: "M2", label: "Higienização das mãos ANTES de cada manipulação", type: "yesno", required: true },
              { id: "M3", label: "Higienização das mãos APÓS cada manipulação", type: "yesno", required: true },
              { id: "M4", label: "Cobertura estéril limpa, seca, bem aderida à pele e protegendo a inserção", type: "yesno", required: true },
              { id: "M5", label: "Cobertura e equipos datados (segundo rotina do SCIRAS)", type: "yesno", required: true },
              { id: "M6", label: "Sítio de inserção avaliado por inspeção visual e palpação, mín. 1×/dia", type: "yesno", required: true },
              { id: "M7", label: "Desinfecção das conexões, conectores, cânulas e injetor lateral antes da manipulação", type: "yesno", required: true },
              { id: "M8", label: "Flushing realizado após administração", type: "yesno", required: true },
              { id: "M9", label: "Troca cobertura gaze/filme (máx. cada 24h ou se comprometida)", type: "yesno", required: true },
              { id: "M10", label: "Troca cobertura transparente (máx. cada 5 dias ou se comprometida)", type: "yesno", required: true },
            ],
          },
        ],
        adherenceRules: {
          type: "all_yes",
          fields: ["M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9", "M10"],
        },
      },
    },
    {
      formType: "SVD_INSERTION",
      name: "SVD — Inserção",
      description: "Checklist de inserção de Sonda Vesical de Demora",
      fields: {
        sections: [
          {
            id: "measures",
            title: "Medidas do Bundle",
            fields: [
              { id: "M1", label: "Cateter tem indicação apropriada", type: "cnc", required: true },
              { id: "M1a", label: "Indicação de SVD", type: "radio", conditional: { field: "M1", equals: "C" }, options: ["Impossibilidade de micção espontânea", "Controle rigoroso do débito urinário", "Trans/pós-operatório", "Incontinência urinária + lesões pele/LPP", "Hematúria com irrigação vesical contínua"] },
              { id: "M2", label: "Realizada higiene íntima antes do procedimento", type: "cnc", required: true },
              { id: "M3", label: "Material aberto com técnica asséptica", type: "cnc", required: true },
              { id: "M4", label: "Utilizadas luvas estéreis com técnica asséptica", type: "cnc", required: true },
              { id: "M5", label: "Realizada antissepsia da genitália", type: "cnc", required: true },
              { id: "M6", label: "Campos estéreis posicionados com técnica asséptica", type: "cnc", required: true },
              { id: "M7", label: "Sistema de drenagem fechado", type: "cnc", required: true },
              { id: "M8", label: "Fixação do cateter de forma adequada", type: "cnc", required: true },
            ],
          },
        ],
        adherenceRules: {
          type: "all_c_or_na",
          fields: ["M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8"],
        },
      },
    },
    {
      formType: "SVD_MAINTENANCE",
      name: "SVD — Manutenção",
      description: "Checklist diário de manutenção do SVD",
      fields: {
        sections: [
          {
            id: "criteria",
            title: "Critérios e Conduta",
            fields: [
              { id: "K1", label: "Critérios para manutenção do SVD", type: "check", required: true, options: ["Impossibilidade de micção espontânea", "Controle rigoroso do débito urinário", "Trans/pós-operatório", "Incontinência urinária + lesões pele/LPP", "Hematúria com irrigação vesical contínua"] },
              { id: "K2", label: "Conduta", type: "radio", required: true, options: ["RETIRAR", "MANTER"] },
            ],
          },
          {
            id: "measures",
            title: "Medidas de Manutenção",
            fields: [
              { id: "M1", label: "Higienização das mãos antes e após manipulação do SVD", type: "cnc", required: true },
              { id: "M2", label: "Realizada troca da fixação do SVD", type: "cnc", required: true },
              { id: "M3", label: "Coletor mantido em nível inferior à bexiga sem contato com o chão", type: "cnc", required: true },
              { id: "M4", label: "Higienização da região perineal durante o banho", type: "cnc", required: true },
              { id: "M5", label: "Esvaziada a bolsa coletora ao atingir 2/3 da capacidade", type: "cnc", required: true },
            ],
          },
        ],
        adherenceRules: {
          type: "all_c_or_na",
          fields: ["M1", "M2", "M3", "M4", "M5"],
        },
      },
    },
    {
      formType: "PAV_PHYSIO",
      name: "PAV — Fisioterapia",
      description: "Checklist PAV - Medidas de Fisioterapia",
      fields: {
        sections: [
          {
            id: "measures",
            title: "Medidas — Fisioterapia",
            fields: [
              { id: "F1", label: "Avaliação da possibilidade de extubação", type: "cnc", required: true, hint: "Conforme quando checklist de desmame de VM for aplicado" },
              { id: "F2", label: "Avaliação do filtro e cuidados com umidificador", type: "cnc", required: true, hint: "Conforme quando houver registro de avaliação diária" },
              { id: "F3", label: "Manutenção do circuito respiratório", type: "cnc", required: true, hint: "Circuito bem alocado, sem condensado" },
              { id: "F4", label: "Avaliação da pressão do Cuff", type: "cnc", required: true, hint: "Conforme se 18–22 mmHg / 25–30 cmH₂O" },
              { id: "F5", label: "Aspiração de secreção de vias aéreas", type: "cnc", required: true, hint: "Registro de avaliação e aspiração" },
              { id: "F6", label: "Indicação de traqueostomia precoce", type: "cnc", required: true, hint: "Indicada em até 7 dias após intubação" },
            ],
          },
        ],
        adherenceRules: { type: "all_c_or_na", fields: ["F1", "F2", "F3", "F4", "F5", "F6"] },
        requiresShift: true,
      },
    },
    {
      formType: "PAV_NURSING",
      name: "PAV — Enfermagem",
      description: "Checklist PAV - Medidas de Enfermagem",
      fields: {
        sections: [
          {
            id: "measures",
            title: "Medidas — Enfermagem",
            fields: [
              { id: "E1", label: "Decúbito elevado (30-45°)", type: "cnc", required: true, hint: "Paciente no decúbito correto no momento da visita" },
              { id: "E2", label: "Higiene oral conforme recomendação institucional", type: "cnc", required: true, hint: "Registro no prontuário ou observação direta" },
              { id: "E3", label: "Sedação mínima e teste de despertar diário", type: "cnc", required: true, hint: "Orientações institucionais seguidas" },
              { id: "E4", label: "Avaliação de bloqueadores neuromusculares", type: "cnc", required: true, hint: "Conforme protocolo, mantido < 72h" },
              { id: "E5", label: "Aspiração de secreção de vias aéreas", type: "cnc", required: true, hint: "Registro de avaliação e aspiração" },
              { id: "E6", label: "Indicação de nutrição enteral precoce", type: "cnc", required: true, hint: "Indicada em até 48h após intubação" },
              { id: "E7", label: "Posicionamento de SNE", type: "cnc", required: true, hint: "Pós-pilórico verificado e documentado" },
            ],
          },
        ],
        adherenceRules: { type: "all_c_or_na", fields: ["E1", "E2", "E3", "E4", "E5", "E6", "E7"] },
        requiresShift: true,
      },
    },
  ];

  for (const schema of schemas) {
    await prisma.checklistSchema.upsert({
      where: { formType: schema.formType },
      update: { fields: JSON.stringify(schema.fields), name: schema.name },
      create: { ...schema, fields: JSON.stringify(schema.fields) },
    });
  }

  console.log(`  ✅ ${schemas.length} schemas de checklist criados`);

  // ─── Paciente de exemplo ───
  const patient = await prisma.patient.upsert({
    where: { medicalRecord: "12345" },
    update: {},
    create: {
      name: "Maria Silva",
      medicalRecord: "12345",
      birthDate: new Date("1965-03-15"),
    },
  });

  console.log(`  ✅ Paciente: ${patient.name}`);
  console.log("✅ Seed completo!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
