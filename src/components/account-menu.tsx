import { useQuery } from "@tanstack/react-query";
import { Building, ChevronDown, LogOut } from "lucide-react";

import { getManagedRestaurant } from "@/api/get-managed-restaurant";
import { getProfile } from "@/api/get-profile";

import { StoreProfileDialog } from "./store-profile-dialog";
import { Button } from "./ui/button";
import { Dialog, DialogTrigger } from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Skeleton } from "./ui/skeleton";

export function AccountMenu() {
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const { data: managedRestaurant, isLoading: isLoadingManagedRestaurant } =
    useQuery({
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

  return (
    <Dialog>
      <DropdownMenu>
        {/* Todas as propriedades e funcionamento de <DropdownMenuTrigger /> serão 
        repassadas para <Button /> ao usar a propriedade `asChild` */}
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="flex items-center gap-2 select-none"
          >
            {isLoadingManagedRestaurant ? (
              <Skeleton className="h-4 w-40" />
            ) : (
              managedRestaurant?.name
            )}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="flex flex-col">
            {isLoadingProfile ? (
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            ) : (
              <>
                <span>{profile?.name}</span>
                <span className="text-muted-foreground text-xs font-normal">
                  {profile?.email}
                </span>
              </>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DialogTrigger asChild>
            <DropdownMenuItem>
              <Building className="mr-2 h-4 w-4" />
              <span>Perfil da loja</span>
            </DropdownMenuItem>
          </DialogTrigger>
          <DropdownMenuItem className="text-rose-500 dark:text-rose-400">
            <LogOut className="mr-2 h-4 w-4 text-rose-500 dark:text-rose-400" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <StoreProfileDialog />
    </Dialog>
  );
}
