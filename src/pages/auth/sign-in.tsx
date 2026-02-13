import { useMutation } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useSearchParams } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

import { signIn } from "@/api/sign-in";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFlashMessage } from "@/hooks/use-flash-message";

const signInFormSchema = z.object({
  email: z.email(),
});

/**
 * z.infer converte a estrutura de z.object para a tipagem do ts.
 */
type signInFormSchemaType = z.infer<typeof signInFormSchema>;

export function SignIn() {
  const [searchParams] = useSearchParams();
  useFlashMessage();

  /**
   * defaultValues: Captura o e-mail da URL (caso o usuário tenha sido redirecionado após o cadastro)
   * e pré-preenche o campo de e-mail no formulário de login.
   */
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<signInFormSchemaType>({
    defaultValues: {
      email: searchParams.get("email") ?? "",
    },
  });

  /**
   * useMutation: Hook do React Query para operações de escrita (POST/PUT/DELETE).
   * * - mutationFn: A função que executa a operação assíncrona. Ao passar 'signIn', conectamos
   * diretamente à chamada da API.
   *
   * * - mutateAsync: A função que dispara a mutação. Renomeamos para 'authenticate' para ficar
   * semântico. Diferente do 'mutate' comum, ela retorna uma Promise, permitindo usar
   * await e try/catch dentro do handleSignIn.
   */
  const { mutateAsync: authenticate } = useMutation({
    mutationFn: signIn,
  });

  async function handleSignIn(data: signInFormSchemaType) {
    try {
      await authenticate({ email: data.email });

      toast.success("Enviamos um link com autenticação para seu e-mail.", {
        duration: 5000,
        action: {
          label: "Reenviar",
          onClick: () => handleSignIn(data),
        },
      });
    } catch (error) {
      toast.error("Credenciais inválidas.");
    }
  }

  return (
    <>
      <Helmet title="Login" />
      <div className="p-8">
        {/* Todas as propriedades que o componente <Button /> receberia, vai passar para o componente <Link />,
          através da propriedade asChild */}
        <Button variant="ghost" asChild className="absolute top-8 right-8">
          <Link to="/sign-up">Novo estabelecimento</Link>
        </Button>
        <div className="flex w-87.5 flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Acessar painel
            </h1>
            <p className="text-muted-foreground text-sm">
              Acompanhe suas vendas pelo painel do parceiro
            </p>
          </div>

          <form onSubmit={handleSubmit(handleSignIn)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Seu e-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@example.com"
                {...register("email")}
              />
            </div>

            <Button
              disabled={isSubmitting}
              className="w-full cursor-pointer"
              type="submit"
            >
              Acessar painel
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
