import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/forms";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-4">
      <Card className="w-full max-w-md">
        <CardTitle className="text-2xl">Вход</CardTitle>
        <CardDescription>Войдите, чтобы добавить достижение или модерировать заявки.</CardDescription>
        <div className="mt-6">
          <LoginForm />
        </div>
      </Card>
    </main>
  );
}
