export interface ShoppingItem {
  id: string;
  text: string;
  status: "todo" | "done";
  category: string;
  createdAt: Date | string; // Allow both Date and string
}

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingItem[];
  categories: string[];
  createdAt: Date | string; // Allow both Date and string
  updatedAt: Date | string; // Allow both Date and string
}

export type Category = {
  id: string;
  name: string;
  color: string;
  icon: string;
};

export interface SharedListItem {
  text: string;
  status: "todo" | "done";
  category: string;
}

export interface SharedListData {
  name: string;
  items: SharedListItem[];
}
