'use client'

import Footer from "@/src/components/Footer";
import NavBar from "@/src/components/NavBar";
import { useEffect, useState, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  EllipsisVertical,
  Plus,
  Scissors,
  SquarePen,
  Trash2,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import { addBarber, deleteBarber, getBarbers, updateBarber } from "@/src/app/actions/actions";

const PAGE_SIZE = 5;

const BarberPage = () => {
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
  const [editingBarber, setEditingBarber] = useState<any>(null);

  const loadBarbers = async (page: number) => {
    setLoading(true);
    const data = await getBarbers(page);
    setBarbers(data.results);
    setTotalPages(Math.ceil(data.count / PAGE_SIZE));
    setLoading(false);
  };

  useEffect(() => {
    loadBarbers(currentPage);
  }, [currentPage]);

  const handleAddBarber = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nameInput = addFormRef.current?.elements.namedItem('name') as HTMLInputElement;
    const salaryInput = addFormRef.current?.elements.namedItem('salary') as HTMLInputElement;

    if (!nameInput?.value.trim() || !salaryInput?.value.trim()) {
      toast.error('Remplissez tous les champs');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const result = await addBarber(formData);
    setIsSubmitting(false);

    if (result) {
      toast.success('Coiffeur ajouté avec succès !');
      addFormRef.current?.reset();
      addModalRef.current?.close();
      await loadBarbers(currentPage);
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
    const success = await deleteBarber(id);
    if (success) {
      toast.success('Coiffeur supprimé !');
      await loadBarbers(currentPage);
    } else {
      toast.error('Erreur lors de la suppression.');
    }
    setIdDeletting('');
    setDeleteItem('');
    deleteModalRef.current?.close();
  };

  const handleOpenEdit = (barber: any) => {
    setEditingBarber(barber);
    editModalRef.current?.showModal();
  };

  const handleUpdateBarber = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nameInput = editFormRef.current?.elements.namedItem('name') as HTMLInputElement;
    const salaryInput = editFormRef.current?.elements.namedItem('salary') as HTMLInputElement;

    if (!nameInput?.value.trim() || !salaryInput?.value.trim()) {
      toast.error('Remplissez tous les champs');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const result = await updateBarber(editingBarber.id, formData);
    setIsSubmitting(false);

    if (result) {
      toast.success('Coiffeur modifié avec succès !');
      editFormRef.current?.reset();
      editModalRef.current?.close();
      setEditingBarber(null);
      await loadBarbers(currentPage);
    } else {
      toast.error('Erreur lors de la modification.');
    }
  };

  return (
    <div className="min-h-screen bg-base-100">
      <NavBar />
      <main className="px-4 md:px-8 pt-28 pb-16">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* En-tête + résumé rapide */}
          <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                Gestion des coiffeurs
              </h1>
              <p className="text-sm md:text-base text-base-content/70">
                Organisez votre équipe et définissez le pourcentage de salaire de chaque coiffeur.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 items-center justify-between md:justify-end">
              <div className="badge badge-outline badge-lg gap-1">
                <Users className="w-3 h-3" />
                <span>{barbers.length} coiffeur(s) sur cette page</span>
              </div>
              <button
                onClick={() => addModalRef.current?.showModal()}
                className="btn btn-primary btn-sm md:btn-md gap-2"
              >
                <Plus className="w-4 h-4" />
                Nouveau coiffeur
              </button>
            </div>
          </section>

          {/* Résumé des coiffeurs */}
          <section className="grid gap-4 md:grid-cols-3">
            <div className="card bg-base-100 shadow-md border border-base-200">
              <div className="card-body p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-base-content/70 uppercase tracking-wide">
                    Coiffeurs actifs (page)
                  </p>
                  <div className="rounded-full p-2 bg-primary/10 border border-base-200">
                    <Scissors className="w-4 h-4 text-primary" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{barbers.length}</p>
                <p className="text-xs text-base-content/60">
                  Nombre de coiffeurs affichés sur cette page.
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
                  Navigation entre les pages de votre équipe.
                </p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-md border border-dashed border-base-300">
              <div className="card-body p-4 space-y-2">
                <p className="text-xs font-medium text-base-content/70 uppercase tracking-wide">
                  Astuce
                </p>
                <p className="text-xs md:text-sm text-base-content/70">
                  Ajustez le pourcentage de salaire par coiffeur pour équilibrer vos coûts et votre marge.
                </p>
              </div>
            </div>
          </section>

          {/* Tableau des coiffeurs */}
          <section>
            <div className="card bg-base-100 shadow-lg border border-base-200">
              <div className="card-body p-0">
                <div className="overflow-x-auto rounded-2xl">
                  <table className="table table-zebra-zebra table-sm md:table-md">
                    <thead className="bg-base-200">
                      <tr className="text-xs uppercase text-base-content/60">
                        <th></th>
                        <th>Coiffeur</th>
                        <th className="text-right">Salaire (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={3} className="text-center py-6">
                            <span className="loading loading-spinner loading-sm" />
                          </td>
                        </tr>
                      ) : barbers.length ? (
                        barbers.map((barber) => (
                          <tr key={barber.id}>
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
                                      disabled={idDeletting === barber.id}
                                      type="button"
                                      className="tooltip tooltip-right"
                                      data-tip="Modifier"
                                      onClick={() => handleOpenEdit(barber)}
                                    >
                                      <SquarePen className="w-4 h-4 text-success" />
                                    </button>
                                  </li>
                                  <li>
                                    <button
                                      disabled={idDeletting === barber.id}
                                      type="button"
                                      className="tooltip tooltip-right"
                                      data-tip="Supprimer"
                                      onClick={() => handleOpenDelete(barber.id)}
                                    >
                                      {idDeletting === barber.id ? (
                                        <span className="loading loading-spinner loading-xs text-error" />
                                      ) : (
                                        <Trash2 className="w-4 h-4 text-error" />
                                      )}
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            </td>
                            <td className="whitespace-nowrap">
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
                                  <p className="text-xs text-base-content/60">
                                    Salaire: {barber.salary}%
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="text-right font-medium text-xs md:text-sm">
                              {barber.salary}%
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="text-center text-sm">
                          <td colSpan={3} className="py-6">
                            Aucun coiffeur enregistré.
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
            <h3 className="font-bold text-lg">Nouveau coiffeur</h3>
            <p className="text-xs text-base-content/60 mt-1">
              Définissez le nom et le pourcentage de salaire pour ce coiffeur.
            </p>
            <form
              ref={addFormRef}
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
                  step={10}
                  min={10}
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
              Modifier : {editingBarber?.barber_name}
            </h3>
            <form
              ref={editFormRef}
              onSubmit={handleUpdateBarber}
              className="flex flex-col gap-4 mt-4"
            >
              <div className="flex flex-col gap-2">
                <label className="label text-xs font-semibold">Nom du coiffeur</label>
                <input
                  type="text"
                  name="name"
                  className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
                  defaultValue={editingBarber?.barber_name}
                  key={editingBarber?.id + '-text'}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="label text-xs font-semibold">Salaire (%)</label>
                <input
                  type="number"
                  step={10}
                  min={10}
                  max={100}
                  defaultValue={editingBarber?.salary}
                  name="salary"
                  className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
                  key={editingBarber?.id + '-salary'}
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
              Supprimer ce coiffeur et toutes ses données enregistrées ? Cette action est
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

export default BarberPage;