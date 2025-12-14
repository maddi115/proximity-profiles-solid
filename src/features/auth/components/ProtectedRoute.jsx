import { Show, createMemo } from 'solid-js';
import { Navigate } from '@solidjs/router';
import { useAuth } from '../hooks/useAuth';
import { LoadingSpinner } from '../../loading/components/LoadingSpinner';

export function ProtectedRoute(props) {
  const auth = useAuth();
  
  // createMemo for derived state (SolidJS best practice)
  const isReady = createMemo(() => !auth.isLoading());
  const isAuthed = createMemo(() => auth.isAuthenticated());

  return (
    <Show
      when={isReady()}
      fallback={
        <div style={{
          display: 'flex',
          'justify-content': 'center',
          'align-items': 'center',
          height: '100vh'
        }}>
          <LoadingSpinner size="large" />
        </div>
      }
    >
      <Show
        when={isAuthed()}
        fallback={<Navigate href="/login" />}
      >
        {props.children}
      </Show>
    </Show>
  );
}
