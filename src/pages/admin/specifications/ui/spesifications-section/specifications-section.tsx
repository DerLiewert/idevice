import { SpecificationGroup } from "@/entities/specifications-groups";
import { SpecificationResponse } from "@/entities/specifications";
import { SpecificationActions } from "./specification-actions";
import { SpecificationsSearch } from "./specifications-search";
import { SpecificationsViewer } from "./specifications-viewer";

export const SpecificationsSection = ({
  groups,
  specifications,
}: {
  groups: SpecificationGroup[];
  specifications: SpecificationResponse[];
}) => {
  return (
    <div className="space-y-5">
      <h2 className="text-2xl">Все характеристики</h2>
      <SpecificationsSearch />
      <SpecificationsViewer groups={groups} specifications={specifications} />
      <SpecificationActions />
    </div>
  );
};
