import { eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, documents, grammarErrors, terminology } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserDocuments(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .leftJoin(documents, eq(documents.userId, users.id))
    .limit(100);
}

export async function createDocument(
  userId: number,
  title: string,
  originalText: string,
  correctedText?: string,
  faseehScore?: number,
  errorCount?: number
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(documents).values({
    userId,
    title,
    originalText,
    correctedText,
    faseehScore,
    errorCount: errorCount || 0,
  });
  
  return result;
}

export async function getDocumentById(documentId: number) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db
    .select()
    .from(documents)
    .where(eq(documents.id, documentId))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function getDocumentErrors(documentId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return db
    .select()
    .from(grammarErrors)
    .where(eq(grammarErrors.documentId, documentId))
    .orderBy(grammarErrors.position);
}

export async function addGrammarError(
  documentId: number,
  errorType: string,
  position: number,
  originalText: string,
  suggestion: string,
  explanation?: string,
  severity?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(grammarErrors).values({
    documentId,
    errorType,
    position,
    originalText,
    suggestion,
    explanation,
    severity: severity || "medium",
  });
}

export async function getTerminology(term: string) {
  const db = await getDb();
  if (!db) return null;
  
  const result = await db
    .select()
    .from(terminology)
    .where(eq(terminology.arabicTerm, term))
    .limit(1);
  
  return result.length > 0 ? result[0] : null;
}

export async function searchTerminology(searchTerm: string) {
  const db = await getDb();
  if (!db) return [];
  
  return db
    .select()
    .from(terminology)
    .where(sql`arabicTerm LIKE ${`%${searchTerm}%`}`)
    .limit(20);
}

// TODO: add more feature queries here as your schema grows.
