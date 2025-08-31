import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTransactionSchema } from "@shared/schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { format } from "date-fns";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const formSchema = insertTransactionSchema.omit({
  userId: true,
}).extend({
  type: z.enum(["income", "expense"]),
});

type FormData = z.infer<typeof formSchema>;

export default function AddTransactionModal({ isOpen, onClose }: AddTransactionModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const currentMonth = format(new Date(), "yyyy-MM");
  
  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "expense",
      date: format(new Date(), "yyyy-MM-dd"),
      categoryId: "cat-1", // Default to first category
      amount: "",
      description: "",
    },
  });


  const transactionType = watch("type");

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      return apiRequest("POST", "/api/transactions", data);
    },
    onSuccess: () => {
      // Invalidate all related queries to refresh the dashboard
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/summary"] });
      queryClient.removeQueries({ queryKey: [`/api/dashboard/summary?month=${currentMonth}`] });
      
      // Force immediate refetch
      queryClient.refetchQueries({ queryKey: [`/api/dashboard/summary?month=${currentMonth}`] });
      
      toast({
        title: "Transaction Added",
        description: "Your transaction has been recorded successfully.",
      });
      reset();
      onClose();
    },
    onError: (error) => {
      console.log("Mutation error:", error);
      toast({
        title: "Error",
        description: "Failed to add transaction. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("✅ Form submitted!", data);
    mutation.mutate(data);
  };

  const handleFormSubmit = handleSubmit(onSubmit, (errors) => {
    console.log("❌ Form validation failed:", errors);
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" data-testid="modal-add-transaction">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription>
            Record a new income or expense transaction with category and date.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="space-y-3">
            <Label>Transaction Type</Label>
            <RadioGroup 
              value={transactionType}
              onValueChange={(value) => setValue("type", value as "income" | "expense")}
              className="flex space-x-4"
              data-testid="radio-transaction-type"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="income" id="income" />
                <Label htmlFor="income">Income</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="expense" id="expense" />
                <Label htmlFor="expense">Expense</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              {...register("amount")}
              data-testid="input-amount"
            />
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Enter description"
              {...register("description")}
              data-testid="input-description"
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={(value) => setValue("categoryId", value)} value={watch("categoryId")} defaultValue="cat-1">
              <SelectTrigger data-testid="select-category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.categoryId && (
              <p className="text-sm text-destructive">{errors.categoryId.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              {...register("date")}
              data-testid="input-date"
            />
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date.message}</p>
            )}
          </div>
          
          <div className="flex space-x-3 pt-4">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={handleClose}
              className="flex-1"
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex-1"
              disabled={mutation.isPending}
              data-testid="button-submit"
            >
              {mutation.isPending ? "Adding..." : "Add Transaction"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
