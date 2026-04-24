export function calculateAge(birthDate: string | null): number | null {
    if (!birthDate) {
        return null;
    }

    const parsedDate = new Date(birthDate);

    if (Number.isNaN(parsedDate.getTime())) {
        return null;
    }

    const today = new Date();
    let age = today.getFullYear() - parsedDate.getFullYear();
    const monthDifference = today.getMonth() - parsedDate.getMonth();

    if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < parsedDate.getDate())
    ) {
        age -= 1;
    }

    return age;
}
