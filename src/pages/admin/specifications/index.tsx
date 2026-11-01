import type { Metadata } from "next";
import { getSpecificationsGroups } from "@/entities/specifications-groups";
import { getSpecifications } from "@/entities/specifications";
import { PageHeader } from "@/shared/ui/page-header";
import { FormTabs } from "./ui/form-tabs";
import { SpecificationsSection } from "./ui/spesifications-section";

export const metadata: Metadata = {
  title: "iDevise | Админ | Характеристики",
};

export const SpecificationsPage = async () => {
  const groups = await getSpecificationsGroups();
  const specifications = await getSpecifications();

  return (
    <>
      <PageHeader
        title="Xарактеристик товаров"
        description="Здесь вы можете управлять группами характеристик и самими
          характеристиками товаров магазина. Для изменения порядка групп во
          фронтэнде просто перетаскивайте их."
      />
      <div className="container mb-10!">
        <FormTabs groups={groups} />
      </div>
      <div className="container">
        <SpecificationsSection
          groups={groups}
          specifications={specifications}
        />
      </div>
    </>
  );
};

export default SpecificationsPage;
