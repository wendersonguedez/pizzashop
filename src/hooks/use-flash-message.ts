import { useEffect } from "react";
import { toast } from "sonner";

export function useFlashMessage() {
  useEffect(() => {
    const authError = localStorage.getItem("@pizzashop:auth-error");
    if (authError) {
      toast.warning("Sessão expirada", {
        description: "Por favor, faça login novamente.",
        id: "session-expired",
      });

      localStorage.removeItem("@pizzashop:auth-error");
    }
  }, []);
}
