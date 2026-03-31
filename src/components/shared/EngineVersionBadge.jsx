import { ENGINE_CONFIG } from '../../constants/engineConfig.js';

export default function EngineVersionBadge() {
  return <span className="text-xs rounded bg-slate-100 px-2 py-1">Engine v{ENGINE_CONFIG.ENGINE_VERSION}</span>;
}
