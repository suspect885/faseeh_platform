import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * جدول النصوص المحفوظة (Saved Documents)
 * يحفظ النصوص التي قام المستخدم بتدقيقها
 */
export const documents = mysqlTable("documents", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  originalText: text("originalText").notNull(),
  correctedText: text("correctedText"),
  faseehScore: int("faseehScore"), // من 0 إلى 100
  errorCount: int("errorCount").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;

/**
 * جدول الأخطاء المكتشفة (Grammar Errors)
 * يحفظ الأخطاء النحوية والإملائية المكتشفة في كل نص
 */
export const grammarErrors = mysqlTable("grammarErrors", {
  id: int("id").autoincrement().primaryKey(),
  documentId: int("documentId").notNull(),
  errorType: varchar("errorType", { length: 100 }).notNull(), // مثل: إملاء، نحو، ترقيم
  position: int("position").notNull(), // موقع الخطأ في النص
  originalText: varchar("originalText", { length: 500 }).notNull(),
  suggestion: varchar("suggestion", { length: 500 }).notNull(),
  explanation: text("explanation"), // شرح الخطأ والقاعدة
  severity: varchar("severity", { length: 20 }).default("medium"), // low, medium, high
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GrammarError = typeof grammarErrors.$inferSelect;
export type InsertGrammarError = typeof grammarErrors.$inferInsert;

/**
 * جدول قاموس المصطلحات (Terminology Dictionary)
 * يحفظ المصطلحات المتخصصة والترجمات
 */
export const terminology = mysqlTable("terminology", {
  id: int("id").autoincrement().primaryKey(),
  arabicTerm: varchar("arabicTerm", { length: 255 }).notNull().unique(),
  englishTerm: varchar("englishTerm", { length: 255 }),
  category: varchar("category", { length: 100 }), // مثل: قانوني، طبي، تقني
  definition: text("definition"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Terminology = typeof terminology.$inferSelect;
export type InsertTerminology = typeof terminology.$inferInsert;