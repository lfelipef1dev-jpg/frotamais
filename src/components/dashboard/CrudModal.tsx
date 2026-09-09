import { useState, useEffect, useRef, useCallback } from 'react';

interface Field {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'textarea';
  required?: boolean;
  options?: { value: string; label: string }[];
  defaultValue?: string | number;
}

interface CrudModalProps {
  open: boolean;
  title: string;
  fields: Field[];
  initialValues?: Record<string, any>;
  submitLabel?: string;
  onSubmit: (data: Record<string, any>) => Promise<void>;
  onClose: () => void;
}

export default function CrudModal({ open, title, fields, initialValues, submitLabel = 'Salvar', onSubmit, onClose }: CrudModalProps) {
  const [values, setValues] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    setError('');
    setLoading(false);
    const init: Record<string, any> = {};
    for (const f of fields) init[f.name] = initialValues?.[f.name] ?? f.defaultValue ?? '';
    setValues(init);

    previousFocus.current = document.activeElement as HTMLElement;
    const firstInput = dialogRef.current?.querySelector<HTMLElement>('input, select, textarea, button');
    firstInput?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const list = Array.from(focusables).filter((el) => !el.hasAttribute('disabled'));
      if (list.length === 0) return;
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      previousFocus.current?.focus();
    };
  }, [open]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await onSubmit(values);
      setValues({});
      onClose();
    } catch {
      setError('Erro ao salvar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="crud-modal-title"
        className="bg-white rounded-2xl border border-brand-border p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="crud-modal-title" className="font-bold text-lg text-brand-text mb-1">{title}</h3>
        <p className="text-sm text-brand-text-secondary mb-5">Preencha os dados e clique em {submitLabel.toLowerCase()}.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((f) => (
            <div key={f.name}>
              <label htmlFor={f.name} className="block text-sm font-medium text-brand-text mb-1">
                {f.label}{f.required ? <span className="text-brand-danger ml-1" aria-hidden="true">*</span> : null}
              </label>
              {f.type === 'select' ? (
                <select
                  id={f.name}
                  required={f.required}
                  value={values[f.name] ?? ''}
                  onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                  className="w-full rounded-lg border border-brand-border bg-brand-bg px-3 py-2.5 text-brand-text focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:border-brand-primary outline-none transition"
                >
                  <option value="">Selecione...</option>
                  {f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              ) : f.type === 'textarea' ? (
                <textarea
                  id={f.name}
                  required={f.required}
                  value={values[f.name] ?? ''}
                  onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
                  className="w-full rounded-lg border border-brand-border bg-brand-bg px-3 py-2.5 text-brand-text focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:border-brand-primary outline-none transition resize-y"
                  rows={3}
                />
              ) : (
                <input
                  id={f.name}
                  type={f.type}
                  required={f.required}
                  value={values[f.name] ?? ''}
                  onChange={(e) => setValues((v) => ({ ...v, [f.name]: f.type === 'number' ? Number(e.target.value) : e.target.value }))}
                  className="w-full rounded-lg border border-brand-border bg-brand-bg px-3 py-2.5 text-brand-text focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:border-brand-primary outline-none transition"
                />
              )}
            </div>
          ))}
          {error && <p className="text-sm text-brand-danger" role="alert">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-brand-primary px-4 py-2.5 font-semibold text-white hover:bg-brand-primary-600 transition disabled:opacity-60 min-h-12 shadow-sm"
            >
              {loading ? 'Salvando...' : submitLabel}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-brand-border px-4 py-2.5 font-medium text-brand-text hover:bg-brand-bg transition min-h-12"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
