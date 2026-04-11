type PersonNameInput = {
    firstName: string;
    lastName: string;
};

function capitalizeSegment(value: string): string {
    if (!value) {
        return value;
    }

    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

export function formatNamePart(value: string): string {
    const normalizedValue = value
        .trim()
        .replace(/\s*-\s*/g, "-")
        .replace(/\s+/g, " ");

    return normalizedValue
        .split("-")
        .map((segment) => capitalizeSegment(segment))
        .join("-");
}

export function formatPersonName({ firstName, lastName }: PersonNameInput): string {
    return `${formatNamePart(firstName)} ${formatNamePart(lastName)}`;
}
