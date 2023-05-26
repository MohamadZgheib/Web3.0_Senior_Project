export const shortenAddress = (address) => {
    if (!address) return ''; // Return an empty string or handle the null case as per your requirements
    return `${address.slice(0, 5)} ... ${address.slice(address.length - 4)}`;
  };
  