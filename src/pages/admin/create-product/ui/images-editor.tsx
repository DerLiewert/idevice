"use client";

import { useEffect, useRef, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TrashIcon, UploadIcon } from "lucide-react";
import Image from "next/image";
import {
  Field,
  FieldError,
  Label,
  Input,
  Button,
  FieldContent,
} from "@/shared/ui";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
  DialogFooter,
  DialogClose,
} from "@/shared/ui";
import { ImageActionsDropdown } from "./image-actions-dropdown";
import {
  FormImage,
  ImagesFormSchema,
  ImagesFormValues,
  NewImage,
} from "../model/schemas";
import { useImagesWithUrl } from "../lib/use-images-with-url";

type ImagesEditorProps = {
  open: boolean;
  images: FormImage[];
  onConfirm: (images: FormImage[]) => void;
  onClose: () => void;
};

export const ImagesEditor = ({
  open,
  images,
  onClose,
  onConfirm,
}: ImagesEditorProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ImagesFormValues>({
    resolver: zodResolver(ImagesFormSchema),
    defaultValues: { images },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "images" });
  const watchedImages = useWatch({ control, name: "images" });
  const imagesWithUrl = useImagesWithUrl(watchedImages ?? []);

  const openFilePicker = (index: number | null = null) => {
    if (!fileInputRef.current) return;

    setReplaceIndex(index);

    fileInputRef.current.value = "";
    fileInputRef.current.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).filter((file) =>
      file.type.startsWith("image/"),
    );

    if (replaceIndex !== null) {
      const file = files[0];

      if (file) {
        setValue(
          `images.${replaceIndex}`,
          {
            type: "new",
            file,
            alt: watchedImages[replaceIndex]?.alt ?? "",
          },
          {
            shouldDirty: true,
            shouldValidate: true,
          },
        );
      }
      setReplaceIndex(null);
    } else if (files.length > 0) {
      append(files.map((file): NewImage => ({ type: "new", file, alt: "" })));
    }

    e.target.value = "";
  };

  useEffect(() => {
    if (!open) return;

    reset({ images });
    setReplaceIndex(null);
  }, [open, images, reset]);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
          reset();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Изображения товара</DialogTitle>
          <DialogDescription>
            В поле <b>«Alt-текст»</b> опишите назначение изображения. Оно будет
            отображаться пользователю, если фото не подгрузилось. Например,
            «Изображение категории товаров “iPhone”»
          </DialogDescription>
        </DialogHeader>

        <div className="-mx-4 -my-4 max-h-[90vh] overflow-y-auto px-4 py-4">
          {fields.length > 0 ? (
            <form
              id="dialog-create-product-images"
              className="max-mini:space-y-5 mini:grid mini:grid-cols-2 gap-y-5 md:grid-cols-3 md:gap-x-5 lg:grid-cols-4 xl:grid-cols-5"
            >
              {fields.map((field, index) => {
                const img = imagesWithUrl[index];

                if (!img) return <div key={field.id} />;

                return (
                  <div key={field.id}>
                    <div className="relative mb-2 flex h-60 w-full shrink-0 rounded-[10px]">
                      <div className="relative h-full w-full overflow-hidden rounded-[inherit] border border-neutral-400">
                        {img.type === "existing" ? (
                          <Image
                            src={img.src}
                            alt={img.alt || ""}
                            className="absolute inset-0 size-full object-contain"
                            fill
                          />
                        ) : (
                          <img
                            src={img.file}
                            alt={img.alt || ""}
                            className="absolute inset-0 h-full w-full object-contain"
                          />
                        )}
                      </div>

                      <div className="absolute top-2 right-2 flex flex-col flex-wrap gap-2">
                        <ImageActionsDropdown
                          onReplace={() => openFilePicker(index)}
                          onDelete={() => remove(index)}
                        />
                      </div>
                    </div>

                    <Controller
                      name={`images.${index}.alt`}
                      control={control}
                      render={({ field, fieldState }) => (
                        <Field className="mt-1.5 self-center">
                          <Label>Alt-текст</Label>
                          <Input
                            {...field}
                            value={field.value || ""}
                            onChange={field.onChange}
                            aria-invalid={fieldState.invalid}
                          />

                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>
                );
              })}
            </form>
          ) : (
            <FieldContent>Не загружено никаких изображений</FieldContent>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="text-accent border-accent"
            onClick={() => openFilePicker()}
          >
            <UploadIcon /> Загрузить еще фото
          </Button>
          <Button
            variant="destructive"
            onClick={() => remove()}
            disabled={fields.length === 0}
          >
            <TrashIcon /> Удалить все фото
          </Button>
        </div>

        {errors.images && <FieldError errors={[errors.images.root]} />}

        <DialogFooter>
          <DialogClose
            render={
              <Button variant="outline" type="button">
                Отменить
              </Button>
            }
          />
          <Button
            type="button"
            onClick={handleSubmit((data) => onConfirm(data.images))}
          >
            Добавить
          </Button>
        </DialogFooter>
      </DialogContent>

      <input
        ref={fileInputRef}
        className="sr-only"
        type="file"
        accept="image/*"
        multiple={replaceIndex === null}
        onChange={handleFileChange}
      />
    </Dialog>
  );
};
