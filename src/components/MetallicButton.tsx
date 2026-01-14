interface MetallicButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function MetallicButton({ children, onClick, className = '' }: MetallicButtonProps) {
  return (
    <button className={`metallic-button ${className}`} onClick={onClick}>
      <span className="metallic-button-shine" />
      <span className="metallic-button-text">{children}</span>
    </button>
  );
}
