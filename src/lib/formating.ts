function formatToRupiah(value: string | number): string {
    // Convert the value to a number
    const numberValue = typeof value === "string" ? parseFloat(value) : value;
  
    // Check if the value is valid
    if (isNaN(numberValue)) {
      throw new Error("Invalid input: The value must be a number or a numeric string.");
    }
  
    // Format the number to Rupiah currency
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(numberValue);
  }

  export {formatToRupiah}