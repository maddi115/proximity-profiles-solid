// src/features/proximity/useProfileActions.js
import { createSignal, onCleanup } from "solid-js";
import { proximityActions, store } from "../../store/proximityStore.js";
import { createHeart } from "./utils";

const COST_PULSE = 1.0;
const COST_TEASE = 2.50;
const COST_REVEAL = 5.00;

export function useProfileActions(profileId) {
  const [showAmount, setShowAmount] = createSignal(false);
  const [teaseAmount, setTeaseAmount] = createSignal(1.0);
  const [isHolding, setIsHolding] = createSignal(false);
  const [showActionForm, setShowActionForm] = createSignal(false);
  const [actionLink, setActionLink] = createSignal("");
  
  let intervalId;
  let timeoutId;
  let holding = false;
  let activated = false;
  let markerRef = null;

  onCleanup(() => {
    if (timeoutId) clearTimeout(timeoutId);
    if (intervalId) clearInterval(intervalId);
  });

  const setMarkerRef = (element) => {
    markerRef = element;
  };

  const handlePulse = (e) => {
    e.stopPropagation();
    const success = proximityActions.sendAction(profileId, COST_PULSE, "❤️");
    if (success) {
      triggerVisualReaction("❤️");
    }
  };

  const handleReveal = (e) => {
    e.stopPropagation();
    const success = proximityActions.sendAction(profileId, COST_REVEAL, "📸");
    if (success) {
      triggerVisualReaction("📸");
    }
  };

  const handleSlap = (e) => {
    e.stopPropagation();
    proximityActions.sendAction(profileId, 0, "👋");
    triggerVisualReaction("👋");
  };
  
  const handleFollow = (e) => {
    e.stopPropagation();
    proximityActions.toggleFollow(profileId);
  };

  const handleActionClick = (e) => {
    e.stopPropagation();
    setShowActionForm(!showActionForm());
  };

  const handleActionSubmit = (e) => {
    e.stopPropagation();
    if (actionLink().trim()) {
      const success = proximityActions.sendAction(profileId, 9.00, "💭");
      if (success) {
        setShowActionForm(false);
        setActionLink("");
      }
    }
  };

  const handleActionCancel = (e) => {
    e.stopPropagation();
    setShowActionForm(false);
    setActionLink("");
  };

  const startTease = (e) => {
    e.stopPropagation();
    if (e.type === "touchstart") e.preventDefault();

    holding = true;
    activated = false;

    timeoutId = setTimeout(() => {
      if (!holding) return;
      activated = true;
      setTeaseAmount(COST_TEASE);
      setIsHolding(true);
      setShowAmount(true);
      
      intervalId = setInterval(() => {
        setTeaseAmount((prev) => prev + 0.10);
      }, 100);
    }, 500);
  };

  const stopTease = (e) => {
    e.stopPropagation();
    if (!holding) return;

    holding = false;
    if (timeoutId) clearTimeout(timeoutId);

    if (!activated) return;
    if (intervalId) clearInterval(intervalId);

    const finalAmount = teaseAmount();
    const success = proximityActions.sendAction(profileId, finalAmount, "😏");
    
    if (success) {
      setIsHolding(false);
      triggerVisualReaction("😏");
    }
    
    setTimeout(() => setShowAmount(false), 500);
  };
  
  const triggerVisualReaction = (emoji) => {
    if (markerRef && emoji === "❤️") {
      const rect = markerRef.getBoundingClientRect();
      const heartX = rect.left + 30;
      const heartY = rect.top + 30;
      
      for (let i = 0; i < 3; i++) {
        setTimeout(() => createHeart(heartX, heartY), i * 100);
      }
    } 
  };

  return {
    showAmount,
    teaseAmount,
    isHolding,
    showActionForm,
    actionLink,
    handlePulse,
    handleReveal,
    handleSlap,
    handleFollow,
    handleActionClick,
    handleActionSubmit,
    handleActionCancel,
    startTease,
    stopTease,
    setActionLink,
    setMarkerRef,
  };
}
