'use server'
// src/app/actions/actions.ts
import api from '@/src/constants/api';
import { cookies } from 'next/headers';

// ─────────────────────────────────────────────
// Fonction utilitaire : renouvelle l'access token
// si Django répond 401 (token expiré)
// ─────────────────────────────────────────────
async function refreshAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refresh_token')?.value;

  if (!refreshToken) return null;

  try {
    const response = await api.post('token/refresh/', { refresh: refreshToken });
    const newAccessToken = response.data.access;

    cookieStore.set('access_token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24
    });

    return newAccessToken;
  } catch (error) {
    console.error('Échec du renouvellement du token:', error);
    return null;
  }
}


export async function getBarbers(page: number = 1) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  if (!token) return { results: [], count: 0, next: null, previous: null };
  try {
    const response = await api.get(`barbers/?page=${page}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      const newToken = await refreshAccessToken();
      if (!newToken) return { results: [], count: 0, next: null, previous: null };
      try {
        const response = await api.get(`barbers/?page=${page}`, {
          headers: { Authorization: `Bearer ${newToken}` }
        });
        return response.data;
      } catch { return { results: [], count: 0, next: null, previous: null }; }
    }
    return { results: [], count: 0, next: null, previous: null };
  }
}


export async function addBarber(formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  if (!token) return null;

  const data = {
    barber_name: formData.get('name'),
    salary: parseInt(formData.get('salary') as string)
  };

  try {
    const response = await api.post('barbers/', data, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    });
    return response.data;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      const newToken = await refreshAccessToken();
      if (!newToken) return null;
      try {
        const response = await api.post('barbers/', data, {
          headers: { Authorization: `Bearer ${newToken}`, 'Content-Type': 'application/json' }
        });
        return response.data;
      } catch { return null; }
    }
    console.error('Erreur ajout coiffeur:', error);
    console.error("Données d'erreur :", error.response.data);
    return null;
  }
}


export async function deleteBarber(id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  if (!token) return false;

  const baseURL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  const url = `${baseURL}api/barbers/${id}/`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.status === 204 || response.status === 200) {
      return true;
    }

    if (response.status === 401) {
      const newToken = await refreshAccessToken();
      if (!newToken) return false;

      const retryResponse = await fetch(url, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${newToken}` }
      });

      return retryResponse.status === 204 || retryResponse.status === 200;
    }

    console.error('Erreur suppression, status:', response.status);
    return false;

  } catch (error) {
    console.error('Erreur suppression barbers:', error);
    return false;
  }
}


export async function updateBarber(id: string, formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  if (!token) return null;

  const data = {
    barber_name: formData.get('name'),
    salary: parseInt(formData.get('salary') as string)
  };

  try {
    const response = await api.put(`barbers/${id}/`, data, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    });
    return response.data;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      const newToken = await refreshAccessToken();
      if (!newToken) return null;
      try {
        const response = await api.put(`barbers/${id}/`, data, {
          headers: { Authorization: `Bearer ${newToken}`, 'Content-Type': 'application/json' }
        });
        return response.data;
      } catch { return null; }
    }
    console.error('Erreur modification barbers:', error);
    return null;
  }
}


export async function getTransactions(page: number = 1) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  if (!token) return {results: [], barbers: [], count: 0, next: null, previous: null};

  try {
    const response = await api.get(`transactions/?page=${page}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      const newToken = await refreshAccessToken();
      if (!newToken) return {results: [], barbers: [], count: 0, next: null, previous: null};
      try {
        const response = await api.get(`transactions/?page=${page}`, {
          headers: { Authorization: `Bearer ${newToken}` }
        });
        return response.data;
      } catch { return {results: [], barbers: [], count: 0, next: null, previous: null}; }
    }
    console.error('Erreur transactions:', error);
    return {results: [], barbers: [], count: 0, next: null, previous: null};
  }
}


export async function addTransaction(formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  if (!token) return null;

  const data = {
    barber_id: formData.get('barber'),
    service: formData.get('service'),
    amount: parseFloat(formData.get('amount') as string),
    payment_method: formData.get('payment_method'),
    date: formData.get('date'),
  };

  try {
    const response = await api.post('transactions/', data, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    });
    return response.data;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      const newToken = await refreshAccessToken();
      if (!newToken) return null;
      try {
        const response = await api.post('transactions/', data, {
          headers: { Authorization: `Bearer ${newToken}`, 'Content-Type': 'application/json' }
        });
        return response.data;
      } catch { return null; }
    }
    console.error('Erreur ajout transaction:', error);
    console.error("Données d'erreur :", error.response.data);
    return null;
  }
}


export async function deleteTransaction(id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  if (!token) return false;

  const baseURL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  const url = `${baseURL}api/transactions/${id}/`;

  try {
    // On utilise fetch natif au lieu d'Axios
    // Axios a un bug avec les réponses 204 (No Content) dans les Server Actions Next.js
    const response = await fetch(url, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    // 204 = supprimé avec succès (pas de contenu dans la réponse)
    // 200 = succès aussi (certaines configs Django)
    if (response.status === 204 || response.status === 200) {
      return true;
    }

    // Si 401 → token expiré → on renouvelle et on réessaie
    if (response.status === 401) {
      const newToken = await refreshAccessToken();
      if (!newToken) return false;

      const retryResponse = await fetch(url, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${newToken}` }
      });

      return retryResponse.status === 204 || retryResponse.status === 200;
    }

    console.error('Erreur suppression, status:', response.status);
    return false;

  } catch (error) {
    console.error('Erreur suppression transaction:', error);
    return false;
  }
}


