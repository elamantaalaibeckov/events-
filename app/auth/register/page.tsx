import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { RegisterForm } from "@/components/forms";

export default function RegisterPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-100 px-4">
      <Card className="w-full max-w-md">
        <CardTitle className="text-2xl">Регистрация студента</CardTitle>
        <CardDescription>Профиль будет создан автоматически с ролью student.</CardDescription>
        <div className="mt-6">
          <RegisterForm />
        </div>
      </Card>
    </main>
  );
}
