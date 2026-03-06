import type { UserProfile } from '../App';

const DB_NAME = 'abha_app_db';
const STORE_NAME = 'userProfiles';
const PRESCRIPTIONS_STORE = 'prescriptions';
const DB_VERSION = 2;

/**
 * Initializes the IndexedDB for storing offline user profile data (including large Base64 files)
 */
const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error("Error opening IndexedDB:", request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(PRESCRIPTIONS_STORE)) {
        db.createObjectStore(PRESCRIPTIONS_STORE, { keyPath: 'id' });
      }
    };
  });
};

/**
 * Saves the user profile into IndexedDB.
 * We use a hardcoded key 'current_profile' since the app uses a single profile.
 */
export const saveProfileToDB = async (profile: UserProfile): Promise<void> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const record = {
        id: 'current_profile',
        data: profile
      };
      
      const request = store.put(record);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error("Failed to save profile to IndexedDB:", err);
    // fallback to localStorage if needed
    try {
      localStorage.setItem('profile', JSON.stringify(profile));
    } catch (e) {
      console.error("LocalStorage fallback failed (likely quota exceeded):", e);
    }
  }
};

/**
 * Retrieves the user profile from IndexedDB.
 */
export const getProfileFromDB = async (): Promise<UserProfile | null> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get('current_profile');
      
      request.onsuccess = () => {
        if (request.result) {
          resolve(request.result.data as UserProfile);
        } else {
          // Fallback to localStorage for existing users migrating
          const stored = localStorage.getItem('profile');
          if (stored) {
            try {
              const parsed = JSON.parse(stored);
              // Migrate it to IDB
              saveProfileToDB(parsed).catch(console.error);
              resolve(parsed);
              return;
            } catch (e) {
              console.error("Failed to parse localStorage profile", e);
            }
          }
          resolve(null);
        }
      };
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error("Failed to load profile from IndexedDB:", err);
    const stored = localStorage.getItem('profile');
    return stored ? JSON.parse(stored) : null;
  }
};

/**
 * Saves a global doctor prescription into IndexedDB.
 */
export const saveGlobalPrescription = async (prescription: any): Promise<void> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([PRESCRIPTIONS_STORE], 'readwrite');
      const store = transaction.objectStore(PRESCRIPTIONS_STORE);
      const request = store.put(prescription);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error("Failed to save global prescription:", err);
  }
};

/**
 * Retrieves all global doctor prescriptions from IndexedDB.
 */
export const getGlobalPrescriptions = async (): Promise<any[]> => {
  try {
    const db = await initDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([PRESCRIPTIONS_STORE], 'readonly');
      const store = transaction.objectStore(PRESCRIPTIONS_STORE);
      const request = store.getAll();
      request.onsuccess = () => {
        resolve(request.result || []);
      };
      request.onerror = () => reject(request.error);
    });
  } catch (err) {
    console.error("Failed to fetch global prescriptions:", err);
    return [];
  }
};
