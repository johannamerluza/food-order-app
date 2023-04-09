import { useState, useReducer } from 'react';
import CartContext from './cart-context';

const defaultCartState = {
  items: [],
  totalAmount: 0,
};
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      const updatedTotalAmount =
        state.totalAmount + action.payload.amount * action.payload.price;
      const itemIndex = state.items.findIndex((item) => {
        return item.id === action.payload.id;
      });
      const existingCartItem = state.items[itemIndex];
      let updatedItems;
      if (existingCartItem) {
        const updatedItem = {
          ...existingCartItem,
          amount: existingCartItem.amount + action.payload.amount,
        };
        updatedItems = [...state.items];
        updatedItems[itemIndex] = updatedItem;
      } else {
        updatedItems = state.items.concat(action.payload);
      }
      return { items: updatedItems, totalAmount: updatedTotalAmount };
    case 'REMOVE_ITEM':
      const existingCartItemIndex = state.items.findIndex(
        (item) => item.id === action.payload,
      );
      const existingItem = state.items[existingCartItemIndex];
      const delUpdatedTotalAmount = state.totalAmount - existingItem.price;
      let delUpdatedItems;
      if (existingItem.amount === 1) {
        delUpdatedItems = state.items.filter(
          (item) => item.id !== action.payload,
        );
      } else {
        const delUpdatedItem = {
          ...existingItem,
          amount: existingItem.amount - 1,
        };
        delUpdatedItems = [...state.items];
        delUpdatedItems[existingCartItemIndex] = delUpdatedItem;
      }
      return { items: delUpdatedItems, totalAmount: delUpdatedTotalAmount };
    default:
      return defaultCartState;
  }
};

const CartProvider = (props) => {
  const [cartState, dispatchCartAction] = useReducer(
    cartReducer,
    defaultCartState,
  );

  const addItemToCartHandler = (item) => {
    dispatchCartAction({ type: 'ADD_ITEM', payload: item });
  };
  const removeItemFromCartHandler = (id) => {
    dispatchCartAction({ type: 'REMOVE_ITEM', payload: id });
  };

  const cartContext = {
    items: cartState.items,
    totalAmount: cartState.totalAmount,
    addItems: addItemToCartHandler,
    removeItems: removeItemFromCartHandler,
  };

  return (
    <CartContext.Provider value={cartContext}>
      {props.children}
    </CartContext.Provider>
  );
};

export default CartProvider;
