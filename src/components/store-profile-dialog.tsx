import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

import {
  getManagedRestaurant,
  type GetManagedRestaurantResponse,
} from "@/api/get-managed-restaurant";
import { updateProfile } from "@/api/update-profile";
import { Button } from "@/components/ui/button";

import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

const storeProfileFormSchema = z.object({
  name: z.string().min(1, "O nome é obrigatório"),
  description: z.string().nullable(),
});

type StoreProfileFormSchemaType = z.infer<typeof storeProfileFormSchema>;

export function StoreProfileDialog() {
  const queryClient = useQueryClient();

  const { data: managedRestaurant } = useQuery({
    queryKey: ["managed-restaurant"],
    queryFn: getManagedRestaurant,
    /**
     * staleTime: Define por quanto tempo os dados são considerados "frescos". Durante esse período, o React Query não irá refazer a
     * requisição para obter os dados novamente, mesmo que o componente seja re-renderizado ou re-montado.
     * No caso do perfil da loja, as informações não mudam com frequência, então podemos definir um tempo infinito para evitar requisições desnecessárias.
     *
     * É necessário adicionar essa flag nos outros componentes que também buscam as informações do restaurante gerenciado,
     * como o dashboard, para garantir que a informação seja consistente em toda a aplicação e evitar refetch desnecessário.
     */
    staleTime: Infinity,
  });

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<StoreProfileFormSchemaType>({
    resolver: zodResolver(storeProfileFormSchema),
    values: {
      name: managedRestaurant?.name ?? "",
      description: managedRestaurant?.description ?? "",
    },
  });

  function updateManagedRestaurantCache({
    name,
    description,
  }: StoreProfileFormSchemaType) {
    const cached = queryClient.getQueryData<GetManagedRestaurantResponse>([
      "managed-restaurant",
    ]);

    /**
     * Atualiza o cache do React Query para refletir as mudanças feitas no perfil da loja,
     * garantindo que outros componentes que dependem desses dados exibam as informações atualizadas.
     *
     * Estará atualizando apenas o nome e a descrição, mantendo os outros dados inalterados.
     */
    if (cached) {
      queryClient.setQueryData<GetManagedRestaurantResponse>(
        ["managed-restaurant"],
        {
          ...cached,
          name,
          description,
        },
      );
    }

    return { cached };
  }

  const { mutateAsync: updateProfileFn } = useMutation({
    mutationFn: updateProfile,
    onMutate: ({ name, description }) => {
      const { cached } = updateManagedRestaurantCache({ name, description });
      return { previousProfile: cached };
    },
    onError(_, __, context) {
      if (context?.previousProfile) {
        updateManagedRestaurantCache(context.previousProfile);
      }
      toast.error("Falha ao atualizar perfil. As alterações foram desfeitas.");
    },
    onSuccess: () => {
      toast.success("Perfil atualizado com sucesso!");
    },
  });

  async function handleUpdateProfile(data: StoreProfileFormSchemaType) {
    await updateProfileFn({
      name: data.name,
      description: data.description,
    });
  }

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>Perfil da loja</DialogTitle>
        <DialogDescription>
          Atualize as informações do perfil da sua loja.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleUpdateProfile)}>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nome
            </Label>
            <Input
              className="col-span-3"
              id="name"
              placeholder="Nome da loja"
              {...register("name")}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Descrição
            </Label>
            <Textarea
              className="col-span-3"
              id="description"
              placeholder="Descrição da loja"
              {...register("description")}
            />
          </div>
        </div>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Cancelar
            </Button>
          </DialogClose>
          <Button type="submit" variant="success" disabled={isSubmitting}>
            Salvar
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
