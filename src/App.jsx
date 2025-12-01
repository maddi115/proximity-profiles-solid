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
  const [savedReaction, setSavedReaction] = createSignal('');
  const [teaseAmount, setTeaseAmount] = createSignal(1.00);
  const [showAmount, setShowAmount] = createSignal(false);
  const [isHolding, setIsHolding] = createSignal(false);
  const [isFollowing, setIsFollowing] = createSignal(false);
  const [showActionForm, setShowActionForm] = createSignal(false);
  const [actionLink, setActionLink] = createSignal('');
  const [isHovering, setIsHovering] = createSignal(false);

  let pulseRef, teaseRef, sentMsgRef, markerRef;
  let interval, timeout, holding = false, activated = false;

  const handlePulse = (e) => {
    e.stopPropagation();
    
    // Save the reaction permanently for this profile
    setSavedReaction('❤️');
    
    // Get the position of the big emoji reaction
    if (sentMsgRef) {
      const rect = sentMsgRef.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      for (let i = 0; i < 3; i++) {
        setTimeout(() => createHeart(centerX, centerY), i * 100);
      }
    }
  };

  const handleReveal = (e) => {
    e.stopPropagation();
    setSavedReaction('📸');
  };

  const handleSlap = (e) => {
    e.stopPropagation();
    setSavedReaction('👋');
  };

  const handleFollow = (e) => {
    e.stopPropagation();
    setIsFollowing(!isFollowing());
    setSavedReaction(isFollowing() ? '✅' : '❌');
  };

  const handleActionClick = (e) => {
    e.stopPropagation();
    setShowActionForm(!showActionForm());
  };

  const handleActionSubmit = (e) => {
    e.stopPropagation();
    if (actionLink().trim()) {
      setSavedReaction('💭');
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
    setSavedReaction('😏');
    setTimeout(() => setShowAmount(false), 500);
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  onMount(() => {
    if (teaseRef) {
      teaseRef.addEventListener('mousedown', startTease);
      teaseRef.addEventListener('mouseup', stopTease);
      teaseRef.addEventListener('mouseleave', stopTease);
      teaseRef.addEventListener('touchstart', startTease);
      teaseRef.addEventListener('touchend', stopTease);
    }

    if (markerRef) {
      markerRef.addEventListener('mouseenter', handleMouseEnter);
      markerRef.addEventListener('mouseleave', handleMouseLeave);
    }
  });

  return (
    <div 
      ref={markerRef}
      class="marker" 
      style={{ top: props.profile.top, left: props.profile.left }}
    >
      <img src={props.profile.img} class="marker-img" loading="lazy" />
      <Show when={props.profile.balance >= 100}>
        <div class="balance-badge">
          <span class="balance-heart">🤍</span>
          <span class="balance-amount">${props.profile.balance}</span>
        </div>
      </Show>
      <Show when={savedReaction() && isHovering()}>
        <div class="sent-msg" ref={sentMsgRef}>{savedReaction()}</div>
      </Show>
      <Show when={showAmount()}>
        <div class="tease-amount">${teaseAmount().toFixed(2)}</div>
      </Show>
      <div class="pulse-action">
        <button ref={pulseRef} class="btn" onClick={handlePulse}>
          <span>pulse $</span>
          <span class="btn-emoji">❤️</span>
        </button>
        <button class="btn" onClick={handleReveal}>
          <span>reveal request pic</span>
          <span class="btn-emoji">📸</span>
        </button>
        <button class="btn" onClick={handleSlap}>
          <span>slap</span>
          <span class="btn-emoji">👋</span>
        </button>
        <button class={`btn ${isFollowing() ? 'following' : ''}`} onClick={handleFollow}>
          <span>{isFollowing() ? 'following' : 'follow'}</span>
          <span class="btn-emoji">{isFollowing() ? '✓' : '+'}</span>
        </button>
        <div class="action-button-wrapper">
          <button class={`btn ${showActionForm() ? 'active' : ''}`} onClick={handleActionClick}>
            <span>what do you want to do to her</span>
            <span class="btn-emoji">💭</span>
          </button>
          <Show when={showActionForm()}>
            <div class="action-form">
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
        <button ref={teaseRef} class={`btn tease-btn ${isHolding() ? 'holding' : ''}`}>
          <span>tease</span>
          <span class="btn-emoji">😏</span>
          <div class="tease-hint">hold button to tease</div>
        </button>
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
