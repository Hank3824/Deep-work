
import { Priority } from './types';

export const COLORS = {
  BEIGE: '#F7F5F0',
  SIDEBAR: '#0F172A',
  TERRACOTTA: '#C04000', // High
  GINGER: '#D4AF37',     // Medium
  SLATE_BLUE: '#4682B4'  // Low
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  [Priority.HIGH]: COLORS.TERRACOTTA,
  [Priority.MEDIUM]: COLORS.GINGER,
  [Priority.LOW]: COLORS.SLATE_BLUE,
};
