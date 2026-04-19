"use client";

import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import FormWizard from "@/components/FormWizard";
import RadioPills from "@/components/ui/RadioPills";
import CheckPills from "@/components/ui/CheckPills";
import FieldWrapper from "@/components/ui/FieldWrapper";

// ─── Constants ───
const MOTIVOS = ["Falência de AVP", "DVA", "NPT", "Hemodiálise", "Monitorização invasiva", "Outro"];
const TIPOS_CVC = ["Mono lúmen", "Duplo lúmen", "Duplo lúmen com prata", "PAI", "Hemodiálise duplo lúmen", "Hemodiálise triplo lúmen", "Outro"];
const LOCAIS = ["Jugular interna direita", "Jugular interna esquerda", "Subclávia direita", "Subclávia esquerda", "Femoral direita", "Femoral esquerda", "Radial direita", "Radial esquerda"];
const JUSTIFICATIVAS_FEMORAL = ["Plaquetopenia", "Uremia", "RNI alargado", "Dificuldade anatômica", "Outros"];
const TENTATIVAS = ["Uma", "Duas", "Três", "Mais de três"];
const SOL_HIGIENE = ["Preparação alcoólica", "Prep. alcoólica com antisséptico", "Sabonete líquido com antisséptico", "Outra"];
const SOL_ANTISSEPSIA = ["Clorexidina alcoólica", "PVPI alcoólica", "Outra"];
const CAT_RESP = ["Médico plantonista", "Médico residente", "Médico intensivista"];
const CAT_AUX = ["Enfermeiro", "Residente enfermagem", "Técnico de enfermagem", "Médico plantonista", "Médico residente"];
const EPIS = ["Gorro", "Máscara", "Luva estéril", "Avental estéril manga longa", "Campo estéril da cabeça aos pés"];
const EPIS_AUX = ["Higienizou as mãos", "Utilizou gorro", "Utilizou máscara"];
const TRI = ["Sim", "Não", "Sim, após intervenção"];
const UNIDADES = ["UTI Adulto", "UTI Neonatal", "UCI", "Clínica Médica", "Clínica Cirúrgica", "Pronto Socorro", "Centro Cirúrgico"];

