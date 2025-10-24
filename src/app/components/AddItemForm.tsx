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
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { DEFAULT_CATEGORIES } from "@/lib/constants";

interface AddItemFormProps {
  onAddItem: (text: string, category: string) => void;
}

export default function AddItemForm({ onAddItem }: AddItemFormProps) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("groceries");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAddItem(text, category);
      setText("");
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", gap: 2, alignItems: "center" }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="What do you need to buy?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          size="small"
        />

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

        <Button
          type="submit"
          variant="contained"
          startIcon={<Add />}
          disabled={!text.trim()}
          sx={{ minWidth: "auto" }}
        >
          Add
        </Button>
      </Box>
    </Paper>
  );
}
