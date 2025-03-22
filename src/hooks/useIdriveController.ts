import { useCallback, useState } from 'react';

interface IdriveControllerState {
  selectedIndex: number;
  totalItems: number;
}

export const useIdriveController = (totalItems: number, onSelect: (index: number) => void) => {
  const [state, setState] = useState<IdriveControllerState>({
    selectedIndex: 0,
    totalItems
  });

  const rotateKnob = useCallback((direction: 'up' | 'down') => {
    setState(prevState => {
      const newIndex = direction === 'up'
        ? (prevState.selectedIndex - 1 + totalItems) % totalItems
        : (prevState.selectedIndex + 1) % totalItems;

      return {
        ...prevState,
        selectedIndex: newIndex
      };
    });
  }, [totalItems]);

  const selectCurrent = useCallback(() => {
    onSelect(state.selectedIndex);
  }, [state.selectedIndex, onSelect]);

  return {
    selectedIndex: state.selectedIndex,
    rotateKnob,
    selectCurrent
  };
}; 