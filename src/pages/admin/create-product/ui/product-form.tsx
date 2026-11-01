"use client";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { generateSlug } from "@/shared/lib";
import {
  Field,
  Input,
  FieldDescription,
  FieldError,
  FieldLegend,
  Textarea,
  FieldLabel,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Button,
  toast,
} from "@/shared/ui";
import { UploadImage } from "./upload-images";
import { Category } from "../model/types";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ExistingImage,
  ProductFormData,
  ProductSchema,
} from "../model/schemas";
import { createProduct } from "../api";
import { useRouter } from "next/navigation";
import { updateProduct } from "../api/update-product";

type CategoryEditFormData = Omit<ProductFormData, "images"> & {
  images: ExistingImage[];
};

type ProductFormProps = {
  categories: Category[];
  className?: string;
  onSuccess?: () => void;
} & (
  | { role: "edit"; defaultValues: CategoryEditFormData; id: number }
  | { role: "add"; defaultValues?: never; id?: number }
);

export const ProductForm = ({
  categories,
  onSuccess,
  defaultValues,
  role,
  id
}: ProductFormProps) => {
  const router = useRouter();
  const { control, handleSubmit, setError, setValue, reset } = useForm({
    resolver: zodResolver(ProductSchema),
    defaultValues: defaultValues || {
      name: "",
      slug: "",
      description: "",
      category_id: undefined,
      images: [],
    },
  });

  const categoriesOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const onHandleSubmit: SubmitHandler<ProductFormData> = async (data) => {
    let successToastText = null;

    if (role === "add") {
      const { images, ...payload } = data;
      const result = await createProduct({
        ...payload,
        images: images
          .filter((img) => img.type === "new")
          .map((img) => ({ alt: img.alt, file: img.file })),
      });

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

      successToastText = "Товар успешно добавлен";
    } else if (role === "edit") {
      try {
        await updateProduct(id, data);
        successToastText = "Товар успешно обновлен";
      } catch (error) {
        toast.add({
          type: "error",
          description: "Не удалось обновить товар",
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
    <form onSubmit={handleSubmit(onHandleSubmit)}>
      {/* Выбор группы характеристик */}
      <Controller
        control={control}
        name="category_id"
        render={({ field, fieldState }) => (
          <Field className="mb-5">
            <FieldLegend>Категория товара</FieldLegend>
            <Select
              items={categoriesOptions}
              value={field.value ?? null}
              onValueChange={field.onChange}
            >
              <SelectTrigger aria-invalid={fieldState.invalid}>
                <SelectValue placeholder="Выберите категорию" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {categoriesOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                  {categoriesOptions.length === 0 && (
                    <SelectLabel>
                      Не создано ни одной категории товаров
                    </SelectLabel>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FieldDescription>
              Выберите к какой категории товаров относится добавляемый товар.
            </FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <div className="flex gap-12">
        <div className="basis-80">
          <Controller
            name={"images"}
            control={control}
            render={({ field, fieldState }) => (
              <Field className="mb-6">
                <UploadImage
                  name={field.name}
                  images={field.value}
                  onChange={field.onChange}
                  isInvalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
        <div className="flex-1 space-y-5">
          <Controller
            name={"name"}
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLegend>Название товара</FieldLegend>
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
                  Название определяет, как товар будет отображаться на вашем
                  сайте.
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name={"slug"}
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLegend>Ярлык</FieldLegend>
                <Input
                  type="text"
                  {...field}
                  aria-invalid={fieldState.invalid}
                />
                <FieldDescription>
                  «Ярлык» - это вариант названия, подходящий для URL. Содержит
                  только латинские буквы в нижнем регистре, цифры и дефисы.
                  Пробелы автоматически будут заменены на символ дефиса "-", а
                  буквы преобразованы к нижнему регистру.
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name={"description"}
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLegend>Описание</FieldLegend>
                <Textarea
                  className="h-30 resize-none"
                  {...field}
                  aria-invalid={fieldState.invalid}
                />
                <FieldDescription>
                  Описание товара, которорое будет отображаться на странице
                  товара.
                </FieldDescription>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <div className="flex flex-wrap justify-end">
            <Button className="min-w-75" size="lg" type="submit">
              {role === "add" ? "Добавить товар" : "Сохранить изменения"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
};
