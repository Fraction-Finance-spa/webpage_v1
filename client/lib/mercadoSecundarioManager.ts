import { UserInvestment } from "./investmentManager";

export interface SecondaryMarketListing {
  id: string;
  investmentId: string;
  sellerEmail: string;
  sellerName: string;
  assetName: string;
  assetType: string;
  originalPrice: number;
  sellingPrice: number;
  quantity: number;
  listedDate: string;
  assetDetails: {
    stoNombre: string;
    plazo: string;
    tasaEsperada: number;
  };
  status: "Disponible" | "Vendido" | "Cancelado";
}

export interface SecondaryMarketPurchase {
  id: string;
  listingId: string;
  buyerEmail: string;
  buyerName: string;
  sellerEmail: string;
  purchaseDate: string;
  purchasePrice: number;
  quantity: number;
  status: "Completada" | "Pendiente" | "Cancelada";
}

export interface UserMarketPortfolio extends UserInvestment {
  availableForSale: number;
  listedForSale: number;
}

const LISTINGS_STORAGE_KEY = "secondaryMarketListings";
const PURCHASES_STORAGE_KEY = "secondaryMarketPurchases";

// Get all active market listings
export function getAllListings(): SecondaryMarketListing[] {
  try {
    const stored = localStorage.getItem(LISTINGS_STORAGE_KEY);
    if (stored) {
      const listings = JSON.parse(stored) as SecondaryMarketListing[];
      return listings.filter((l) => l.status === "Disponible");
    }
  } catch (error) {
    console.error("Error reading listings:", error);
  }
  return [];
}

// Get user's active listings
export function getUserListings(userEmail: string): SecondaryMarketListing[] {
  const allListings = getAllListings();
  return allListings.filter((l) => l.sellerEmail === userEmail && l.status === "Disponible");
}

// Create a new listing
export function createListing(
  userEmail: string,
  userName: string,
  investment: UserInvestment,
  sellingPrice: number,
  quantity: number = 1
): SecondaryMarketListing {
  const listings = getAllListingsIncludingUnavailable();

  const newListing: SecondaryMarketListing = {
    id: Date.now().toString(),
    investmentId: investment.id,
    sellerEmail: userEmail,
    sellerName: userName,
    assetName: investment.stoNombre,
    assetType: investment.tipo,
    originalPrice: investment.montoInvertido,
    sellingPrice: sellingPrice,
    quantity: quantity,
    listedDate: new Date().toISOString(),
    assetDetails: {
      stoNombre: investment.stoNombre,
      plazo: investment.plazo,
      tasaEsperada: investment.tasaEsperada,
    },
    status: "Disponible",
  };

  listings.push(newListing);
  saveListings(listings);
  return newListing;
}

// Cancel a listing
export function cancelListing(listingId: string): boolean {
  const listings = getAllListingsIncludingUnavailable();
  const index = listings.findIndex((l) => l.id === listingId);

  if (index !== -1) {
    listings[index].status = "Cancelado";
    saveListings(listings);
    return true;
  }
  return false;
}

// Complete a purchase
export function completePurchase(
  listingId: string,
  buyerEmail: string,
  buyerName: string,
  purchasePrice: number,
  quantity: number = 1
): SecondaryMarketPurchase | null {
  const listings = getAllListingsIncludingUnavailable();
  const listingIndex = listings.findIndex((l) => l.id === listingId);

  if (listingIndex === -1) {
    return null;
  }

  const listing = listings[listingIndex];

  // Create purchase record
  const purchase: SecondaryMarketPurchase = {
    id: Date.now().toString(),
    listingId: listingId,
    buyerEmail: buyerEmail,
    buyerName: buyerName,
    sellerEmail: listing.sellerEmail,
    purchaseDate: new Date().toISOString(),
    purchasePrice: purchasePrice,
    quantity: quantity,
    status: "Completada",
  };

  // Mark listing as sold
  listings[listingIndex].status = "Vendido";
  saveListings(listings);

  // Save purchase
  const purchases = getPurchasesHistory();
  purchases.push(purchase);
  savePurchases(purchases);

  return purchase;
}

// Get user's purchase history
export function getUserPurchaseHistory(userEmail: string): SecondaryMarketPurchase[] {
  const purchases = getPurchasesHistory();
  return purchases.filter((p) => p.buyerEmail === userEmail && p.status === "Completada");
}

// Get user's sales history
export function getUserSalesHistory(userEmail: string): SecondaryMarketPurchase[] {
  const purchases = getPurchasesHistory();
  return purchases.filter((p) => p.sellerEmail === userEmail && p.status === "Completada");
}

// Get user's market portfolio with availability info
export function getUserMarketPortfolio(
  userEmail: string,
  userInvestments: UserInvestment[]
): UserMarketPortfolio[] {
  const userListings = getUserListings(userEmail);

  return userInvestments.map((inv) => {
    const listedQuantity = userListings
      .filter((l) => l.investmentId === inv.id)
      .reduce((sum, l) => sum + l.quantity, 0);

    return {
      ...inv,
      availableForSale: Math.max(0, inv.montoInvertido - listedQuantity),
      listedForSale: listedQuantity,
    };
  });
}

// Get price discount percentage
export function calculateDiscount(originalPrice: number, sellingPrice: number): number {
  if (originalPrice === 0) return 0;
  return Math.round(((originalPrice - sellingPrice) / originalPrice) * 100);
}

// Get market statistics
export function getMarketStats() {
  const listings = getAllListings();
  const purchases = getPurchasesHistory().filter((p) => p.status === "Completada");

  const totalListings = listings.length;
  const totalTransactions = purchases.length;
  const totalVolumeTraded = purchases.reduce((sum, p) => sum + p.purchasePrice * p.quantity, 0);
  const averageDiscount =
    listings.length > 0
      ? Math.round(
          listings.reduce((sum, l) => sum + calculateDiscount(l.originalPrice, l.sellingPrice), 0) /
            listings.length
        )
      : 0;

  return {
    totalListings,
    totalTransactions,
    totalVolumeTraded,
    averageDiscount,
  };
}

// Get total value of pending assets for sale
export function getTotalPendingAssetsValue(): number {
  const listings = getAllListings();
  return listings.reduce((sum, listing) => sum + listing.sellingPrice, 0);
}

// Get count of pending unsold listings
export function getPendingListingsCount(): number {
  const listings = getAllListings();
  return listings.length;
}

// Private helper functions
function getAllListingsIncludingUnavailable(): SecondaryMarketListing[] {
  try {
    const stored = localStorage.getItem(LISTINGS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error reading listings:", error);
  }
  return [];
}

function getPurchasesHistory(): SecondaryMarketPurchase[] {
  try {
    const stored = localStorage.getItem(PURCHASES_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error reading purchases:", error);
  }
  return [];
}

function saveListings(listings: SecondaryMarketListing[]): void {
  try {
    localStorage.setItem(LISTINGS_STORAGE_KEY, JSON.stringify(listings));
  } catch (error) {
    console.error("Error saving listings:", error);
  }
}

function savePurchases(purchases: SecondaryMarketPurchase[]): void {
  try {
    localStorage.setItem(PURCHASES_STORAGE_KEY, JSON.stringify(purchases));
  } catch (error) {
    console.error("Error saving purchases:", error);
  }
}
