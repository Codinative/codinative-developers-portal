import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

// ----------------------------------------------------------------------------
// Firebase Admin SDK for the dashboard's own project.
//
// The dashboard stores all of its data (secrets, projects, QA, users, login
// config) in a single Firebase project. We lazily initialize a NAMED Admin app
// and cache it (firebase-admin keeps a registry keyed by app name).
// ----------------------------------------------------------------------------

export type Creds = {
  projectId?: string;
  clientEmail?: string;
  privateKey?: string;
};

function dbFor(name: string, creds: Creds): Firestore {
  if (!creds.projectId || !creds.clientEmail || !creds.privateKey) {
    throw new Error(
      `Missing Firebase service-account credentials for "${name}". ` +
        `Check the corresponding *_PROJECT_ID / *_CLIENT_EMAIL / *_PRIVATE_KEY env vars.`,
    );
  }

  const existing = getApps().find((a) => a.name === name);
  const app: App =
    existing ??
    initializeApp(
      {
        credential: cert({
          projectId: creds.projectId,
          clientEmail: creds.clientEmail,
          // Vercel/.env store the key with literal "\n"; convert back to newlines.
          privateKey: creds.privateKey.replace(/\\n/g, "\n"),
        }),
      },
      name,
    );

  return getFirestore(app);
}

/** Firestore for the dashboard's own project (holds all dashboard data). */
export function getDashboardDb(): Firestore {
  return dbFor("dashboard", {
    projectId: process.env.DASHBOARD_FIREBASE_PROJECT_ID,
    clientEmail: process.env.DASHBOARD_FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.DASHBOARD_FIREBASE_PRIVATE_KEY,
  });
}