export default function CvcInsercaoPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  // ─── Form state ───
  const [d, setD] = useState<Record<string, any>>({
    paciente: "", prontuario: "", dataNascimento: "", unidade: "", leito: "",
    dataInsercao: "",
    catResp: "", catAux: "",
    motivos: [], motivoOutro: "",
    tentativas: "",
    tipoCvc: "", tipoCvcOutro: "",
    local: "",
    justFemoral: [],
    usg: "", motivoSemUsg: "",
    higieneMaos: "", solucaoHigiene: "",
    antissepsia: "", solucaoAntissepsia: "",
    tempoFriccao: "", tempoSecagem: "",
    epiResp: {} as Record<string, string>,
    epiAux: {} as Record<string, string>,
    coberturaEsteril: "", dataRegistrada: "",
  });

  const set = useCallback((k: string, v: any) => setD((p) => ({ ...p, [k]: v })), []);
  const setEpiResp = useCallback((item: string, v: string) => {
    setD((p) => ({ ...p, epiResp: { ...p.epiResp, [item]: v } }));
  }, []);
  const setEpiAux = useCallback((item: string, v: string) => {
    setD((p) => ({ ...p, epiAux: { ...p.epiAux, [item]: v } }));
  }, []);

  // ─── Adherence calculation ───
  const calcAdherence = () => {
    const allEpiResp = EPIS.every((e) => d.epiResp[e] === "Sim");
    const allEpiAux = EPIS_AUX.every((e) => d.epiAux[e] === "Sim");
    return (
      d.higieneMaos === "Realizada" &&
      d.antissepsia === "Realizada" &&
      d.tempoFriccao === "Mais de 30 segundos" &&
      d.tempoSecagem === "2 minutos ou mais" &&
      allEpiResp && allEpiAux &&
      d.coberturaEsteril === "Sim" &&
      d.dataRegistrada === "Sim" &&
      d.usg === "Sim"
    );
  };

  // ─── Submit ───
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // In production: POST to /api/checklists with real deviceId and schemaId
      // For now, we show the result
      const adherent = calcAdherence();
      alert(
        adherent
          ? "✅ Bundle ADERIDO! Checklist salvo com sucesso."
          : "⚠️ Bundle NÃO aderido. Checklist salvo — itens não conformes registrados."
      );
      router.push("/dashboard");
    } catch (err) {
      alert("Erro ao salvar. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── TriState component ───
  const TriRow = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
    <div className="py-3 border-b border-gray-100">
      <p className="text-sm font-semibold text-gray-800 mb-2">{label}</p>
      <div className="flex gap-1.5">
        {TRI.map((opt) => {
          const isSelected = value === opt;
          const color = opt === "Sim" ? "green" : opt === "Não" ? "red" : "amber";
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={`flex-1 py-2 rounded-lg text-xs font-bold border-2 transition-all ${
                isSelected
                  ? color === "green" ? "border-green-500 bg-green-50 text-green-700"
                  : color === "red" ? "border-red-500 bg-red-50 text-red-700"
                  : "border-amber-500 bg-amber-50 text-amber-700"
                  : "border-gray-200 bg-gray-50 text-gray-400"
              }`}
            >
              {isSelected && "✓ "}{opt}
            </button>
          );
        })}
      </div>
    </div>
  );

  // ─── Steps ───
  const steps = [
    {
      id: "identification",
      title: "Paciente",
      content: (
        <div className="space-y-4">
          <FieldWrapper label="Nome do paciente" required>
            <input type="text" value={d.paciente} onChange={(e) => set("paciente", e.target.value)}
              placeholder="Nome completo" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-base outline-none focus:border-brand-500" />
          </FieldWrapper>
          <div className="grid grid-cols-2 gap-3">
            <FieldWrapper label="Prontuário" required>
              <input type="text" value={d.prontuario} onChange={(e) => set("prontuario", e.target.value)}
                placeholder="Nº" className="w-full px-3 py-3 rounded-xl border border-gray-200 text-base outline-none focus:border-brand-500" />
            </FieldWrapper>
            <FieldWrapper label="Nascimento" required>
              <input type="date" value={d.dataNascimento} onChange={(e) => set("dataNascimento", e.target.value)}
                className="w-full px-3 py-3 rounded-xl border border-gray-200 text-base outline-none focus:border-brand-500" />
            </FieldWrapper>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FieldWrapper label="Unidade" required>
              <select value={d.unidade} onChange={(e) => set("unidade", e.target.value)}
                className="w-full px-3 py-3 rounded-xl border border-gray-200 text-base outline-none focus:border-brand-500 bg-white">
                <option value="">Selecione...</option>
                {UNIDADES.map((u) => <option key={u}>{u}</option>)}
              </select>
            </FieldWrapper>
            <FieldWrapper label="Leito" required>
              <input type="text" value={d.leito} onChange={(e) => set("leito", e.target.value)}
                placeholder="Ex: L-01" className="w-full px-3 py-3 rounded-xl border border-gray-200 text-base outline-none focus:border-brand-500" />
            </FieldWrapper>
          </div>
          <FieldWrapper label="Data da inserção" required>
            <input type="date" value={d.dataInsercao} onChange={(e) => set("dataInsercao", e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-base outline-none focus:border-brand-500" />
          </FieldWrapper>
        </div>
      ),
    },
    {
      id: "professionals",
      title: "Profissionais",
      content: (
        <div className="space-y-5">
          <FieldWrapper label="Responsável pela inserção" required>
            <RadioPills options={CAT_RESP} value={d.catResp} onChange={(v) => set("catResp", v)} />
          </FieldWrapper>
          <FieldWrapper label="Auxiliar" required>
            <RadioPills options={CAT_AUX} value={d.catAux} onChange={(v) => set("catAux", v)} />
          </FieldWrapper>
        </div>
      ),
    },
    {
      id: "indication",
      title: "Indicação",
      content: (
        <div className="space-y-5">
          <FieldWrapper label="Motivo da inserção" required hint="Selecione todos que se aplicam">
            <CheckPills options={MOTIVOS} values={d.motivos} onChange={(v) => set("motivos", v)} />
            {d.motivos.includes("Outro") && (
              <input type="text" value={d.motivoOutro} onChange={(e) => set("motivoOutro", e.target.value)}
                placeholder="Especifique..." className="mt-2 w-full px-4 py-3 rounded-xl border border-gray-200 text-base outline-none focus:border-brand-500" />
            )}
          </FieldWrapper>
          <FieldWrapper label="Número de tentativas de punção" required>
            <RadioPills options={TENTATIVAS} value={d.tentativas} onChange={(v) => set("tentativas", v)} />
          </FieldWrapper>
          <FieldWrapper label="Tipo de CVC" required>
            <RadioPills options={TIPOS_CVC} value={d.tipoCvc} onChange={(v) => set("tipoCvc", v)} />
          </FieldWrapper>
        </div>
      ),
    },
    {
      id: "site",
      title: "Local",
      content: (
        <div className="space-y-5">
          <FieldWrapper label="Local de inserção" required>
            <RadioPills options={LOCAIS} value={d.local} onChange={(v) => set("local", v)} />
          </FieldWrapper>
          {d.local?.includes("Femoral") && (
            <FieldWrapper label="Justificativa para acesso femoral" required>
              <CheckPills options={JUSTIFICATIVAS_FEMORAL} values={d.justFemoral} onChange={(v) => set("justFemoral", v)} />
            </FieldWrapper>
          )}
          <FieldWrapper label="Punção guiada por USG?" required>
            <RadioPills options={["Sim", "Não"]} value={d.usg} onChange={(v) => set("usg", v)} />
          </FieldWrapper>
          {d.usg === "Não" && (
            <FieldWrapper label="Motivo para não usar USG" required>
              <RadioPills options={["Equipamento indisponível", "Limitação técnica"]} value={d.motivoSemUsg} onChange={(v) => set("motivoSemUsg", v)} />
            </FieldWrapper>
          )}
        </div>
      ),
    },
    {
      id: "hygiene",
      title: "Higiene",
      content: (
        <div className="space-y-5">
          <FieldWrapper label="Higiene das mãos" required>
            <RadioPills options={["Realizada", "Não realizada"]} value={d.higieneMaos} onChange={(v) => set("higieneMaos", v)} />
          </FieldWrapper>
          {d.higieneMaos === "Realizada" && (
            <FieldWrapper label="Solução utilizada">
              <RadioPills options={SOL_HIGIENE} value={d.solucaoHigiene} onChange={(v) => set("solucaoHigiene", v)} />
            </FieldWrapper>
          )}
        </div>
      ),
    },
    {
      id: "antisepsis",
      title: "Antissepsia",
      content: (
        <div className="space-y-5">
          <FieldWrapper label="Antissepsia da pele" required>
            <RadioPills options={["Realizada", "Não realizada"]} value={d.antissepsia} onChange={(v) => set("antissepsia", v)} />
          </FieldWrapper>
          {d.antissepsia === "Realizada" && (
            <FieldWrapper label="Solução antisséptica">
              <RadioPills options={SOL_ANTISSEPSIA} value={d.solucaoAntissepsia} onChange={(v) => set("solucaoAntissepsia", v)} />
            </FieldWrapper>
          )}
          <FieldWrapper label="Tempo de fricção" required>
            <RadioPills options={["Mais de 30 segundos", "Menos de 30 segundos"]} value={d.tempoFriccao} onChange={(v) => set("tempoFriccao", v)} />
          </FieldWrapper>
          <FieldWrapper label="Tempo de secagem" required>
            <RadioPills options={["2 minutos ou mais", "Menos de 2 minutos"]} value={d.tempoSecagem} onChange={(v) => set("tempoSecagem", v)} />
          </FieldWrapper>
        </div>
      ),
    },
    {
      id: "barrier",
      title: "Barreira",
      content: (
        <div className="space-y-5">
          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-3">EPIs — Responsável pela inserção</h3>
            {EPIS.map((epi) => (
              <TriRow key={epi} label={epi} value={d.epiResp[epi] || ""} onChange={(v) => setEpiResp(epi, v)} />
            ))}
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-800 mb-3">EPIs — Auxiliar</h3>
            {EPIS_AUX.map((epi) => (
              <TriRow key={epi} label={epi} value={d.epiAux[epi] || ""} onChange={(v) => setEpiAux(epi, v)} />
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "coverage",
      title: "Cobertura",
      content: (
        <div className="space-y-5">
          <FieldWrapper label="Cobertura estéril aplicada?" required>
            <RadioPills options={["Sim", "Não"]} value={d.coberturaEsteril} onChange={(v) => set("coberturaEsteril", v)} />
          </FieldWrapper>
          <FieldWrapper label="Data registrada no curativo?" required>
            <RadioPills options={["Sim", "Não"]} value={d.dataRegistrada} onChange={(v) => set("dataRegistrada", v)} />
          </FieldWrapper>
        </div>
      ),
    },
    {
      id: "summary",
      title: "Resumo",
      content: <SummarySection data={d} adherent={calcAdherence()} />,
    },
  ];

  return (
    <FormWizard
      steps={steps}
      title="CVC — Inserção"
      subtitle="Cateter venoso central · Evento único"
      headerColor="from-brand-500 to-brand-700"
      onSubmit={handleSubmit}
      isSubmitting={submitting}
    />
  );
}

// ─── Summary sub-component ───
function SummarySection({ data: d, adherent }: { data: any; adherent: boolean }) {
  const checks = [
    { label: "Higiene das mãos", ok: d.higieneMaos === "Realizada" },
    { label: "Antissepsia da pele", ok: d.antissepsia === "Realizada" },
    { label: "Tempo de fricção ≥ 30s", ok: d.tempoFriccao === "Mais de 30 segundos" },
    { label: "Tempo de secagem ≥ 2min", ok: d.tempoSecagem === "2 minutos ou mais" },
    { label: "Barreira máxima (responsável)", ok: EPIS.every((e) => d.epiResp[e] === "Sim") },
    { label: "Barreira máxima (auxiliar)", ok: EPIS_AUX.every((e) => d.epiAux[e] === "Sim") },
    { label: "Cobertura estéril", ok: d.coberturaEsteril === "Sim" },
    { label: "Data no curativo", ok: d.dataRegistrada === "Sim" },
    { label: "USG na punção", ok: d.usg === "Sim" },
  ];

  return (
    <div className="space-y-4">
      {/* Adherence badge */}
      <div className={`p-4 rounded-2xl border-2 text-center ${
        adherent ? "bg-green-50 border-green-500" : "bg-red-50 border-red-500"
      }`}>
        <div className="text-3xl mb-1">{adherent ? "✅" : "⚠️"}</div>
        <div className={`text-lg font-extrabold ${adherent ? "text-green-700" : "text-red-700"}`}>
          {adherent ? "Bundle ADERIDO" : "Bundle NÃO ADERIDO"}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {checks.filter((c) => c.ok).length} conformes · {checks.filter((c) => !c.ok).length} não conformes
        </p>
      </div>

      {/* Patient data */}
      <div className="p-4 bg-gray-50 rounded-xl text-sm">
        <p className="font-bold text-gray-800 mb-2">Dados do paciente</p>
        <div className="grid grid-cols-2 gap-1 text-gray-500">
          <span><b>Nome:</b> {d.paciente || "—"}</span>
          <span><b>Prontuário:</b> {d.prontuario || "—"}</span>
          <span><b>Unidade:</b> {d.unidade || "—"}</span>
          <span><b>Leito:</b> {d.leito || "—"}</span>
          <span><b>Inserção:</b> {d.dataInsercao || "—"}</span>
          <span><b>Local:</b> {d.local || "—"}</span>
          <span><b>Tipo CVC:</b> {d.tipoCvc || "—"}</span>
          <span><b>USG:</b> {d.usg || "—"}</span>
        </div>
      </div>

      {/* Checks */}
      <div className="text-sm">
        <p className="font-bold text-gray-800 mb-2">Verificação do bundle</p>
        {checks.map((c, i) => (
          <div key={i} className="flex items-center gap-2.5 py-2 border-b border-gray-100 last:border-0">
            <span className="text-lg">{c.ok ? "✅" : "❌"}</span>
            <span className={`flex-1 ${c.ok ? "text-gray-700" : "text-red-600 font-semibold"}`}>{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
