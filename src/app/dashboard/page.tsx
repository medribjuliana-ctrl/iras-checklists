"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const FORM_CARDS = [
  {
    group: "PAV — Pneumonia Associada à Ventilação",
    icon: "🫁",
    color: "cyan",
    items: [
      { id: "pav-fisio", name: "Fisioterapia", desc: "Medidas F1–F6 · Por turno", badge: "Diário", href: "/checklists/pav-fisio" },
      { id: "pav-enf", name: "Enfermagem", desc: "Medidas E1–E7 · Por turno", badge: "Diário", href: "/checklists/pav-enf" },
    ],
  },
  {
    group: "CVC — Cateter Venoso Central",
    icon: "💉",
    color: "green",
    items: [
      { id: "cvc-ins", name: "Inserção de CVC", desc: "9 seções · Evento único", badge: "Inserção", href: "/checklists/cvc-insercao" },
      { id: "cvc-man", name: "Manutenção de CVC", desc: "10 medidas SIM/NÃO · Diário", badge: "Diário", href: "/checklists/cvc-manutencao" },
    ],
  },
  {
    group: "SVD — Sonda Vesical de Demora",
    icon: "🔬",
    color: "purple",
    items: [
      { id: "svd-ins", name: "Inserção de SVD", desc: "8 medidas C/NC/NA", badge: "Inserção", href: "/checklists/svd-insercao" },
      { id: "svd-man", name: "Manutenção de SVD", desc: "5 medidas · RETIRAR/MANTER", badge: "Diário", href: "/checklists/svd-manutencao" },
    ],
  },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<"forms" | "recent" | "patients">("forms");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-4xl mb-2">🏥</div>
          <p className="text-gray-500 text-sm">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-brand-500 to-brand-700 text-white px-5 pt-6 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-extrabold">IRAS Checklists</h1>
            <p className="text-sm opacity-80 mt-0.5">Prevenção de Infecções — Hospital</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg"
            title="Sair"
          >
            👤
          </button>
        </div>

        {/* Stats */}
        <div className="flex gap-3 mt-4">
          {[
            { label: "preenchidos", value: "—" },
            { label: "pendentes", value: "—" },
            { label: "adesão", value: "—%" },
          ].map((s) => (
            <div key={s.label} className="flex-1 py-2.5 px-3 rounded-xl bg-white/15 text-center">
              <div className="text-xl font-extrabold">{s.value}</div>
              <div className="text-[10px] uppercase tracking-wide opacity-80">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border-b border-gray-200">
        {(["forms", "recent", "patients"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-3 text-center text-sm font-medium border-b-[3px] transition-colors ${
              tab === t
                ? "border-brand-500 text-brand-600 font-bold"
                : "border-transparent text-gray-400"
            }`}
          >
            {t === "forms" ? "📋 Formulários" : t === "recent" ? "🕐 Recentes" : "🏥 Pacientes"}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-5 py-5">
        {tab === "forms" && (
          <div className="space-y-6">
            {FORM_CARDS.map((group) => (
              <div key={group.group}>
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="text-xl">{group.icon}</span>
                  <h2 className="text-[15px] font-bold text-gray-800">{group.group}</h2>
                </div>
                <div className="space-y-2">
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => router.push(item.href)}
                      className="w-full flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-gray-200 hover:border-brand-300 hover:shadow-md transition-all text-left"
                    >
                      <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center text-xl shrink-0">
                        {group.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[15px] font-bold text-gray-800">{item.name}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 text-brand-600 uppercase tracking-wide">
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                      </div>
                      <span className="text-gray-300 text-lg">›</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === "recent" && (
          <div className="text-center py-12 text-gray-400">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-sm">Nenhum preenchimento recente</p>
            <p className="text-xs mt-1">Os checklists preenchidos aparecerão aqui</p>
          </div>
        )}

        {tab === "patients" && (
          <div className="space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar paciente por nome ou prontuário..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-base outline-none focus:border-brand-500 transition-colors"
              />
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            </div>
            <div className="text-center py-8 text-gray-400">
              <p className="text-sm">Digite para buscar pacientes</p>
            </div>
          </div>
        )}
      </div>

      {/* Welcome banner */}
      {session?.user && (
        <div className="fixed bottom-16 inset-x-5">
          <div className="bg-brand-50 border border-brand-200 rounded-xl px-4 py-2.5 text-center">
            <p className="text-xs text-brand-700">
              Conectado como <strong>{session.user.name}</strong>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
