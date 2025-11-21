import { useState } from "react";
import Layout from "@/components/Layout";
import { ChevronRight, ChevronLeft, CheckCircle, Code, Zap, DollarSign, Wallet, FileText, Server } from "lucide-react";

type AssetClass = "equity" | "rwa" | null;
type BlockchainNetwork = "ethereum-mainnet" | "sepolia-testnet" | "polygon-mainnet" | "polygon-amoy" | "bnb-mainnet" | "base-mainnet" | null;

interface WizardState {
  step: number;
  assetClass: AssetClass;
  blockchain: BlockchainNetwork;
  adminWallet: string;
  tokenName: string;
  tokenSymbol: string;
  maxSupply: string;
  adminAddress: string;
  contractCode: string;
  deploymentAddress: string;
  isDeploying: boolean;
}

const ASSET_CLASSES = [
  {
    id: "equity",
    name: "Equity / Fund (Regulated)",
    description: "Ideal for investment funds. Creates an ERC20 token with whitelisting and mint/burn controls for KYC/AML compliance.",
    icon: DollarSign,
  },
  {
    id: "rwa",
    name: "Simple RWA Token",
    description: "A basic ERC20 token for Real-World Assets. Perfect for items without complex compliance needs. Mints the total supply to the admin.",
    icon: Zap,
  },
];

const BLOCKCHAIN_NETWORKS = [
  {
    id: "ethereum-mainnet",
    name: "Ethereum Mainnet",
    speed: "Slow",
    cost: "High",
    security: "High",
    mainnet: true,
  },
  {
    id: "sepolia-testnet",
    name: "Sepolia Testnet",
    speed: "Slow",
    cost: "Low",
    security: "Testnet",
    mainnet: false,
  },
  {
    id: "polygon-mainnet",
    name: "Polygon Mainnet",
    speed: "High",
    cost: "Low",
    security: "High",
    mainnet: true,
  },
  {
    id: "polygon-amoy",
    name: "Polygon Amoy Testnet",
    speed: "High",
    cost: "Low",
    security: "Testnet",
    mainnet: false,
  },
  {
    id: "bnb-mainnet",
    name: "BNB Smart Chain",
    speed: "High",
    cost: "Low",
    security: "Medium",
    mainnet: true,
  },
  {
    id: "base-mainnet",
    name: "Base",
    speed: "Very High",
    cost: "Very Low",
    security: "Medium",
    mainnet: true,
  },
];

