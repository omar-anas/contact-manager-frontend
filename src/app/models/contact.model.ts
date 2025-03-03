export interface Contact {
    id: number;
    name: string;
    phone: string;
    address: string;
    notes?: string;
    isLocked?: boolean;
    lockedBy?: string | null;
  }