"use client";

import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";
import { DeleteSweep } from "@mui/icons-material";
import AddItemForm from "./components/AddItemForm";
import ItemList from "./components/ItemList";
import CategoryFilter from "./components/CategoryFilter";
import QRGenerator from "./components/QRGenerator";
import { useShoppingList } from "@/hooks/useShoppingList";
import theme from "@/lib/theme";
import { useEffect } from "react";
import { SharedListData, SharedListItem } from "@/types";

export default function Home() {
  const {
    list,
    filteredItems,
    filter,
    setFilter,
    selectedCategory,
    setSelectedCategory,
    addItem,
    removeItem,
    toggleItemStatus,
    buyAgain,
    clearCompleted,
  } = useShoppingList();

  const completedCount = list.items.filter(
    (item) => item.status === "done"
  ).length;
  const todoCount = list.items.filter((item) => item.status === "todo").length;

  // Add this useEffect after your other hooks
  useEffect(() => {
    const handleImport = () => {
      try {
        const sharedListData = localStorage.getItem("shared-list-import");
        const urlParams = new URLSearchParams(window.location.search);
        const shouldImport = urlParams.get("import") === "true";

        if (sharedListData && shouldImport) {
          // Use setTimeout to avoid synchronous state updates
          setTimeout(() => {
            try {
              const importedList: SharedListData = JSON.parse(sharedListData);

              // Add imported items to current list with proper typing
              importedList.items.forEach((item: SharedListItem) => {
                addItem(item.text, item.category);
              });

              // Clear the imported data
              localStorage.removeItem("shared-list-import");

              // Remove the import parameter from URL without refresh
              const newUrl = window.location.pathname;
              window.history.replaceState({}, "", newUrl);
            } catch (error) {
              console.error("Error importing shared list:", error);
            }
          }, 0);
        }
      } catch (error) {
        console.error("Error in import handler:", error);
      }
    };

    handleImport();
  }, [addItem]); // Only depend on addItem

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
            🛒 Shopping List
          </Typography>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Your smart shopping companion
          </Typography>

          {/* Stats */}
          <Paper elevation={1} sx={{ p: 2, mt: 2, display: "inline-block" }}>
            <Box sx={{ display: "flex", gap: 3 }}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h6" color="primary">
                  {todoCount}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  To Buy
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h6" color="success.main">
                  {completedCount}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Done
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h6">{list.items.length}</Typography>
                <Typography variant="caption" color="textSecondary">
                  Total
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Box>

        {/* Action Buttons */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "space-between",
            mb: 2,
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "center" },
          }}
        >
          <QRGenerator list={list} />

          {completedCount > 0 && (
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<DeleteSweep />}
              onClick={clearCompleted}
              sx={{
                minWidth: { xs: "100%", sm: "auto" },
                width: { xs: "100%", sm: "auto" },
              }}
            >
              Clear Completed ({completedCount})
            </Button>
          )}
        </Box>

        <AddItemForm onAddItem={addItem} />

        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          filter={filter}
          onFilterChange={setFilter}
        />

        <ItemList
          items={filteredItems}
          onToggleStatus={toggleItemStatus}
          onRemoveItem={removeItem}
          onBuyAgain={buyAgain}
        />

        <Box
          sx={{
            textAlign: "center",
            mt: 4,
            pt: 2,
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          <Typography variant="caption" color="textSecondary">
            Data stored locally in your browser • Share via QR code
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
