'use client'

import NavBar from "@/src/components/NavBar";
import { getUserProfile, updateUserProfile, deleteUserProfile, updatePassword } from '@/src/app/actions/actions';
import { useEffect, useState, useRef } from 'react';
import { ROUTES } from "@/src/constants/routes";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Save, Trash2 } from "lucide-react";
import axios from "axios";
import Footer from "@/src/components/Footer";

const SettingPage = () => {

  const router = useRouter()
  const [profile, setProfile] = useState<{ id: string; name: string; email: string; ville: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletting, setIsDeletting] = useState(false);
  const [isUpdatting, setIsUpdatting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const deleteModalRef = useRef<HTMLDialogElement>(null);
  const [deleteConfirm, setDeleteConfirm] = useState('')

  useEffect(() => {
    const loadProfile = async () => {
      const data = await getUserProfile();
      setProfile(data);
      setLoading(false);
    };
    loadProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const result = await updateUserProfile(formData);
    setIsSubmitting(false);

    if (result) {
      toast.success('Profil mis à jour avec succès !');
      setProfile(result);
    } else {
      toast.error('Erreur lors de la mise à jour.');
    }
  };

  const handleOpenDelete = () => {
    if (deleteConfirm !== 'SUPPRIMER') {
      toast.error('Veuillez taper SUPPRIMER pour confirmer la suppression.');
      return;
    }

    deleteModalRef.current?.showModal();
  };

  const handleDeleteAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsDeletting(true);
    const success = await deleteUserProfile();
    setIsDeletting(false);
    setDeleteConfirm('');
    deleteModalRef.current?.close();

    if (success) {
      toast.success('Compte supprimé avec succès.');
      setLoading(true)
      try {
        await axios.post('/api/logout');
        router.push(ROUTES.AUTH.LOGIN);
        router.refresh();
      } catch {
        toast.error("Erreur lors de la déconnexion");
      } finally {
        setLoading(false)
      }
    } else {
      toast.error('Erreur lors de la suppression du compte.');
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get('currentPassword');
    const newPassword = formData.get('newPassword');
    const confirmPassword = formData.get('confirmPassword');

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Remplissez tous les champs')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('Le confirmez le bon mot de passe')
      return
    }

    setIsUpdatting(true)
    const result = await updatePassword(formData);
    setIsUpdatting(false);

    if (result) {
      toast.success('Mot de passe mis à jour avec succès !');
    } else {
      toast.error('Erreur lors de la mise à jour.');
    }
  }

  return (
    <div className="min-h-screen bg-base-100">
      <NavBar />
      {loading ? (
        <main className="px-6 pt-28 pb-16">
          <div className="max-w-5xl mx-auto space-y-10">
            <section className="card bg-base-100 shadow-lg border border-base-200">
              <div className="card-body space-y-6">
                <div>
                  <div className="skeleton h-4 w-20 mb-2"></div>
                  <div className="skeleton h-4 w-28"></div>
                </div>

                <div className="flex flex-col items-center gap-3 p-8">
                  <div className="skeleton h-20 w-20 shrink-0 rounded-full"></div>
                  <div className="text-center">
                    <div className="skeleton h-4 w-28 mb-2"></div>
                    <div className="skeleton h-4 w-28"></div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="form-control sm:col-span-1">
                    <div className="skeleton h-4 w-28 mb-2"></div>
                    <div className="skeleton h-10 w-full mb-2"></div>
                  </div>

                  <div className="form-control sm:col-span-1">
                    <div className="skeleton h-4 w-28 mb-2"></div>
                    <div className="skeleton h-10 w-full mb-2"></div>
                  </div>

                  <div className="form-control sm:col-span-2">
                    <div className="skeleton h-4 w-28 mb-2"></div>
                    <div className="skeleton h-10 w-full mb-2"></div>
                  </div>

                  <div className="sm:col-span-2 flex justify-end">
                    <div className="skeleton h-10 w-50 mb-2"></div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      ) : (
        <main className="px-6 pt-28 pb-16">
          <div className="max-w-5xl mx-auto space-y-10">
            {/* Section 1 : Modification du profil */}
            <section className="card bg-base-100 shadow-lg border border-base-200">
              <div className="card-body space-y-6">
                <div>
                  <h2 className="text-xl font-bold">Profil du compte</h2>
                  <p className="text-sm text-base-content/60">
                    Mettez à jour votre nom et votre adresse email.
                  </p>
                </div>

                <div className="flex flex-col items-center gap-3 p-8">
                  <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shrink-0">
                    <span className="text-3xl font-bold text-base-content">
                      {profile?.name?.charAt(0).toUpperCase() ?? '?'}
                    </span>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold">{profile?.name}</div>
                    <div className="text-sm text-base-content/50">
                      {profile?.email}
                    </div>
                  </div>
                </div>

                <form ref={formRef} onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
                  <div className="form-control sm:col-span-1">
                    <label className="label">
                      <span className="label-text font-medium">Nom du salon / responsable</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={profile?.name}
                      placeholder="Salon Élégance"
                      className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
                    />
                  </div>

                  <div className="form-control sm:col-span-1">
                    <label className="label">
                      <span className="label-text font-medium">Email</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      defaultValue={profile?.email}
                      placeholder="vous@exemple.com"
                      className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
                    />
                  </div>

                  <div className="form-control sm:col-span-2">
                    <label className="label">
                      <span className="label-text font-medium">Ville</span>
                    </label>
                    <input
                      type="text"
                      name="ville"
                      defaultValue={profile?.ville}
                      placeholder="Brazzaville"
                      className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
                    />
                  </div>

                  <div className="sm:col-span-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn btn-primary transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      {isSubmitting
                        ? <span className="loading loading-spinner loading-sm"></span>
                        : <Save className="w-4 h-4" />}
                      {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
                    </button>
                  </div>
                </form>
              </div>
            </section>

            {/* Section 2 : Modification du mot de passe */}
            <section className="card bg-base-100 shadow-lg border border-base-200">
              <div className="card-body space-y-6">
                <div>
                  <h2 className="text-xl font-bold">Sécurité</h2>
                  <p className="text-sm text-base-content/60">
                    Modifiez votre mot de passe régulièrement pour sécuriser
                    votre compte.
                  </p>
                </div>

                <form ref={formRef} onSubmit={handleUpdatePassword} className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        Mot de passe actuel
                      </span>
                    </label>
                    <input
                      type="password"
                      name="currentPassword"
                      placeholder="••••••••"
                      className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        Nouveau mot de passe
                      </span>
                    </label>
                    <input
                      type="password"
                      name="newPassword"
                      placeholder="••••••••"
                      className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        Confirmer le nouveau mot de passe
                      </span>
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="••••••••"
                      className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={isUpdatting}
                      className="btn btn-primary transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      {isUpdatting
                        ? <span className="loading loading-spinner loading-sm"></span>
                        : <Save className="w-4 h-4" />}
                      {isUpdatting ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
                    </button>
                  </div>
                </form>
              </div>
            </section>

            {/* Section 3 : Suppression du compte */}
            <section className="card bg-base-100 shadow-lg border border-error/30">
              <div className="card-body space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-error">
                    Suppression du compte
                  </h2>
                  <p className="text-sm text-base-content/70">
                    Cette action est définitive. Toutes vos données (transactions,
                    coiffeurs, ...) seront supprimées de façon permanente.
                  </p>
                </div>

                <div className="alert alert-warning text-warning bg-warning/10 border-warning/40">
                  <span className="text-sm">
                    Tapez <span className="font-semibold">SUPPRIMER</span> pour
                    confirmer que vous comprenez les conséquences.
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">
                        Confirmation
                      </span>
                    </label>
                    <input
                      type="text"
                      name="deleteConfirm"
                      placeholder="SUPPRIMER"
                      autoComplete="off"
                      value={deleteConfirm}
                      onChange={(e) => { setDeleteConfirm(e.target.value) }}
                      className="input input-bordered focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent w-full"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => handleOpenDelete()}
                      className="btn btn-error btn-outline transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                    >
                      <Trash2 className="w-4 h-4" /> Supprimer définitivement
                    </button>
                  </div>
                </div>
              </div>
            </section>

          </div>

          {/* MODAL SUPPRESSION */}
          <dialog
            ref={deleteModalRef}
            className="modal modal-bottom sm:modal-middle backdrop-blur"
          >
            <div className="modal-box">
              <h3 className="font-bold text-lg">Dernière chance !</h3>
              <p className="py-4 text-sm md:text-base">
                Voulez-vous vraiment supprimer votre compte ? Cette action est irréversible.
              </p>
              <form ref={formRef} onSubmit={handleDeleteAccount} className="space-y-4">
                <div className="flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteConfirm('');
                      deleteModalRef.current?.close();
                    }}
                    className="btn btn-ghost"
                  >
                    Non, annuler
                  </button>
                  <button
                    type="submit"
                    disabled={isDeletting}
                    className="btn btn-error gap-2"
                  >
                    {isDeletting ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    {isDeletting ? 'Suppression en cours...' : 'Oui, supprimer'}
                  </button>
                </div>
              </form>
            </div>
          </dialog>

        </main>
      )}

      <Footer />

    </div>
  );
};

export default SettingPage;
