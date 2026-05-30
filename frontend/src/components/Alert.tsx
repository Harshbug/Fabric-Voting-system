type Props = { variant?: "error" | "success" | "info"; children: React.ReactNode };

export default function Alert({ variant = "info", children }: Props) {
  return <div className={`alert alert-${variant}`}>{children}</div>;
}
