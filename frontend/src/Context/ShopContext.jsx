import { useEffect, useState } from "react";
import { ShopContext } from "./ShopContext";
import { fetchProducts } from "../services/products";
const CART_STORAGE_KEY = "sky-mart-cart";

const getSavedCart = () => {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    return savedCart ? JSON.parse(savedCart) : {};
  } catch {
    return {};
  }
};

const ShopContextProvider = (props) => {
  const [cartItems, setCartItems] = useState(getSavedCart);
  const [all_product, setAllProducts] = useState([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    fetchProducts()
      .then((products) => {
        if (isCurrent) setAllProducts(products);
      })
      .catch((error) => {
        if (isCurrent) setProductsError(error.message);
      })
      .finally(() => {
        if (isCurrent) setIsLoadingProducts(false);
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
  };
  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) - 1),
    }));
  };
  const clearCart = () => setCartItems({});
  const addProductToCatalogue = (product) => {
    setAllProducts((current) => [...current, product].sort((first, second) => first.id - second.id));
  };
  const updateProductInCatalogue = (product) => {
    setAllProducts((current) => current.map((item) => item.id === product.id ? product : item));
  };
  const removeProductFromCatalogue = (productId) => {
    setAllProducts((current) => current.filter((item) => item.id !== productId));
    setCartItems((current) => {
      const { [productId]: _removedProduct, ...remainingItems } = current;
      return remainingItems;
    });
  };

  const getTotalCartAmount = () =>
    Object.entries(cartItems).reduce((totalAmount, [itemId, quantity]) => {
      const itemInfo = all_product.find((product) => product.id === Number(itemId));
      return itemInfo ? totalAmount + itemInfo.new_price * quantity : totalAmount;
    }, 0);

  const getTotalCartItems = () => {
    let totalItems = 0;
    for(const item in cartItems){
      if(cartItems[item] > 0){
        totalItems += cartItems[item];
      }
    }
    return totalItems;
  }

  const contextValue = {
    getTotalCartItems,
    getTotalCartAmount,
    all_product,
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    addProductToCatalogue,
    updateProductInCatalogue,
    removeProductFromCatalogue,
    isLoadingProducts,
    productsError,
  };
  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
