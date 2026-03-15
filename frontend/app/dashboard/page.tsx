"use client";

import Footer from "@/src/components/Footer";
import NavBar from "@/src/components/NavBar";
import { addBarber, addTransaction, dashboard } from "@/src/app/actions/actions";
import { ROUTES } from "@/src/constants/routes";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Plus,
  RefreshCw,
  Scissors,
  Users,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useRef } from 'react';
import toast from "react-hot-toast";

type DashboardData = {
  user: {
    name: string;
    ville: string;
  }
  today_revenue: number | string | null;
  yesterday_revenue: number | string | null;
  barber_count: number;
  total_salaries_to_pay: number | string | null;
  last_transactions: {
    id: string;
    service: string;
    amount: number | string;
    payment_method: string;
    date: string;
    barber_name: string;
  }[];
  ranking: {
    barber_id: string;
    barber_name: string;
    service_count: number;
    total_revenue: number | string;
    rank: number;
  }[];
  barbers:{
    id: string;
    barber_name: string;
  }[];
};

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false)
  const [isSubmittingTransaction, setIsSubmittingTransaction] = useState(false);
  const [isSubmittingBarber, setIsSubmittingBarber] = useState(false);

  const addModalTransactionRef = useRef<HTMLDialogElement>(null);
  const addFormTransactionRef = useRef<HTMLFormElement>(null);
  const addModalBarberRef = useRef<HTMLDialogElement>(null);
  const addFormBarberRef = useRef<HTMLFormElement>(null);

  const load = async () => {
    setLoading(true)
    const result = await dashboard();
    setData(result as DashboardData);
    setLoading(false)
  }

  useEffect(() => {
    load();
  }, []);

  const todayRevenue = data?.today_revenue ?? null;
  const yesterdayRevenue = data?.yesterday_revenue ?? null;

  const handleAddTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const barberInput = addFormTransactionRef.current?.elements.namedItem('barber') as HTMLInputElement;
    const serviceInput = addFormTransactionRef.current?.elements.namedItem('service') as HTMLInputElement;
    const amountInput = addFormTransactionRef.current?.elements.namedItem('amount') as HTMLInputElement;
    const paymentMethodInput = addFormTransactionRef.current?.elements.namedItem('payment_method') as HTMLInputElement;
    const dateInput = addFormTransactionRef.current?.elements.namedItem('date') as HTMLInputElement;

    if (
      !barberInput?.value.trim() ||
      !serviceInput?.value.trim() ||
      !amountInput?.value.trim() ||
      !paymentMethodInput?.value.trim() ||
      !dateInput?.value.trim()
    ) {
      toast.error('Remplissez tous les champs');
      return;
    }

    setIsSubmittingTransaction(true);
    const formData = new FormData(e.currentTarget);
    const result = await addTransaction(formData);
    setIsSubmittingTransaction(false);

    if (result) {
      toast.success('Transaction ajoutée avec succès !');
      addFormTransactionRef.current?.reset();
      addModalTransactionRef.current?.close();
      await load();
    } else {
      toast.error("Erreur lors de l'ajout. Veuillez réessayer.");
    }
  };

  const handleAddBarber = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nameInput = addFormBarberRef.current?.elements.namedItem('name') as HTMLInputElement;
    const salaryInput = addFormBarberRef.current?.elements.namedItem('salary') as HTMLInputElement;

    if (!nameInput?.value.trim() || !salaryInput?.value.trim()) {
      toast.error('Remplissez tous les champs');
      return;
    }

    setIsSubmittingBarber(true);
    const formData = new FormData(e.currentTarget);
    const result = await addBarber(formData);
    setIsSubmittingBarber(false);

    if (result) {
      toast.success('Coiffeur ajouté avec succès !');
      addFormBarberRef.current?.reset();
      addModalBarberRef.current?.close();
      await load();
    } else {
      toast.error("Erreur lors de l'ajout. Veuillez réessayer.");
    }
  };

  const timeAgo = (dateStr: string): string => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "À l'instant";
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${days}j`;
  };

  return (
    <div className="min-h-screen bg-base-100">
      <NavBar />

      <main className="px-4 md:px-8 pt-28 pb-16">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* En-tête du tableau de bord */}
          <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Tableau de bord
              </h1>
              <p className="text-sm md:text-base text-base-content/70 mt-1">
                Vue d&apos;ensemble de l&apos;activité de votre salon aujourd&apos;hui.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <div className="badge badge-outline badge-lg border-base-300">
                {`${data?.user.name} - ${data?.user.ville}`}
              </div>
              <button disabled={loading} onClick={()=>{load()}} className="btn btn-sm join-item btn-outline btn-secondary">
                {loading ? <span className="loading loading-spinner w-4 h-4 mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                Aujourd&apos;hui
              </button>
            </div>
          </section>

          {/* Statistiques principales */}
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {/* CA du jour */}
            <div className="card bg-base-100 shadow-lg border border-base-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="card-body p-4 md:p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-base-content/70 uppercase tracking-wide">
                    Chiffre d&apos;affaires du jour
                  </p>
                  <div className="rounded-full p-2 bg-linear-to-br from-primary/20 to-primary/5 border border-base-200">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-bold">
                  {todayRevenue ?? "—"}
                  {todayRevenue !== null ? " FCFA" : ""}
                </p>
                {typeof yesterdayRevenue !== "number" &&
                typeof yesterdayRevenue !== "string" ? (
                  <p className="text-xs text-base-content/60">
                    Aucune donnée de comparaison.
                  </p>
                ) : Number(yesterdayRevenue) > 0 ? (
                  (() => {
                    const today = Number(todayRevenue) || 0;
                    const yesterday = Number(yesterdayRevenue) || 0;
                    const pct = ((today - yesterday) / yesterday) * 100;
                    const isUp = pct >= 0;

                    return (
                      <p
                        className={`flex items-center gap-1 text-xs font-medium ${
                          isUp ? "text-success" : "text-error"
                        }`}
                      >
                        {isUp ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        {pct.toFixed(1)}% vs hier
                      </p>
                    );
                  })()
                ) : (
                  <p className="text-xs text-base-content/60">
                    Aucune donnée de comparaison.
                  </p>
                )}
              </div>
            </div>

            {/* CA d'hier */}
            <div className="card bg-base-100 shadow-lg border border-base-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="card-body p-4 md:p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-base-content/70 uppercase tracking-wide">
                    Chiffre d&apos;affaires d&apos;hier
                  </p>
                  <div className="rounded-full p-2 bg-linear-to-br from-base-300/60 to-base-100 border border-base-200">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-bold">
                  {yesterdayRevenue ?? "—"}
                  {yesterdayRevenue !== null ? " FCFA" : ""}
                </p>
                <p className="text-xs text-base-content/60">
                  Sert de base de comparaison au jour actuel.
                </p>
              </div>
            </div>

            {/* Nombre de coiffeurs */}
            <div className="card bg-base-100 shadow-lg border border-base-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="card-body p-4 md:p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-base-content/70 uppercase tracking-wide">
                    Nombre de coiffeurs
                  </p>
                  <div className="rounded-full p-2 bg-linear-to-br from-secondary/20 to-secondary/5 border border-base-200">
                    <Scissors className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-bold">
                  {data ? data.barber_count.toString() : "—"}
                </p>
                <p className="text-xs text-base-content/60">
                  Nombre total de coiffeurs enregistrés dans votre salon.
                </p>
              </div>
            </div>

            {/* Salaires à verser */}
            <div className="card bg-base-100 shadow-lg border border-base-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="card-body p-4 md:p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-base-content/70 uppercase tracking-wide">
                    Salaires à verser (mois en cours)
                  </p>
                  <div className="rounded-full p-2 bg-linear-to-br from-success/20 to-success/5 border border-base-200">
                    <Wallet className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-bold">
                  {data?.total_salaries_to_pay ?? "—"}
                  {data?.total_salaries_to_pay !== null &&
                  data?.total_salaries_to_pay !== undefined
                    ? " FCFA"
                    : ""}
                </p>
                <p className="text-xs text-base-content/60">
                  Estimation totale à payer à vos coiffeurs pour le mois actuel.
                </p>
              </div>
            </div>
          </section>

          {/* Activité récente & performance des coiffeurs */}
          <section className="grid gap-6 lg:grid-cols-3">
            {/* Activité récente */}
            <div className="lg:col-span-2 card bg-base-100 shadow-lg border border-base-200 overflow-x-auto">
              <div className="card-body p-4 md:p-6 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h2 className="card-title text-lg md:text-xl">
                      Activité récente
                    </h2>
                    <p className="text-xs md:text-sm text-base-content/70">
                      Dernières transactions enregistrées dans CashCut.
                    </p>
                  </div>
                  <Link href={ROUTES.DASHBOARD.TRANSACTIONS} className="btn btn-ghost btn-sm">
                    Voir tout
                  </Link>
                </div>

                <div className="overflow-x-auto -mx-2 md:mx-0">
                  {data && data.last_transactions.length > 0 ? (
                    <table className="table table-zebra-zebra table-sm md:table-md">
                      <thead>
                        <tr className="text-xs uppercase text-base-content/60">
                          <th>Coiffeur</th>
                          <th>Service</th>
                          <th>Montant</th>
                          <th>Moyen</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.last_transactions.map((trx) => (
                          <tr key={trx.id}>
                            <td className="whitespace-nowrap text-xs md:text-sm">
                              {trx.barber_name}
                            </td>
                            <td className="whitespace-nowrap text-xs md:text-sm">
                              {trx.service}
                            </td>
                            <td className="whitespace-nowrap font-semibold text-xs md:text-sm">
                              {trx.amount} FCFA
                            </td>
                            <td className="whitespace-nowrap">
                              <span className="badge badge-ghost badge-xs md:badge-sm capitalize">
                                {trx.payment_method}
                              </span>
                            </td>
                            <td className="whitespace-nowrap text-xs text-base-content/70">
                              <div className="tooltip tooltip-primary" data-tip={new Date(trx.date).toLocaleString("fr-FR")}>
                                {timeAgo(trx.date)}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="py-6 text-sm text-base-content/60 text-center">
                      Aucune transaction récente à afficher.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Performance des coiffeurs */}
            <div className="card bg-base-100 shadow-lg border border-base-200">
              <div className="card-body p-4 md:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="card-title text-lg md:text-xl">
                      Performance des coiffeurs
                    </h2>
                    <p className="text-xs md:text-sm text-base-content/70">
                      Classement basé sur le chiffre d&apos;affaires du jour.
                    </p>
                  </div>
                  <span className="badge badge-primary badge-outline badge-sm w-24 md:mt-4">
                    Temps réel
                  </span>
                </div>

                <div className="space-y-3">
                  {data && data.ranking.length > 0 ? (
                    data.ranking.map((barber) => (
                      <div
                        key={barber.barber_id}
                        className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-base-200/60 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="avatar placeholder">
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                              <span className="text-xl font-bold text-base-content">
                                {barber.barber_name[0]}
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="font-semibold text-sm">
                              {barber.barber_name}
                            </p>
                            <p className="text-xs text-base-content/70">
                              {barber.service_count} services aujourd&apos;hui
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">
                            {barber.total_revenue} FCFA
                          </p>
                          <p className="text-xs text-base-content/60">
                            Rang #{barber.rank}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-base-content/60">
                      Aucun classement disponible pour aujourd&apos;hui.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Actions rapides */}
          <section className="card bg-base-200/70 border border-dashed border-base-300">
            <div className="card-body flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="card-title text-lg md:text-xl">
                  Gagner du temps au quotidien
                </h2>
                <p className="text-xs md:text-sm text-base-content/70 max-w-xl">
                  Accédez rapidement aux actions les plus utilisées dans CashCut.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button onClick={() => addModalTransactionRef.current?.showModal()} className="btn btn-primary btn-sm md:btn-md">
                  <Plus className="w-4 h-4" /> Nouvelle transaction
                </button>
                <button onClick={() => addModalBarberRef.current?.showModal()} className="btn btn-outline btn-secondary btn-sm md:btn-md">
                  <Plus className="w-4 h-4" /> Ajouter un coiffeur
                </button>
                <Link href={ROUTES.DASHBOARD.SALARY} className="btn btn-ghost btn-sm md:btn-md">
                  <BarChart3 className="w-4 h-4" /> Voir les rapports
                </Link>
              </div>
            </div>
          </section>
        </div>

        {/* MODAL AJOUT TRANSACTION */}
        <dialog ref={addModalTransactionRef} className="modal backdrop-blur">
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg">Nouvelle transaction</h3>
            <p className="text-xs text-base-content/60 mt-1">
              Enregistrez un nouveau service réalisé dans votre salon.
            </p>
            <form
              ref={addFormTransactionRef}
              onSubmit={handleAddTransaction}
              className="flex flex-col gap-4 mt-4"
            >
              <div className="flex flex-col gap-2">
                <label className="label text-xs font-semibold">Coiffeur</label>
                <select
                  name="barber"
                  defaultValue={''}
                  className="select select-bordered focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
                >
                  <option disabled value={''}>
                    Sélectionnez un coiffeur
                  </option>
                  {data?.barbers.map((barber) => (
                    <option key={barber.id} value={barber.id}>
                      {barber.barber_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="label text-xs font-semibold">Service</label>
                <input
                  type="text"
                  list="coupes"
                  name="service"
                  className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
                  placeholder="Ex : Coupe simple"
                  required
                />
                <datalist id="coupes">
                  <option value="Dégradé" />
                  <option value="Taper" />
                  <option value="Boule à Z" />
                  <option value="Autre" />
                </datalist>
              </div>
              <div className="flex flex-col gap-2">
                <label className="label text-xs font-semibold">Prix (FCFA)</label>
                <input
                  type="number"
                  step={500}
                  min={500}
                  defaultValue={1000}
                  name="amount"
                  className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
                  placeholder="Ex: 1500"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="label text-xs font-semibold">Moyen de paiement</label>
                <select
                  defaultValue="Espèce"
                  name="payment_method"
                  className="select select-bordered focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
                >
                  <option value={'Espèce'}>Espèce</option>
                  <option value={'Mobile Money'}>Mobile Money</option>
                  <option value={'Airtel Money'}>Airtel Money</option>
                  <option value={'Virement'}>Virement</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="label text-xs font-semibold">Date du service</label>
                <input
                  type="date"
                  name="date"
                  className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmittingTransaction}
                className="btn btn-primary w-full gap-2"
              >
                {isSubmittingTransaction ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                {isSubmittingTransaction ? 'Ajout en cours...' : 'Ajouter'}
              </button>
            </form>
          </div>
        </dialog>

        {/* MODAL AJOUT BARBER */}
        <dialog ref={addModalBarberRef} className="modal backdrop-blur">
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg">Nouveau coiffeur</h3>
            <p className="text-xs text-base-content/60 mt-1">
              Définissez le nom et le pourcentage de salaire pour ce coiffeur.
            </p>
            <form
              ref={addFormBarberRef}
              onSubmit={handleAddBarber}
              className="flex flex-col gap-4 mt-4"
            >
              <div className="flex flex-col gap-2">
                <label className="label text-xs font-semibold">Nom du coiffeur</label>
                <input
                  type="text"
                  name="name"
                  className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
                  placeholder="Entrez le nom du coiffeur"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="label text-xs font-semibold">Salaire (%)</label>
                <input
                  type="number"
                  step={1}
                  min={1}
                  max={100}
                  defaultValue={40}
                  name="salary"
                  className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
                  placeholder="Ex: 40"
                  required
                />
                <p className="text-[11px] text-base-content/60">
                  Exemple: 40 signifie que ce coiffeur reçoit 40% du montant de chaque
                  service.
                </p>
              </div>
              <button
                type="submit"
                disabled={isSubmittingBarber}
                className="btn btn-primary w-full gap-2"
              >
                {isSubmittingBarber ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                {isSubmittingBarber ? 'Ajout en cours...' : 'Ajouter'}
              </button>
            </form>
          </div>
        </dialog>

      </main>

      <Footer />

    </div>
  );
};

export default Dashboard;