import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

import ClienteLayout
  from "../components/ClienteLayout";

import RotaProtegida
  from "../components/RotaProtegida";

// CLIENTE

import Home
  from "../pages/Home";

import Carrinho
  from "../pages/Carrinho";

import Checkout
  from "../pages/Checkout";

import Enderecos
  from "../pages/Enderecos";

import Login
  from "../pages/Login";

import Perfil
  from "../pages/Perfil";

import Pedidos
  from "../pages/Pedidos";

import Cadastro
  from "../pages/Cadastro";

// ADMIN

import AdminLogin
  from "../pages/admin/AdminLogin";

import Dashboard
  from "../pages/admin/Dashboard";

import AdminLayout
  from "../layouts/AdminLayout";

import PedidosAdmin
  from "../pages/admin/PedidosAdmin";

import ProdutosAdmin
  from "../pages/admin/ProdutosAdmin";

import CategoriasAdmin
  from "../pages/admin/CategoriasAdmin";

import ConfiguracoesAdmin
  from "../pages/admin/ConfiguracoesAdmin";

function AppRoutes() {

  return (

    <BrowserRouter>

      <Routes>

        {/* ====================================== */}
        {/* HOME */}
        {/* ====================================== */}

        <Route
          path="/"
          element={
            <ClienteLayout>

              <Home />

            </ClienteLayout>
          }
        />

        {/* ====================================== */}
        {/* CARRINHO - PÚBLICO */}
        {/* ====================================== */}

        <Route
          path="/carrinho"
          element={
            <ClienteLayout>

              <Carrinho />

            </ClienteLayout>
          }
        />

        {/* ====================================== */}
        {/* CHECKOUT - PROTEGIDO */}
        {/* ====================================== */}

        <Route
          path="/checkout"
          element={
            <RotaProtegida>

              <ClienteLayout>

                <Checkout />

              </ClienteLayout>

            </RotaProtegida>
          }
        />

        {/* ====================================== */}
        {/* ENDEREÇOS - PROTEGIDO */}
        {/* ====================================== */}

        <Route
          path="/enderecos"
          element={
            <RotaProtegida>

              <ClienteLayout>

                <Enderecos />

              </ClienteLayout>

            </RotaProtegida>
          }
        />

        {/* ====================================== */}
        {/* LOGIN */}
        {/* ====================================== */}

        <Route
          path="/login"
          element={
            <Login />
          }
        />

        {/* ====================================== */}
        {/* PERFIL - PROTEGIDO */}
        {/* ====================================== */}

        <Route
          path="/perfil"
          element={
            <RotaProtegida>

              <ClienteLayout>

                <Perfil />

              </ClienteLayout>

            </RotaProtegida>
          }
        />

        {/* ====================================== */}
        {/* PEDIDOS - PROTEGIDO */}
        {/* ====================================== */}

        <Route
          path="/pedidos"
          element={
            <RotaProtegida>

              <ClienteLayout>

                <Pedidos />

              </ClienteLayout>

            </RotaProtegida>
          }
        />

        {/* ====================================== */}
        {/* CADASTRO */}
        {/* ====================================== */}

        <Route
          path="/cadastro"
          element={
            <Cadastro />
          }
        />

        {/* ====================================== */}
        {/* ADMIN LOGIN */}
        {/* ====================================== */}

        <Route
          path="/admin"
          element={
            <AdminLogin />
          }
        />

        {/* ====================================== */}
        {/* ADMIN DASHBOARD */}
        {/* ====================================== */}

        <Route
          path="/admin/dashboard"
          element={
            <AdminLayout>

              <Dashboard />

            </AdminLayout>
          }
        />

        {/* ====================================== */}
        {/* ADMIN PEDIDOS */}
        {/* ====================================== */}

        <Route
          path="/admin/pedidos"
          element={
            <AdminLayout>

              <PedidosAdmin />

            </AdminLayout>
          }
        />

        {/* ====================================== */}
        {/* ADMIN PRODUTOS */}
        {/* ====================================== */}

        <Route
          path="/admin/produtos"
          element={
            <AdminLayout>

              <ProdutosAdmin />

            </AdminLayout>
          }
        />

        {/* ====================================== */}
        {/* ADMIN CATEGORIAS */}
        {/* ====================================== */}

        <Route
          path="/admin/categorias"
          element={
            <AdminLayout>

              <CategoriasAdmin />

            </AdminLayout>
          }
        />

        {/* ====================================== */}
        {/* ADMIN CONFIGURAÇÕES */}
        {/* ====================================== */}

        <Route
          path="/admin/configuracoes"
          element={
            <AdminLayout>

              <ConfiguracoesAdmin />

            </AdminLayout>
          }
        />

      </Routes>

    </BrowserRouter>

  );

}

export default AppRoutes;