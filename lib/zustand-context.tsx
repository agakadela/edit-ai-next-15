import { StoreApi } from "zustand";
import React from "react";

export const createZustandContext = <
  TInitial,
  TStore extends StoreApi<TInitial>
>(
  getStore: (initial: TInitial) => TStore
) => {
  const Context = React.createContext<TStore | null>(null);

  const Provider = ({
    children,
    initialValue,
  }: {
    children: React.ReactNode;
    initialValue: TInitial;
  }) => {
    const [store] = React.useState(getStore(initialValue));

    return <Context.Provider value={store}>{children}</Context.Provider>;
  };
  return {
    useContext: () => React.useContext(Context),
    Provider,
    Context,
  };
};
