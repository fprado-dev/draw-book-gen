import { getDatabase, ref, set, get, remove, update } from 'firebase/database';
import { app } from './firebase';
import { Ebook } from '@/types/ebook';

export const createEbook = async (userId: string, projectId: string, ebook: Partial<Ebook>) => {
  try {
    const database = getDatabase(app);
    const ebookId = Date.now().toString();
    const newEbook = {
      id: ebookId,
      projectId,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft',
      pages: [],
      ...ebook
    };

    await set(ref(database, `ebooks/${userId}/${projectId}/${ebookId}`), newEbook);
    return { ebook: newEbook, error: null };
  } catch (error) {
    console.error('Error creating ebook:', error);
    return { ebook: null, error: 'Failed to create ebook' };
  }
};

export const getProjectEbooks = async (userId: string, projectId: string) => {
  try {
    const database = getDatabase(app);
    const ebooksRef = ref(database, `ebooks/${userId}/${projectId}`);
    const snapshot = await get(ebooksRef);

    if (snapshot.exists()) {
      const ebooksData = snapshot.val();
      const ebooks = Object.values(ebooksData).map((ebook: any) => ({
        ...ebook,
        createdAt: new Date(ebook.createdAt),
        updatedAt: new Date(ebook.updatedAt)
      }));
      return { ebooks, error: null };
    }
    return { ebooks: [], error: null };
  } catch (error) {
    console.error('Error fetching ebooks:', error);
    return { ebooks: [], error: 'Failed to fetch ebooks' };
  }
};

export const updateEbook = async (userId: string, projectId: string, ebookId: string, updates: Partial<Ebook>) => {
  try {
    const database = getDatabase(app);
    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString()
    };

    await update(ref(database, `ebooks/${userId}/${projectId}/${ebookId}`), updatedData);
    return { success: true, error: null };
  } catch (error) {
    console.error('Error updating ebook:', error);
    return { success: false, error: 'Failed to update ebook' };
  }
};

export const deleteEbook = async (userId: string, projectId: string, ebookId: string) => {
  try {
    const database = getDatabase(app);
    await remove(ref(database, `ebooks/${userId}/${projectId}/${ebookId}`));
    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting ebook:', error);
    return { success: false, error: 'Failed to delete ebook' };
  }
};

export const getEbook = async (userId: string, projectId: string, ebookId: string) => {
  try {
    const database = getDatabase(app);
    const ebookRef = ref(database, `ebooks/${userId}/${projectId}/${ebookId}`);
    const snapshot = await get(ebookRef);

    if (snapshot.exists()) {
      const ebookData = snapshot.val();
      const ebook = {
        ...ebookData,
        createdAt: new Date(ebookData.createdAt),
        updatedAt: new Date(ebookData.updatedAt)
      };
      return { ebook, error: null };
    }
    return { ebook: null, error: 'Ebook not found' };
  } catch (error) {
    console.error('Error fetching ebook:', error);
    return { ebook: null, error: 'Failed to fetch ebook' };
  }
};