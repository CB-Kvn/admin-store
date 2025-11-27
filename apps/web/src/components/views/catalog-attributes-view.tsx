import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { PageHeader } from "../page-header";
import { Palette, Layers, Lock, Gem, Ruler } from "lucide-react";
import { ColorsList } from "./colors-list";
import { MaterialsList } from "./materials-list";
import { ClosureTypesList } from "./closure-types-list";
import { StonesList } from "./stones-list";
import { SizesList } from "./sizes-list";
import { useEffect } from "react";
import { useAttributes } from "../../hooks";

interface CatalogAttributesViewProps {
  onAddColor?: () => void;
  onColorClick?: (colorId: string) => void;
  onAddMaterial?: () => void;
  onMaterialClick?: (materialId: string) => void;
  onAddClosureType?: () => void;
  onClosureTypeClick?: (closureTypeId: string) => void;
  onAddStone?: () => void;
  onStoneClick?: (stoneId: string) => void;
  onAddSize?: () => void;
  onSizeClick?: (sizeId: string) => void;
}

export function CatalogAttributesView({
  onAddColor,
  onColorClick,
  onAddMaterial,
  onMaterialClick,
  onAddClosureType,
  onClosureTypeClick,
  onAddStone,
  onStoneClick,
  onAddSize,
  onSizeClick,
}: CatalogAttributesViewProps) {
  const {
    materials,
    colors,
    closureTypes,
    stones,
    sizes,
    loadingAny,
    errorAny,
  } = useAttributes();

  useEffect(() => {
    if (loadingAny) {
      console.log("[Atributos] Cargando atributos...");
    }
  }, [loadingAny]);

  useEffect(() => {
    if (errorAny) {
      console.error("[Atributos] Error al cargar atributos:", errorAny);
    }
  }, [errorAny]);

  useEffect(() => {
    console.log("[Atributos] Datos actuales:", {
      materiales: materials,
      colores: colors,
      tiposDeCierre: closureTypes,
    });
  }, [materials, colors, closureTypes]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Atributos del Catálogo"
        description="Gestiona colores, materiales, tipos de cierre, piedras y tamaños"
      />

      <Tabs defaultValue="colors" className="w-full">
        <TabsList className="w-full flex gap-2 overflow-x-auto">
          <TabsTrigger value="colors" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Colores
          </TabsTrigger>
          <TabsTrigger value="materials" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Materiales
          </TabsTrigger>
          <TabsTrigger value="closure-types" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Tipos de Cierre
          </TabsTrigger>
          <TabsTrigger value="stones" className="flex items-center gap-2">
            <Gem className="h-4 w-4" />
            Piedras
          </TabsTrigger>
          <TabsTrigger value="sizes" className="flex items-center gap-2">
            <Ruler className="h-4 w-4" />
            Tamaños
          </TabsTrigger>
        </TabsList>

        <TabsContent value="colors" className="mt-6">
          <ColorsList colors={colors} onAddColor={onAddColor} onColorClick={onColorClick} />
        </TabsContent>

        <TabsContent value="materials" className="mt-6">
          <MaterialsList
            materials={materials}
            onAddMaterial={onAddMaterial}
            onMaterialClick={onMaterialClick}
          />
        </TabsContent>

        <TabsContent value="closure-types" className="mt-6">
          <ClosureTypesList
            closureTypes={closureTypes}
            onAddClosureType={onAddClosureType}
            onClosureTypeClick={onClosureTypeClick}
          />
        </TabsContent>

        <TabsContent value="stones" className="mt-6">
          <StonesList
            stones={stones}
            onAddStone={onAddStone}
            onStoneClick={onStoneClick}
          />
        </TabsContent>

        <TabsContent value="sizes" className="mt-6">
          <SizesList
            sizes={sizes}
            onAddSize={onAddSize}
            onSizeClick={onSizeClick}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}