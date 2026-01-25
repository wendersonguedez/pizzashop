import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const signUpFormSchema = z.object({
  restaurantName: z.string().min(3),
  managerName: z.string().min(3),
  phone: z.string().min(10).max(11),
  email: z.email(),
});

/**
 * z.infer converte a estrutura de z.object para a tipagem do ts.
 */
type signUpFormSchemaType = z.infer<typeof signUpFormSchema>;

export function SignUp() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<signUpFormSchemaType>();

  async function handleSignUp(data: signUpFormSchemaType) {
    try {
      console.log(data);

      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Restaurante cadastrado com sucesso.", {
        duration: 5000,
        action: {
          label: "Login",
          onClick: () => navigate("/sign-in"),
        },
      });
    } catch (error) {
      toast.error("Erro ao cadastrar restaurante.");
    }
  }

  return (
    <>
      <Helmet title="Cadastro" />
      <div className="p-8">
        <Button variant="ghost" asChild className="absolute top-8 right-8">
          <Link to="/sign-in">Fazer login</Link>
        </Button>
        <div className="flex w-87.5 flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Criar conta grátis
            </h1>
            <p className="text-muted-foreground text-sm">
              Seja um parceiro e comece suas vendas!
            </p>
          </div>

          <form onSubmit={handleSubmit(handleSignUp)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="restaurantName">Nome do estabelecimento</Label>
              <Input
                id="restaurantName"
                type="text"
                placeholder="Pizza Hut"
                {...register("restaurantName")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="managerName">Seu nome</Label>
              <Input
                id="managerName"
                type="text"
                placeholder="example@example.com"
                {...register("managerName")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Seu e-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@example.com"
                {...register("email")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Seu celular</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(99) 99999-9999"
                {...register("phone")}
              />
            </div>

            <Button
              disabled={isSubmitting}
              className="w-full cursor-pointer"
              type="submit"
            >
              Finalizar cadastro
            </Button>

            <p className="text-muted-foreground px-6 text-center text-sm leading-relaxed">
              Ao continuar, você concorda com nossos{" "}
              <a href="" className="underline underline-offset-4">
                termos de serviço
              </a>{" "}
              e{" "}
              <a href="" className="underline underline-offset-4">
                políticas de privacidade.
              </a>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
