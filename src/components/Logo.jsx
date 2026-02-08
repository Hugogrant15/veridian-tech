const Logo = ({ className = "" }) => {
  return (
    <svg
      viewBox="0 0 210 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-labelledby="logoTitle"
    >
      <title id="logoTitle">Veridian Tech</title>
      {/* Icon: Abstract Hexagon V */}
      <path d="M20 2L37.32 12V32L20 42L2.68 32V12L20 2Z" fill="currentColor" />
      <path
        d="M20 10L30 16V28L20 34L10 28V16L20 10Z"
        fill="white"
        fillOpacity="0.3"
      />

      {/* Text */}
      <text
        x="50"
        y="30"
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="bold"
        fontSize="26"
        fill="currentColor"
        letterSpacing="-0.5"
      >
        Veridian Tech
      </text>
    </svg>
  );
};

export default Logo;
