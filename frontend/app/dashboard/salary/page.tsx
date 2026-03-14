'use client'

import { stats } from "@/src/app/actions/actions";
import Footer from "@/src/components/Footer";
import NavBar from "@/src/components/NavBar";
import {
  Banknote,
  BarChart3,
  CalendarRange,
  PiggyBank,
  Search,
  Users,
} from "lucide-react";
import { useState, useRef } from 'react';
import toast from "react-hot-toast";

const currentYear = new Date().getFullYear();

const months = [
  { value: 1, label: "Janvier" }, { value: 2, label: "Février" },
  { value: 3, label: "Mars" },    { value: 4, label: "Avril" },
  { value: 5, label: "Mai" },     { value: 6, label: "Juin" },
  { value: 7, label: "Juillet" }, { value: 8, label: "Août" },
  { value: 9, label: "Septembre"},{ value: 10, label: "Octobre" },
  { value: 11, label: "Novembre"},{ value: 12, label: "Décembre" },
];

const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

type MonthlyReport = {
  month: number;
  year: number;
  barbers: {
    barber_id: string;
    barber_name: string;
    salary_percentage: number;
    service_count: number;
    total_revenue: string;
    barber_salary: string;
    salon_share: string;
  }[];
  summary: {
    total_revenue: string;
    total_salary_deductions: string;
    salon_net_profit: string;
  };
};

