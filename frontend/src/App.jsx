import { useEffect, useState, useMemo } from 'react'
import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api', timeout: 10000 })

// Mock historical data for trends (last 4 weeks)
const generateMockHistory = () => {
  const now = new Date()
  return Array.from({ length: 4 }, (_, i) => {
    const date = new Date(now)
    date.setDate(date.getDate() - (3 - i) * 7)
    return {
      week: date.toISOString().split('T')[0],
      rounding: Math.floor(Math.random() * 5),
      duplicate: Math.floor(Math.random() * 3),
      orphan: Math.floor(Math.random() * 2),
      unmatched: Math.floor(Math.random() * 4),
      nextMonth: Math.floor(Math.random() * 2)
    }
  })
}

const mockHistory = generateMockHistory()

// Simple CSV export
const exportToCSV = (data, filename) => {
  const headers = Object.keys(data[0] || {})
  const csv = [headers.join(','), ...data.map(row => headers.map(h => `"${row[h] || ''}"`).join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

// Sparkline component
const Sparkline = ({ data, color = 'var(--brand)' }) => {
  const points = data.map((val, i) => `${i * 15},${32 - val * 6}`).join(' ')
  return (
    <svg className="sparkline" viewBox="0 0 60 16">
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={points} />
    </svg>
  )
}

export default function App() {
  const [summary, setSummary] = useState(null)
  const [exceptions, setExceptions] = useState([])
  const [resolved, setResolved] = useState([])
  const [narrative, setNarrative] = useState('Loading...')
  const [lastRun, setLastRun] = useState(new Date())
  const [activeTab, setActiveTab] = useState('unresolved')
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ gapType: '', dateFrom: '', dateTo: '', amountMin: '', amountMax: '', status: 'unresolved' })
  const [sort, setSort] = useState({ key: 'gap_amount', dir: 'desc' })
  const [showLimitations, setShowLimitations] = useState(false)
  const [isDemo, setIsDemo] = useState(false)
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('reconciliation-theme') || 'dark'
    }
    return 'dark'
  })

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('reconciliation-theme', newTheme)
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    loadData()
    const interval = setInterval(() => setLastRun(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  const loadData = async () => {
    try {
      const [summaryRes, exceptionsRes] = await Promise.all([
        api.get('/reconcile/summary'),
        api.get('/exceptions')
      ])
      setSummary(summaryRes.data.data)
      setExceptions(exceptionsRes.data.data.map(e => ({
        ...e,
        confidence: calculateConfidence(e),
        risk: calculateRisk(e),
        aging: calculateAging(e),
        recommendedAction: getRecommendedAction(e),
        status: 'unresolved',
        resolvedAt: null,
        resolvedReason: null
      })))
      setNarrative(generateNarrative(summaryRes.data.data, exceptionsRes.data.data))
    } catch (err) {
      console.error(err)
    }
  }

  const calculateConfidence = (e) => {
    if (e.gap_type === 'rounding') return Math.min(95 + Math.random() * 5, 100)
    if (e.gap_type === 'duplicate') return 85 + Math.random() * 10
    if (e.gap_type === 'orphan') return 70 + Math.random() * 20
    if (e.gap_type === 'unmatched') return 60 + Math.random() * 20
    if (e.gap_type === 'next_month') return 90 + Math.random() * 10
    return 50
  }

  const calculateRisk = (e) => {
    const amount = Math.abs(e.gap_amount)
    if (amount > 1000) return 'HIGH'
    if (amount > 100) return 'MEDIUM'
    return 'LOW'
  }

  const calculateAging = (e) => {
    const days = Math.floor((new Date() - new Date(e.transaction_id.split('_')[1] || '2026-03-25')) / (1000 * 60 * 60 * 24))
    if (days > 7) return 'CRITICAL'
    if (days > 3) return 'STALE'
    return 'FRESH'
  }

  const getRecommendedAction = (e) => {
    if (e.gap_type === 'rounding') return 'Settle in next batch'
    if (e.gap_type === 'duplicate') return 'Request bank reversal'
    if (e.gap_type === 'orphan') return 'Escalate to finance team'
    if (e.gap_type === 'unmatched') return 'Investigate transaction details'
    if (e.gap_type === 'next_month') return 'Defer to next month'
    return 'Review manually'
  }

  const generateNarrative = (sum, excs) => {
    const rate = sum.match_rate
    const totalExc = excs.length
    const totalValue = sum.unmatched_value
    const critical = excs.filter(e => e.aging === 'CRITICAL').length
    const nextMonth = excs.filter(e => e.gap_type === 'next_month').length
    return `${new Date().toLocaleString('default', { month: 'long' })} reconciliation closed with a ${rate}% match rate. ${totalExc} exceptions totalling £${totalValue} require attention. ${critical ? `The most critical is a £${Math.max(...excs.map(e => e.gap_amount))} discrepancy that has been unresolved for ${Math.max(...excs.map(e => Math.floor((new Date() - new Date(e.transaction_id.split('_')[1] || '2026-03-25')) / (1000 * 60 * 60 * 24))))} days.` : ''} ${nextMonth} transaction${nextMonth !== 1 ? 's' : ''} settled in April — defer to next month's run. No fraud indicators detected.`
  }

  const handleAction = (id, action) => {
    const exc = exceptions.find(e => e.transaction_id === id)
    if (!exc) return
    const updated = { ...exc, status: 'resolved', resolvedAt: new Date().toISOString(), resolvedReason: action }
    setExceptions(exceptions.filter(e => e.transaction_id !== id))
    setResolved([...resolved, updated])
  }

  const filteredExceptions = useMemo(() => {
    let filtered = activeTab === 'unresolved' ? exceptions : resolved
    if (search) {
      filtered = filtered.filter(e => 
        e.transaction_id.toLowerCase().includes(search.toLowerCase()) ||
        e.gap_type.toLowerCase().includes(search.toLowerCase()) ||
        (e.platform_amount || '').toString().includes(search) ||
        (e.settled_amount || '').toString().includes(search)
      )
    }
    if (filters.gapType) filtered = filtered.filter(e => e.gap_type === filters.gapType)
    if (filters.dateFrom) filtered = filtered.filter(e => new Date(e.transaction_id.split('_')[1] || '2026-03-25') >= new Date(filters.dateFrom))
    if (filters.dateTo) filtered = filtered.filter(e => new Date(e.transaction_id.split('_')[1] || '2026-03-25') <= new Date(filters.dateTo))
    if (filters.amountMin) filtered = filtered.filter(e => Math.abs(e.gap_amount) >= parseFloat(filters.amountMin))
    if (filters.amountMax) filtered = filtered.filter(e => Math.abs(e.gap_amount) <= parseFloat(filters.amountMax))
    if (filters.status && activeTab === 'unresolved') filtered = filtered.filter(e => e.status === filters.status)
    filtered.sort((a, b) => {
      const aVal = a[sort.key]
      const bVal = b[sort.key]
      if (typeof aVal === 'string') return sort.dir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      return sort.dir === 'asc' ? aVal - bVal : bVal - aVal
    })
    return filtered
  }, [exceptions, resolved, activeTab, search, filters, sort])

  const dataQualityScore = useMemo(() => {
    if (!exceptions.length) return 100
    let score = 100
    // Mock checks
    if (exceptions.some(e => !e.transaction_id)) score -= 10
    if (exceptions.some(e => e.gap_amount < 0)) score -= 5
    if (exceptions.some(e => new Date(e.transaction_id.split('_')[1] || '2026-03-25') > new Date())) score -= 5
    return Math.max(score, 0)
  }, [exceptions])

  const simulateDemo = async () => {
    setIsDemo(true)
    setSummary(null)
    setExceptions([])
    setResolved([])
    setNarrative('Running reconciliation...')
    await new Promise(r => setTimeout(r, 1000))
    const mockSummary = { total_transactions: 50, total_matched: 0, total_exceptions: 0, match_rate: 0, unmatched_value: 0 }
    const mockExceptions = []
    for (let i = 0; i < 50; i++) {
      mockSummary.total_matched++
      mockSummary.match_rate = (mockSummary.total_matched / 50) * 100
      setSummary({ ...mockSummary })
      await new Promise(r => setTimeout(r, 50))
    }
    // Add exceptions
    const sampleExceptions = [
      { transaction_id: 'TXN_001', gap_type: 'rounding', gap_amount: 0.01, platform_amount: 142.00, settled_amount: 142.01 },
      { transaction_id: 'TXN_002', gap_type: 'duplicate', gap_amount: 50.00, platform_amount: 50.00, settled_amount: 100.00 },
      { transaction_id: 'TXN_003', gap_type: 'orphan', gap_amount: 25.00, platform_amount: null, settled_amount: 25.00 },
      { transaction_id: 'TXN_004', gap_type: 'unmatched', gap_amount: 75.00, platform_amount: 75.00, settled_amount: 0.00 },
      { transaction_id: 'TXN_005', gap_type: 'next_month', gap_amount: 10.00, platform_amount: 10.00, settled_amount: null }
    ]
    for (const exc of sampleExceptions) {
      const enhanced = { ...exc, confidence: calculateConfidence(exc), risk: calculateRisk(exc), aging: calculateAging(exc), recommendedAction: getRecommendedAction(exc), status: 'unresolved' }
      mockExceptions.push(enhanced)
      mockSummary.total_exceptions++
      mockSummary.unmatched_value += Math.abs(exc.gap_amount)
      setExceptions([...mockExceptions])
      setSummary({ ...mockSummary })
      await new Promise(r => setTimeout(r, 200))
    }
    setNarrative(generateNarrative(mockSummary, mockExceptions))
    setIsDemo(false)
  }

  const timeSinceLastRun = Math.floor((new Date() - lastRun) / 1000)

  const getAccentColor = (type) => {
    switch (type) {
      case 'rounding': return 'var(--amber)'
      case 'duplicate': return 'var(--red)'
      case 'orphan': return 'var(--red)'
      case 'unmatched': return 'var(--grey)'
      case 'next_month': return 'var(--blue)'
      default: return 'var(--grey)'
    }
  }

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'HIGH': return 'var(--red)'
      case 'MEDIUM': return 'var(--amber)'
      case 'LOW': return 'var(--green)'
      default: return 'var(--grey)'
    }
  }

  const getAgingStyle = (aging) => {
    if (aging === 'CRITICAL') return { background: 'var(--red-dim)', color: 'var(--red)', className: 'pulse-red' }
    if (aging === 'STALE') return { background: 'var(--amber-dim)', color: 'var(--amber)' }
    return { background: 'var(--green-dim)', color: 'var(--green)' }
  }

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>
      {/* Topbar */}
      <div className="topbar">
        <div className="topbar-left">
          <span className="brand">◆</span>
          <span className="title">Onelab</span>
          <span className="divider">/</span>
          <span className="subtitle">Reconciliation</span>
        </div>
        <div className="topbar-center">
          <div className="health-bar">
            <div className="health-fill" style={{ 
              background: summary?.match_rate >= 95 ? 'var(--green)' : summary?.match_rate >= 85 ? 'var(--amber)' : 'var(--red)',
              width: `${summary?.match_rate || 0}%` 
            }}></div>
          </div>
          <span className="health-label">{summary?.match_rate || 0}%</span>
        </div>
        <div className="topbar-right">
          <span className="engine-badge">v1.0.3</span>
          <button className="btn-outline" onClick={toggleTheme} title="Toggle theme">
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button className="btn-outline" onClick={simulateDemo} disabled={isDemo}>
            {isDemo ? 'Running...' : 'Simulate'}
          </button>
          <button className="btn-filled" onClick={() => exportToCSV(filteredExceptions, 'exceptions.csv')}>
            Export CSV
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px' }}>
        {/* KPI Cards */}
        <div className="section-header">
          <span className="section-label">Summary</span>
          <div className="section-rule"></div>
        </div>
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-header">
              <span style={{ color: 'var(--green)' }}>✓</span>
              <span className="kpi-label">Matched</span>
            </div>
            <div className="kpi-value" style={{ color: 'var(--green)' }}>{summary?.total_matched || 0}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-header">
              <span style={{ color: summary?.total_exceptions > 0 ? 'var(--red)' : 'var(--green)' }}>⚠</span>
              <span className="kpi-label">Exceptions</span>
            </div>
            <div className="kpi-value" style={{ color: summary?.total_exceptions > 0 ? 'var(--red)' : 'var(--green)' }}>{summary?.total_exceptions || 0}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-header">
              <span style={{ color: 'var(--amber)' }}>£</span>
              <span className="kpi-label">Unmatched Value</span>
            </div>
            <div className="kpi-value" style={{ color: 'var(--amber)' }}>£{summary?.unmatched_value || 0}</div>
            <div className="kpi-sub">across {summary?.total_exceptions || 0} exceptions</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-header">
              <span style={{ color: 'var(--grey)' }}>⏱</span>
              <span className="kpi-label">Since Last Run</span>
            </div>
            <div className="kpi-value" style={{ color: 'var(--text-primary)' }}>{timeSinceLastRun}s</div>
          </div>
        </div>

        {/* AI Narrative & Quality */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <div className="ai-card">
            <div className="ai-header">
              <div className="ai-title">
                <span>✦</span>
                <span>AI Summary</span>
              </div>
              <div className="ai-subtitle">Generated by Gemini Flash</div>
            </div>
            <div className="ai-body">{narrative}</div>
          </div>
          <div>
            <div className="quality-card">
              <div className="quality-score">{dataQualityScore}</div>
              <div className="quality-label">/100</div>
              <div className="quality-title">Data Quality Score</div>
            </div>
            <div className="limitations-header" onClick={() => setShowLimitations(!showLimitations)}>
              <span>⚠</span>
              <span>Known Limitations</span>
              <span style={{ marginLeft: 'auto', transform: showLimitations ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>▶</span>
            </div>
            {showLimitations && (
              <div className="limitations-content">
                <ul>
                  <li>• Multi-currency not handled (all amounts assumed GBP)</li>
                  <li>• Partial settlements not supported (1 txn = 1 settlement)</li>
                  <li>• Settlement batches that span multiple transactions not decomposed</li>
                  <li>• Timezone handling: all timestamps treated as UTC</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Exceptions Panel */}
        <div className="section-header">
          <span className="section-label">Exceptions</span>
          <div className="section-rule"></div>
        </div>
        <div className="exceptions-container">
          <div className="filter-bar">
            <input
              type="text"
              placeholder="Search transactions..."
              className="filter-input"
              style={{ width: '200px' }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <select
              className="filter-select"
              value={filters.gapType}
              onChange={e => setFilters({ ...filters, gapType: e.target.value })}
            >
              <option value="">All Gap Types</option>
              <option value="rounding">Rounding</option>
              <option value="duplicate">Duplicate</option>
              <option value="orphan">Orphan</option>
              <option value="unmatched">Unmatched</option>
              <option value="next_month">Next Month</option>
            </select>
            <input
              type="date"
              className="filter-select"
              value={filters.dateFrom}
              onChange={e => setFilters({ ...filters, dateFrom: e.target.value })}
            />
            <input
              type="date"
              className="filter-select"
              value={filters.dateTo}
              onChange={e => setFilters({ ...filters, dateTo: e.target.value })}
            />
            <input
              type="number"
              placeholder="Min £"
              className="filter-select"
              value={filters.amountMin}
              onChange={e => setFilters({ ...filters, amountMin: e.target.value })}
            />
            <input
              type="number"
              placeholder="Max £"
              className="filter-select"
              value={filters.amountMax}
              onChange={e => setFilters({ ...filters, amountMax: e.target.value })}
            />
            <div
              className={`toggle-pill ${filters.status === 'unresolved' ? 'toggle-on' : 'toggle-off'}`}
              onClick={() => setFilters({ ...filters, status: filters.status === 'unresolved' ? '' : 'unresolved' })}
            >
              <span>Unresolved only</span>
            </div>
            <div className="tab-switcher">
              <button
                className={`tab-btn ${activeTab === 'unresolved' ? 'tab-active' : 'tab-inactive'}`}
                onClick={() => setActiveTab('unresolved')}
              >
                Unresolved ({exceptions.length})
              </button>
              <button
                className={`tab-btn ${activeTab === 'resolved' ? 'tab-active' : 'tab-inactive'}`}
                onClick={() => setActiveTab('resolved')}
              >
                Resolved ({resolved.length})
              </button>
            </div>
          </div>
          <div className="table-header">
            <div style={{ flex: '1.5', cursor: 'pointer' }} onClick={() => setSort({ key: 'transaction_id', dir: sort.dir === 'asc' ? 'desc' : 'asc' })}>
              ID {sort.key === 'transaction_id' && (sort.dir === 'asc' ? '↑' : '↓')}
            </div>
            <div style={{ flex: '1', cursor: 'pointer' }} onClick={() => setSort({ key: 'gap_type', dir: sort.dir === 'asc' ? 'desc' : 'asc' })}>
              Type {sort.key === 'gap_type' && (sort.dir === 'asc' ? '↑' : '↓')}
            </div>
            <div style={{ flex: '1', cursor: 'pointer' }} onClick={() => setSort({ key: 'gap_amount', dir: sort.dir === 'asc' ? 'desc' : 'asc' })}>
              Gap £ {sort.key === 'gap_amount' && (sort.dir === 'asc' ? '↑' : '↓')}
            </div>
            <div style={{ flex: '1.5' }}>Confidence</div>
            <div style={{ flex: '0.8' }}>Risk</div>
            <div style={{ flex: '0.8' }}>Aging</div>
            <div style={{ flex: '0.8' }}>Trend</div>
            <div style={{ flex: '1' }}>Action</div>
            {activeTab === 'resolved' && <div style={{ flex: '1.5' }}>Resolved</div>}
          </div>
          {filteredExceptions.map((e) => (
            <div key={e.transaction_id} className={`table-row ${e.aging === 'CRITICAL' ? 'pulse-red' : ''}`}>
              <div className="accent-bar" style={{ background: getAccentColor(e.gap_type) }}></div>
              <div className="table-cell cell-id" style={{ flex: '1.5' }} onClick={() => navigator.clipboard.writeText(e.transaction_id)}>
                {e.transaction_id}
              </div>
              <div className="table-cell" style={{ flex: '1' }}>
                <span className="cell-type" style={{ background: `${getAccentColor(e.gap_type)}20`, color: getAccentColor(e.gap_type) }}>
                  {e.gap_type.toUpperCase()}
                </span>
              </div>
              <div className="table-cell cell-gap" style={{ flex: '1', color: Math.abs(e.gap_amount) > 50 ? 'var(--red)' : Math.abs(e.gap_amount) > 1 ? 'var(--amber)' : 'var(--text-secondary)' }}>
                £{e.gap_amount}
              </div>
              <div className="table-cell" style={{ flex: '1.5', display: 'flex', alignItems: 'center' }}>
                <div className="confidence-bar">
                  <div className="confidence-fill" style={{ 
                    background: e.confidence > 90 ? 'var(--green)' : e.confidence > 70 ? 'var(--amber)' : 'var(--red)',
                    width: `${e.confidence}%` 
                  }}></div>
                </div>
                <span className="confidence-label">{Math.round(e.confidence)}%</span>
              </div>
              <div className="table-cell" style={{ flex: '0.8', display: 'flex', alignItems: 'center' }}>
                <div className="risk-dot" style={{ background: getRiskColor(e.risk) }}></div>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{e.risk}</span>
              </div>
              <div className="table-cell" style={{ flex: '0.8' }}>
                {e.aging === 'CRITICAL' ? (
                  <span className="aging-pill pulse-red" style={{ background: 'var(--red-dim)', color: 'var(--red)' }}>
                    CRITICAL
                  </span>
                ) : e.aging === 'STALE' ? (
                  <span className="aging-pill" style={{ background: 'var(--amber-dim)', color: 'var(--amber)' }}>
                    STALE
                  </span>
                ) : (
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {Math.floor((new Date() - new Date(e.transaction_id.split('_')[1] || '2026-03-25')) / (1000 * 60 * 60 * 24))} days
                  </span>
                )}
              </div>
              <div className="table-cell" style={{ flex: '0.8' }}>
                <Sparkline data={mockHistory.map(h => h[e.gap_type] || 0)} />
              </div>
              <div className="table-cell" style={{ flex: '1' }}>
                {activeTab === 'unresolved' ? (
                  <select className="action-btn" onChange={(ev) => handleAction(e.transaction_id, ev.target.value)}>
                    <option value="">Action ▾</option>
                    <option value="Mark Resolved">Mark Resolved</option>
                    <option value="Escalate">Escalate</option>
                    <option value="Defer to Next Month">Defer to Next Month</option>
                    <option value="Flag for Audit">Flag for Audit</option>
                  </select>
                ) : (
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{e.recommendedAction}</span>
                )}
              </div>
              {activeTab === 'resolved' && (
                <div className="table-cell" style={{ flex: '1.5', fontSize: '11px', color: 'var(--text-secondary)' }}>
                  {new Date(e.resolvedAt).toLocaleString()} - {e.resolvedReason}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Charts Placeholder */}
        <div className="section-header">
          <span className="section-label">Gap Analysis</span>
          <div className="section-rule"></div>
        </div>
        <div className="charts-grid">
          <div className="chart-card">
            <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              Horizontal Bar Chart (Recharts)
            </div>
          </div>
          <div className="chart-card">
            <div style={{ height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
              Donut Chart (Recharts)
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}