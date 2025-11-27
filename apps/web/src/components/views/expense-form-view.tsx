import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card } from "../ui/card";
import { PageHeader } from "../page-header";
import { ArrowLeft, Calendar as CalendarIcon, Upload, Trash } from "lucide-react";
import { toast } from "sonner";
import { useExpenses } from "../../hooks";
import { useGetExpenseByIdQuery } from "../../state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import type { ExpenseCategory } from "../../lib/types";

interface ExpenseFormViewProps {
  expenseId?: string;
  onBack: () => void;
}

export function ExpenseFormView({ expenseId, onBack }: ExpenseFormViewProps) {
  const isEditing = !!expenseId;
  const { createExpense, updateExpense, deleteExpense, isCreatingExpense, isUpdatingExpense, isDeletingExpense } = useExpenses();
  const { data: expenseData, isLoading: isLoadingExpense } = useGetExpenseByIdQuery(expenseId!, {
    skip: !expenseId,
  });
  
  // Form state
  const [formData, setFormData] = useState({
    date: new Date(),
    description: "",
    subtotal: "",
    taxes: "",
    category: "OTHER" as ExpenseCategory,
    paymentMethod: "",
    notes: "",
    receipt: "",
  });

  // Load expense data when editing
  useEffect(() => {
    if (expenseData) {
      // Calculate subtotal and taxes from total amount
      const amount = expenseData.amount || 0;
      const taxRate = 0.16; // Assuming 16% tax rate
      const subtotal = amount / (1 + taxRate);
      const taxes = amount - subtotal;
      
      setFormData({
        date: expenseData.date ? new Date(expenseData.date) : new Date(),
        description: expenseData.description || "",
        subtotal: subtotal.toFixed(2),
        taxes: taxes.toFixed(2),
        category: (expenseData.category as ExpenseCategory) || "OTHER",
        paymentMethod: "",
        notes: expenseData.notes || "",
        receipt: "",
      });
    }
  }, [expenseData]);

  const calculateTotal = () => {
    const subtotal = parseFloat(formData.subtotal) || 0;
    const taxes = parseFloat(formData.taxes) || 0;
    return (subtotal + taxes).toFixed(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación mínima
    if (!formData.description || !formData.subtotal) {
      toast.error("Por favor, completa los campos requeridos");
      return;
    }

    const subtotalNum = parseFloat(formData.subtotal || "0");
    const taxesNum = parseFloat(formData.taxes || "0");
    const amount = subtotalNum + taxesNum;
    const currentUserId = (typeof localStorage !== 'undefined'
      ? (localStorage.getItem('currentUserId') ?? 'admin')
      : 'admin');

    try {
      if (isEditing && expenseId) {
        await updateExpense({
          id: expenseId,
          changes: {
            description: formData.description,
            amount,
            date: formData.date.toISOString(),
            category: formData.category,
            paymentMethod: formData.paymentMethod || undefined,
            notes: formData.notes || undefined,
            subtotal: subtotalNum,
            taxes: taxesNum,
            userId: currentUserId,
          },
        });
        toast.success("Gasto actualizado exitosamente");
      } else {
        await createExpense({
          description: formData.description,
          amount,
          date: formData.date.toISOString(),
          category: formData.category,
          paymentMethod: formData.paymentMethod || undefined,
          notes: formData.notes || undefined,
          subtotal: subtotalNum,
          taxes: taxesNum,
          userId: currentUserId,
        });
        toast.success("Gasto creado exitosamente");
      }

      onBack();
    } catch (err: any) {
      console.error("[Gastos] Error guardando gasto:", err);
      const apiMessage = err?.data?.message || err?.data?.error || err?.message;
      toast.error(apiMessage || "No se pudo guardar el gasto");
    }
  };

  const handleDelete = async () => {
    if (!expenseId) return;
    const confirmed = window.confirm("¿Seguro que deseas eliminar este gasto?");
    if (!confirmed) return;
    try {
      await deleteExpense(expenseId);
      toast.success("Gasto eliminado exitosamente");
      onBack();
    } catch (err: any) {
      console.error("[Gastos] Error eliminando gasto:", err);
      const apiMessage = err?.data?.message || err?.data?.error || err?.message;
      toast.error(apiMessage || "No se pudo eliminar el gasto");
    }
  };

  const handleChange = (field: string, value: string | Date) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEditing ? "Editar Gasto" : "Nuevo Gasto"}
        breadcrumbs={[
          { label: "Gastos", href: "#" },
          { label: isEditing ? "Editar" : "Nuevo" },
        ]}
        actions={
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft />
            Volver
          </Button>
        }
      />

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 max-w-4xl">
          <Card className="p-6">
            <h3 className="mb-4">Información del Gasto</h3>
          <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Fecha <span className="text-destructive">*</span></Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarIcon />
                      {format(formData.date, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => date && handleChange("date", date)}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">
                  Categoría <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleChange("category", value)}
                >
                  <SelectTrigger id="category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MATERIALS">Materiales</SelectItem>
                    <SelectItem value="TOOLS">Herramientas</SelectItem>
                    <SelectItem value="MARKETING">Marketing</SelectItem>
                    <SelectItem value="SERVICES">Servicios</SelectItem>
                    <SelectItem value="SALARIES">Salarios</SelectItem>
                    <SelectItem value="RENT">Alquiler</SelectItem>
                    <SelectItem value="OTHER">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">
                  Descripción <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Describe el gasto..."
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleChange("notes", e.target.value)}
                  placeholder="Notas adicionales (opcional)"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subtotal">
                  Subtotal <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="subtotal"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.subtotal}
                  onChange={(e) => handleChange("subtotal", e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxes">Impuestos</Label>
                <Input
                  id="taxes"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.taxes}
                  onChange={(e) => handleChange("taxes", e.target.value)}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">
                  Método de Pago <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) => handleChange("paymentMethod", value)}
                >
                  <SelectTrigger id="paymentMethod">
                    <SelectValue placeholder="Seleccionar método de pago" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CASH">Efectivo</SelectItem>
                    <SelectItem value="CARD">Tarjeta</SelectItem>
                    <SelectItem value="TRANSFER">Transferencia</SelectItem>
                    <SelectItem value="CHECK">Cheque</SelectItem>
                    <SelectItem value="OTHER">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Monto Total</Label>
                <div className="h-9 px-3 py-2 bg-muted rounded-md flex items-center">
                  ${calculateTotal()}
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4">Recibo</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="receipt">URL del Recibo</Label>
                <Input
                  id="receipt"
                  type="url"
                  value={formData.receipt}
                  onChange={(e) => handleChange("receipt", e.target.value)}
                  placeholder="https://ejemplo.com/recibo.pdf"
                />
              </div>

              <div className="p-4 border border-dashed rounded-lg text-center">
                <Upload className="mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">
                  Funcionalidad de carga iría aquí
                </p>
                <p className="text-muted-foreground">
                  Por ahora, ingresa una URL de recibo arriba
                </p>
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            {isEditing && (
              <Button type="button" variant="destructive" onClick={handleDelete} disabled={isDeletingExpense}>
                <Trash className="mr-2 h-4 w-4" />
                Eliminar
              </Button>
            )}
            <Button type="button" variant="outline" onClick={onBack}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isCreatingExpense || isUpdatingExpense || isLoadingExpense}>
              {isEditing ? "Actualizar Gasto" : "Crear Gasto"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}