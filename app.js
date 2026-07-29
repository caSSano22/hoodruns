/* ==========================================================================
   HOODRUNS - THE FRONT PAGE OF THE ROBINHOOD TRENCHES INTERACTIVE LOGIC
   Network: Robinhood Chain EVM (Chain ID: 0xa4b1 / 42161)
   ========================================================================== */

let userAddress = null;

// On DOM Loaded
document.addEventListener('DOMContentLoaded', () => {
  initTableFilters();
  initLiveScannerUpdates();
  initFaqAccordions();
  checkExistingEIP1193Connection();
});

// FAQ Accordion Toggle
function initFaqAccordions() {
  const faqHeaders = document.querySelectorAll('.faq-accordion-header');
  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      item.classList.toggle('open');
      const body = item.querySelector('.faq-accordion-body');
      if (body) {
        if (item.classList.contains('open')) {
          body.style.maxHeight = body.scrollHeight + 'px';
        } else {
          body.style.maxHeight = '0px';
        }
      }
    });
  });
}

// 1. Alert Table Filters
function initTableFilters() {
  const filterBtns = document.querySelectorAll('.filter-chip');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');

      const filter = e.target.dataset.filter;
      const rows = document.querySelectorAll('.alert-row');
      
      rows.forEach(row => {
        if (filter === 'all') {
          row.style.display = '';
        } else if (filter === '10x') {
          const gain = parseFloat(row.dataset.gain || '0');
          row.style.display = gain >= 10 ? '' : 'none';
        } else if (filter === 'recent') {
          const isRecent = row.dataset.recent === 'true';
          row.style.display = isRecent ? '' : 'none';
        }
      });
    });
  });
}

// 2. Live Scanner Simulation Stream
function initLiveScannerUpdates() {
  const scannerBody = document.getElementById('liveScannerStream');
  if (!scannerBody) return;

  const mockTokens = [
    { symbol: '$PONS', name: 'Pons Family', alertMcap: '$132k', peakMcap: '$4.6M', gain: '35x', time: '12m ago' },
    { symbol: '$HOOD', name: 'Robinhood Trench', alertMcap: '$85k', peakMcap: '$1.8M', gain: '21x', time: '28m ago' },
    { symbol: '$BOW', name: 'BowFun Protocol', alertMcap: '$210k', peakMcap: '$2.9M', gain: '14x', time: '1h ago' },
    { symbol: '$CIRCUS', name: 'Circus DEX', alertMcap: '$45k', peakMcap: '$620k', gain: '13.7x', time: '2h ago' },
    { symbol: '$VIRTUAL', name: 'Virtuals Robinhood', alertMcap: '$310k', peakMcap: '$3.1M', gain: '10x', time: '3h ago' }
  ];

  // Periodically insert live alerts
  setInterval(() => {
    const randomToken = mockTokens[Math.floor(Math.random() * mockTokens.length)];
    showToast(`⚡ NEW RUNNER DETECTED: ${randomToken.symbol} (${randomToken.gain} Surge on Robinhood EVM)`);
  }, 12000);
}

// 3. Real EIP-1193 Web3 Wallet Provider (Robinhood Chain EVM)
async function checkExistingEIP1193Connection() {
  if (typeof window.ethereum !== 'undefined') {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts && accounts.length > 0) {
        handleConnectedAccount(accounts[0]);
      }
    } catch (err) {
      console.warn('Error checking existing wallet connection:', err);
    }
  }
}

function openWalletModal() {
  const modal = document.getElementById('walletModal');
  if (modal) modal.classList.add('open');
}

function closeWalletModal() {
  const modal = document.getElementById('walletModal');
  if (modal) modal.classList.remove('open');
}

async function connectRealEIP1193Wallet() {
  closeWalletModal();

  if (typeof window.ethereum === 'undefined') {
    showToast('No Web3 wallet extension found. Install Robinhood Wallet or MetaMask!');
    window.open('https://robinhood.com/web3-wallet/', '_blank');
    return;
  }

  try {
    showToast('Connecting Robinhood EVM wallet...');
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    if (accounts && accounts.length > 0) {
      await handleConnectedAccount(accounts[0]);
    }
  } catch (err) {
    showToast(`Connection failed: ${err.message || 'User rejected'}`);
  }
}

async function handleConnectedAccount(account) {
  userAddress = account;
  const shortAddr = account.substring(0, 6) + '...' + account.substring(account.length - 4);

  const connectBtns = document.querySelectorAll('.connect-wallet-trigger');
  connectBtns.forEach(btn => {
    btn.textContent = `🟢 ${shortAddr}`;
    btn.style.background = 'rgba(0, 255, 102, 0.2)';
    btn.style.color = '#00ff66';
    btn.style.borderColor = '#00ff66';
  });

  showToast(`Robinhood EVM Wallet Connected (${shortAddr})`);
}

function showToast(msg) {
  const toast = document.createElement('div');
  toast.className = 'toast-hoodruns';
  toast.textContent = msg;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 4000);
}