export default function SmartContractWizard() {
  const [state, setState] = useState<WizardState>({
    step: 1,
    assetClass: null,
    blockchain: null,
    adminWallet: "",
    tokenName: "",
    tokenSymbol: "",
    maxSupply: "",
    adminAddress: "",
    contractCode: "",
    deploymentAddress: "",
    isDeploying: false,
  });

  const handleNext = () => {
    if (state.step < 7) {
      if (state.step === 1 && !state.assetClass) {
        alert("Por favor selecciona una clase de activo");
        return;
      }
      if (state.step === 2 && !state.blockchain) {
        alert("Por favor selecciona una red blockchain");
        return;
      }
      if (state.step === 3 && !state.adminWallet) {
        alert("Por favor conecta tu billetera");
        return;
      }
      if (state.step === 4) {
        if (!state.tokenName || !state.tokenSymbol || !state.maxSupply || !state.adminAddress) {
          alert("Por favor completa todos los campos requeridos");
          return;
        }
        // Generate contract code for review
        generateContractCode();
      }
      setState((prev) => ({ ...prev, step: prev.step + 1 }));
    }
  };

  const handlePrevious = () => {
    if (state.step > 1) {
      setState((prev) => ({ ...prev, step: prev.step - 1 }));
    }
  };

  const generateContractCode = () => {
    const code = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
${state.assetClass === "equity" ? 'import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Pausable.sol";\n' : ""}
${state.assetClass === "equity" ? 'import "@openzeppelin/contracts/security/Pausable.sol";\n' : ""}

/**
 * @title ${state.tokenName}
 * @dev ${state.assetClass === "equity" ? "ERC20 Token with whitelist and pause features for KYC/AML compliance" : "Simple ERC20 Token for Real-World Assets"}
 */
contract ${state.tokenSymbol} is ERC20, ERC20Burnable, Ownable${state.assetClass === "equity" ? ", ERC20Pausable" : ""} {
    uint256 public constant MAX_SUPPLY = ${state.maxSupply} * 10 ** 18;
    
    ${state.assetClass === "equity" ? "mapping(address => bool) public whitelist;\n    " : ""}
    constructor() ERC20("${state.tokenName}", "${state.tokenSymbol}") {
        _mint(msg.sender, MAX_SUPPLY);
    }
    
    ${state.assetClass === "equity" ? `
    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function addToWhitelist(address account) public onlyOwner {
        whitelist[account] = true;
    }

    function removeFromWhitelist(address account) public onlyOwner {
        whitelist[account] = false;
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        override(ERC20${state.assetClass === "equity" ? ", ERC20Pausable" : ""})
        whenNotPaused
    {
        super._beforeTokenTransfer(from, to, amount);
    }
    ` : ""}
    
    function burn(uint256 amount) public override {
        super.burn(amount);
    }
}`;
    setState((prev) => ({ ...prev, contractCode: code }));
  };

  const handleDeploy = async () => {
    setState((prev) => ({ ...prev, isDeploying: true }));
    // Simulate deployment
    setTimeout(() => {
      const mockAddress = `0x${Math.random().toString(16).substr(2, 40)}`;
      setState((prev) => ({
        ...prev,
        deploymentAddress: mockAddress,
        isDeploying: false,
      }));
    }, 2000);
  };

  return (
    <Layout>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-blue-50" style={{ paddingTop: "80px" }}>
        <div className="max-w-4xl mx-auto" style={{ paddingTop: "40px" }}>
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-foreground mb-4">Digital Asset Tokenization Wizard</h1>
            <p className="text-xl text-foreground/70">
              Create a new on-chain asset from a secure template.
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="bg-white rounded-lg border border-border/40 p-8 mb-8">
            <div className="flex items-center justify-between mb-8">
              {[1, 2, 3, 4, 5, 6, 7].map((step) => (
                <div key={step} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      step < state.step
                        ? "bg-green-500 text-white"
                        : step === state.step
                          ? "bg-primary text-white border-2 border-primary"
                          : "bg-gray-200 text-foreground/60"
                    }`}
                  >
                    {step < state.step ? <CheckCircle className="w-5 h-5" /> : step}
                  </div>
                  <p className="text-xs mt-2 text-center text-foreground/60 max-w-20">Paso {step}</p>
                </div>
              ))}
            </div>

            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-blue-600 transition-all duration-300"
                style={{ width: `${((state.step - 1) / 6) * 100}%` }}
              />
            </div>
          </div>

          {/* Step Content */}
          <div className="bg-white rounded-lg border border-border/40 p-8 mb-8">
            {/* Step 1: Asset Class Selection */}
            {state.step === 1 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Paso 1 de 7: Seleccionar Clase de Activo</h2>
                  <p className="text-foreground/70">
                    Esto determina la plantilla del contrato inteligente y características como la lista blanca y los permisos.
                  </p>
                </div>

                <div className="space-y-4">
                  {ASSET_CLASSES.map((assetClass) => {
                    const Icon = assetClass.icon;
                    return (
                      <div
                        key={assetClass.id}
                        onClick={() => setState((prev) => ({ ...prev, assetClass: assetClass.id as AssetClass }))}
                        className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                          state.assetClass === assetClass.id
                            ? "border-primary bg-primary/5"
                            : "border-border/40 hover:border-primary/50 bg-white"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <Icon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                          <div className="flex-1">
                            <h3 className="font-bold text-foreground mb-1">{assetClass.name}</h3>
                            <p className="text-sm text-foreground/70">{assetClass.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: Blockchain Network Selection */}
            {state.step === 2 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Paso 2 de 7: Seleccionar Red Blockchain</h2>
                  <p className="text-foreground/70">
                    Elige la red donde se emitirá tu activo. Esto no se puede cambiar más tarde.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {BLOCKCHAIN_NETWORKS.map((network) => (
                    <div
                      key={network.id}
                      onClick={() => setState((prev) => ({ ...prev, blockchain: network.id as BlockchainNetwork }))}
                      className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                        state.blockchain === network.id
                          ? "border-primary bg-primary/5"
                          : "border-border/40 hover:border-primary/50 bg-white"
                      }`}
                    >
                      <h3 className="font-bold text-foreground mb-3">{network.name}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-foreground/60">Velocidad:</span>
                          <span className="font-semibold text-foreground">{network.speed}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/60">Costo:</span>
                          <span className="font-semibold text-foreground">{network.cost}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-foreground/60">Seguridad:</span>
                          <span className="font-semibold text-foreground">{network.security}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Admin Wallet Connection */}
            {state.step === 3 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Paso 3 de 7: Conectar Billetera de Administrador</h2>
                  <p className="text-foreground/70">
                    Conecta la billetera que poseerá y gestionará el contrato inteligente.
                  </p>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => setState((prev) => ({ ...prev, adminWallet: "0x742d35Cc6634C0532925a3b844Bc394e0e4f0d" }))}
                    className="w-full p-6 border-2 border-primary rounded-lg hover:bg-primary/10 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <Wallet className="w-6 h-6 text-primary" />
                      <div className="text-left">
                        <p className="font-bold text-foreground">Conectar con MetaMask</p>
                        <p className="text-sm text-foreground/60">
                          {state.adminWallet ? `Conectado: ${state.adminWallet.substring(0, 10)}...` : "Haz clic para conectar"}
                        </p>
                      </div>
                    </div>
                  </button>

                  {state.adminWallet && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-700 font-semibold">✓ Billetera conectada exitosamente</p>
                      <p className="text-xs text-green-600 mt-1">{state.adminWallet}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Token Details */}
            {state.step === 4 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Paso 4 de 7: Detalles del Token</h2>
                  <p className="text-foreground/70">
                    Define las propiedades en cadena de tu token.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Nombre del Token</label>
                    <input
                      type="text"
                      value={state.tokenName}
                      onChange={(e) => setState((prev) => ({ ...prev, tokenName: e.target.value }))}
                      placeholder="Ej: Fraction Finance Token"
                      className="w-full px-4 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Símbolo del Token</label>
                    <input
                      type="text"
                      value={state.tokenSymbol}
                      onChange={(e) => setState((prev) => ({ ...prev, tokenSymbol: e.target.value.toUpperCase() }))}
                      placeholder="Ej: FFT"
                      maxLength={5}
                      className="w-full px-4 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Dirección de Billetera del Administrador</label>
                    <input
                      type="text"
                      value={state.adminAddress}
                      onChange={(e) => setState((prev) => ({ ...prev, adminAddress: e.target.value }))}
                      placeholder="0x..."
                      className="w-full px-4 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <p className="text-xs text-foreground/60 mt-1">Esta billetera tendrá control administrativo sobre el contrato.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Suministro Máximo (Cap)</label>
                    <input
                      type="number"
                      value={state.maxSupply}
                      onChange={(e) => setState((prev) => ({ ...prev, maxSupply: e.target.value }))}
                      placeholder="Ej: 1000000"
                      className="w-full px-4 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                    <p className="text-xs text-foreground/60 mt-1">Esto establece el número máximo de tokens que pueden existir.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Contract Review */}
            {state.step === 5 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Paso 5 de 7: Revisar Contrato Inteligente</h2>
                  <p className="text-foreground/70 mb-4">
                    Basado en OpenZeppelin - Biblioteca de contratos inteligentes seguros.
                  </p>
                </div>

                <div className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto font-mono text-sm max-h-96 overflow-y-auto">
                  <pre>{state.contractCode}</pre>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-700">
                    <span className="font-semibold">ℹ️ Información:</span> Este contrato se basa en los estándares OpenZeppelin ERC20 y es auditable.
                  </p>
                </div>
              </div>
            )}

            {/* Step 6: Compilation */}
            {state.step === 6 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Paso 6 de 7: Compilar Contrato Inteligente</h2>
                  <p className="text-foreground/70">
                    El contrato será compilado usando Solidity {state.assetClass === "equity" ? "v0.8.20" : "v0.8.20"}.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-6 border-2 border-dashed border-primary/30 rounded-lg bg-primary/5">
                    <div className="flex items-center gap-3 mb-4">
                      <Code className="w-6 h-6 text-primary" />
                      <div>
                        <p className="font-semibold text-foreground">Compilación de Contrato</p>
                        <p className="text-sm text-foreground/60">Solidity v0.8.20</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-foreground">Sintaxis validada</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-foreground">Dependencias de OpenZeppelin verificadas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-foreground">Contrato listo para desplegar</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-700">
                      <span className="font-semibold">⚠️ Próximo Paso:</span> En el siguiente paso, el contrato será desplegado en la red {BLOCKCHAIN_NETWORKS.find((n) => n.id === state.blockchain)?.name}.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Deployment & Address */}
            {state.step === 7 && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Paso 7 de 7: Desplegar Contrato Inteligente</h2>
                  <p className="text-foreground/70">
                    Completa la transacción en tu billetera para desplegar el contrato.
                  </p>
                </div>

                {!state.deploymentAddress ? (
                  <button
                    onClick={handleDeploy}
                    disabled={state.isDeploying}
                    className="w-full p-6 bg-gradient-to-r from-primary to-blue-600 text-white font-bold rounded-lg hover:from-primary/90 hover:to-blue-600/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {state.isDeploying ? (
                      <>
                        <div className="animate-spin">⟳</div>
                        Desplegando...
                      </>
                    ) : (
                      <>
                        <Server className="w-5 h-5" />
                        Desplegar Contrato
                      </>
                    )}
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="p-6 bg-green-50 border-2 border-green-500 rounded-lg">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-bold text-green-700 text-lg">¡Contrato Desplegado Exitosamente!</p>
                          <p className="text-sm text-green-600 mt-1">Tu contrato inteligente ha sido desplegado en la blockchain.</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-foreground">Dirección del Contrato Inteligente</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={state.deploymentAddress}
                          readOnly
                          className="flex-1 px-4 py-2 border border-border/40 rounded-lg bg-gray-50 font-mono text-sm"
                        />
                        <button
                          onClick={() => navigator.clipboard.writeText(state.deploymentAddress)}
                          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                        >
                          Copiar
                        </button>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-700">
                        Guarda esta dirección para referencias futuras. Puedes usar este contrato para transferencias, acuñación y otras operaciones.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4 justify-between">
            <button
              onClick={handlePrevious}
              disabled={state.step === 1}
              className="flex items-center gap-2 px-6 py-2 border border-border/40 text-foreground rounded-lg hover:bg-secondary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </button>

            {state.step < 7 && (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
              >
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {state.step === 7 && state.deploymentAddress && (
              <button
                onClick={() => (window.location.href = "/admin")}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
              >
                Volver al Admin
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
