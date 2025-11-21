import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import {
  TrendingUp,
  Plus,
  X,
  ShoppingCart,
  BarChart3,
  Wallet,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Tag,
} from "lucide-react";
import { getUserInvestments } from "@/lib/investmentManager";
import {
  getAllListings,
  getUserListings,
  getUserMarketPortfolio,
  createListing,
  completePurchase,
  cancelListing,
  calculateDiscount,
  getUserPurchaseHistory,
  getUserSalesHistory,
  getMarketStats,
  SecondaryMarketListing,
} from "@/lib/mercadoSecundarioManager";
import { getSTOs, type STO } from "@/lib/stoManager";
import { getSmartContracts, type SmartContract } from "@/lib/smartContractManager";

type ViewMode = "marketplace" | "portfolio" | "history" | "create-listing";

export default function MercadoSecundario() {
  const userEmail = localStorage.getItem("userEmail") || "";
  const userFirstName = localStorage.getItem("userFirstName") || "";
  const [viewMode, setViewMode] = useState<ViewMode>("marketplace");

  const [allListings, setAllListings] = useState<SecondaryMarketListing[]>([]);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [sales, setSales] = useState<any[]>([]);
  const [stos, setSTOs] = useState<STO[]>([]);
  const [smartContracts, setSmartContracts] = useState<SmartContract[]>([]);

  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [sellingPrice, setSellingPrice] = useState("");
  const [tokenQuantity, setTokenQuantity] = useState("");
  const [selectedListing, setSelectedListing] = useState<SecondaryMarketListing | null>(null);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [marketStats, setMarketStats] = useState({
    totalListings: 0,
    totalTransactions: 0,
    totalVolumeTraded: 0,
    averageDiscount: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    // Load STOs and SmartContracts
    const loadedSTOs = getSTOs();
    const loadedContracts = getSmartContracts();
    setSTOs(loadedSTOs);
    setSmartContracts(loadedContracts);

    // Load marketplace listings
    const listings = getAllListings();
    setAllListings(listings);

    // Load user's portfolio
    const userInvestments = getUserInvestments(userEmail);
    const marketPortfolio = getUserMarketPortfolio(userEmail, userInvestments);
    setPortfolio(marketPortfolio);

    // Load user's transaction history
    const userPurchases = getUserPurchaseHistory(userEmail);
    setPurchases(userPurchases);

    const userSales = getUserSalesHistory(userEmail);
    setSales(userSales);

    // Load market statistics
    const stats = getMarketStats();
    setMarketStats(stats);
  };

  const getListingDetails = (listing: SecondaryMarketListing) => {
    const sto = stos.find((s) => s.id === listing.investmentId || s.nombreActivo === listing.assetName);
    const contract = sto ? smartContracts.find((c) => c.id === sto.activoDigitalId) : null;
    const totalTokens = sto ? parseInt(sto.numerosTokensVenta) : 0;
    const listedTokens = listing.quantity || 1;
    const tokenPercentage = totalTokens > 0 ? ((listedTokens / totalTokens) * 100).toFixed(2) : "0";

    return {
      category: contract?.categoria || "Sin Categoría",
      totalTokens,
      listedTokens,
      tokenPercentage,
    };
  };

  const handleCreateListing = () => {
    setError("");
    setSuccess("");

    if (!selectedAsset) {
      setError("Por favor selecciona un activo");
      return;
    }

    if (!sellingPrice || parseFloat(sellingPrice) <= 0) {
      setError("Por favor ingresa un precio válido");
      return;
    }

    if (!tokenQuantity || parseInt(tokenQuantity) <= 0) {
      setError("Por favor ingresa una cantidad de tokens válida");
      return;
    }

    const price = parseFloat(sellingPrice);
    if (price > selectedAsset.montoInvertido) {
      setError("El precio de venta no puede ser mayor al precio de compra");
      return;
    }

    const quantity = parseInt(tokenQuantity);

    try {
      createListing(
        userEmail,
        userFirstName,
        selectedAsset,
        price,
        quantity
      );

      setSuccess("¡Activo listado para venta exitosamente!");
      setTimeout(() => {
        setShowCreateModal(false);
        setSelectedAsset(null);
        setSellingPrice("");
        setTokenQuantity("");
        setSuccess("");
        loadData();
      }, 1500);
    } catch (err) {
      setError("Error al crear la lista. Por favor intenta de nuevo.");
    }
  };

  const handleBuyAsset = () => {
    setError("");
    setSuccess("");

    if (!selectedListing) {
      setError("Error: No se seleccionó correctamente la lista");
      return;
    }

    try {
      completePurchase(
        selectedListing.id,
        userEmail,
        userFirstName,
        selectedListing.sellingPrice
      );

      setSuccess("¡Activo comprado exitosamente!");
      setTimeout(() => {
        setShowBuyModal(false);
        setSelectedListing(null);
        setSuccess("");
        loadData();
      }, 1500);
    } catch (err) {
      setError("Error al comprar el activo. Por favor intenta de nuevo.");
    }
  };

  const handleCancelListing = (listingId: string) => {
    if (confirm("¿Estás seguro de que deseas cancelar esta venta?")) {
      cancelListing(listingId);
      setSuccess("Venta cancelada exitosamente");
      setTimeout(() => {
        setSuccess("");
        loadData();
      }, 1500);
    }
  };

  const getAvailableAssets = () => {
    return portfolio.filter((asset) => asset.availableForSale > 0);
  };

  return (
    <Layout>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-blue-50" style={{ paddingTop: "80px" }}>
        <div className="max-w-7xl mx-auto" style={{ paddingTop: "40px" }}>
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-foreground mb-4">Mercado Secundario de Activos</h1>
            <p className="text-xl text-foreground/70">
              Compra y vende activos digitales en el mercado secundario
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-lg border border-border/40 p-4 mb-8 flex gap-4 flex-wrap">
            <button
              onClick={() => setViewMode("marketplace")}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                viewMode === "marketplace"
                  ? "bg-primary text-white"
                  : "text-foreground/70 hover:bg-gray-100"
              }`}
            >
              <ShoppingCart className="w-4 h-4 inline mr-2" />
              Marketplace
            </button>
            <button
              onClick={() => setViewMode("portfolio")}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                viewMode === "portfolio"
                  ? "bg-primary text-white"
                  : "text-foreground/70 hover:bg-gray-100"
              }`}
            >
              <Wallet className="w-4 h-4 inline mr-2" />
              Mi Portafolio
            </button>
            <button
              onClick={() => setViewMode("history")}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                viewMode === "history"
                  ? "bg-primary text-white"
                  : "text-foreground/70 hover:bg-gray-100"
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Historial
            </button>
          </div>

          {/* Alert Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
              <p className="text-green-700">{success}</p>
            </div>
          )}

          {/* Marketplace View */}
          {viewMode === "marketplace" && (
            <div className="space-y-8">
              {/* Market Statistics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg border border-border/40 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold text-foreground/70">Activos Listados</h3>
                    <TrendingUp className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{marketStats.totalListings}</p>
                  <p className="text-xs text-foreground/60 mt-0.5">disponibles</p>
                </div>

                <div className="bg-white rounded-lg border border-border/40 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold text-foreground/70">Transacciones</h3>
                    <ShoppingCart className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{marketStats.totalTransactions}</p>
                  <p className="text-xs text-foreground/60 mt-0.5">completadas</p>
                </div>

                <div className="bg-white rounded-lg border border-border/40 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold text-foreground/70">Volumen Negociado</h3>
                    <DollarSign className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    ${marketStats.totalVolumeTraded.toLocaleString()}
                  </p>
                  <p className="text-xs text-foreground/60 mt-0.5">USD</p>
                </div>

                <div className="bg-white rounded-lg border border-border/40 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-semibold text-foreground/70">Desc. Promedio</h3>
                    <BarChart3 className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{marketStats.averageDiscount}%</p>
                  <p className="text-xs text-foreground/60 mt-0.5">promedio</p>
                </div>
              </div>

              {/* Listings */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Activos Disponibles para Compra</h2>
                {allListings.length === 0 ? (
                  <div className="bg-white rounded-lg border border-border/40 p-8 text-center">
                    <TrendingUp className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
                    <p className="text-foreground/70 mb-2">No hay activos disponibles en el mercado</p>
                    <p className="text-sm text-foreground/60">
                      Sé el primero en vender activos de tu portafolio
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {allListings.map((listing) => {
                      const details = getListingDetails(listing);
                      const categoryColors: Record<string, { bg: string; text: string }> = {
                        "Capital de trabajo": { bg: "bg-blue-100", text: "text-blue-700" },
                        "Bonos Corporativos": { bg: "bg-green-100", text: "text-green-700" },
                        "Deuda Privada": { bg: "bg-purple-100", text: "text-purple-700" },
                        "Sin Categoría": { bg: "bg-gray-100", text: "text-gray-700" },
                      };
                      const colors = categoryColors[details.category] || categoryColors["Sin Categoría"];

                      return (
                        <div key={listing.id} className="bg-white rounded-lg border border-border/40 p-4 hover:shadow-lg transition-all overflow-hidden">
                          {/* Header with Category */}
                          <div className="mb-3">
                            <h3 className="text-base font-bold text-foreground mb-0.5">{listing.assetName}</h3>
                            <p className="text-xs text-foreground/60 mb-2">{listing.assetType}</p>

                            {/* Category Badge */}
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text}`}>
                              <Tag className="w-3 h-3" />
                              {details.category}
                            </span>
                          </div>

                          {/* Token Information */}
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 mb-3 border border-blue-100">
                            <div className="space-y-1.5">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-semibold text-foreground">Tokens</span>
                                <span className="text-base font-bold text-primary">{details.listedTokens}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-foreground/60">% Total</span>
                                <span className="text-xs font-semibold text-primary">{details.tokenPercentage}%</span>
                              </div>
                              <div className="w-full bg-blue-200 rounded-full h-1.5 mt-2">
                                <div
                                  className="bg-primary rounded-full h-1.5 transition-all"
                                  style={{ width: `${Math.min(parseFloat(details.tokenPercentage), 100)}%` }}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Price Information */}
                          <div className="bg-gray-50 rounded-lg p-3 mb-3 space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-foreground/60">Original:</span>
                              <span className="font-semibold text-foreground">${listing.originalPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-foreground/60">Actual:</span>
                              <span className="font-bold text-primary">${listing.sellingPrice.toLocaleString()}</span>
                            </div>
                            <div className="border-t border-gray-200 pt-2 flex justify-between text-xs">
                              <span className="text-foreground/60">Desc.:</span>
                              <span className={`font-semibold ${calculateDiscount(listing.originalPrice, listing.sellingPrice) > 0 ? "text-green-600" : "text-orange-600"}`}>
                                {calculateDiscount(listing.originalPrice, listing.sellingPrice)}%
                              </span>
                            </div>
                          </div>

                          {/* Asset Details */}
                          <div className="grid grid-cols-2 gap-2 mb-3">
                            <div className="bg-gray-50 rounded p-2 border border-gray-200">
                              <p className="text-xs text-foreground/60">Plazo</p>
                              <p className="text-xs font-semibold text-foreground">{listing.assetDetails.plazo}</p>
                            </div>
                            <div className="bg-gray-50 rounded p-2 border border-gray-200">
                              <p className="text-xs text-foreground/60">Rendimiento</p>
                              <p className="text-xs font-semibold text-foreground">{listing.assetDetails.tasaEsperada}%</p>
                            </div>
                          </div>

                          <p className="text-xs text-foreground/50 mb-3 line-clamp-1">
                            {listing.sellerName} • {new Date(listing.listedDate).toLocaleDateString("es-ES")}
                          </p>

                          <button
                            onClick={() => {
                              setSelectedListing(listing);
                              setShowBuyModal(true);
                            }}
                            className="w-full px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold text-sm flex items-center justify-center gap-2"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            Comprar
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Portfolio View */}
          {viewMode === "portfolio" && (
            <div className="space-y-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Mi Portafolio</h2>
                {getAvailableAssets().length > 0 && (
                  <button
                    onClick={() => {
                      setShowCreateModal(true);
                      setSelectedAsset(null);
                      setSellingPrice("");
                      setTokenQuantity("");
                      setError("");
                    }}
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Vender Activo
                  </button>
                )}
              </div>

              {portfolio.length === 0 ? (
                <div className="bg-white rounded-lg border border-border/40 p-8 text-center">
                  <Wallet className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
                  <p className="text-foreground/70 mb-2">No tienes activos en tu portafolio</p>
                  <p className="text-sm text-foreground/60">
                    Invierte en oportunidades para poder venderlas en el mercado secundario
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {portfolio.map((asset) => (
                    <div key={asset.id} className="bg-white rounded-lg border border-border/40 p-4 hover:shadow-lg transition-all">
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-3">
                        <div>
                          <h3 className="text-sm font-bold text-foreground mb-0.5">{asset.stoNombre}</h3>
                          <p className="text-xs text-foreground/60 mb-1">{asset.tipo}</p>
                          <div className="inline-block px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                            {asset.estado}
                          </div>
                        </div>

                        <div>
                          <p className="text-xs text-foreground/60 mb-0.5">Invertido</p>
                          <p className="text-sm font-bold text-foreground">${asset.montoInvertido.toLocaleString()}</p>
                        </div>

                        <div>
                          <p className="text-xs text-foreground/60 mb-0.5">Disponible</p>
                          <p className="text-sm font-bold text-primary">${asset.availableForSale.toLocaleString()}</p>
                        </div>

                        <div className="hidden sm:block">
                          <p className="text-xs text-foreground/60 mb-0.5">Listado</p>
                          <p className="text-sm font-bold text-orange-600">${asset.listedForSale.toLocaleString()}</p>
                        </div>
                      </div>

                      {asset.availableForSale > 0 && (
                        <button
                          onClick={() => {
                            setSelectedAsset(asset);
                            setShowCreateModal(true);
                            setSellingPrice("");
                            setTokenQuantity("");
                            setError("");
                          }}
                          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold text-sm flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Vender este Activo
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Active Listings */}
              {getUserListings(userEmail).length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-bold text-foreground mb-4">Mis Ventas Activas</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getUserListings(userEmail).map((listing) => {
                      const details = getListingDetails(listing);
                      const categoryColors: Record<string, { bg: string; text: string }> = {
                        "Capital de trabajo": { bg: "bg-blue-100", text: "text-blue-700" },
                        "Bonos Corporativos": { bg: "bg-green-100", text: "text-green-700" },
                        "Deuda Privada": { bg: "bg-purple-100", text: "text-purple-700" },
                        "Sin Categoría": { bg: "bg-gray-100", text: "text-gray-700" },
                      };
                      const colors = categoryColors[details.category] || categoryColors["Sin Categoría"];

                      return (
                        <div key={listing.id} className="bg-white rounded-lg border border-primary/20 p-4 hover:shadow-lg transition-all">
                          <h4 className="text-base font-bold text-foreground mb-0.5">{listing.assetName}</h4>
                          <p className="text-xs text-foreground/60 mb-2">{listing.assetType}</p>

                          {/* Category Badge */}
                          <div className="mb-3">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text}`}>
                              <Tag className="w-3 h-3" />
                              {details.category}
                            </span>
                          </div>

                          {/* Token Information */}
                          <div className="bg-gradient-to-r from-primary/5 to-blue-50 rounded-lg p-3 mb-3 border border-primary/20">
                            <div className="flex justify-between items-center mb-1.5">
                              <span className="text-xs font-semibold text-foreground">Tokens</span>
                              <span className="text-base font-bold text-primary">{details.listedTokens}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-foreground/60">% Total</span>
                              <span className="text-xs font-semibold text-primary">{details.tokenPercentage}%</span>
                            </div>
                          </div>

                          {/* Price Information */}
                          <div className="bg-blue-50 rounded-lg p-3 mb-3 space-y-1.5">
                            <div className="flex justify-between text-xs">
                              <span className="text-foreground/60">Precio:</span>
                              <span className="font-bold text-primary">${listing.sellingPrice.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-foreground/60">Desc.:</span>
                              <span className="font-semibold text-green-600">
                                {calculateDiscount(listing.originalPrice, listing.sellingPrice)}%
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleCancelListing(listing.id)}
                            className="w-full px-3 py-2 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-semibold text-sm flex items-center justify-center gap-2"
                          >
                            <X className="w-3.5 h-3.5" />
                            Cancelar
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* History View */}
          {viewMode === "history" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Mis Compras</h2>
                {purchases.length === 0 ? (
                  <div className="bg-white rounded-lg border border-border/40 p-8 text-center">
                    <ShoppingCart className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
                    <p className="text-foreground/70">No has comprado activos aún</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {purchases.map((purchase) => (
                      <div key={purchase.id} className="bg-white rounded-lg border border-border/40 p-4">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                          <div>
                            <p className="text-sm text-foreground/60 mb-1">Activo</p>
                            <p className="font-semibold text-foreground">Listado #{purchase.listingId.substring(0, 8)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-foreground/60 mb-1">Precio Pagado</p>
                            <p className="font-bold text-primary">${purchase.purchasePrice.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-foreground/60 mb-1">Vendedor</p>
                            <p className="font-semibold text-foreground">{purchase.sellerEmail}</p>
                          </div>
                          <div>
                            <p className="text-sm text-foreground/60 mb-1">Fecha</p>
                            <p className="font-semibold text-foreground">
                              {new Date(purchase.purchaseDate).toLocaleDateString("es-ES")}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Mis Ventas</h2>
                {sales.length === 0 ? (
                  <div className="bg-white rounded-lg border border-border/40 p-8 text-center">
                    <TrendingUp className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
                    <p className="text-foreground/70">No has vendido activos aún</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sales.map((sale) => (
                      <div key={sale.id} className="bg-white rounded-lg border border-border/40 p-4">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                          <div>
                            <p className="text-sm text-foreground/60 mb-1">Activo</p>
                            <p className="font-semibold text-foreground">Listado #{sale.listingId.substring(0, 8)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-foreground/60 mb-1">Precio de Venta</p>
                            <p className="font-bold text-primary">${sale.purchasePrice.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-sm text-foreground/60 mb-1">Comprador</p>
                            <p className="font-semibold text-foreground">{sale.buyerEmail}</p>
                          </div>
                          <div>
                            <p className="text-sm text-foreground/60 mb-1">Fecha</p>
                            <p className="font-semibold text-foreground">
                              {new Date(sale.purchaseDate).toLocaleDateString("es-ES")}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Listing Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Vender Activo</h2>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setError("");
                  setSellingPrice("");
                  setTokenQuantity("");
                  setSelectedAsset(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Asset Selection */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Selecciona el Activo a Vender
                </label>
                <select
                  value={selectedAsset?.id || ""}
                  onChange={(e) => {
                    const asset = getAvailableAssets().find((a) => a.id === e.target.value);
                    setSelectedAsset(asset || null);
                  }}
                  className="w-full px-4 py-3 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">Elige un activo disponible</option>
                  {getAvailableAssets().map((asset) => (
                    <option key={asset.id} value={asset.id}>
                      {asset.stoNombre} - ${asset.availableForSale.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selected Asset Details */}
              {selectedAsset && (
                <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Precio Original:</span>
                    <span className="font-semibold text-foreground">${selectedAsset.montoInvertido.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Disponible para Vender:</span>
                    <span className="font-semibold text-primary">${selectedAsset.availableForSale.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Plazo:</span>
                    <span className="font-semibold text-foreground">{selectedAsset.plazo}</span>
                  </div>
                </div>
              )}

              {/* Price Input */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Precio de Venta
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/60">$</span>
                  <input
                    type="number"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    placeholder="Ingresa el precio deseado"
                    className="w-full pl-8 pr-4 py-3 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                    max={selectedAsset?.montoInvertido}
                    step="0.01"
                  />
                </div>
                {selectedAsset && sellingPrice && (
                  <p className="mt-2 text-sm text-foreground/60">
                    Descuento: {calculateDiscount(selectedAsset.montoInvertido, parseFloat(sellingPrice))}% respecto al precio original
                  </p>
                )}
              </div>

              {/* Token Quantity Input */}
              <div>
                <label className="block text-sm font-semibold text-foreground mb-3">
                  Cantidad de Tokens a Vender
                </label>
                <input
                  type="number"
                  value={tokenQuantity}
                  onChange={(e) => setTokenQuantity(e.target.value)}
                  placeholder="Ingresa la cantidad de tokens"
                  className="w-full px-4 py-3 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                  min="1"
                  step="1"
                />
                {selectedAsset && tokenQuantity && (
                  <p className="mt-2 text-sm text-foreground/60">
                    Precio total: ${(parseFloat(sellingPrice || "0") * parseInt(tokenQuantity)).toLocaleString()}
                  </p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setError("");
                    setSellingPrice("");
                    setTokenQuantity("");
                    setSelectedAsset(null);
                  }}
                  className="flex-1 px-6 py-3 border border-border/40 text-foreground rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateListing}
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Listar para Venta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Buy Asset Modal */}
      {showBuyModal && selectedListing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Confirmar Compra</h2>
              <button
                onClick={() => {
                  setShowBuyModal(false);
                  setError("");
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Asset Details */}
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">{selectedListing.assetName}</h3>
                <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Tipo:</span>
                    <span className="font-semibold text-foreground">{selectedListing.assetType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Vendedor:</span>
                    <span className="font-semibold text-foreground">{selectedListing.sellerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Plazo:</span>
                    <span className="font-semibold text-foreground">{selectedListing.assetDetails.plazo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Rentabilidad Esperada:</span>
                    <span className="font-semibold text-foreground">{selectedListing.assetDetails.tasaEsperada}%</span>
                  </div>
                </div>
              </div>

              {/* Price Summary */}
              <div className="border-t border-border/40 pt-6">
                <div className="space-y-3 bg-blue-50 rounded-lg p-4">
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Precio Original:</span>
                    <span className="text-foreground">${selectedListing.originalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Descuento:</span>
                    <span className="text-green-600 font-semibold">-{calculateDiscount(selectedListing.originalPrice, selectedListing.sellingPrice)}%</span>
                  </div>
                  <div className="border-t border-blue-200 pt-3 flex justify-between">
                    <span className="font-semibold text-foreground">Precio de Compra:</span>
                    <span className="text-2xl font-bold text-primary">${selectedListing.sellingPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => {
                    setShowBuyModal(false);
                    setError("");
                  }}
                  className="flex-1 px-6 py-3 border border-border/40 text-foreground rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleBuyAsset}
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Comprar Ahora
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
