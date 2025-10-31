import { useAuth } from "@/_core/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Plus, FileText, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  // جلب النصوص المحفوظة
  const { data: documents, isLoading: docsLoading } = trpc.checker.getDocuments.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  // إنشاء نص جديد
  const createDocMutation = trpc.checker.createDoc.useMutation({
    onSuccess: () => {
      setTitle("");
      setText("");
      setIsOpen(false);
      // إعادة تحميل النصوص
      trpc.useUtils().checker.getDocuments.invalidate();
    },
  });

  const handleCreateDocument = () => {
    if (!title.trim() || !text.trim()) {
      alert("الرجاء إدخال العنوان والنص");
      return;
    }

    createDocMutation.mutate({
      title: title.trim(),
      originalText: text.trim(),
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>يجب تسجيل الدخول</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">
              يجب عليك تسجيل الدخول للوصول إلى لوحة التحكم
            </p>
            <Link href="/">
              <Button className="w-full">العودة إلى الرئيسية</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">لوحة التحكم</h1>
            <p className="text-slate-600 mt-1">مرحباً بك، {user?.name || "المستخدم"}</p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                نص جديد
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>إنشاء نص جديد للتدقيق</DialogTitle>
                <DialogDescription>
                  أدخل عنوان النص والمحتوى الذي تريد تدقيقه
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-900">العنوان</label>
                  <Input
                    placeholder="مثال: مقالة عن الذكاء الاصطناعي"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-900">النص</label>
                  <Textarea
                    placeholder="الصق النص هنا..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="mt-1 min-h-48"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                  >
                    إلغاء
                  </Button>
                  <Button
                    onClick={handleCreateDocument}
                    disabled={createDocMutation.isPending}
                  >
                    {createDocMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        جاري الإنشاء...
                      </>
                    ) : (
                      "إنشاء وتدقيق"
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                إجمالي النصوص
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {documents?.length || 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                متوسط درجة الفصاحة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {documents && documents.length > 0
                  ? Math.round(
                      documents.reduce((sum: number, doc: any) => sum + (doc.documents?.faseehScore || 0), 0) /
                        documents.length
                    )
                  : 0}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                إجمالي الأخطاء المكتشفة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {documents
                  ? documents.reduce((sum: number, doc: any) => sum + (doc.documents?.errorCount || 0), 0)
                  : 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Documents List */}
        <Card>
          <CardHeader>
            <CardTitle>النصوص المحفوظة</CardTitle>
            <CardDescription>
              جميع النصوص التي قمت بتدقيقها
            </CardDescription>
          </CardHeader>
          <CardContent>
            {docsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
              </div>
            ) : documents && documents.length > 0 ? (
              <div className="space-y-3">
                {documents.map((doc: any) => (
                  <Link key={doc.documents?.id} href={`/document/${doc.documents?.id}`}>
                    <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors">
                      <div className="flex items-center gap-3 flex-1">
                        <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-slate-900 truncate">
                            {doc.documents?.title}
                          </h3>
                          <p className="text-sm text-slate-500">
                            {doc.documents?.originalText.substring(0, 100)}...
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 ml-4">
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-sm font-medium text-slate-900">
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                            {doc.documents?.faseehScore || 0}
                          </div>
                          <p className="text-xs text-slate-500">درجة الفصاحة</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-sm font-medium text-slate-900">
                            <AlertCircle className="w-4 h-4 text-orange-600" />
                            {doc.documents?.errorCount || 0}
                          </div>
                          <p className="text-xs text-slate-500">أخطاء</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="font-medium text-slate-900 mb-1">لا توجد نصوص بعد</h3>
                <p className="text-slate-600 mb-4">
                  ابدأ بإنشاء نص جديد لتدقيقه
                </p>
                <Button onClick={() => setIsOpen(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  إنشاء نص جديد
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
