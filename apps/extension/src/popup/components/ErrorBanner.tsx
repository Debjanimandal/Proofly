interface ErrorBannerProps {
  message: string;
}

export function ErrorBanner({ message }: ErrorBannerProps): JSX.Element {
  return (
    <div className="rounded-xl border border-danger bg-card px-3 py-2 text-xs text-red-200">
      {message}
    </div>
  );
}
