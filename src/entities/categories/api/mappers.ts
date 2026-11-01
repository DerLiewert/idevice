import { DefaultValues } from "react-hook-form";
import { CategoryFormData, CategoryFull } from "@/pages/admin/categories/model";

export const toFormDefaults = (
  c: CategoryFull,
): CategoryFormData | DefaultValues<CategoryFormData> => ({
  name: c.name,
  slug: c.slug,
  image: c.image ? { type: "existing", ...c.image } : undefined,
});
