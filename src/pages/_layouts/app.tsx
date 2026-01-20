import { Outlet } from "react-router";

export function AppLayout() {
  return (
    <div>
      <h1>Cabeçalho</h1>

      <div>
        <Outlet />
      </div>

      <div>
        <h1>Rodapé</h1>
      </div>
    </div>
  );
}
