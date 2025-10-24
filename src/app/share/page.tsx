"use client";

import { useState, useLayoutEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
  Alert,
} from "@mui/material";
import { Add, ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { parseShareableLink } from "@/lib/shareUtils";
import { DEFAULT_CATEGORIES } from "@/lib/constants";

interface SharedListData {
  name: string;
  items: Array<{
    text: string;
    status: string;
    category: string;
  }>;
}

export default function SharePage() {
  const router = useRouter();
  const [sharedList, setSharedList] = useState<SharedListData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Use useLayoutEffect for synchronous operations that need to happen before paint
  useLayoutEffect(() => {
    let mounted = true;

    const loadSharedList = async () => {
      try {
        const url = window.location.href;
        const listData = parseShareableLink(url);

        if (mounted) {
          if (listData) {
            setSharedList(listData);
          } else {
            setError("Invalid or expired sharing link");
          }
        }
      } catch (err) {
        console.log(err);
        if (mounted) {
          setError("Error loading shared list");
        }
      }
    };

    loadSharedList();

    return () => {
      mounted = false;
    };
  }, []);

  const getCategoryInfo = (categoryId: string) => {
    return (
      DEFAULT_CATEGORIES.find((cat) => cat.id === categoryId) ||
      DEFAULT_CATEGORIES[0]
    );
  };

  const addToMyList = () => {
    if (sharedList) {
      // Store the shared list in localStorage to import in the main app
      localStorage.setItem("shared-list-import", JSON.stringify(sharedList));
      router.push("/?import=true");
    }
  };

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button startIcon={<ArrowBack />} onClick={() => router.push("/")}>
          Back to Home
        </Button>
      </Container>
    );
  }

  if (!sharedList) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: "center" }}>
        <Typography>Loading shared list...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => router.push("/")}
          sx={{ mb: 2 }}
        >
          Back to Home
        </Button>

        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          🛒 Shared Shopping List
        </Typography>
        <Typography variant="h6" color="primary" gutterBottom>
          {sharedList.name}
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {sharedList.items.length} items shared with you
        </Typography>
      </Box>

      {/* Import Button */}
      <Box sx={{ textAlign: "center", mb: 3 }}>
        <Button
          variant="contained"
          size="large"
          startIcon={<Add />}
          onClick={addToMyList}
        >
          Add to My Shopping List
        </Button>
      </Box>

      {/* Shared Items List */}
      <Paper elevation={2}>
        <List>
          {sharedList.items.map((item, index) => {
            const category = getCategoryInfo(item.category);

            return (
              <ListItem key={index} divider>
                <ListItemText
                  primary={item.text}
                  secondary={
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
                        mt: 0.5,
                      }}
                    />
                  }
                />
              </ListItem>
            );
          })}
        </List>
      </Paper>
    </Container>
  );
}
