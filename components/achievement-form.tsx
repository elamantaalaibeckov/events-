"use client";

import { useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { createAchievementAction } from "@/actions/achievements";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { achievementSchema } from "@/lib/validations";
import type { Event } from "@/types/database";

export function AchievementForm({ events }: { events: Event[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const nativeSubmitRef = useRef(false);
  const form = useForm<z.infer<typeof achievementSchema>>({
    resolver: zodResolver(achievementSchema),
    defaultValues: {
      title: "",
      description: "",
      event_id: ""
    }
  });

  return (
    <form
      ref={formRef}
      action={createAchievementAction}
      className="grid gap-4"
      encType="multipart/form-data"
      onSubmit={async (event) => {
        if (nativeSubmitRef.current) {
          nativeSubmitRef.current = false;
          return;
        }

        event.preventDefault();
        const isValid = await form.trigger();
        if (isValid) {
          nativeSubmitRef.current = true;
          formRef.current?.requestSubmit();
        }
      }}
    >
      <div>
        <Input {...form.register("title")} name="title" placeholder="Название достижения" required />
        {form.formState.errors.title ? <p className="mt-1 text-xs text-red-600">{form.formState.errors.title.message}</p> : null}
      </div>
      <div>
        <Textarea {...form.register("description")} name="description" placeholder="Описание, результат, место, команда" required />
        {form.formState.errors.description ? (
          <p className="mt-1 text-xs text-red-600">{form.formState.errors.description.message}</p>
        ) : null}
      </div>
      <Select {...form.register("event_id")} name="event_id" defaultValue="">
        <option value="">Без привязки к событию</option>
        {events.map((event) => (
          <option key={event.id} value={event.id}>
            {event.title}
          </option>
        ))}
      </Select>
      <Input name="file" type="file" accept="image/*,.pdf,.doc,.docx" />
      <Button>Отправить на проверку</Button>
    </form>
  );
}
