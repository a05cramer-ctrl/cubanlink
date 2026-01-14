interface MetallicButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
}

export default function MetallicButton({ children, onClick, className = '', href, target, rel }: MetallicButtonProps) {
  const buttonContent = (
    <>
      <span className="metallic-button-shine" />
      <span className="metallic-button-text">{children}</span>
    </>
  );

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={`metallic-button ${className}`}>
        {buttonContent}
      </a>
    );
  }

  return (
    <button className={`metallic-button ${className}`} onClick={onClick}>
      {buttonContent}
    </button>
  );
}
