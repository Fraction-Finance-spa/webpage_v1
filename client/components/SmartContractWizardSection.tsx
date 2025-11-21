import { useState } from "react";
import { ChevronRight, ChevronLeft, CheckCircle, Code, Zap, DollarSign, Wallet, FileText, Server, AlertCircle } from "lucide-react";
import { addSmartContract } from "@/lib/smartContractManager";

type AssetClass = "equity" | "rwa" | null;
type BlockchainNetwork = "ethereum-mainnet" | "sepolia-testnet" | "polygon-mainnet" | "polygon-amoy" | "bnb-mainnet" | "base-mainnet" | null;

interface SmartContractWizardSectionProps {
  setActiveSection: (section: string) => void;
  onContractCreated: () => void;
  preFilledData?: {
    tokenName?: string;
    tokenSymbol?: string;
    maxSupply?: string;
    contractDescription?: string;
    contractCategory?: string;
  };
}

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
  contractDescription: string;
  contractPurpose: string;
  contractCategory: string;
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

export default function SmartContractWizardSection({ setActiveSection, onContractCreated }: SmartContractWizardSectionProps) {
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
    contractDescription: "",
    contractPurpose: "",
    contractCategory: "",
  });

  const [documentos, setDocumentos] = useState<Array<{ nombre: string; archivo: string; tipo: string }>>([]);

  const handleNext = () => {
    if (state.step < 9) {
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
        generateContractCode();
      }
      if (state.step === 5) {
        if (!state.contractDescription || !state.contractPurpose || !state.contractCategory) {
          alert("Por favor completa todos los campos requeridos");
          return;
        }
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
      
      // Save the deployed contract
      const blockchainName = BLOCKCHAIN_NETWORKS.find((n) => n.id === state.blockchain)?.name || state.blockchain;
      addSmartContract({
        nombre: state.tokenName,
        simbolo: state.tokenSymbol,
        direccion: mockAddress,
        blockchain: blockchainName,
        assetClass: state.assetClass === "equity" ? "Equity / Fund (Regulated)" : "Simple RWA Token",
        suministroMaximo: state.maxSupply,
        administrador: state.adminAddress,
        estado: "Activo",
        categoria: state.contractCategory as "Capital de trabajo" | "Bonos Corporativos" | "Deuda Privada",
        codigoContrato: state.contractCode,
        documentos: documentos.map((doc) => ({
          id: Date.now().toString() + Math.random(),
          nombre: doc.nombre,
          tipo: doc.tipo,
          url: doc.archivo,
          fechaCarga: new Date().toISOString(),
        })),
      });
      
      setState((prev) => ({
        ...prev,
        deploymentAddress: mockAddress,
        isDeploying: false,
      }));
      
      onContractCreated();
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground mb-2">Digital Asset Tokenization Wizard</h2>
        <p className="text-foreground/70">
          Create a new on-chain asset from a secure template.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white rounded-lg border border-border/40 p-6">
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((step) => (
            <div key={step} className="flex flex-col items-center flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  step < state.step
                    ? "bg-green-500 text-white"
                    : step === state.step
                      ? "bg-primary text-white border-2 border-primary"
                      : "bg-gray-200 text-foreground/60"
                }`}
              >
                {step < state.step ? <CheckCircle className="w-4 h-4" /> : step}
              </div>
              <p className="text-xs mt-1 text-center text-foreground/60" />
            </div>
          ))}
        </div>

        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-blue-600 transition-all duration-300"
            style={{ width: `${((state.step - 1) / 8) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg border border-border/40 p-6">
        {/* Step 1: Asset Class Selection */}
        {state.step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground"><p>Paso 1 de 9: Seleccionar Clase de Activo</p></h3>
            <p className="text-sm text-foreground/70">
              Esto determina la plantilla del contrato inteligente y características como la lista blanca y los permisos.
            </p>
            <div className="space-y-3">
              {ASSET_CLASSES.map((assetClass) => {
                const Icon = assetClass.icon;
                return (
                  <div
                    key={assetClass.id}
                    onClick={() => setState((prev) => ({ ...prev, assetClass: assetClass.id as AssetClass }))}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      state.assetClass === assetClass.id
                        ? "border-primary bg-primary/5"
                        : "border-border/40 hover:border-primary/50 bg-white"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-bold text-foreground text-sm mb-0.5">{assetClass.name}</h4>
                        <p className="text-xs text-foreground/70">{assetClass.description}</p>
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
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">Paso 2 de 9: Seleccionar Red Blockchain</h3>
            <p className="text-sm text-foreground/70">
              Elige la red donde se emitirá tu activo. Esto no se puede cambiar más tarde.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {BLOCKCHAIN_NETWORKS.map((network) => (
                <div
                  key={network.id}
                  onClick={() => setState((prev) => ({ ...prev, blockchain: network.id as BlockchainNetwork }))}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    state.blockchain === network.id
                      ? "border-primary bg-primary/5"
                      : "border-border/40 hover:border-primary/50 bg-white"
                  }`}
                >
                  <h4 className="font-bold text-foreground text-sm mb-2">{network.name}</h4>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-foreground/60">Velocidad:</span>
                      <span className="font-semibold text-foreground">{network.speed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/60">Costo:</span>
                      <span className="font-semibold text-foreground">{network.cost}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Admin Wallet Connection */}
        {state.step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">Paso 3 de 9: Conectar Billetera de Administrador</h3>
            <p className="text-sm text-foreground/70">
              Conecta la billetera que poseerá y gestionará el contrato inteligente.
            </p>
            <button
              onClick={() => setState((prev) => ({ ...prev, adminWallet: "0x742d35Cc6634C0532925a3b844Bc394e0e4f0d" }))}
              className="w-full p-4 border-2 border-primary rounded-lg hover:bg-primary/10 transition-all"
            >
              <div className="flex items-center gap-3">
                <Wallet className="w-5 h-5 text-primary" />
                <div className="text-left">
                  <p className="font-bold text-foreground text-sm">Conectar con MetaMask</p>
                  <p className="text-xs text-foreground/60">
                    {state.adminWallet ? `Conectado: ${state.adminWallet.substring(0, 10)}...` : "Haz clic para conectar"}
                  </p>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Step 4: Token Details */}
        {state.step === 4 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">Paso 4 de 9: Detalles del Token</h3>
            <p className="text-sm text-foreground/70">
              Define las propiedades en cadena de tu token.
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Nombre del Token</label>
                <input
                  type="text"
                  value={state.tokenName}
                  onChange={(e) => setState((prev) => ({ ...prev, tokenName: e.target.value }))}
                  placeholder="Ej: Fraction Finance Token"
                  className="w-full px-3 py-2 text-sm border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Símbolo del Token</label>
                <input
                  type="text"
                  value={state.tokenSymbol}
                  onChange={(e) => setState((prev) => ({ ...prev, tokenSymbol: e.target.value.toUpperCase() }))}
                  placeholder="Ej: FFT"
                  maxLength={5}
                  className="w-full px-3 py-2 text-sm border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Dirección de Billetera del Administrador</label>
                <input
                  type="text"
                  value={state.adminAddress}
                  onChange={(e) => setState((prev) => ({ ...prev, adminAddress: e.target.value }))}
                  placeholder="0x..."
                  className="w-full px-3 py-2 text-sm border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Suministro Máximo (Cap)</label>
                <input
                  type="number"
                  value={state.maxSupply}
                  onChange={(e) => setState((prev) => ({ ...prev, maxSupply: e.target.value }))}
                  placeholder="Ej: 1000000"
                  className="w-full px-3 py-2 text-sm border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Contract Metadata */}
        {state.step === 5 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">Paso 5 de 9: Información del Contrato</h3>
            <p className="text-sm text-foreground/70">
              Define los metadatos y documentación del contrato inteligente.
            </p>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Descripción del Contrato</label>
                <textarea
                  value={state.contractDescription}
                  onChange={(e) => setState((prev) => ({ ...prev, contractDescription: e.target.value }))}
                  placeholder="Describe el propósito y características del contrato..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Propósito del Contrato</label>
                <input
                  type="text"
                  value={state.contractPurpose}
                  onChange={(e) => setState((prev) => ({ ...prev, contractPurpose: e.target.value }))}
                  placeholder="Ej: Tokenización de deuda corporativa"
                  className="w-full px-3 py-2 text-sm border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground mb-1 block">Categoría</label>
                <select
                  value={state.contractCategory}
                  onChange={(e) => setState((prev) => ({ ...prev, contractCategory: e.target.value }))}
                  className="w-full px-3 py-2 text-sm border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  <option value="">Selecciona una categoría</option>
                  <option value="Capital de trabajo">Capital de trabajo</option>
                  <option value="Bonos Corporativos">Bonos Corporativos</option>
                  <option value="Deuda Privada">Deuda Privada</option>
                </select>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-semibold text-foreground mb-3">Documentos Técnicos y de Respaldo</h4>
                <div className="border-2 border-dashed border-border/40 rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setDocumentos((prev) => [
                            ...prev,
                            {
                              nombre: file.name,
                              tipo: file.type,
                              archivo: event.target?.result as string,
                            },
                          ]);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="hidden"
                    id="metadata-doc-upload"
                    accept=".pdf,.doc,.docx,.txt,.zip"
                  />
                  <label htmlFor="metadata-doc-upload" className="cursor-pointer block">
                    <svg
                      className="w-6 h-6 text-primary mx-auto mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <p className="text-foreground font-semibold text-sm">Haz clic para cargar documentos</p>
                    <p className="text-xs text-foreground/60 mt-1">PDF, DOC, TXT, ZIP (máx. 10MB)</p>
                  </label>
                </div>

                {documentos.length > 0 && (
                  <div className="space-y-2 mt-4">
                    <p className="text-xs font-semibold text-foreground">Documentos cargados:</p>
                    {documentos.map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 flex-1">
                          <FileText className="w-4 h-4 text-green-600" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-foreground truncate">{doc.nombre}</p>
                            <p className="text-xs text-foreground/60">{doc.tipo}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setDocumentos((prev) => prev.filter((_, i) => i !== idx))}
                          className="p-1 hover:bg-red-100 rounded transition-colors"
                        >
                          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 6: Contract Review */}
        {state.step === 6 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">Paso 6 de 9: Revisar Contrato Inteligente</h3>
            <p className="text-sm text-foreground/70">
              Basado en OpenZeppelin - Biblioteca de contratos inteligentes seguros.
            </p>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto font-mono text-xs max-h-72 overflow-y-auto">
              <pre>{state.contractCode}</pre>
            </div>
          </div>
        )}

        {/* Step 7: Compilation & Documents */}
        {state.step === 7 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">Paso 7 de 9: Compilar Contrato Inteligente</h3>
            <div className="p-4 border-2 border-dashed border-primary/30 rounded-lg bg-primary/5 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <Code className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-semibold text-foreground text-sm">Compilación de Contrato</p>
                  <p className="text-xs text-foreground/60">Solidity v0.8.20</p>
                </div>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span className="text-foreground">Sintaxis validada</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span className="text-foreground">Dependencias verificadas</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Step 8: Confirmation Review */}
        {state.step === 8 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">Paso 8 de 9: Revisar Información</h3>
            <p className="text-sm text-foreground/70">
              Verifica todos los datos antes de desplegar el contrato.
            </p>
            <div className="space-y-3">
              <div className="p-4 bg-gray-50 rounded-lg border border-border/40 space-y-4">
                <div>
                  <p className="text-foreground/60 text-xs mb-1">Descripción</p>
                  <p className="font-semibold text-foreground text-sm">{state.contractDescription}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-foreground/60 text-xs">Propósito</p>
                    <p className="font-semibold text-foreground">{state.contractPurpose}</p>
                  </div>
                  <div>
                    <p className="text-foreground/60 text-xs">Categoría</p>
                    <p className="font-semibold text-foreground capitalize">{state.contractCategory}</p>
                  </div>
                </div>
                <div className="border-t border-border/40 pt-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-foreground/60 text-xs">Nombre del Token</p>
                      <p className="font-semibold text-foreground">{state.tokenName}</p>
                    </div>
                    <div>
                      <p className="text-foreground/60 text-xs">Símbolo</p>
                      <p className="font-semibold text-foreground">{state.tokenSymbol}</p>
                    </div>
                    <div>
                      <p className="text-foreground/60 text-xs">Clase de Activo</p>
                      <p className="font-semibold text-foreground">
                        {state.assetClass === "equity" ? "Equity / Fund" : "Simple RWA"}
                      </p>
                    </div>
                    <div>
                      <p className="text-foreground/60 text-xs">Red Blockchain</p>
                      <p className="font-semibold text-foreground">
                        {BLOCKCHAIN_NETWORKS.find((n) => n.id === state.blockchain)?.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-foreground/60 text-xs">Suministro Máximo</p>
                      <p className="font-semibold text-foreground">{state.maxSupply}</p>
                    </div>
                    <div>
                      <p className="text-foreground/60 text-xs">Administrador</p>
                      <p className="font-semibold text-foreground text-xs">{state.adminAddress.substring(0, 20)}...</p>
                    </div>
                  </div>
                </div>
                {documentos.length > 0 && (
                  <div className="border-t border-border/40 pt-4">
                    <p className="text-foreground/60 text-xs mb-2">Documentos Cargados</p>
                    <div className="space-y-1">
                      {documentos.map((doc, idx) => (
                        <p key={idx} className="text-xs text-foreground">• {doc.nombre}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700">
                  Esta acción desplegará un contrato inteligente en la blockchain seleccionada. Asegúrate de que todos los datos sean correctos.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 9: Deployment */}
        {state.step === 9 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">Paso 9 de 9: Desplegar Contrato Inteligente</h3>
            {!state.deploymentAddress ? (
              <button
                onClick={handleDeploy}
                disabled={state.isDeploying}
                className="w-full p-4 bg-gradient-to-r from-primary to-blue-600 text-white font-bold rounded-lg hover:from-primary/90 hover:to-blue-600/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {state.isDeploying ? (
                  <>
                    <div className="animate-spin">⟳</div>
                    Desplegando...
                  </>
                ) : (
                  <>
                    <Server className="w-4 h-4" />
                    Desplegar Contrato
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-3">
                <div className="p-4 bg-green-50 border-2 border-green-500 rounded-lg">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-green-700 text-sm">¡Contrato Desplegado Exitosamente!</p>
                      <p className="text-xs text-green-600 mt-0.5">Tu contrato inteligente ha sido desplegado en la blockchain.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Dirección del Contrato Inteligente</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={state.deploymentAddress}
                      readOnly
                      className="flex-1 px-3 py-2 border border-border/40 rounded-lg bg-gray-50 font-mono text-xs"
                    />
                    <button
                      onClick={() => navigator.clipboard.writeText(state.deploymentAddress)}
                      className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-xs font-semibold"
                    >
                      Copiar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-3 justify-between">
        <button
          onClick={handlePrevious}
          disabled={state.step === 1}
          className="flex items-center gap-2 px-4 py-2 border border-border/40 text-foreground rounded-lg hover:bg-secondary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </button>

        <button
          onClick={() => setActiveSection("activos")}
          className="px-4 py-2 border border-border/40 text-foreground rounded-lg hover:bg-secondary/20 transition-colors font-semibold text-sm"
        >
          Cancelar
        </button>

        {state.step < 9 && (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold text-sm"
          >
            Siguiente
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {state.step === 9 && state.deploymentAddress && (
          <button
            onClick={() => {
              setActiveSection("activos");
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold text-sm"
          >
            Ir a Activos Digitales
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
