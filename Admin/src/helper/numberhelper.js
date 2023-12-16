export function formatNumberWithDecimal(number) {
    // Convert the number to a string
    const numString = String(number);
    // Split the string into groups of three digits
    const groups = numString.split(/(?=(?:\d{3})+(?!\d))/);

    // Join the groups with a decimal point
    const formattedNumber = groups.join('.');

    return formattedNumber;
  }