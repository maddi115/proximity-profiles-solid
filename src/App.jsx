import { createSignal, For, Show, onMount } from 'solid-js';
import './App.css';

const profiles = [
  { id: 1, img: "https://i.imgur.com/2D8gFpZ.png", top: "42%", left: "50%", balance: 0 },
  { id: 2, img: "https://i.imgur.com/zLafbHr.png", top: "46%", left: "56%", balance: 0 },
  { id: 3, img: "https://i.imgur.com/SJfFa5D.png", top: "50%", left: "57%", balance: 0 },
  { id: 4, img: "https://i.imgur.com/gYxZ2TV.jpeg", top: "55%", left: "54%", balance: 0 },
  { id: 5, img: "https://i.imgur.com/fSNOzKx.png", top: "57%", left: "48%", balance: 0 },
  { id: 6, img: "https://i.imgur.com/8YAtaDK.png", top: "54%", left: "43%", balance: 100 },
  { id: 7, img: "https://i.imgur.com/prIKM5x.png", top: "49%", left: "43%", balance: 0 },
  { id: 8, img: "https://i.imgur.com/NyAlxXl.png", top: "51%", left: "50%", balance: 0 }
];

const createHeart = (x, y) => {
  const h = document.createElement('div');
  h.className = 'floating-heart';
  h.textContent = '❤️';
  h.style.left = x + 'px';
  h.style.top = y + 'px';
  h.style.setProperty('--drift-x', (Math.random() - 0.5) * 100 + 'px');
  document.body.appendChild(h);
  setTimeout(() => h.remove(), 3000);
};

