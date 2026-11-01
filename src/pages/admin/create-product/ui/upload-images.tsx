"use client";
import { useState } from "react";
import { cn } from "cn";
import { CameraIcon, SquarePenIcon } from "lucide-react";
import { Button } from "@/shared/ui";
import { ImagesEditor } from "./images-editor";
import { ExistingImage, FormImage, NewImage } from "../model/schemas";
import { useImagesWithUrl } from "../lib/use-images-with-url";
import Image from "next/image";

type UploadImageProps = {
  name: string;
  isInvalid?: boolean;
  className?: string;
  images: Array<NewImage | ExistingImage>;
  onChange: (image: Array<NewImage | ExistingImage>) => void;
};

export const UploadImage = ({
  name,
  images,
  isInvalid,
  className,
  onChange,
}: UploadImageProps) => {
  const [open, setOpen] = useState(false);
  const [draftImages, setDraftImages] = useState<FormImage[]>([]);
  const imagesWithUrl = useImagesWithUrl(images);

  const openEditor = (nextImages: FormImage[] = images) => {
    setDraftImages(nextImages);
    setOpen(true);
  };

  return (
    <>
      <div className="w-full max-w-80">
        <div className={cn("relative aspect-square w-full", className)}>
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
                const files =
                  e.target.files &&
                  Array.from(e.target.files).filter((file) =>
                    file.type.startsWith("image/"),
                  );

                if (!files) return;

                const newDraftImages = files.map(
                  (file) => ({ type: "new", file, alt: "" }) as NewImage,
                );
                openEditor(newDraftImages);

                e.target.value = "";
              }}
              multiple
            />

            {imagesWithUrl.length > 0 ? (
              imagesWithUrl[0].type === "new" ? (
                <img
                  src={imagesWithUrl[0].file}
                  alt={imagesWithUrl[0].alt || "Изображение категории"}
                  className="absolute inset-0 size-full object-contain"
                />
              ) : (
                <Image
                  src={imagesWithUrl[0].src}
                  alt={imagesWithUrl[0].alt || "Изображение товара"}
                  className="absolute inset-0 size-full object-contain"
                  fill
                />
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

          {images.length > 0 && (
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="absolute top-3 right-3 z-2"
              onClick={() => openEditor()}
            >
              <SquarePenIcon />
            </Button>
          )}
        </div>
        {imagesWithUrl.length > 0 && (
          <div className="flex w-full gap-1 overflow-auto">
            {imagesWithUrl.map((img, index) => (
              <div
                key={img.type === "existing" ? img.id : `${img.file}-${index}`}
                className={cn(
                  "border-border relative size-15 flex-0 shrink-0 basis-15 rounded-[6px] border-2 object-contain",
                  // { "border-accent": img === mainImage },
                )}
              >
                {img.type === "existing" ? (
                  <Image
                    src={img.src}
                    alt={img.alt || "Изображение товара"}
                    className="absolute inset-px size-[calc(100%-2px)] object-contain"
                    fill
                  />
                ) : (
                  <img
                    src={img.file}
                    alt={img.alt || "Изображение товара"}
                    className="absolute inset-px size-[calc(100%-2px)] object-contain"
                    // onClick={() => setMainImage(img)}
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <ImagesEditor
          open={open}
          images={draftImages}
          onClose={() => {
            setOpen(false);
          }}
          onConfirm={(nextImages) => {
            onChange(nextImages);
            setOpen(false);
          }}
        />
      </div>
    </>
  );
};
