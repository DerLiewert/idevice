export type CategoryErrorField = "name" | "slug";

export class CategoryError extends Error {
  field: CategoryErrorField;

  constructor(field: CategoryErrorField, message: string) {
    super(message);
    this.name = "CategoryError";
    this.field = field;
  }
}
