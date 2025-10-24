export interface ShoppingItem {
  id: string;
  text: string;
  status: "todo" | "done";
  category: string;
  createdAt: Date;
}

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingItem[];
  categories: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type Category = {
  id: string;
  name: string;
  color: string;
  icon: string;
};
