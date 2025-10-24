"use client";

import { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Paper,
  useTheme,
  useMediaQuery,
  Menu,
} from "@mui/material";
import { Add, Category, KeyboardArrowDown } from "@mui/icons-material";
import { DEFAULT_CATEGORIES } from "@/lib/constants";

interface AddItemFormProps {
  onAddItem: (text: string, category: string) => void;
}

export default function AddItemForm({ onAddItem }: AddItemFormProps) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("groceries");
  const [mobileCategoryAnchor, setMobileCategoryAnchor] =
    useState<null | HTMLElement>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAddItem(text, category);
      setText("");
    }
  };

  const handleMobileCategoryOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileCategoryAnchor(event.currentTarget);
  };

  const handleMobileCategoryClose = () => {
    setMobileCategoryAnchor(null);
  };

  const handleCategorySelect = (categoryId: string) => {
    setCategory(categoryId);
    handleMobileCategoryClose();
  };

  const getSelectedCategory = () => {
    return (
      DEFAULT_CATEGORIES.find((cat) => cat.id === category) ||
      DEFAULT_CATEGORIES[0]
    );
  };

  const selectedCategory = getSelectedCategory();

  return (
    <Paper elevation={2} sx={{ p: { xs: 1.5, sm: 2 }, mb: 3 }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          gap: { xs: 1, sm: 2 },
          alignItems: "center",
          flexDirection: { xs: "column", sm: "row" },
        }}
      >
        {/* Text Input - Full width on mobile, flexible on larger screens */}
        <TextField
          fullWidth
          variant="outlined"
          placeholder="What do you need to buy?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          size="small"
          sx={{
            minWidth: { xs: "100%", sm: "200px" },
            "& .MuiOutlinedInput-root": {
              fontSize: { xs: "14px", sm: "16px" },
            },
          }}
        />

        {/* Category Selector - Different layouts for mobile vs desktop */}
        {isMobile ? (
          // Mobile: Compact category selector with menu
          <>
            <Button
              variant="outlined"
              startIcon={<Category />}
              endIcon={<KeyboardArrowDown />}
              onClick={handleMobileCategoryOpen}
              fullWidth
              size="small"
              sx={{
                justifyContent: "space-between",
                fontSize: "14px",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <span>{selectedCategory.icon}</span>
                <span>{selectedCategory.name}</span>
              </Box>
            </Button>

            <Menu
              anchorEl={mobileCategoryAnchor}
              open={Boolean(mobileCategoryAnchor)}
              onClose={handleMobileCategoryClose}
              PaperProps={{
                sx: {
                  maxHeight: 300,
                  width: 200,
                },
              }}
            >
              {DEFAULT_CATEGORIES.map((cat) => (
                <MenuItem
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.id)}
                  selected={category === cat.id}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </Box>
                </MenuItem>
              ))}
            </Menu>
          </>
        ) : isTablet ? (
          // Tablet: Compact select
          <FormControl sx={{ minWidth: 140 }} size="small">
            <InputLabel sx={{ fontSize: "14px" }}>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
              sx={{ fontSize: "14px" }}
            >
              {DEFAULT_CATEGORIES.map((cat) => (
                <MenuItem key={cat.id} value={cat.id} sx={{ fontSize: "14px" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          // Desktop: Full select
          <FormControl sx={{ minWidth: 120 }} size="small">
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
            >
              {DEFAULT_CATEGORIES.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Add Button - Adapts to screen size */}
        <Button
          type="submit"
          variant="contained"
          startIcon={<Add />}
          disabled={!text.trim()}
          sx={{
            minWidth: { xs: "100%", sm: "auto" },
            width: { xs: "100%", sm: "auto" },
            fontSize: { xs: "14px", sm: "16px" },
            py: { xs: 1, sm: 0.5 },
          }}
        >
          Add
        </Button>
      </Box>

      {/* Quick Category Chips for Mobile - Optional enhancement */}
      {isMobile && (
        <Box sx={{ mt: 1, display: "flex", gap: 0.5, flexWrap: "wrap" }}>
          {DEFAULT_CATEGORIES.slice(0, 4).map((cat) => (
            <Button
              key={cat.id}
              variant={category === cat.id ? "contained" : "outlined"}
              size="small"
              onClick={() => setCategory(cat.id)}
              sx={{
                minWidth: "auto",
                px: 1,
                py: 0.5,
                fontSize: "12px",
                backgroundColor:
                  category === cat.id ? cat.color : "transparent",
                borderColor: cat.color,
                color: category === cat.id ? "white" : cat.color,
                "&:hover": {
                  backgroundColor: cat.color,
                  color: "white",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <span style={{ fontSize: "12px" }}>{cat.icon}</span>
                <span>{cat.name}</span>
              </Box>
            </Button>
          ))}
        </Box>
      )}
    </Paper>
  );
}
