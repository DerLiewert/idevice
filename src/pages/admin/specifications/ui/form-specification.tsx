"use client";
import { useRouter } from "next/navigation";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SpecificationGroup } from "@/entities/specifications-groups";
import {
  createSpecification,
  updateSpecification,
  SpecificationFormData,
  SpecificationSchema,
} from "@/entities/specifications";
import {
  Button,
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  Input,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";

type FormSpecificationBase = {
  onSuccess?: () => void;
  groups: SpecificationGroup[];
};

type FormSpecificationAdd = {
  role: "add";
  defaultValues?: never;
  specification_id?: never;
};

type FormSpecificationEdit = {
  role: "edit";
  defaultValues: SpecificationFormData;
  specification_id: number;
};

type FormSpecificationProps = FormSpecificationBase &
  (FormSpecificationAdd | FormSpecificationEdit);

export const FormSpecification = ({
  onSuccess,
  defaultValues,
  role,
  groups,
  specification_id,
}: FormSpecificationProps) => {
  const router = useRouter();
  const {
    control,
    formState: { errors },
    handleSubmit,
    setError,
    reset,
    resetField,
  } = useForm({
    resolver: zodResolver(SpecificationSchema),
    defaultValues: defaultValues ?? {
      name: "",
      group_id: undefined,
    },
  });

  const groupsOptions = groups.map((group) => ({
    label: group.name,
    value: group.id,
  }));

  const handleFormSubmit: SubmitHandler<SpecificationFormData> = async (
    data,
  ) => {
    try {
      if (role === "add") {
        await createSpecification(data);
        resetField("name");
      } else {
        await updateSpecification(specification_id, data);
        reset();
      }

      onSuccess?.();
      router.refresh();
    } catch (error) {
      setError("name", {
        type: "server",
        message:
          error instanceof Error
            ? error.message
            : `Не удалось ${role === "add" ? "создать" : "обновить"} характеристику`,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
      <FieldGroup className="flex-row">
        {/* Выбор группы характеристик */}
        <Field className="w-100">
          <FieldLabel>Группа характеристик</FieldLabel>
          <Controller
            control={control}
            name="group_id"
            render={({ field }) => (
              <Select
                items={groupsOptions}
                value={field.value ?? null}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите характеристику" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {groupsOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                    {groups.length === 0 && (
                      <SelectLabel>
                        Не создано ни одной группы характеристик
                      </SelectLabel>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.group_id && (
            <FieldDescription className="text-destructive">
              * {errors.group_id.message}
            </FieldDescription>
          )}
          <FieldDescription>
            Группа характеристик к которой относится будет относится создаваемая
            характеристика
          </FieldDescription>
        </Field>

        {/* Добавление характеристики к выбранной группе */}
        <Field className="w-auto flex-1">
          <FieldLabel>Название характеристики</FieldLabel>
          <Controller
            control={control}
            name={"name"}
            render={({ field }) => (
              <Input
                type="text"
                {...field}
                placeholder={
                  role === "edit"
                    ? "Прошлое значение: " + defaultValues.name
                    : ""
                }
                aria-invalid={errors[field.name] ? "true" : "false"}
              />
            )}
          />
          {errors.name && (
            <FieldDescription className="text-destructive">
              * {errors.name.message}
            </FieldDescription>
          )}
          <FieldDescription>
            Название определяет группу, которая будет содержать в себе
            относящиеся к ней характеристики.
          </FieldDescription>
        </Field>

        <Button className="mt-6.75 w-60" type="submit">
          {role === "add" ? "Добавить характеристику" : "Сохранить изменения"}
        </Button>
      </FieldGroup>
    </form>
  );
};
