import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { Link } from "wouter";
import { CheckCircle2, Zap, BookOpen, BarChart3, ArrowRight, Loader2 } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Navigation */}
      <nav className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {APP_LOGO && <img src={APP_LOGO} alt="Logo" className="h-8 w-8" />}
            <span className="font-bold text-xl text-slate-900">{APP_TITLE}</span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-slate-600">مرحباً، {user?.name || "المستخدم"}</span>
                <Link href="/dashboard">
                  <Button variant="default" size="sm">
                    لوحة التحكم
                  </Button>
                </Link>
              </>
            ) : (
              <a href={getLoginUrl()}>
                <Button variant="default" size="sm">
                  تسجيل الدخول
                </Button>
              </a>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
            ارتقِ بمحتواك العربي <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-800">إلى مستوى الاحتراف</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            مدقق لغوي عميق ومُحسّن أسلوب مدعوم بالذكاء الاصطناعي، مصمم خصيصاً لإتقان اللغة العربية الفصحى
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          {isAuthenticated ? (
            <Link href="/dashboard">
              <Button size="lg" className="gap-2">
                ابدأ التدقيق الآن <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          ) : (
            <a href={getLoginUrl()}>
              <Button size="lg" className="gap-2">
                ابدأ مجاناً <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
          )}
          <Button size="lg" variant="outline">
            اعرف المزيد
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          <Card className="border-slate-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <Zap className="w-8 h-8 text-blue-600 mb-2" />
              <CardTitle className="text-lg">المدقق اللغوي العميق</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                تدقيق متقدم للنحو والصرف والإملاء وعلامات الترقيم بدقة عالية
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CheckCircle2 className="w-8 h-8 text-green-600 mb-2" />
              <CardTitle className="text-lg">مُحسّن الأسلوب</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                اقتراحات ذكية لتحسين الجمل الضعيفة وتعزيز تدفق النص
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <BookOpen className="w-8 h-8 text-purple-600 mb-2" />
              <CardTitle className="text-lg">قاموس المصطلحات</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                قاعدة بيانات شاملة للمصطلحات المتخصصة والترجمات الدقيقة
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <BarChart3 className="w-8 h-8 text-orange-600 mb-2" />
              <CardTitle className="text-lg">مؤشر الفصاحة</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                تقييم شامل لجودة النص مع تقرير مفصل وتوصيات التحسين
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-20 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-slate-900">كيف تعمل فصيح؟</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-lg">1</span>
              </div>
              <h3 className="font-bold text-lg mb-2">الصق نصك</h3>
              <p className="text-slate-600">انسخ والصق النص الذي تريد تدقيقه في محرر النصوص</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-lg">2</span>
              </div>
              <h3 className="font-bold text-lg mb-2">التدقيق الفوري</h3>
              <p className="text-slate-600">يتم تحليل النص وكشف الأخطاء اللغوية والنحوية تلقائياً</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 font-bold text-lg">3</span>
              </div>
              <h3 className="font-bold text-lg mb-2">احصل على التقرير</h3>
              <p className="text-slate-600">تقرير مفصل مع اقتراحات التحسين ومؤشر الفصاحة</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-slate-900">ماذا يقول المستخدمون؟</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-slate-200">
              <CardContent className="pt-6">
                <p className="text-slate-600 mb-4">
                  "منصة فصيح غيرت طريقة كتابتي. الأخطاء التي كنت أغفل عنها أصبح يكتشفها التطبيق بسهولة."
                </p>
                <p className="font-semibold text-slate-900">د. أحمد محمد</p>
                <p className="text-sm text-slate-500">باحث أكاديمي</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardContent className="pt-6">
                <p className="text-slate-600 mb-4">
                  "أداة رائعة لمن يهتم بجودة محتواه العربي. الاقتراحات دقيقة وسهلة التطبيق."
                </p>
                <p className="font-semibold text-slate-900">فاطمة علي</p>
                <p className="text-sm text-slate-500">كاتبة محتوى</p>
              </CardContent>
            </Card>

            <Card className="border-slate-200">
              <CardContent className="pt-6">
                <p className="text-slate-600 mb-4">
                  "استخدمتها في تدقيق رسالتي الجامعية وساعدتني كثيراً في تحسين الأسلوب والقواعد."
                </p>
                <p className="font-semibold text-slate-900">محمود سالم</p>
                <p className="text-sm text-slate-500">طالب دراسات عليا</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-20 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">جاهز لتحسين محتواك؟</h2>
          <p className="text-lg mb-8 text-blue-100">
            ابدأ الآن مجاناً وشعر بالفرق في جودة كتابتك
          </p>
          {isAuthenticated ? (
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" className="gap-2">
                اذهب إلى لوحة التحكم <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          ) : (
            <a href={getLoginUrl()}>
              <Button size="lg" variant="secondary" className="gap-2">
                ابدأ الآن <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="mb-2">© 2025 منصة فصيح. جميع الحقوق محفوظة.</p>
          <p className="text-sm">
            منصة متخصصة في التدقيق اللغوي والنحوي للغة العربية الفصحى
          </p>
        </div>
      </footer>
    </div>
  );
}
