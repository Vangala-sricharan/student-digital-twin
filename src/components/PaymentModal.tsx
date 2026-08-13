import React, { useState, useEffect } from 'react';
import { X, Copy, Check, QrCode, ExternalLink, Clock, RefreshCw, AlertTriangle, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { PlanConfig, UPI_PAYEE_ID, generateUPIUri, validateUPIUri } from '../data/plans';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: PlanConfig | null;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  selectedPlan,
}) => {
  const [copiedUPI, setCopiedUPI] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [countdown, setCountdown] = useState(23);
  const [simulationComplete, setSimulationComplete] = useState(false);

  // Reset simulation timer and state whenever modal opens or selectedPlan changes
  useEffect(() => {
    if (isOpen) {
      setIsSimulating(false);
      setCountdown(23);
      setSimulationComplete(false);
      setCopiedUPI(false);
    }
  }, [isOpen, selectedPlan?.id]);

  // Handle 23-second simulation countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isSimulating && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (isSimulating && countdown === 0) {
      setIsSimulating(false);
      setSimulationComplete(true);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isSimulating, countdown]);

  if (!isOpen || !selectedPlan) return null;

  const amount = selectedPlan.amount;
  const isFreePlan = amount <= 0;
  const upiUri = generateUPIUri(amount);
  const isValidQr = !isFreePlan && validateUPIUri(upiUri, amount);

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(UPI_PAYEE_ID);
    setCopiedUPI(true);
    setTimeout(() => setCopiedUPI(false), 2000);
  };

  const handleStartSimulation = () => {
    setIsSimulating(true);
    setCountdown(23);
    setSimulationComplete(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white dark:bg-[#0B1626] border border-slate-200 dark:border-sky-500/30 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Top Header & Close Button */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 dark:border-white/10 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-700 dark:text-sky-300 text-[10px] font-black uppercase tracking-wider border border-sky-400/30 mb-1">
              <Zap className="h-3 w-3 text-sky-500" />
              <span>DEMO PAYMENT</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              Complete Payment
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Demo payment simulation — no real payment verification.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Selected Plan Summary Card */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-500/10 via-blue-500/10 to-cyan-500/10 border border-sky-500/20 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              SELECTED PLAN
            </span>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>{selectedPlan.name}</span>
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                ({selectedPlan.billingPeriod})
              </span>
            </h3>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              AMOUNT
            </span>
            <span className="text-2xl font-black text-sky-600 dark:text-sky-400">
              {selectedPlan.priceDisplay}
            </span>
          </div>
        </div>

        {/* Payment QR & Details Section */}
        {isFreePlan ? (
          <div className="p-6 rounded-2xl bg-slate-100 dark:bg-white/5 text-center space-y-2">
            <ShieldCheck className="h-8 w-8 text-emerald-500 mx-auto" />
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
              Payment amount unavailable for this plan.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              The Free Plan does not require payment processing.
            </p>
          </div>
        ) : !isValidQr ? (
          <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-2 text-amber-800 dark:text-amber-200">
            <AlertTriangle className="h-8 w-8 text-amber-500 mx-auto" />
            <p className="text-sm font-bold">
              Unable to generate payment QR. Please try again.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {/* UPI ID Row */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  PAYEE UPI ID
                </span>
                <span className="text-sm font-mono font-black text-slate-900 dark:text-white">
                  {UPI_PAYEE_ID}
                </span>
              </div>

              <button
                onClick={handleCopyUPI}
                className="px-3 py-1.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-700 dark:text-sky-300 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedUPI ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedUPI ? 'Copied' : 'Copy UPI'}</span>
              </button>
            </div>

            {/* Dynamic Plan-Specific QR Code Display */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-lg flex flex-col items-center space-y-3">
              <div className="p-2.5 bg-slate-900 rounded-xl text-white text-[10px] font-black tracking-widest uppercase flex items-center gap-1.5">
                <QrCode className="h-3.5 w-3.5 text-sky-400" />
                <span>PLAN QR — ₹{amount}</span>
              </div>

              <div className="p-3 bg-white rounded-xl shadow-inner border border-slate-100">
                <QRCodeSVG
                  value={upiUri}
                  size={170}
                  level="M"
                  includeMargin={true}
                />
              </div>

              <div className="text-center space-y-1">
                <span className="text-xs font-bold text-slate-900 block">
                  Scan with any UPI app
                </span>
                <span className="text-[10px] font-mono text-slate-500 block truncate max-w-xs">
                  {upiUri}
                </span>
              </div>

              <a
                href={upiUri}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                target="_blank"
                rel="noreferrer"
              >
                <span>Open UPI App</span>
                <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
              </a>
            </div>

            {/* 23-Second Demo Payment Simulation Section */}
            <div className="pt-2 border-t border-slate-100 dark:border-white/10 space-y-3">
              {!isSimulating && !simulationComplete && (
                <button
                  onClick={handleStartSimulation}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-extrabold text-xs shadow-lg shadow-sky-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Clock className="h-4 w-4" />
                  <span>Start Demo Payment</span>
                </button>
              )}

              {isSimulating && (
                <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-400/40 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-sky-800 dark:text-sky-200">
                    <span className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin text-sky-500" />
                      <span>Demo payment simulation in progress...</span>
                    </span>
                    <span className="font-mono text-sm">{countdown}s</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-500 to-blue-600 transition-all duration-1000"
                      style={{ width: `${((23 - countdown) / 23) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {simulationComplete && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/40 text-amber-900 dark:text-amber-100 space-y-2 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Demo payment simulation completed</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-300 pt-1">
                    <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                    <span>DEMO ONLY — NO REAL PAYMENT WAS VERIFIED</span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    This is a demonstration simulation. No real payment was received, no transaction ID was generated, and no real paid subscription was created.
                  </p>

                  <button
                    onClick={handleStartSimulation}
                    className="text-xs font-bold text-sky-600 dark:text-sky-400 underline hover:text-sky-500 pt-1 block cursor-pointer"
                  >
                    Start Demo Payment Again
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
