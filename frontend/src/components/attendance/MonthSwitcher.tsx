import { IconButton, Paper, Stack, Typography } from "@mui/material";

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
                <IconButton onClick={onPrevMonth} size="small" aria-label="Previous month">
                    <Typography component="span" fontSize={16} lineHeight={1}>
                        {"<"}
                    </Typography>
                </IconButton>
                <Typography variant="body2" fontWeight={600} sx={{ minWidth: 120, textAlign: "center" }}>
                    {monthLabel}
                </Typography>
                <IconButton onClick={onNextMonth} size="small" disabled={disableNext} aria-label="Next month">
                    <Typography component="span" fontSize={16} lineHeight={1}>
                        {">"}
                    </Typography>
                </IconButton>
            </Stack>
        </Paper>
    );
}
