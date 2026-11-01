"use client";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  SpecificationsGroupFormData,
  SpecificationsGroupSchema,
  createSpecificationsGroup,
  updateSpecificationsGroup,
} from "@/entities/specifications-groups";
import {
  Button,
  Field,
  FieldDescription,
  FieldLabel,
  Input,
} from "@/shared/ui";

type FormSpecificationGroupProps = { onSuccess?: () => void } & (
  | { role: "add"; defaultValues?: never; group_id?: never }
  | {
      role: "edit";
      defaultValues: SpecificationsGroupFormData;
      group_id: number;
    }
);

export const FormSpecificationGroup = ({
  onSuccess,
  defaultValues,
  role,
  group_id,
}: FormSpecificationGroupProps) => {
  const router = useRouter();

  const {
    control,
    formState: { errors },
    setError,
    handleSubmit,
    reset,
  } = useForm({
    resolver: zodResolver(SpecificationsGroupSchema),
    defaultValues: defaultValues ?? {
      name: "",
    },
  });

  const handleFormSubmit: SubmitHandler<SpecificationsGroupFormData> = async (
    data,
  ) => {
    try {
      if (role === "add") await createSpecificationsGroup(data);
      else await updateSpecificationsGroup(group_id, data);

      reset();
      onSuccess?.();
      router.refresh();
    } catch (error) {
      setError("name", {
        type: "server",
        message:
          error instanceof Error
            ? error.message
            : `Не удалось ${role === "add" ? "создать" : "обновить"} группу`,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="w-full">
      <Field>
        <FieldLabel>Название группы характеристик</FieldLabel>
        <div className="flex gap-5">
          <Controller
            name={"name"}
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Input
                  {...field}
                  type="text"
                  placeholder={
                    role === "edit"
                      ? "Прошлое значение: " + defaultValues.name
                      : ""
                  }
                  aria-invalid={errors[field.name] ? "true" : "false"}
                />
              </>
            )}
          />
          <Button className="w-60" type="submit">
            {role === "add" ? "Добавить" : "Обновить"} группу
          </Button>
        </div>
        {errors.name && (
          <FieldDescription className="text-destructive">
            * {errors.name.message}
          </FieldDescription>
        )}
        <FieldDescription>
          Название определяет группу, которая будет содержать в себе относящиеся
          к ней характеристики.
        </FieldDescription>
      </Field>
    </form>
  );
};
