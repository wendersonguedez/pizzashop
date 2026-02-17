import { Link } from "react-router";

interface ErrorProps {
  error: unknown;
  resetErrorBoundary: () => void;
}

export function ErrorPage({ error, resetErrorBoundary }: ErrorProps) {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2">
      <h1 className="text-4xl font-bold">Ops, algo deu errado!</h1>
      <p className="text-accent-foreground">
        Um erro inesperado aconteceu na aplicação:
      </p>
      <pre className="bg-muted rounded-md p-4 text-sm text-red-500">
        {(error instanceof Error ? error.message : null) ||
          JSON.stringify(error)}
      </pre>
      <div className="flex gap-2">
        <Link
          to="/dashboard"
          onClick={resetErrorBoundary}
          className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-10 items-center rounded-md px-4 py-2"
        >
          Voltar ao Dashboard
        </Link>
      </div>
    </div>
  );
}
