import Link from "next/link";
import { signInAction, signUpAction } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LoginForm() {
  return (
    <form action={signInAction} className="grid gap-4">
      <Input name="email" type="email" placeholder="Email" required />
      <Input name="password" type="password" placeholder="Пароль" required />
      <Button>Войти</Button>
      <Link href="/auth/register" className="text-center text-sm text-blue-700 hover:underline">
        Создать аккаунт студента
      </Link>
    </form>
  );
}

export function RegisterForm() {
  return (
    <form action={signUpAction} className="grid gap-4">
      <Input name="full_name" placeholder="ФИО" required />
      <Input name="group_name" placeholder="Группа" required />
      <Input name="email" type="email" placeholder="Email" required />
      <Input name="password" type="password" placeholder="Пароль" minLength={6} required />
      <Button>Зарегистрироваться</Button>
      <Link href="/auth/login" className="text-center text-sm text-blue-700 hover:underline">
        Уже есть аккаунт
      </Link>
    </form>
  );
}
