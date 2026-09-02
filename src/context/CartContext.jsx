import {
  createContext,
  useEffect,
  useState
} from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {

  const [cart, setCart] = useState(() => {

    const carrinhoSalvo =
      localStorage.getItem("cart");

    return carrinhoSalvo
      ? JSON.parse(carrinhoSalvo)
      : [];
  });

  useEffect(() => {

    localStorage.setItem(
      "cart",
      JSON.stringify(cart)
    );

  }, [cart]);

  function adicionarProduto(produto) {

    const existe = cart.find(
      (item) => item._id === produto._id
    );

    if (existe) {

      setCart(
        cart.map((item) =>
          item._id === produto._id
            ? {
                ...item,
                quantidade:
                  item.quantidade + 1
              }
            : item
        )
      );

    } else {

      setCart([
        ...cart,
        {
          ...produto,
          quantidade: 1
        }
      ]);

    }
  }

  function removerProduto(id) {

    setCart(
      cart
        .map((item) =>
          item._id === id
            ? {
                ...item,
                quantidade:
                  item.quantidade - 1
              }
            : item
        )
        .filter(
          (item) =>
            item.quantidade > 0
        )
    );
  }

  function excluirProduto(id) {

    setCart(
      cart.filter(
        (item) => item._id !== id
      )
    );
  }

  function limparCarrinho() {
    setCart([]);
  }

  const total = cart.reduce(
    (acc, item) =>
      acc +
      Number(item.preco) *
        item.quantidade,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        adicionarProduto,
        removerProduto,
        excluirProduto,
        limparCarrinho,
        total
      }}
    >
      {children}
    </CartContext.Provider>
  );
}