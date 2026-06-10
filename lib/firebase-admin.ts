import { initializeApp, getApps, cert, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";

// ----------------------------------------------------------------------------
// Multi-project Firebase Admin SDK.
//
// Each BigCommerce app lives in its OWN Firebase project, and the dashboard
// stores its encrypted secrets in a dedicated project of its own. So instead of
// a single `adminDb`, we lazily initialize one NAMED Admin app per project and
// cache it (firebase-admin keeps a registry keyed by app name).
// ----------------------------------------------------------------------------

type Creds = {
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

/** Firestore for the dashboard's own project (holds the `secrets` collection). */
export function getDashboardDb(): Firestore {
  return dbFor("dashboard", {
    projectId: process.env.DASHBOARD_FIREBASE_PROJECT_ID,
    clientEmail: process.env.DASHBOARD_FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.DASHBOARD_FIREBASE_PRIVATE_KEY,
  });
}

/**
 * Firestore for a monitored app's project. Credentials are resolved from env
 * vars by prefix, e.g. envPrefix="FB_SIGNUP" reads FB_SIGNUP_PROJECT_ID,
 * FB_SIGNUP_CLIENT_EMAIL and FB_SIGNUP_PRIVATE_KEY.
 */
export function getAppDb(envPrefix: string): Firestore {
  return dbFor(envPrefix, {
    projectId: process.env[`${envPrefix}_PROJECT_ID`],
    clientEmail: process.env[`${envPrefix}_CLIENT_EMAIL`],
    privateKey: process.env[`${envPrefix}_PRIVATE_KEY`],
  });
}