const SalaryPage = () => {
  const [report, setReport] = useState<MonthlyReport | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const statFormRef = useRef<HTMLFormElement>(null);

  const handleStats = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const year = statFormRef.current?.elements.namedItem('year') as HTMLSelectElement | null;
    const month = statFormRef.current?.elements.namedItem('month') as HTMLSelectElement | null;

    if (!year?.value.trim() || !month?.value.trim()) {
      toast.error('Remplissez tous les champs');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const result = await stats(formData);
    setIsSubmitting(false);

    if (result) {
      setReport(result as MonthlyReport);
    } else {
      toast.error("Erreur. Veuillez réessayer.");
    }
  };

  const getMonthLabel = (value: number | undefined) => {
    if (!value) return '';
    return months.find((m) => m.value === value)?.label || '';
  };

  return (
    <div className="min-h-screen bg-base-100">
      <NavBar />
      <main className="px-4 md:px-8 pt-28 pb-16">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* En-tête */}
          <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Gestion des salaires
              </h1>
              <p className="text-sm md:text-base text-base-content/70">
                Calculez automatiquement le salaire de chaque coiffeur pour un mois donné.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs md:text-sm text-base-content/70">
              <CalendarRange className="w-4 h-4" />
              <span>
                {report
                  ? `Période : ${getMonthLabel(report.month)} ${report.year}`
                  : "Sélectionnez un mois et une année"}
              </span>
            </div>
          </section>

          {/* Filtres période */}
          <section className="w-full card bg-base-100 shadow-md border border-base-200">
            <div className="card-body p-4 md:p-6">
              <form
                ref={statFormRef}
                onSubmit={handleStats}
                className="flex flex-col md:flex-row md:items-end md:justify-start gap-4"
              >
                <div className="flex-1">
                  <label className="label text-xs font-semibold">Mois</label>
                  <select
                    name="month"
                    defaultValue={''}
                    className="select select-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option disabled value={''}>
                      Sélectionnez un mois
                    </option>
                    {months.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex-1">
                  <label className="label text-xs font-semibold">Année</label>
                  <select
                    name="year"
                    defaultValue={''}
                    className="select select-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option disabled value={''}>
                      Sélectionnez une année
                    </option>
                    {years.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-secondary w-full md:w-max px-8 gap-2"
                >
                  {isSubmitting ? (
                    <span className="loading loading-spinner loading-sm" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  {isSubmitting ? 'Traitement...' : 'Appliquer'}
                </button>
              </form>
            </div>
          </section>

          {/* Résumé & tableau */}
          {report ? (
            <>
              {/* Résumé du salon */}
              <section className="grid gap-4 md:grid-cols-3">
                <div className="card bg-base-100 shadow-lg border border-base-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="card-body p-4 md:p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-base-content/70 uppercase tracking-wide">
                        Chiffre d&apos;affaires du salon
                      </p>
                      <div className="rounded-full p-2 bg-primary/10 border border-base-200">
                        <BarChart3 className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold">
                      {report.summary.total_revenue} FCFA
                    </p>
                    <p className="text-xs text-base-content/60">
                      Total encaissé pour cette période.
                    </p>
                  </div>
                </div>

                <div className="card bg-base-100 shadow-lg border border-base-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="card-body p-4 md:p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-base-content/70 uppercase tracking-wide">
                        Total salaires à verser
                      </p>
                      <div className="rounded-full p-2 bg-secondary/10 border border-base-200">
                        <Banknote className="w-4 h-4 text-secondary" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold">
                      {report.summary.total_salary_deductions} FCFA
                    </p>
                    <p className="text-xs text-base-content/60">
                      Somme totale à payer à vos coiffeurs.
                    </p>
                  </div>
                </div>

                <div className="card bg-base-100 shadow-lg border border-base-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="card-body p-4 md:p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-base-content/70 uppercase tracking-wide">
                        Bénéfice net du salon
                      </p>
                      <div className="rounded-full p-2 bg-accent/10 border border-base-200">
                        <PiggyBank className="w-4 h-4 text-accent" />
                      </div>
                    </div>
                    <p className="text-2xl font-bold">
                      {report.summary.salon_net_profit} FCFA
                    </p>
                    <p className="text-xs text-base-content/60">
                      Ce qu&apos;il reste après paiement des salaires.
                    </p>
                  </div>
                </div>
              </section>

              {/* Détail par coiffeur */}
              <section className="card bg-base-100 shadow-lg border border-base-200">
                <div className="card-body p-4 md:p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h2 className="card-title text-lg md:text-xl">
                        Détail par coiffeur
                      </h2>
                      <p className="text-xs md:text-sm text-base-content/70">
                        Nombre de services, chiffre d&apos;affaires et salaire.
                      </p>
                    </div>
                    <span className="badge badge-primary badge-outline badge-sm w-24 md:mt-4">
                      {report.barbers.length} coiffeur(s)
                    </span>
                  </div>

                  {report.barbers.length === 0 ? (
                    <div className="alert alert-info mt-2">
                      <div>
                        <span className="font-medium">Aucune donnée pour cette période.</span>
                        <span className="text-xs md:text-sm">
                          Ajoutez des transactions pour ce mois afin de voir les salaires à calculer.
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto -mx-2 md:mx-0">
                      <table className="table c table-sm md:table-md">
                        <thead>
                          <tr className="text-xs uppercase text-base-content/60">
                            <th>Coiffeur</th>
                            <th className="text-right">% Salaire</th>
                            <th className="text-right">Services</th>
                            <th className="text-right">Total encaissé</th>
                            <th className="text-right">Salaire à verser</th>
                            <th className="text-right">Part du salon</th>
                          </tr>
                        </thead>
                        <tbody>
                          {report.barbers.map((b) => (
                            <tr key={b.barber_id}>
                              <td className="whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                  <div className="avatar placeholder">
                                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                                      <span className="text-xl font-bold text-base-content">
                                        {b.barber_name[0]}
                                      </span>
                                    </div>
                                  </div>
                                  <div>
                                    <p className="font-semibold text-sm">
                                      {b.barber_name}
                                    </p>
                                    <p className="text-xs text-base-content/60">
                                      ID: {b.barber_id.slice(0, 8)}…
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="text-right text-xs md:text-sm">
                                {b.salary_percentage}%
                              </td>
                              <td className="text-right text-xs md:text-sm">
                                {b.service_count}
                              </td>
                              <td className="text-right font-medium text-xs md:text-sm whitespace-nowrap">
                                {b.total_revenue} FCFA
                              </td>
                              <td className="text-right font-semibold text-xs md:text-sm text-success whitespace-nowrap">
                                {b.barber_salary} FCFA
                              </td>
                              <td className="text-right font-medium text-xs md:text-sm text-base-content/80 whitespace-nowrap">
                                {b.salon_share} FCFA
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </section>
            </>
          ) : (
            // État vide avant recherche
            <section className="card bg-base-200/70 border border-dashed border-base-300">
              <div className="card-body flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h2 className="card-title text-lg md:text-xl">
                    Choisissez une période pour voir les salaires
                  </h2>
                  <p className="text-xs md:text-sm text-base-content/70 max-w-xl">
                    Sélectionnez un mois et une année, puis cliquez sur &quot;Appliquer&quot; pour générer le rapport détaillé de votre équipe.
                  </p>
                </div>
                <div className="hidden md:flex flex-col items-end text-right text-xs md:text-sm text-base-content/60">
                  <p>Astuce : utilisez toujours la même période</p>
                  <p>pour comparer facilement les performances de vos coiffeurs.</p>
                </div>
              </div>
            </section>
          )}

        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SalaryPage;