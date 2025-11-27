import React from "react";
import { ProductFormView } from "./product-form-view";
import { useGetProductByIdQuery, useUpdateProductMutation } from "../../state";
import type { ApiProduct } from "../../lib/api-types";

interface ProductEditViewProps {
  productId: string;
  onBack: () => void;
}

export function ProductEditView({ productId, onBack }: ProductEditViewProps) {
  const { data: product, isLoading, error } = useGetProductByIdQuery(productId);
  const [updateProduct, { isLoading: isSaving }] = useUpdateProductMutation();

  if (isLoading) {
    return <div style={{ padding: 16 }}>Cargando producto…</div>;
  }

  if (error) {
    return <div style={{ padding: 16, color: "#b00020" }}>Error cargando producto.</div>;
  }

  const handleSave = async (changes: Partial<any>) => {
    try {
      // El backend espera { item, images, categories }.
      // Para edición de imágenes, enviamos al menos item vació para pasar validación.
      const payload: any = {
        item: {},
        ...(changes.images ? { images: changes.images } : {}),
      };
      await updateProduct({ id: productId, changes: payload as any }).unwrap();
      onBack();
    } catch (e) {
      // En esta versión simple solo mostramos el error en consola
      console.error("Error al actualizar producto", e);
    }
  };

  return (
    <ProductFormView
      product={product as ApiProduct}
      productId={productId}
      onBack={onBack}
      onSave={handleSave}
    />
  );
}