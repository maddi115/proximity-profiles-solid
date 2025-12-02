import { userProfile, closestProfile } from "../data";

export function DynamicIsland() {
  return (
    <div class="dynamic-island">
      <div class="island-avatar">
        <img src={userProfile.img} alt="You" />
      </div>

      <div class="proximity-text">really close to</div>

      <div class="island-avatar">
        <img src={closestProfile.img} alt="Nearby" />
        <div class="live-indicator">
          <span class="live-icon">👁️</span>
        </div>
      </div>
    </div>
  );
}
