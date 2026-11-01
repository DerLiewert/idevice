import { SpecificationGroup } from "@/entities/specifications-groups";
import { FormSpecificationGroup } from "./form-group";
import { FormSpecification } from "./form-specification";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui";

export const FormTabs = ({ groups }: { groups: SpecificationGroup[] }) => {
  return (
    <Tabs defaultValue="groups" className="gap-4">
      <div className="overflow-x-auto overflow-y-hidden pb-0.5">
        <TabsList className="w-full justify-start" variant="line">
          <TabsTrigger value="groups">Добавить группу</TabsTrigger>
          <TabsTrigger value="specifications">
            Добавить характеристику
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="groups">
        <FormSpecificationGroup role="add" />
      </TabsContent>
      <TabsContent value="specifications">
        <FormSpecification role="add" groups={groups} />
      </TabsContent>
    </Tabs>
  );
};
