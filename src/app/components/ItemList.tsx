"use client";

import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Box,
  Paper,
  Typography,
} from "@mui/material";
import {
  CheckCircle,
  RadioButtonUnchecked,
  Delete,
  Replay,
} from "@mui/icons-material";
import { ShoppingItem } from "@/types";
import { DEFAULT_CATEGORIES } from "@/lib/constants";

interface ItemListProps {
  items: ShoppingItem[];
  onToggleStatus: (id: string) => void;
  onRemoveItem: (id: string) => void;
  onBuyAgain: (id: string) => void;
}

export default function ItemList({
  items,
  onToggleStatus,
  onRemoveItem,
  onBuyAgain,
}: ItemListProps) {
  if (items.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 4, textAlign: "center" }}>
        <Typography color="textSecondary">
          No items found. Add some items to your shopping list!
        </Typography>
      </Paper>
    );
  }

  const getCategoryInfo = (categoryId: string) => {
    return (
      DEFAULT_CATEGORIES.find((cat) => cat.id === categoryId) ||
      DEFAULT_CATEGORIES[0]
    );
  };

  return (
    <Paper elevation={2}>
      <List>
        {items.map((item) => {
          const category = getCategoryInfo(item.category);

          return (
            <ListItem
              key={item.id}
              divider
              sx={{
                opacity: item.status === "done" ? 0.7 : 1,
                backgroundColor:
                  item.status === "done" ? "action.hover" : "background.paper",
              }}
            >
              <IconButton
                onClick={() => onToggleStatus(item.id)}
                color={item.status === "done" ? "success" : "default"}
                sx={{ mr: 2 }}
              >
                {item.status === "done" ? (
                  <CheckCircle />
                ) : (
                  <RadioButtonUnchecked />
                )}
              </IconButton>

              <ListItemText
                primary={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 0.5,
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        textDecoration:
                          item.status === "done" ? "line-through" : "none",
                      }}
                    >
                      {item.text}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mt: 0.5,
                    }}
                  >
                    <Chip
                      label={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          <span>{category.icon}</span>
                          <span>{category.name}</span>
                        </Box>
                      }
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: category.color,
                        color: category.color,
                        fontSize: "0.7rem",
                        height: 24,
                      }}
                    />
                    <Typography variant="caption" color="textSecondary">
                      {item.createdAt instanceof Date
                        ? item.createdAt.toLocaleDateString()
                        : new Date(item.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                }
              />

              <ListItemSecondaryAction>
                <Box sx={{ display: "flex", gap: 1 }}>
                  {item.status === "done" ? (
                    <IconButton
                      onClick={() => onBuyAgain(item.id)}
                      color="primary"
                      size="small"
                      title="Buy Again"
                    >
                      <Replay />
                    </IconButton>
                  ) : null}

                  <IconButton
                    onClick={() => onRemoveItem(item.id)}
                    color="error"
                    size="small"
                    title="Remove"
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
    </Paper>
  );
}
