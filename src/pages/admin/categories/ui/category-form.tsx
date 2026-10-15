"use client";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { UploadImage } from "./upload-image";
import {
  Field,
  FieldLegend,
  Input,
  FieldDescription,
  Button,
  FieldError,
  toast,
} from "@/shared/ui";
import { createCategory, updateCategory } from "../api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { CategoryFormData, CategorySchema, ExistingImage } from "../model";
import { generateSlug } from "@/shared/lib";

type CategoryEditFormData = Omit<CategoryFormData, "image"> & {
  image?: ExistingImage;
};

type CategoryFormProps = { className?: string; onSuccess?: () => void } & (
  | { role: "edit"; defaultValues: CategoryEditFormData; id: number }
  | { role: "add"; defaultValues?: never; id?: number }
);
// mode: {type: "edit"; id: number; defaultValues: CategoryEditFormData}

export const CategoryForm = ({
  className,
  defaultValues,
  role,
  id,
  onSuccess,
}: CategoryFormProps) => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
    setValue,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(CategorySchema),
    defaultValues: defaultValues || {
      name: "",
      slug: "",
    },
  });

  const onSubmitHandle: SubmitHandler<CategoryFormData> = async (data) => {
    let successToastText = null;
    if (role === "add") {
      if (data.image.type !== "new") return;

      const { image, ...payload } = data;
      const result = await createCategory({ ...payload, image });

      if (!result.success) {
        if (result.field) {
          setError(result.field, {
            type: "server",
            message: result.message,
          });
        } else {
          setError("root", {
            type: "server",
            message: result.message,
          });
        }

        return;
      }

      successToastText = "Категория успешно создана :)";
    } else if (role === "edit") {
      try {
        await updateCategory(id, data);
        successToastText = "Категория успешно обновлена ;)";
      } catch (error) {
        toast.add({
          type: "error",
          description: "Не удалось обновить категорию :(",
          priority: "high",
        });
      }
    }

    if (successToastText) {
      toast.add({
        type: "success",
        description: successToastText,
      });
    }

    reset();
    onSuccess?.();
    router.refresh();
    return;
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandle)} className={className}>
      <Controller
        name={"image"}
        control={control}
        render={({ field, fieldState }) => (
          <Field className="mb-6">
            <UploadImage
              name={field.name}
              image={field.value}
              onChange={field.onChange}
              isInvalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name={"name"}
        control={control}
        render={({ field, fieldState }) => (
          <Field className="mb-5">
            <FieldLegend>Название категории</FieldLegend>
            <Input
              type="text"
              {...field}
              aria-invalid={fieldState.invalid}
              onChange={(e) => {
                field.onChange(e);
                setValue("slug", generateSlug(e.currentTarget.value));
              }}
            />
            <FieldDescription>
              Название определяет, как элемент будет отображаться на вашем
              сайте.
            </FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name={"slug"}
        control={control}
        render={({ field, fieldState }) => (
          <Field className="mb-5">
            <FieldLegend>Ярлык</FieldLegend>
            <Input type="text" {...field} aria-invalid={fieldState.invalid} />
            <FieldDescription>
              «Ярлык» - это вариант названия, подходящий для URL. Содержит
              только латинские буквы в нижнем регистре, цифры и дефисы.
            </FieldDescription>
            <FieldDescription>
              Пробелы автоматически будут заменены на символ дефиса "-", а буквы
              преобразованы к нижнему регистру.
            </FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      {errors.root && <FieldError className="mb-5" errors={[errors.root]} />}

      <Button className="min-w-60" size="lg" type="submit">
        {role === "add" ? "Добавить категорию" : "Сохранить изменения"}
      </Button>
    </form>
  );
};
