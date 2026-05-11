import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/forms";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
    next?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const error = params.error ? decodeURIComponent(params.error) : null;
  const message = params.message === "check-email" ? "Проверьте email и подтвердите аккаунт, затем войдите." : null;

  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-4">
      <Card className="w-full max-w-md">
        <CardTitle className="text-2xl">Вход</CardTitle>
        <CardDescription>Войдите, чтобы добавить достижение или модерировать заявки.</CardDescription>
        <div className="mt-6">
          <LoginForm error={error} message={message} next={params.next} />
        </div>
      </Card>
    </main>
  );
}
