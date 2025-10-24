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
  Snackbar,
  Alert,
} from "@mui/material";
import { Close, Share, ContentCopy } from "@mui/icons-material";
import { QRCodeSVG } from "qrcode.react";
import { ShoppingList } from "@/types";
import { generateShortShareableLink } from "@/lib/shortLinkUtils";

interface QRGeneratorProps {
  list: ShoppingList;
}

export default function QRGenerator({ list }: QRGeneratorProps) {
  const [open, setOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Generate short shareable link
  const shareableLink = generateShortShareableLink(list);

  const handleShare = async () => {
    if (navigator.share && shareableLink) {
      try {
        await navigator.share({
          title: `${list.name} - Shopping List`,
          text: `Check out my shopping list: ${list.items
            .map((item) => item.text)
            .join(", ")}`,
          url: shareableLink,
        });
      } catch (error) {
        console.log("Error sharing:", error);
        setOpen(true);
      }
    } else {
      setOpen(true);
    }
  };

  const copyToClipboard = async () => {
    if (!shareableLink) return;

    try {
      await navigator.clipboard.writeText(shareableLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    } catch (error) {
      console.error("Failed to copy:", error);
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = shareableLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    }
  };

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
        disabled={!shareableLink}
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
              gap: 3,
            }}
          >
            <Typography
              variant="body2"
              color="textSecondary"
              textAlign="center"
            >
              Scan this QR code or copy the link to share your shopping list
              with others
            </Typography>

            {/* QR Code */}
            {shareableLink && (
              <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1 }}>
                <QRCodeSVG value={shareableLink} size={200} />
              </Box>
            )}

            {/* Shareable Link */}
            <Box sx={{ width: "100%" }}>
              <Typography variant="subtitle2" gutterBottom>
                Shareable Link:
              </Typography>
              <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                <Typography
                  variant="body2"
                  sx={{
                    flex: 1,
                    p: 1,
                    bgcolor: "grey.50",
                    borderRadius: 1,
                    wordBreak: "break-all",
                    fontSize: "0.8rem",
                  }}
                >
                  {shareableLink || "Generating link..."}
                </Typography>
                <IconButton
                  onClick={copyToClipboard}
                  color="primary"
                  size="small"
                  disabled={!shareableLink}
                >
                  <ContentCopy />
                </IconButton>
              </Box>
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

      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={() => setCopySuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setCopySuccess(false)} severity="success">
          Link copied to clipboard!
        </Alert>
      </Snackbar>
    </>
  );
}
