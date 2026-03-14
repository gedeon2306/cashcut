'use client'

import Footer from "@/src/components/Footer";
import NavBar from "@/src/components/NavBar";
import { useEffect, useState, useRef } from 'react';
import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  EllipsisVertical,
  Plus,
  SquarePen,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import { addTransaction, deleteTransaction, getTransactions, updateTransaction } from "@/src/app/actions/actions";

const PAGE_SIZE = 15;

const TransactionPage = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [barbers, setBarbers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [idDeletting, setIdDeletting] = useState('');
  const [deleteItem, setDeleteItem] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const addModalRef = useRef<HTMLDialogElement>(null);
  const addFormRef = useRef<HTMLFormElement>(null);
  const editModalRef = useRef<HTMLDialogElement>(null);
  const editFormRef = useRef<HTMLFormElement>(null);
  const deleteModalRef = useRef<HTMLDialogElement>(null);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);

  const loadTransactions = async (page: number) => {
    setLoading(true);
    const data = await getTransactions(page);
    setTransactions(data.results ?? []);
    setBarbers(data.barbers ?? []);
    setTotalPages(Math.ceil(data.count / PAGE_SIZE));
    setLoading(false);
  };

  useEffect(() => {
    loadTransactions(currentPage);
  }, [currentPage]);

  const handleAddTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const barberInput = addFormRef.current?.elements.namedItem('barber') as HTMLInputElement;
    const serviceInput = addFormRef.current?.elements.namedItem('service') as HTMLInputElement;
    const amountInput = addFormRef.current?.elements.namedItem('amount') as HTMLInputElement;
    const paymentMethodInput = addFormRef.current?.elements.namedItem('payment_method') as HTMLInputElement;
    const dateInput = addFormRef.current?.elements.namedItem('date') as HTMLInputElement;

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

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const result = await addTransaction(formData);
    setIsSubmitting(false);

    if (result) {
      toast.success('Transaction ajoutée avec succès !');
      addFormRef.current?.reset();
      addModalRef.current?.close();
      await loadTransactions(currentPage);
    } else {
      toast.error("Erreur lors de l'ajout. Veuillez réessayer.");
    }
  };

  const handleOpenDelete = (id: any) => {
    setDeleteItem(id);
    deleteModalRef.current?.showModal();
  };

  const handleDelete = async (id: string) => {
    setIdDeletting(id);
    const success = await deleteTransaction(id);
    if (success) {
      toast.success('Transaction supprimée !');
      await loadTransactions(currentPage);
    } else {
      toast.error('Erreur lors de la suppression.');
    }
    setIdDeletting('');
    setDeleteItem('');
    deleteModalRef.current?.close();
  };

  const handleOpenEdit = (transaction: any) => {
    setEditingTransaction(transaction);
    editModalRef.current?.showModal();
  };

  const handleUpdateTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const barberInput = editFormRef.current?.elements.namedItem('barber') as HTMLInputElement;
    const serviceInput = editFormRef.current?.elements.namedItem('service') as HTMLInputElement;
    const amountInput = editFormRef.current?.elements.namedItem('amount') as HTMLInputElement;
    const paymentMethodInput = editFormRef.current?.elements.namedItem('payment_method') as HTMLInputElement;
    const dateInput = editFormRef.current?.elements.namedItem('date') as HTMLInputElement;

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

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const result = await updateTransaction(editingTransaction.id, formData);
    setIsSubmitting(false);

    if (result) {
      toast.success('Transaction modifiée avec succès !');
      editFormRef.current?.reset();
      editModalRef.current?.close();
      setEditingTransaction(null);
      await loadTransactions(currentPage);
    } else {
      toast.error('Erreur lors de la modification.');
    }
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateEnregistrement = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalPageRevenue = transactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  return (
    <div className="min-h-screen bg-base-100">
      <NavBar />
      <main className="px-4 md:px-8 pt-28 pb-16">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* En-tête */}
          <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Gestion des transactions
              </h1>
              <p className="text-sm md:text-base text-base-content/70">
                Suivez chaque service réalisé dans votre salon, avec le montant et le moyen de paiement.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 items-center justify-between md:justify-end">
              <div className="badge badge-outline badge-lg gap-1">
                <CreditCard className="w-3 h-3" />
                <span>{transactions.length} transaction(s) sur cette page</span>
              </div>
              <button
                onClick={() => addModalRef.current?.showModal()}
                className="btn btn-primary btn-sm md:btn-md gap-2"
              >
                <Plus className="w-4 h-4" />
                Nouvelle transaction
              </button>
            </div>
          </section>

          {/* Résumé rapide */}
          <section className="grid gap-4 md:grid-cols-3">
            <div className="card bg-base-100 shadow-md border border-base-200">
              <div className="card-body p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-base-content/70 uppercase tracking-wide">
                    Transactions (page)
                  </p>
                  <div className="rounded-full p-2 bg-primary/10 border border-base-200">
                    <CreditCard className="w-4 h-4 text-primary" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{transactions.length}</p>
                <p className="text-xs text-base-content/60">
                  Nombre de lignes affichées sur cette page.
                </p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-md border border-base-200">
              <div className="card-body p-4 space-y-2">
                <p className="text-xs font-medium text-base-content/70 uppercase tracking-wide">
                  Pagination
                </p>
                <p className="text-2xl font-bold">
                  {currentPage} / {totalPages || 1}
                </p>
                <p className="text-xs text-base-content/60">
                  Navigation entre les pages pour voir vos transactions.
                </p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-md border border-base-200">
              <div className="card-body p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-base-content/70 uppercase tracking-wide">
                    Total encaissé (page)
                  </p>
                  <div className="rounded-full p-2 bg-secondary/10 border border-base-200">
                    <BarChart3 className="w-4 h-4 text-secondary" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{totalPageRevenue} FCFA</p>
                <p className="text-xs text-base-content/60">
                  Somme de toutes les transactions visibles.
                </p>
              </div>
            </div>
          </section>

          {/* Tableau des transactions */}
          <section>
            <div className="card bg-base-100 shadow-lg border border-base-200">
              <div className="card-body p-0">
                <div className="overflow-x-auto rounded-2xl">
                  <table className="table table-zebra-zebra table-sm md:table-md">
                    <thead className="bg-base-200">
                      <tr className="text-xs uppercase text-base-content/60">
                        <th></th>
                        <th>Coiffeur</th>
                        <th>Service</th>
                        <th>Prix</th>
                        <th>Moyen</th>
                        <th>Date</th>
                        <th>Enregistrement</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={7} className="text-center py-6">
                            <span className="loading loading-spinner loading-sm" />
                          </td>
                        </tr>
                      ) : transactions.length ? (
                        transactions.map((transaction) => (
                          <tr key={transaction.id}>
                            <td className="relative">
                              <div className="dropdown dropdown-bottom">
                                <div
                                  tabIndex={0}
                                  role="button"
                                  className="btn btn-ghost btn-xs md:btn-sm m-1"
                                >
                                  <EllipsisVertical className="w-5 h-5" />
                                </div>
                                <ul
                                  tabIndex={0}
                                  className="dropdown-content absolute top-[-20] left-10 z-10 menu p-2 shadow-2xl bg-base-200 rounded-box"
                                >
                                  <li>
                                    <button
                                      disabled={idDeletting === transaction.id}
                                      type="button"
                                      className="tooltip tooltip-right"
                                      data-tip="Modifier"
                                      onClick={() => handleOpenEdit(transaction)}
                                    >
                                      <SquarePen className="w-4 h-4 text-success" />
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      disabled={idDeletting === transaction.id}
                                      type="button"
                                      className="tooltip tooltip-right"
                                      data-tip="Supprimer"
                                      onClick={() => handleOpenDelete(transaction.id)}
                                    >
                                      {idDeletting === transaction.id ? (
                                        <span className="loading loading-spinner loading-xs text-error" />
                                      ) : (
                                        <Trash2 className="w-4 h-4 text-error" />
                                      )}
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            </td>
                            <td className="whitespace-nowrap text-xs md:text-sm">{transaction.barber.barber_name}</td>
                            <td className="whitespace-nowrap text-xs md:text-sm">{transaction.service}</td>
                            <td className="whitespace-nowrap font-semibold text-xs md:text-sm">{transaction.amount} FCFA</td>
                            <td className="whitespace-nowrap text-xs md:text-sm">
                              <span className="badge badge-ghost badge-xs md:badge-sm capitalize">
                                {transaction.payment_method}
                              </span>
                            </td>
                            <td className="whitespace-nowrap text-xs md:text-sm text-base-content/70">{formatDate(transaction.date)}</td>
                            <td className="whitespace-nowrap text-xs md:text-sm text-base-content/70">{formatDateEnregistrement(transaction.created_at)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr className="text-center text-sm">
                          <td colSpan={7} className="py-6">
                            Aucune transaction enregistrée.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* Pagination */}
          {totalPages > 1 && (
            <section className="flex justify-end">
              <div className="join">
                <button
                  className="join-item btn btn-sm"
                  onClick={() => setCurrentPage((p) => p - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`join-item btn btn-sm ${
                      currentPage === page ? 'btn-active btn-primary' : ''
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  className="join-item btn btn-sm"
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </section>
          )}
        </div>

        {/* MODAL AJOUT */}
        <dialog ref={addModalRef} className="modal backdrop-blur">
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
              ref={addFormRef}
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
                  {barbers.map((barber) => (
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
                disabled={isSubmitting}
                className="btn btn-primary w-full gap-2"
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                {isSubmitting ? 'Ajout en cours...' : 'Ajouter'}
              </button>
            </form>
          </div>
        </dialog>

        {/* MODAL MODIFICATION */}
        <dialog ref={editModalRef} className="modal backdrop-blur">
          <div className="modal-box">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg">
              Modifier transaction :{" "}
              {editingTransaction?.barber.barber_name &&
                `${editingTransaction.barber.barber_name} - ${formatDateEnregistrement(
                  editingTransaction.date
                )}`}
            </h3>
            <form
              ref={editFormRef}
              onSubmit={handleUpdateTransaction}
              className="flex flex-col gap-4 mt-4"
            >
              <div className="flex flex-col gap-2">
                <label className="label text-xs font-semibold">Coiffeur</label>
                <select
                  name="barber"
                  key={editingTransaction?.barber.id}
                  defaultValue={editingTransaction?.barber.id}
                  className="select select-bordered focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
                >
                  {barbers.map((barber) => (
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
                  key={editingTransaction?.service}
                  defaultValue={editingTransaction?.service}
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
                  name="amount"
                  key={editingTransaction?.amount}
                  defaultValue={editingTransaction?.amount}
                  className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
                  placeholder="Ex: 1500"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="label text-xs font-semibold">Moyen de paiement</label>
                <select
                  name="payment_method"
                  key={editingTransaction?.payment_method}
                  defaultValue={editingTransaction?.payment_method}
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
                  key={editingTransaction?.date}
                  defaultValue={
                    editingTransaction?.date
                      ? new Date(editingTransaction.date).toISOString().split('T')[0]
                      : ''
                  }
                  className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full gap-2"
              >
                {isSubmitting ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  <SquarePen className="w-4 h-4" />
                )}
                {isSubmitting ? 'Modification en cours...' : 'Modifier'}
              </button>
            </form>
          </div>
        </dialog>

        {/* MODAL SUPPRESSION */}
        <dialog
          ref={deleteModalRef}
          className="modal modal-bottom sm:modal-middle backdrop-blur"
        >
          <div className="modal-box">
            <h3 className="font-bold text-lg">Attention !</h3>
            <p className="py-4 text-sm md:text-base">
              Voulez-vous vraiment supprimer cette transaction ? Cette action est
              irréversible.
            </p>
            <div className="flex justify-center gap-2">
              <button
                type="button"
                onClick={() => {
                  deleteModalRef.current?.close();
                  setDeleteItem('');
                }}
                className="btn btn-ghost"
              >
                Non, annuler
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteItem)}
                disabled={idDeletting === deleteItem}
                className="btn btn-error gap-2"
              >
                {idDeletting === deleteItem ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                {idDeletting === deleteItem ? 'Suppression en cours...' : 'Oui, supprimer'}
              </button>
            </div>
          </div>
        </dialog>
        
      </main>
      <Footer />
    </div>
  );
};

export default TransactionPage;