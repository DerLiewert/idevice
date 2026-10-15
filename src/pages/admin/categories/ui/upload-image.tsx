"use client";
import { useEffect, useState } from "react";
import { CameraIcon, SquarePenIcon, TrashIcon } from "lucide-react";
import { cn } from "cn";
import {
  DialogContent,
  DialogHeader,
  FieldGroup,
  Label,
  DialogFooter,
  Dialog,
  Button,
  DialogTitle,
  DialogDescription,
  Field,
  Input,
  DialogClose,
  FieldDescription,
} from "@/shared/ui";
import { CategoryFormData } from "../model";
import { useObjectUrl } from "../lib";
import Image from "next/image";

type UploadImageProps = {
  className?: string;
  name: string;
  image: CategoryFormData["image"] | undefined;
  onChange: (image: CategoryFormData["image"]) => void;
  isInvalid?: boolean;
};
export const UploadImage = ({
  className,
  name,
  image,
  onChange,
  isInvalid = false,
}: UploadImageProps) => {
  const imageUrl = useObjectUrl(
    image && image.type === "new" ? image.file : null,
  );
  const [draftImage, setDraftImage] = useState<
    CategoryFormData["image"] | null
  >(null);

  return (
    <>
      <div className={cn("relative size-55!", className)}>
        <label
          aria-invalid={isInvalid}
          className={cn(
            "group border-border has-focus-visible:border-ring has-focus-visible:ring-ring/50 hover:text-accent hover:border-accent relative inline-block size-full cursor-pointer overflow-hidden rounded-[20px] border bg-neutral-300 transition-colors has-focus-visible:ring-[3px]",
            "aria-invalid:border-destructive aria-invalid:ring-destructive/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 aria-invalid:hover:text-destructive aria-invalid:ring-3",
          )}
        >
          <input
            className="sr-only"
            name={name}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;

              if (!file) return;
              if (!file.type.startsWith("image/")) return;

              setDraftImage({ type: "new", file, alt: image?.alt || "" });
              e.target.value = "";
            }}
          />
          {image ? (
            image.type === "existing" ? (
              <Image
                src={image.src}
                alt={image.alt || ""}
                className="absolute inset-0 size-full object-contain"
                fill
              />
            ) : imageUrl ? (
              <img
                src={imageUrl}
                alt={image.alt || "Изображение категории"}
                className="absolute inset-0 size-full object-contain"
              />
            ) : (
              <p className="no-scrollbar pointer-events-none absolute top-1/2 left-1/2 max-h-full w-full -translate-1/2 overflow-auto text-center text-sm">
                <CameraIcon className="mx-auto mb-1 size-8" strokeWidth="1px" />
                <span className="inline-block">
                  Загрузить фото
                  <br />
                  категории
                </span>
              </p>
            )
          ) : (
            <p className="no-scrollbar pointer-events-none absolute top-1/2 left-1/2 max-h-full w-full -translate-1/2 overflow-auto text-center text-sm">
              <CameraIcon className="mx-auto mb-1 size-8" strokeWidth="1px" />
              <span className="inline-block">
                Загрузить фото
                <br />
                категории
              </span>
            </p>
          )}
        </label>

        {image && (
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="absolute top-3 right-3 z-2"
            onClick={() => setDraftImage(image)}
          >
            <SquarePenIcon />
          </Button>
        )}
      </div>
      <EditUploadImageDialog
        draftImage={draftImage}
        onClose={() => setDraftImage(null)}
        onConfirm={(image) => {
          onChange(image);
          setDraftImage(null);
        }}
      />
    </>
  );
};

//===============================================================================================================================
type EditUploadImageProps = {
  onClose: () => void;
  onConfirm: (image: CategoryFormData["image"]) => void;
  draftImage: CategoryFormData["image"] | null;
};

const EditUploadImageDialog = ({
  onClose,
  onConfirm,
  draftImage,
}: EditUploadImageProps) => {
  const imageUrl = useObjectUrl(
    draftImage && draftImage.type === "new" ? draftImage.file : null,
  );
  const [alt, setAlt] = useState("");

  useEffect(() => {
    setAlt(draftImage?.alt ?? "");
  }, [draftImage]);

  return (
    <Dialog
      open={draftImage !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Изображение категории</DialogTitle>
          <DialogDescription>
            Изображение, представляющее данную категорию товаров.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup>
          {draftImage ? (
            <div className="flex gap-4">
              {draftImage.type === "existing" ? (
                <Image
                  src={draftImage.src}
                  alt={draftImage.alt || ""}
                  className="size-25 rounded-[10px] bg-neutral-200 object-contain p-1"
                  width={100}
                  height={100}
                />
              ) : (
                <img
                  src={imageUrl}
                  alt={draftImage.alt || ""}
                  className="size-25 rounded-[10px] bg-neutral-200 object-contain p-1"
                />
              )}

              <Field className="mt-1.5 self-center">
                <Label>Alt-текст</Label>
                <Input
                  name="alt"
                  value={alt}
                  onChange={(e) => setAlt(e.currentTarget.value)}
                />
                <FieldDescription>
                  Опишите назначение изображения. Оно будет отображаться
                  пользователю, если фото не подгрузилось. Например,
                  «Изображение категории товаров “iPhone”»
                </FieldDescription>
              </Field>
            </div>
          ) : (
            "Не удалось загрузить данные об изображении"
          )}
        </FieldGroup>
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
            onClick={() => {
              if (!draftImage) return;
              onConfirm({ ...draftImage, alt: alt.trim() });
            }}
            disabled={!draftImage}
          >
            Добавить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