export async function updateTransaction(id: string, formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  if (!token) return null;

  const data = {
    barber_id: formData.get('barber'),
    service: formData.get('service'),
    amount: parseFloat(formData.get('amount') as string),
    payment_method: formData.get('payment_method'),
    date: formData.get('date'),
  };

  try {
    // PUT sur /transactions/<id>/
    const response = await api.put(`transactions/${id}/`, data, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    });
    return response.data;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      const newToken = await refreshAccessToken();
      if (!newToken) return null;
      try {
        const response = await api.put(`transactions/${id}/`, data, {
          headers: { Authorization: `Bearer ${newToken}`, 'Content-Type': 'application/json' }
        });
        return response.data;
      } catch { return null; }
    }
    console.error('Erreur modification transaction:', error);
    return null;
  }
}


export async function getUserProfile() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  if (!token) return null;

  try {
    const response = await api.get('profile/', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data; // { id, name, email }
  } catch (error: any) {
    if (error?.response?.status === 401) {
      const newToken = await refreshAccessToken();
      if (!newToken) return null;
      try {
        const response = await api.get('profile/', {
          headers: { Authorization: `Bearer ${newToken}` }
        });
        return response.data;
      } catch { return null; }
    }
    console.error('Erreur profil utilisateur:', error);
    return null;
  }
}


export async function updateUserProfile(formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  if (!token) return null;

  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    ville: formData.get('ville'),
  };

  try {
    const response = await api.put('profile/', data, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    });
    return response.data;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      const newToken = await refreshAccessToken();
      if (!newToken) return null;
      try {
        const response = await api.put('profile/', data, {
          headers: { Authorization: `Bearer ${newToken}`, 'Content-Type': 'application/json' }
        });
        return response.data;
      } catch { return null; }
    }
    console.error('Erreur modification profil:', error);
    return null;
  }
}


export async function deleteUserProfile() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  if (!token) return false;

  const baseURL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
  const url = `${baseURL}api/profile/`;

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.status === 204 || response.status === 200) {
      return true;
    }

    if (response.status === 401) {
      const newToken = await refreshAccessToken();
      if (!newToken) return false;

      const retryResponse = await fetch(url, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${newToken}` }
      });

      return retryResponse.status === 204 || retryResponse.status === 200;
    }

    console.error('Erreur suppression, status:', response.status);
    return false;

  } catch (error) {
    console.error('Erreur suppression compte:', error);
    return false;
  }
}


export async function updatePassword(formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  if (!token) return null;

  const data = {
    currentPassword: formData.get('currentPassword'),
    newPassword: formData.get('newPassword'),
  };

  try {
    const response = await api.put('password/', data, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    });
    return response.data;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      const newToken = await refreshAccessToken();
      if (!newToken) return null;
      try {
        const response = await api.put('password/', data, {
          headers: { Authorization: `Bearer ${newToken}`, 'Content-Type': 'application/json' }
        });
        return response.data;
      } catch { return null; }
    }
    console.error('Erreur modification mot de passe:', error);
    return null;
  }
}


export async function stats(formData: FormData) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  if (!token) return null;

  const data = {
    month: formData.get('month'),
    year: formData.get('year'),
  };

  try {
    const response = await api.post('reports/monthly/', data, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
    });
    return response.data;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      const newToken = await refreshAccessToken();
      if (!newToken) return null;
      try {
        const response = await api.post('reports/monthly/', data, {
          headers: { Authorization: `Bearer ${newToken}`, 'Content-Type': 'application/json' }
        });
        return response.data;
      } catch { return null; }
    }
    console.error('Erreur :', error);
    console.error("Données d'erreur :", error.response.data);
    return null;
  }
}


export async function dashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;
  if (!token) return { user: {}, today_revenue: null, yesterday_revenue: null, barber_count: 0, total_salaries_to_pay: null, last_transactions: [], ranking: [], barbers: [] };

  try {
    const response = await api.get('dashboard/', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      const newToken = await refreshAccessToken();
      if (!newToken) return { user: {}, today_revenue: null, yesterday_revenue: null, barber_count: 0, total_salaries_to_pay: null, last_transactions: [], ranking: [], barbers: [] };;
      try {
        const response = await api.get('dashboard/', {
          headers: { Authorization: `Bearer ${newToken}` }
        });
        return response.data;
      } catch { 
        return { user: {}, today_revenue: null, yesterday_revenue: null, barber_count: 0, total_salaries_to_pay: null, last_transactions: [], ranking: [], barbers: [] }; 
      }
    }
    console.error('Erreur :', error);
    return { user: {}, today_revenue: null, yesterday_revenue: null, barber_count: 0, total_salaries_to_pay: null, last_transactions: [], ranking: [], barbers: [] };
  }
}