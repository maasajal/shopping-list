"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { Close, Share } from "@mui/icons-material";
import { QRCodeSVG } from "qrcode.react";
import { ShoppingList } from "@/types";

interface QRGeneratorProps {
  list: ShoppingList;
}

export default function QRGenerator({ list }: QRGeneratorProps) {
  const [open, setOpen] = useState(false);

  // Safe date handling for QR data
  const qrData = JSON.stringify({
    type: "shopping-list",
    version: "1.0",
    data: {
      name: list.name,
      items: list.items.map((item) => ({
        ...item,
        // Ensure dates are properly serialized
        createdAt:
          item.createdAt instanceof Date
            ? item.createdAt.toISOString()
            : item.createdAt,
      })),
      // Ensure dates are properly serialized
      createdAt:
        list.createdAt instanceof Date
          ? list.createdAt.toISOString()
          : list.createdAt,
      updatedAt:
        list.updatedAt instanceof Date
          ? list.updatedAt.toISOString()
          : list.updatedAt,
    },
  });

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: list.name,
          text: "Check out my shopping list!",
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      setOpen(true);
    }
  };

  // Safe date display
  const getSafeDateDisplay = (date: Date | string) => {
    if (date instanceof Date) {
      return date.toLocaleDateString();
    }
    try {
      return new Date(date).toLocaleDateString();
    } catch {
      return "Unknown date";
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<Share />}
        onClick={handleShare}
        sx={{ mb: 2 }}
      >
        Share List
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6">Share Shopping List</Typography>
            <IconButton onClick={() => setOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Typography
              variant="body2"
              color="textSecondary"
              textAlign="center"
            >
              Scan this QR code to share your shopping list with others
            </Typography>

            <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1 }}>
              <QRCodeSVG value={qrData} size={256} />
            </Box>

            <Typography
              variant="caption"
              color="textSecondary"
              textAlign="center"
            >
              {list.items.length} items • Last updated:{" "}
              {getSafeDateDisplay(list.updatedAt)}
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
