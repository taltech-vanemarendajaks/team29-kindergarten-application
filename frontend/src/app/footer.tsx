import { Box, Container, Typography } from "@mui/material";

type FooterProps = {
  text: string;
};

export default function Footer({ text }: FooterProps) {
  return (
    <Box component="footer" sx={{ borderTop: 1, borderColor: "divider", py: 2 }}>
      <Container>
        <Typography color="text.secondary" variant="body2">
          {text}
        </Typography>
      </Container>
    </Box>
  );
}
