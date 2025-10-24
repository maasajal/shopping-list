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

        {/* Rest of your component remains the same */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <QRGenerator list={list} />

          {completedCount > 0 && (
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<DeleteSweep />}
              onClick={clearCompleted}
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
