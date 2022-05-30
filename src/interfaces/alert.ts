interface Alert {
  id?: number;
  variant: 'description' | 'snack-bar';
  type: 'banner' | 'toast';
  status: 'success' | 'danger';
  title: string;
  subtitle?: string;
  onClose?(): void;
}

export default Alert;
