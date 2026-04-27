import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { IconButton, Paper, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";

interface MonthSwitcherProps {
    monthStart: Date;
    onPrevMonth: () => void;
    onNextMonth: () => void;
    disableNext?: boolean;
}

export default function MonthSwitcher({
    monthStart,
    onPrevMonth,
    onNextMonth,
    disableNext = false,
}: MonthSwitcherProps) {
    const monthLabel = monthStart.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });

    return (
        <Paper variant="outlined" sx={{ px: 1, py: 0.5, borderRadius: 999 }}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
                <IconButton
                    onClick={onPrevMonth}
                    size="small"
                    aria-label="Previous month"
                    sx={(theme) => ({
                        color: "primary.main",
                        transition: "background-color 120ms ease, transform 120ms ease",
                        "&:hover": {
                            backgroundColor: alpha(theme.palette.primary.main, 0.08),
                            transform: "translateX(-1px)",
                        },
                    })}
                >
                    <ChevronLeftRoundedIcon fontSize="small" />
                </IconButton>
                <Typography variant="body2" fontWeight={600} sx={{ minWidth: 120, textAlign: "center" }}>
                    {monthLabel}
                </Typography>
                <IconButton
                    onClick={onNextMonth}
                    size="small"
                    disabled={disableNext}
                    aria-label="Next month"
                    sx={(theme) => ({
                        color: "primary.main",
                        transition: "background-color 120ms ease, transform 120ms ease",
                        "&:hover": {
                            backgroundColor: alpha(theme.palette.primary.main, 0.08),
                            transform: "translateX(1px)",
                        },
                        "&.Mui-disabled": {
                            color: alpha(theme.palette.text.primary, 0.26),
                        },
                    })}
                >
                    <ChevronRightRoundedIcon fontSize="small" />
                </IconButton>
            </Stack>
        </Paper>
    );
}
