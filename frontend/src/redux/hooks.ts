// src/redux/hooks.ts
import { useDispatch, useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Dispatch tipizzato per supportare i thunk
export const useAppDispatch: () => AppDispatch = useDispatch;

// Selector tipizzato (opzionale)
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;