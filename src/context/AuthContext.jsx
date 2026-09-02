import {
  createContext,
  useState
} from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {

  const [usuario, setUsuario] = useState(() => {
    const usuarioSalvo =
      localStorage.getItem("usuario");

    return usuarioSalvo
      ? JSON.parse(usuarioSalvo)
      : null;
  });

  const [token, setToken] = useState(
    () => localStorage.getItem("token")
  );

  function login(usuarioRecebido, tokenRecebido) {

    localStorage.setItem(
      "usuario",
      JSON.stringify(usuarioRecebido)
    );

    localStorage.setItem(
      "token",
      tokenRecebido
    );

    setUsuario(usuarioRecebido);
    setToken(tokenRecebido);
  }

  function logout() {

    localStorage.removeItem("usuario");
    localStorage.removeItem("token");

    setUsuario(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}