function ProfileMarker(props) {
  const [sentMsg, setSentMsg] = createSignal('');
  const [showMsg, setShowMsg] = createSignal(false);
  const [teaseAmount, setTeaseAmount] = createSignal(1.00);
  const [showAmount, setShowAmount] = createSignal(false);
  const [isHolding, setIsHolding] = createSignal(false);
  const [isFollowing, setIsFollowing] = createSignal(false);
  const [showActionForm, setShowActionForm] = createSignal(false);
  const [actionLink, setActionLink] = createSignal('');

  let pulseRef, teaseRef;
  let interval, timeout, holding = false, activated = false;

  const handlePulse = (e) => {
    e.stopPropagation();
    const rect = pulseRef.getBoundingClientRect();
    for (let i = 0; i < 3; i++) {
      setTimeout(() => createHeart(rect.left + rect.width / 2, rect.top + rect.height / 2), i * 100);
    }
    setSentMsg('sent ❤️ pulse $3.00');
    setShowMsg(true);
    setTimeout(() => setShowMsg(false), 2000);
  };

  const handleReveal = (e) => {
    e.stopPropagation();
    setSentMsg('sent 📸 reveal request $4.00');
    setShowMsg(true);
    setTimeout(() => setShowMsg(false), 2000);
  };

  const handleSlap = (e) => {
    e.stopPropagation();
    setSentMsg('sent 👋 slap $2.00');
    setShowMsg(true);
    setTimeout(() => setShowMsg(false), 2000);
  };

  const handleFollow = (e) => {
    e.stopPropagation();
    setIsFollowing(!isFollowing());
    setSentMsg(isFollowing() ? '✅ following' : '❌ unfollowed');
    setShowMsg(true);
    setTimeout(() => setShowMsg(false), 2000);
  };

  const handleActionClick = (e) => {
    e.stopPropagation();
    setShowActionForm(true);
  };

  const handleActionSubmit = (e) => {
    e.stopPropagation();
    if (actionLink().trim()) {
      setSentMsg('sent 💭 action $9.00');
      setShowMsg(true);
      setTimeout(() => setShowMsg(false), 2000);
      setShowActionForm(false);
      setActionLink('');
    }
  };

  const handleActionCancel = (e) => {
    e.stopPropagation();
    setShowActionForm(false);
    setActionLink('');
  };

  const startTease = (e) => {
    e.stopPropagation();
    e.preventDefault();
    holding = true;
    activated = false;
    timeout = setTimeout(() => {
      if (!holding) return;
      activated = true;
      setTeaseAmount(1.00);
      setIsHolding(true);
      setShowAmount(true);
      interval = setInterval(() => setTeaseAmount(prev => prev + 0.01), 100);
    }, 500);
  };

  const stopTease = (e) => {
    if (!holding) return;
    e.stopPropagation();
    e.preventDefault();
    holding = false;
    clearTimeout(timeout);
    if (!activated) return;
    clearInterval(interval);
    setIsHolding(false);
    setSentMsg(`sent 😏 tease $${teaseAmount().toFixed(2)}`);
    setShowMsg(true);
    setTimeout(() => setShowMsg(false), 2000);
    setTimeout(() => setShowAmount(false), 500);
  };

  onMount(() => {
    if (teaseRef) {
      teaseRef.addEventListener('mousedown', startTease);
      teaseRef.addEventListener('mouseup', stopTease);
      teaseRef.addEventListener('mouseleave', stopTease);
      teaseRef.addEventListener('touchstart', startTease);
      teaseRef.addEventListener('touchend', stopTease);
    }
  });

  return (
    <div class="marker" style={{ top: props.profile.top, left: props.profile.left }}>
      <img src={props.profile.img} class="marker-img" loading="lazy" />
      <Show when={props.profile.balance >= 100}>
        <div class="balance-badge">
          <span class="balance-heart">🤍</span>
          <span class="balance-amount">${props.profile.balance}</span>
        </div>
      </Show>
      <div class="pulse-action">
        <button ref={pulseRef} class="btn" onClick={handlePulse}>
          <span style={{ "font-size": "6px" }}>pulse $</span>
          <span class="btn-emoji">❤️</span>
        </button>
        <button class="btn" onClick={handleReveal}>
          <span style={{ "font-size": "6px" }}>reveal request pic</span>
          <span class="btn-emoji">📸</span>
        </button>
        <button class="btn" onClick={handleSlap}>
          <span style={{ "font-size": "6px" }}>slap</span>
          <span class="btn-emoji">👋</span>
        </button>
        <button class={`btn ${isFollowing() ? 'following' : ''}`} onClick={handleFollow}>
          <span style={{ "font-size": "6px" }}>{isFollowing() ? 'following' : 'follow'}</span>
          <span class="btn-emoji">{isFollowing() ? '✓' : '+'}</span>
        </button>
        <button class="btn" onClick={handleActionClick}>
          <span style={{ "font-size": "6px" }}>what do you want to do to her</span>
          <span class="btn-emoji">💭</span>
        </button>
        <button ref={teaseRef} class={`btn tease-btn ${isHolding() ? 'holding' : ''}`}>
          <span style={{ "font-size": "6px" }}>tease</span>
          <span class="btn-emoji">😏</span>
          <div class="tease-hint">hold button to tease</div>
          <div class={`tease-amount ${showAmount() ? 'show' : ''}`}>${teaseAmount().toFixed(2)}</div>
        </button>
        <Show when={showMsg()}>
          <div class="sent-msg">{sentMsg()}</div>
        </Show>
        <Show when={showActionForm()}>
          <div class="action-form">
            <div class="action-form-header">
              <span>💭 What do you want to do? ($9.00)</span>
            </div>
            <input
              type="text"
              class="action-input"
              placeholder="Paste image/video link..."
              value={actionLink()}
              onInput={(e) => setActionLink(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
            <div class="action-form-buttons">
              <button class="action-submit" onClick={handleActionSubmit}>
                Send $9.00
              </button>
              <button class="action-cancel" onClick={handleActionCancel}>
                Cancel
              </button>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
}

function App() {
  return (
    <div>
      <div class="proximity-circle"></div>
      <div class="proximity-label">people live online within 50ft radius of you</div>
      <For each={profiles}>{profile => <ProfileMarker profile={profile} />}</For>
    </div>
  );
}

export default App;
