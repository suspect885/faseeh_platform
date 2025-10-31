import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import {
  getUserDocuments,
  createDocument,
  getDocumentById,
  getDocumentErrors,
  searchTerminology,
} from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // ميزات التدقيق اللغوي
  checker: router({
    // الحصول على جميع النصوص المحفوظة للمستخدم
    getDocuments: protectedProcedure.query(async ({ ctx }) => {
      return getUserDocuments(ctx.user.id);
    }),

    // إنشاء نص جديد للتدقيق
    createDoc: protectedProcedure
      .input((val: unknown) => {
        if (typeof val !== "object" || val === null) throw new Error("Invalid input");
        const obj = val as Record<string, unknown>;
        return {
          title: String(obj.title || "Untitled"),
          originalText: String(obj.originalText || ""),
        };
      })
      .mutation(async ({ ctx, input }) => {
        return createDocument(ctx.user.id, input.title, input.originalText);
      }),

    // الحصول على تفاصيل النص والأخطاء
    getDocumentDetails: protectedProcedure
      .input((val: unknown) => {
        if (typeof val !== "object" || val === null) throw new Error("Invalid input");
        const obj = val as Record<string, unknown>;
        return { documentId: Number(obj.documentId) };
      })
      .query(async ({ input }) => {
        const doc = await getDocumentById(input.documentId);
        if (!doc) return null;
        const errors = await getDocumentErrors(input.documentId);
        return { document: doc, errors };
      }),

    // البحث عن مصطلح في القاموس
    searchTerms: publicProcedure
      .input((val: unknown) => {
        if (typeof val !== "object" || val === null) throw new Error("Invalid input");
        const obj = val as Record<string, unknown>;
        return { term: String(obj.term || "") };
      })
      .query(async ({ input }) => {
        if (!input.term.trim()) return [];
        return searchTerminology(input.term);
      }),
  }),
});

export type AppRouter = typeof appRouter;
