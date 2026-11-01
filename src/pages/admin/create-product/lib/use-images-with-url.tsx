"use client";
import { useEffect, useState } from "react";
import { ExistingImage, FormImage, NewImage } from "../model/schemas";

type ImageWithUrl = (Omit<NewImage, "file"> & { file: string }) | ExistingImage;

export const useImagesWithUrl = (images: FormImage[]) => {
  const [imagesWithUrl, setImagesWithUrl] = useState<Array<ImageWithUrl>>([]);

  useEffect(() => {
    const urls: string[] = [];

    const result = images.map((img) => {
      if (img.type === "existing") return img;

      const url = URL.createObjectURL(img.file);
      urls.push(url);

      return {
        ...img,
        file: url,
      };
    });

    setImagesWithUrl(result);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  return imagesWithUrl;
};
