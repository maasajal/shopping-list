"use client";

import {
  Box,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { DEFAULT_CATEGORIES } from "@/lib/constants";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  filter: "all" | "todo" | "done";
  onFilterChange: (filter: "all" | "todo" | "done") => void;
}

export default function CategoryFilter({
  selectedCategory,
  onCategoryChange,
  filter,
  onFilterChange,
}: CategoryFilterProps) {
  return (
    <Box sx={{ mb: 3 }}>
      {/* Status Filter */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>
          Filter by Status:
        </Typography>
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={(_, value) => value && onFilterChange(value)}
          size="small"
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="todo">To Do</ToggleButton>
          <ToggleButton value="done">Done</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Category Filter */}
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          Filter by Category:
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          <Chip
            label="All Categories"
            variant={selectedCategory === "all" ? "filled" : "outlined"}
            onClick={() => onCategoryChange("all")}
            color="primary"
          />
          {DEFAULT_CATEGORIES.map((category) => (
            <Chip
              key={category.id}
              label={
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </Box>
              }
              variant={selectedCategory === category.id ? "filled" : "outlined"}
              onClick={() => onCategoryChange(category.id)}
              sx={{
                backgroundColor:
                  selectedCategory === category.id
                    ? category.color
                    : "transparent",
                borderColor: category.color,
                color:
                  selectedCategory === category.id ? "white" : category.color,
                "&:hover": {
                  backgroundColor: category.color,
                  color: "white",
                },
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
