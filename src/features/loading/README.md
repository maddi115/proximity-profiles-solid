# Loading Feature

**Independent loading state management** - tracks multiple simultaneous operations.

## Usage

### With Hook (Recommended)
```javascript
import { useLoading } from '@/features/loading/hooks/useLoading';

const { isLoading, withLoading } = useLoading();

const handleSubmit = async () => {
  await withLoading('submit-form', async () => {
    await apiCall();
  });
};

return <LoadingButton isLoading={isLoading('submit-form')} />;
```

### Components
```javascript
import { LoadingButton } from '@/features/loading/components/LoadingButton';
import { LoadingSpinner } from '@/features/loading/components/LoadingSpinner';

<LoadingButton 
  isLoading={isLoading} 
  loadingText="Processing..."
>
  Submit
</LoadingButton>
```

## Architecture

- **Store**: Tracks multiple operations by unique key
- **Components**: Reusable buttons and spinners
- **Hook**: Easy integration with async operations

## Independence

This feature does NOT depend on any other feature.
It can be used anywhere in the app for any async operation.
