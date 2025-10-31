import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useRoute } from "wouter";
import { ArrowRight, Loader2, AlertCircle, CheckCircle2, Copy } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

export default function DocumentDetail() {
  const { isAuthenticated } = useAuth();
  const [, params] = useRoute("/document/:id");
  const [copied, setCopied] = useState(false);
  const documentId = params?.id ? parseInt(params.id) : null;

  const { data: docData, isLoading } = trpc.checker.getDocumentDetails.useQuery(
    { documentId: documentId || 0 },
    { enabled: isAuthenticated && !!documentId }
  );

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>يجب تسجيل الدخول</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button className="w-full">العودة إلى الرئيسية</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!docData || !docData.document) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>النص غير موجود</CardTitle>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard">
              <Button className="w-full">العودة إلى لوحة التحكم</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { document, errors } = docData;
  const errorsByType = errors.reduce((acc: any, err: any) => {
    if (!acc[err.errorType]) {
      acc[err.errorType] = [];
    }
    acc[err.errorType].push(err);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" className="gap-2 mb-4">
              <ArrowRight className="w-4 h-4 rotate-180" />
              العودة
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">{document.title}</h1>
          <p className="text-slate-600 mt-2">
            تم الإنشاء: {new Date(document.createdAt).toLocaleDateString("ar-SA")}
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                درجة الفصاحة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {document.faseehScore || 0}
                <span className="text-sm text-slate-600 ml-1">/100</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                عدد الأخطاء
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">
                {document.errorCount || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                حالة التدقيق
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-600">مكتمل</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content Comparison */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Original Text */}
          <Card>
            <CardHeader>
              <CardTitle>النص الأصلي</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-100 p-4 rounded-lg text-slate-900 leading-relaxed mb-4 max-h-64 overflow-y-auto">
                {document.originalText}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2"
                onClick={() => handleCopyText(document.originalText)}
              >
                <Copy className="w-4 h-4" />
                {copied ? "تم النسخ" : "نسخ النص"}
              </Button>
            </CardContent>
          </Card>

          {/* Corrected Text */}
          <Card>
            <CardHeader>
              <CardTitle>النص المصحح</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 p-4 rounded-lg text-slate-900 leading-relaxed mb-4 max-h-64 overflow-y-auto">
                {document.correctedText || document.originalText}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2"
                onClick={() => handleCopyText(document.correctedText || document.originalText)}
              >
                <Copy className="w-4 h-4" />
                نسخ النص المصحح
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Errors by Type */}
        {Object.keys(errorsByType).length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">الأخطاء المكتشفة</h2>
            {Object.entries(errorsByType).map(([errorType, typeErrors]: [string, any]) => (
              <Card key={errorType}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-orange-600" />
                    {errorType}
                  </CardTitle>
                  <CardDescription>
                    {typeErrors.length} أخطاء من هذا النوع
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {typeErrors.map((error: any, idx: number) => (
                      <div
                        key={idx}
                        className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-sm font-medium text-slate-600">الخطأ:</p>
                            <p className="font-mono bg-red-50 text-red-700 p-2 rounded mt-1">
                              {error.originalText}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              error.severity === "high"
                                ? "bg-red-100 text-red-700"
                                : error.severity === "medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {error.severity === "high"
                              ? "عالي"
                              : error.severity === "medium"
                              ? "متوسط"
                              : "منخفض"}
                          </span>
                        </div>

                        <div className="mb-2">
                          <p className="text-sm font-medium text-slate-600">الاقتراح:</p>
                          <p className="font-mono bg-green-50 text-green-700 p-2 rounded mt-1">
                            {error.suggestion}
                          </p>
                        </div>

                        {error.explanation && (
                          <div>
                            <p className="text-sm font-medium text-slate-600">الشرح:</p>
                            <p className="text-sm text-slate-600 mt-1">
                              {error.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-bold text-lg text-slate-900 mb-2">
                لا توجد أخطاء!
              </h3>
              <p className="text-slate-600">
                النص خالي من الأخطاء اللغوية والنحوية
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
