import { createSignal } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { DynamicIsland } from '../dynamicIsland';
import styles from '../../../routes.module.css';
import myStoryStyles from './my-story.module.css';

export default function MyStory() {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = createSignal(null);
  let cameraInputRef;
  let imageInputRef;

  const handleCameraClick = () => {
    cameraInputRef.click();
  };

  const handleImageClick = () => {
    imageInputRef.click();
  };

  const handleFileSelect = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      console.log(`${type} selected:`, file.name);
      setSelectedFile(file);
      // TODO: Handle image upload/preview
    }
  };

  return (
    <div class={styles.pageContent}>
      <button
        class={myStoryStyles.backBtn}
        onClick={() => navigate('/home')}
      >
        ← Back Home
      </button>

      <div class={myStoryStyles.islandWrapper}>
        <DynamicIsland />
      </div>

      <div class={myStoryStyles.header}>
        <h1 class={styles.pageTitle}>My Story</h1>
        <p class={myStoryStyles.subtitle}>Share a moment with your story</p>
      </div>

      <div class={myStoryStyles.actionContainer}>
        <button 
          class={myStoryStyles.actionButton}
          onClick={handleCameraClick}
        >
          <div class={myStoryStyles.iconWrapper}>
            📷
          </div>
          <span class={myStoryStyles.buttonLabel}>Camera</span>
        </button>

        <button 
          class={myStoryStyles.actionButton}
          onClick={handleImageClick}
        >
          <div class={myStoryStyles.iconWrapper}>
            🖼️
          </div>
          <span class={myStoryStyles.buttonLabel}>Add Image</span>
        </button>

        {/* Hidden file inputs */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          style="display: none;"
          onChange={(e) => handleFileSelect(e, 'Camera')}
        />
        
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          style="display: none;"
          onChange={(e) => handleFileSelect(e, 'Image')}
        />
      </div>

      {selectedFile() && (
        <div class={myStoryStyles.preview}>
          <p class={myStoryStyles.previewText}>
            Selected: {selectedFile().name}
          </p>
        </div>
      )}
    </div>
  );
}
